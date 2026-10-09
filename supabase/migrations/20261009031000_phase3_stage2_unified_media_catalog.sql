-- =============================================================================
-- House of Padmavati — Phase 3, Stage 2: Unified Media Catalog
-- Migration: 20261009031000_phase3_stage2_unified_media_catalog.sql
--
-- Implements:
--   1. public.media_assets table with soft-deletion, category tags & metadata
--   2. RLS policies: public active read, admin full management (is_admin())
--   3. check_media_asset_usage() comprehensive reference tracking RPC
--   4. Administrative RPCs: register_media_asset, soft_delete_media_asset,
--      restore_media_asset, permanent_delete_media_asset
--   5. Backfill/registration of existing product images, collection films/stills,
--      and journal images into unified catalog without copying files
-- =============================================================================

-- #############################################################################
-- 1. MEDIA ASSETS TABLE (public.media_assets)
-- #############################################################################

CREATE TABLE IF NOT EXISTS public.media_assets (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bucket_id       TEXT NOT NULL,
  storage_path    TEXT NOT NULL,
  public_url      TEXT NOT NULL UNIQUE,
  file_name       TEXT NOT NULL,
  display_name    TEXT NOT NULL,
  media_type      TEXT NOT NULL CHECK (media_type IN ('image', 'video', 'document')),
  mime_type       TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL DEFAULT 0,
  width           INTEGER,
  height          INTEGER,
  duration_sec    NUMERIC(6, 2),
  alt_text        TEXT,
  poster_url      TEXT,
  category        TEXT NOT NULL DEFAULT 'general' CHECK (category IN ('general', 'product', 'film', 'editorial', 'craft', 'brand')),
  tags            TEXT[] DEFAULT '{}',
  status          TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'trash')),
  deleted_at      TIMESTAMPTZ,
  uploaded_by     UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_category ON public.media_assets (category);
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON public.media_assets (media_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON public.media_assets (status);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON public.media_assets (created_at DESC);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS trg_media_assets_updated_at ON public.media_assets;
CREATE TRIGGER trg_media_assets_updated_at
  BEFORE UPDATE ON public.media_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- #############################################################################
-- 2. ROW-LEVEL SECURITY POLICIES
-- #############################################################################

ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Anonymous and customer visitors can read only active media assets
DROP POLICY IF EXISTS "media_assets_public_read" ON public.media_assets;
CREATE POLICY "media_assets_public_read" ON public.media_assets
  FOR SELECT TO anon, authenticated
  USING (status = 'active');

-- Studio administrators have full CRUD privileges
DROP POLICY IF EXISTS "media_assets_admin_all" ON public.media_assets;
CREATE POLICY "media_assets_admin_all" ON public.media_assets
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- #############################################################################
-- 3. USAGE & REFERENCE CHECK RPC (check_media_asset_usage)
-- #############################################################################

CREATE OR REPLACE FUNCTION public.check_media_asset_usage(
  p_url TEXT
) RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_refs TEXT[] := '{}';
  v_rec  RECORD;
  v_settings JSONB;
BEGIN
  IF p_url IS NULL OR trim(p_url) = '' THEN
    RETURN jsonb_build_object('in_use', false, 'references', '[]'::jsonb);
  END IF;

  -- 1. Check product_images table
  FOR v_rec IN
    SELECT p.name, pi.is_primary
    FROM public.product_images pi
    LEFT JOIN public.products p ON p.id = pi.product_id
    WHERE pi.url = p_url
  LOOP
    v_refs := array_append(
      v_refs,
      'Product "' || COALESCE(v_rec.name, 'Unnamed Product') || '" (' ||
        CASE WHEN v_rec.is_primary THEN 'Primary Image' ELSE 'Gallery Image' END || ')'
    );
  END LOOP;

  -- 2. Check collections table
  FOR v_rec IN
    SELECT name, hero_video_url, hero_image_url
    FROM public.collections
    WHERE hero_video_url = p_url OR hero_image_url = p_url
  LOOP
    IF v_rec.hero_video_url = p_url THEN
      v_refs := array_append(v_refs, 'Collection "' || v_rec.name || '" (Hero Film)');
    END IF;
    IF v_rec.hero_image_url = p_url THEN
      v_refs := array_append(v_refs, 'Collection "' || v_rec.name || '" (Poster Still)');
    END IF;
  END LOOP;

  -- 3. Check journal_articles table
  FOR v_rec IN
    SELECT title
    FROM public.journal_articles
    WHERE img = p_url
  LOOP
    v_refs := array_append(v_refs, 'Journal Article "' || v_rec.title || '"');
  END LOOP;

  -- 4. Check store_settings in settings table
  SELECT value INTO v_settings
  FROM public.settings
  WHERE key = 'store_settings';

  IF v_settings IS NOT NULL THEN
    IF v_settings->'homepage_cinematic_video'->>'video_url' = p_url THEN
      v_refs := array_append(v_refs, 'Homepage Cinematic Video');
    END IF;
    IF v_settings->'homepage_cinematic_video'->>'poster_url' = p_url THEN
      v_refs := array_append(v_refs, 'Homepage Cinematic Video Poster');
    END IF;
  END IF;

  -- 5. Check site_sections table (draft and published payloads)
  FOR v_rec IN
    SELECT display_name
    FROM public.site_sections
    WHERE draft_payload::text LIKE '%' || p_url || '%'
       OR published_payload::text LIKE '%' || p_url || '%'
  LOOP
    v_refs := array_append(v_refs, 'Site Section "' || v_rec.display_name || '"');
  END LOOP;

  RETURN jsonb_build_object(
    'in_use', (cardinality(v_refs) > 0),
    'references', to_jsonb(v_refs)
  );
END;
$$;

REVOKE ALL ON FUNCTION public.check_media_asset_usage(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_media_asset_usage(TEXT) TO anon, authenticated, service_role;

-- #############################################################################
-- 4. ADMINISTRATIVE MUTATION RPCs
-- #############################################################################

-- 4.1 Register Media Asset (Idempotent Upload / Cataloging)
CREATE OR REPLACE FUNCTION public.register_media_asset(
  p_bucket_id       TEXT,
  p_storage_path    TEXT,
  p_public_url      TEXT,
  p_file_name       TEXT,
  p_display_name    TEXT,
  p_media_type      TEXT,
  p_mime_type       TEXT,
  p_file_size_bytes BIGINT,
  p_alt_text        TEXT DEFAULT NULL,
  p_poster_url      TEXT DEFAULT NULL,
  p_category        TEXT DEFAULT 'general',
  p_tags            TEXT[] DEFAULT '{}'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
  v_rec RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  -- Validate media type
  IF p_media_type NOT IN ('image', 'video', 'document') THEN
    RAISE EXCEPTION 'Invalid media_type: %', p_media_type USING ERRCODE = '22023';
  END IF;

  -- Validate MIME type safety
  IF p_media_type = 'image' AND p_mime_type NOT IN ('image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml') THEN
    RAISE EXCEPTION 'Unsupported image mime_type: %', p_mime_type USING ERRCODE = '22023';
  END IF;

  IF p_media_type = 'video' AND p_mime_type NOT IN ('video/mp4', 'video/webm', 'video/quicktime') THEN
    RAISE EXCEPTION 'Unsupported video mime_type: %', p_mime_type USING ERRCODE = '22023';
  END IF;

  -- Enforce size boundaries: Images <= 20MB, Videos <= 150MB
  IF p_media_type = 'image' AND p_file_size_bytes > 20971520 THEN
    RAISE EXCEPTION 'Image exceeds maximum 20MB limit' USING ERRCODE = '22023';
  END IF;

  IF p_media_type = 'video' AND p_file_size_bytes > 157286400 THEN
    RAISE EXCEPTION 'Video exceeds maximum 150MB limit' USING ERRCODE = '22023';
  END IF;

  INSERT INTO public.media_assets (
    bucket_id,
    storage_path,
    public_url,
    file_name,
    display_name,
    media_type,
    mime_type,
    file_size_bytes,
    alt_text,
    poster_url,
    category,
    tags,
    status,
    uploaded_by
  ) VALUES (
    p_bucket_id,
    p_storage_path,
    p_public_url,
    p_file_name,
    COALESCE(p_display_name, p_file_name),
    p_media_type,
    p_mime_type,
    p_file_size_bytes,
    p_alt_text,
    p_poster_url,
    p_category,
    p_tags,
    'active',
    auth.uid()
  )
  ON CONFLICT (public_url) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    alt_text = COALESCE(EXCLUDED.alt_text, media_assets.alt_text),
    poster_url = COALESCE(EXCLUDED.poster_url, media_assets.poster_url),
    category = EXCLUDED.category,
    tags = EXCLUDED.tags,
    status = 'active',
    deleted_at = NULL,
    updated_at = now()
  RETURNING * INTO v_rec;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'media_registered',
    'media',
    v_rec.id::text,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object(
      'url', p_public_url,
      'type', p_media_type,
      'size', p_file_size_bytes
    )
  );

  RETURN to_jsonb(v_rec);
END;
$$;

-- 4.2 Soft Delete Media Asset
CREATE OR REPLACE FUNCTION public.soft_delete_media_asset(
  p_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
  v_usage JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec
  FROM public.media_assets
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'asset_not_found');
  END IF;

  -- Reference check
  v_usage := public.check_media_asset_usage(v_rec.public_url);
  IF (v_usage->>'in_use')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'asset_in_use',
      'references', v_usage->'references',
      'message', 'Cannot delete asset while referenced by active store content'
    );
  END IF;

  UPDATE public.media_assets
  SET status = 'trash',
      deleted_at = now(),
      updated_at = now()
  WHERE id = p_id;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'media_trashed',
    'media',
    p_id::text,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object('url', v_rec.public_url)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 4.3 Restore Media Asset
CREATE OR REPLACE FUNCTION public.restore_media_asset(
  p_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec
  FROM public.media_assets
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'asset_not_found');
  END IF;

  UPDATE public.media_assets
  SET status = 'active',
      deleted_at = NULL,
      updated_at = now()
  WHERE id = p_id;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'media_restored',
    'media',
    p_id::text,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object('url', v_rec.public_url)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 4.4 Permanent Delete Media Asset (Guarded: Must be in trash and not referenced)
CREATE OR REPLACE FUNCTION public.permanent_delete_media_asset(
  p_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
  v_usage JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec
  FROM public.media_assets
  WHERE id = p_id;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'asset_not_found');
  END IF;

  -- Safety check: Asset must be in trash before permanent purge
  IF v_rec.status != 'trash' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'asset_not_in_trash',
      'message', 'Asset must be moved to trash before permanent deletion'
    );
  END IF;

  -- Reference check
  v_usage := public.check_media_asset_usage(v_rec.public_url);
  IF (v_usage->>'in_use')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'asset_in_use',
      'references', v_usage->'references'
    );
  END IF;

  DELETE FROM public.media_assets
  WHERE id = p_id;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'media_permanently_deleted',
    'media',
    p_id::text,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object(
      'url', v_rec.public_url,
      'bucket', v_rec.bucket_id,
      'path', v_rec.storage_path
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'bucket_id', v_rec.bucket_id,
    'storage_path', v_rec.storage_path
  );
