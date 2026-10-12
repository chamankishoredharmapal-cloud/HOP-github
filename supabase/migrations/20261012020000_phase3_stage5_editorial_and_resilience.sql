-- =============================================================================
-- House of Padmavati (HOP)
-- Phase 3 — Stage 5: Editorial Management & Operational Resilience Migration
-- Migration ID: 20261012020000_phase3_stage5_editorial_and_resilience.sql
-- =============================================================================

-- #############################################################################
-- 1. EXTEND JOURNAL ARTICLES TABLE
-- #############################################################################

-- Add author byline
ALTER TABLE public.journal_articles
  ADD COLUMN IF NOT EXISTS author TEXT NOT NULL DEFAULT 'House of Padmavati';

-- Add image accessibility alt text
ALTER TABLE public.journal_articles
  ADD COLUMN IF NOT EXISTS image_alt TEXT;

-- Add editorial sort ordering (curated display order, default 0)
ALTER TABLE public.journal_articles
  ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- Add archived_at timestamp for soft-deletion / archiving
ALTER TABLE public.journal_articles
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Index for ordering published articles
CREATE INDEX IF NOT EXISTS idx_journal_articles_curated_order
  ON public.journal_articles (sort_order ASC, published_at DESC);

-- #############################################################################
-- 2. CREATE JOURNAL ARTICLE REVISIONS TABLE
-- #############################################################################

CREATE TABLE IF NOT EXISTS public.journal_article_revisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id      UUID NOT NULL REFERENCES public.journal_articles(id) ON DELETE CASCADE,
  revision_number INTEGER NOT NULL,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL,
  tag             TEXT NOT NULL,
  img             TEXT NOT NULL,
  asset_path      TEXT,
  dek             TEXT NOT NULL,
  content         TEXT,
  author          TEXT NOT NULL DEFAULT 'House of Padmavati',
  image_alt       TEXT,
  status          TEXT NOT NULL,
  snapshot        JSONB NOT NULL,
  change_summary  TEXT,
  created_by      UUID REFERENCES auth.users(id),
  actor_email     TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unq_journal_article_revision UNIQUE (article_id, revision_number)
);

CREATE INDEX IF NOT EXISTS idx_journal_revisions_article
  ON public.journal_article_revisions (article_id, revision_number DESC);

-- Enable Row-Level Security
ALTER TABLE public.journal_article_revisions ENABLE ROW LEVEL SECURITY;

-- Deny public access; allow authenticated administrators full access
DROP POLICY IF EXISTS "journal_revisions_admin_all" ON public.journal_article_revisions;
CREATE POLICY "journal_revisions_admin_all" ON public.journal_article_revisions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- #############################################################################
-- 3. REVISION CAPTURE & RESTORE FUNCTIONS
-- #############################################################################

-- 3.1 Snapshot / Save Revision Function
CREATE OR REPLACE FUNCTION public.save_journal_article_revision(
  p_article_id     UUID,
  p_change_summary TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_article  RECORD;
  v_next_rev INTEGER;
  v_rev_id   UUID;
  v_actor    TEXT;
  v_snapshot JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_article
  FROM public.journal_articles
  WHERE id = p_article_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Journal article not found: %', p_article_id USING ERRCODE = 'P0002';
  END IF;

  -- Determine next revision number
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO v_next_rev
  FROM public.journal_article_revisions
  WHERE article_id = p_article_id;

  v_actor := COALESCE(auth.jwt() ->> 'email', 'admin');

  v_snapshot := jsonb_build_object(
    'id', v_article.id,
    'slug', v_article.slug,
    'title', v_article.title,
    'tag', v_article.tag,
    'img', v_article.img,
    'asset_path', v_article.asset_path,
    'dek', v_article.dek,
    'content', v_article.content,
    'author', v_article.author,
    'image_alt', v_article.image_alt,
    'sort_order', v_article.sort_order,
    'status', v_article.status,
    'published_at', v_article.published_at
  );

  INSERT INTO public.journal_article_revisions (
    article_id,
    revision_number,
    title,
    slug,
    tag,
    img,
    asset_path,
    dek,
    content,
    author,
    image_alt,
    status,
    snapshot,
    change_summary,
    created_by,
    actor_email
  ) VALUES (
    v_article.id,
    v_next_rev,
    v_article.title,
    v_article.slug,
    v_article.tag,
    v_article.img,
    v_article.asset_path,
    v_article.dek,
    v_article.content,
    v_article.author,
    v_article.image_alt,
    v_article.status,
    v_snapshot,
    COALESCE(p_change_summary, 'Updated reflection'),
    auth.uid(),
    v_actor
  ) RETURNING id INTO v_rev_id;

  RETURN jsonb_build_object(
    'revision_id', v_rev_id,
    'revision_number', v_next_rev,
    'article_id', v_article.id,
    'actor_email', v_actor,
    'created_at', now()
  );
END;
$$;

REVOKE ALL ON FUNCTION public.save_journal_article_revision(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.save_journal_article_revision(UUID, TEXT) TO authenticated, service_role;

-- 3.2 Restore Journal Article Revision Function
CREATE OR REPLACE FUNCTION public.restore_journal_article_revision(
  p_article_id      UUID,
  p_revision_number INTEGER
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rev      RECORD;
  v_article  RECORD;
  v_actor    TEXT;
  v_new_rev  INTEGER;
  v_snapshot JSONB;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rev
  FROM public.journal_article_revisions
  WHERE article_id = p_article_id AND revision_number = p_revision_number;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Revision % not found for article %', p_revision_number, p_article_id USING ERRCODE = 'P0002';
  END IF;

  v_actor := COALESCE(auth.jwt() ->> 'email', 'admin');

  -- Update article table with revision data
  UPDATE public.journal_articles
  SET
    title       = v_rev.title,
    slug        = v_rev.slug,
    tag         = v_rev.tag,
    img         = v_rev.img,
    asset_path  = v_rev.asset_path,
    dek         = v_rev.dek,
    content     = v_rev.content,
    author      = COALESCE(v_rev.author, 'House of Padmavati'),
    image_alt   = v_rev.image_alt,
    status      = v_rev.status,
    updated_at  = now()
  WHERE id = p_article_id
  RETURNING * INTO v_article;

  -- Create a new revision documenting the restore action
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO v_new_rev
  FROM public.journal_article_revisions
  WHERE article_id = p_article_id;

  v_snapshot := jsonb_build_object(
    'id', v_article.id,
    'slug', v_article.slug,
    'title', v_article.title,
    'tag', v_article.tag,
    'img', v_article.img,
    'asset_path', v_article.asset_path,
    'dek', v_article.dek,
    'content', v_article.content,
    'author', v_article.author,
    'image_alt', v_article.image_alt,
    'sort_order', v_article.sort_order,
    'status', v_article.status,
    'published_at', v_article.published_at
  );

  INSERT INTO public.journal_article_revisions (
    article_id,
    revision_number,
    title,
    slug,
    tag,
    img,
    asset_path,
    dek,
    content,
    author,
    image_alt,
    status,
    snapshot,
    change_summary,
    created_by,
    actor_email
  ) VALUES (
    v_article.id,
    v_new_rev,
    v_article.title,
    v_article.slug,
    v_article.tag,
    v_article.img,
    v_article.asset_path,
    v_article.dek,
    v_article.content,
    v_article.author,
    v_article.image_alt,
    v_article.status,
    v_snapshot,
    'Restored from revision #' || p_revision_number,
    auth.uid(),
    v_actor
  );

  -- Log action to studio_activities
  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'journal_revision_restored',
    'journal',
    p_article_id::text,
    v_article.title,
    v_actor,
    jsonb_build_object(
      'restored_revision', p_revision_number,
      'new_revision', v_new_rev
    )
  );

  RETURN to_jsonb(v_article);
END;
$$;

REVOKE ALL ON FUNCTION public.restore_journal_article_revision(UUID, INTEGER) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restore_journal_article_revision(UUID, INTEGER) TO authenticated, service_role;

-- #############################################################################
-- 4. ARCHIVE AND RESTORE RPCs FOR JOURNAL ARTICLES
-- #############################################################################

CREATE OR REPLACE FUNCTION public.archive_journal_article(
  p_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
  v_actor TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec FROM public.journal_articles WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Journal article not found: %', p_id USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.journal_articles
  SET status = 'archived',
      archived_at = now(),
      updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_rec;

  v_actor := COALESCE(auth.jwt() ->> 'email', 'admin');

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'journal_archived',
    'journal',
    p_id::text,
    v_rec.title,
    v_actor,
    jsonb_build_object('slug', v_rec.slug)
  );

  RETURN to_jsonb(v_rec);
END;
$$;

REVOKE ALL ON FUNCTION public.archive_journal_article(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.archive_journal_article(UUID) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.restore_journal_article(
  p_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec RECORD;
  v_actor TEXT;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec FROM public.journal_articles WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Journal article not found: %', p_id USING ERRCODE = 'P0002';
  END IF;

  UPDATE public.journal_articles
  SET status = 'draft',
      archived_at = NULL,
      updated_at = now()
  WHERE id = p_id
  RETURNING * INTO v_rec;

  v_actor := COALESCE(auth.jwt() ->> 'email', 'admin');

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'journal_restored',
    'journal',
    p_id::text,
    v_rec.title,
    v_actor,
    jsonb_build_object('slug', v_rec.slug)
  );

  RETURN to_jsonb(v_rec);
END;
$$;

REVOKE ALL ON FUNCTION public.restore_journal_article(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.restore_journal_article(UUID) TO authenticated, service_role;

-- #############################################################################
-- 5. UPGRADED COMPREHENSIVE MEDIA USAGE CHECK
-- #############################################################################

CREATE OR REPLACE FUNCTION public.check_media_asset_usage(
  p_url TEXT
) RETURNS JSONB
LANGUAGE plpgsql
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

  -- 3. Check journal_articles table (cover image, asset path, and markdown body references)
  FOR v_rec IN
    SELECT title
    FROM public.journal_articles
    WHERE img = p_url
       OR asset_path = p_url
       OR (content IS NOT NULL AND content LIKE '%' || p_url || '%')
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
-- 6. PERMANENT MEDIA PURGE RPC (DEFENSIVE SAFE PURGE)
-- #############################################################################

CREATE OR REPLACE FUNCTION public.purge_media_asset(
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

  -- Guard: Asset MUST be in trash first
  IF v_rec.status != 'trash' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'must_be_in_trash',
      'message', 'Asset must be moved to Trash before permanent deletion.'
    );
  END IF;

  -- Guard: Ensure asset has 0 live references across HOP
  v_usage := public.check_media_asset_usage(v_rec.public_url);
  IF (v_usage->>'in_use')::boolean THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'asset_in_use',
      'references', v_usage->'references',
      'message', 'Cannot purge asset: active references detected across store content.'
    );
  END IF;

  -- Safe to delete catalog entry
  DELETE FROM public.media_assets WHERE id = p_id;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'media_permanently_purged',
    'media',
    p_id::text,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object(
      'url', v_rec.public_url,
      'bucket_id', v_rec.bucket_id,
      'storage_path', v_rec.storage_path
    )
  );

  RETURN jsonb_build_object(
    'success', true,
    'bucket_id', v_rec.bucket_id,
    'storage_path', v_rec.storage_path
  );
END;
$$;

REVOKE ALL ON FUNCTION public.purge_media_asset(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.purge_media_asset(UUID) TO authenticated, service_role;

-- #############################################################################
-- 7. SEED BASELINE REVISIONS FOR EXISTING JOURNAL ARTICLES
-- #############################################################################

DO $$
DECLARE
  v_art RECORD;
  v_exists BOOLEAN;
  v_snapshot JSONB;
BEGIN
  FOR v_art IN SELECT * FROM public.journal_articles LOOP
    SELECT EXISTS (
      SELECT 1 FROM public.journal_article_revisions WHERE article_id = v_art.id
    ) INTO v_exists;

    IF NOT v_exists THEN
      v_snapshot := jsonb_build_object(
        'id', v_art.id,
        'slug', v_art.slug,
        'title', v_art.title,
        'tag', v_art.tag,
        'img', v_art.img,
        'asset_path', v_art.asset_path,
        'dek', v_art.dek,
        'content', v_art.content,
        'author', COALESCE(v_art.author, 'House of Padmavati'),
        'image_alt', v_art.image_alt,
        'sort_order', COALESCE(v_art.sort_order, 0),
        'status', v_art.status,
        'published_at', v_art.published_at
      );

      INSERT INTO public.journal_article_revisions (
        article_id,
        revision_number,
        title,
        slug,
        tag,
        img,
        asset_path,
        dek,
        content,
        author,
        image_alt,
        status,
        snapshot,
        change_summary,
        actor_email
      ) VALUES (
        v_art.id,
        1,
        v_art.title,
        v_art.slug,
        v_art.tag,
        v_art.img,
        v_art.asset_path,
        v_art.dek,
        v_art.content,
        COALESCE(v_art.author, 'House of Padmavati'),
        v_art.image_alt,
        v_art.status,
        v_snapshot,
        'Initial baseline revision #1',
        'system'
      );
    END IF;
  END LOOP;
END;
$$;