END;
$$;

-- Secure Execution Permissions
REVOKE ALL ON FUNCTION public.register_media_asset(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TEXT[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_media_asset(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BIGINT, TEXT, TEXT, TEXT, TEXT[]) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.soft_delete_media_asset(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.soft_delete_media_asset(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.restore_media_asset(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_media_asset(UUID) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.permanent_delete_media_asset(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.permanent_delete_media_asset(UUID) TO authenticated, service_role;

-- #############################################################################
-- 5. ASSET BACKFILL / REGISTRATION OF EXISTING ASSETS
-- #############################################################################

-- 5.1 Backfill from product_images table
INSERT INTO public.media_assets (
  bucket_id,
  storage_path,
  public_url,
  file_name,
  display_name,
  media_type,
  mime_type,
  file_size_bytes,
  alt_text,
  category,
  status
)
SELECT
  'product-images',
  COALESCE(SUBSTRING(pi.url FROM '/storage/v1/object/public/product-images/(.*)'), 'migrated-' || pi.id::text),
  pi.url,
  COALESCE(pi.alt_text, 'Product Image ' || pi.id::text),
  COALESCE(pi.alt_text, 'Product Image'),
  'image',
  'image/jpeg',
  0,
  pi.alt_text,
  'product',
  'active'
FROM public.product_images pi
ON CONFLICT (public_url) DO NOTHING;

-- 5.2 Backfill collection films
INSERT INTO public.media_assets (
  bucket_id,
  storage_path,
  public_url,
  file_name,
  display_name,
  media_type,
  mime_type,
  file_size_bytes,
  alt_text,
  category,
  status
)
SELECT
  'HOP-films',
  COALESCE(SUBSTRING(c.hero_video_url FROM '/storage/v1/object/public/HOP-films/(.*)'), 'migrated-film-' || c.id::text),
  c.hero_video_url,
  c.name || ' Collection Film',
  c.name || ' Collection Film',
  'video',
  'video/mp4',
  0,
  c.name || ' Collection Film',
  'film',
  'active'
FROM public.collections c
WHERE c.hero_video_url IS NOT NULL AND c.hero_video_url != ''
ON CONFLICT (public_url) DO NOTHING;

-- 5.3 Backfill collection poster stills
INSERT INTO public.media_assets (
  bucket_id,
  storage_path,
  public_url,
  file_name,
  display_name,
  media_type,
  mime_type,
  file_size_bytes,
  alt_text,
  category,
  status
)
SELECT
  'HOP-films',
  COALESCE(SUBSTRING(c.hero_image_url FROM '/storage/v1/object/public/HOP-films/(.*)'), 'migrated-poster-' || c.id::text),
  c.hero_image_url,
  c.name || ' Poster Still',
  c.name || ' Poster Still',
  'image',
  'image/jpeg',
  0,
  c.name || ' Poster Still',
  'editorial',
  'active'
FROM public.collections c
WHERE c.hero_image_url IS NOT NULL AND c.hero_image_url != ''
ON CONFLICT (public_url) DO NOTHING;

-- 5.4 Backfill journal article images (if hosted in Supabase storage)
INSERT INTO public.media_assets (
  bucket_id,
  storage_path,
  public_url,
  file_name,
  display_name,
  media_type,
  mime_type,
  file_size_bytes,
  alt_text,
  category,
  status
)
SELECT
  'product-images',
  COALESCE(SUBSTRING(j.img FROM '/storage/v1/object/public/product-images/(.*)'), 'migrated-journal-' || j.id::text),
  j.img,
  j.title || ' Editorial Still',
  j.title,
  'image',
  'image/jpeg',
  0,
  j.title,
  'editorial',
  'active'
FROM public.journal_articles j
WHERE j.img IS NOT NULL AND j.img LIKE 'https%supabase.co%'
ON CONFLICT (public_url) DO NOTHING;
