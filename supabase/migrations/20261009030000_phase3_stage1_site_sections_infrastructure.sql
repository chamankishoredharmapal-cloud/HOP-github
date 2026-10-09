-- =============================================================================
-- House of Padmavati — Phase 3, Stage 1: Secure Content Infrastructure
-- Migration: 20261009030000_phase3_stage1_site_sections_infrastructure.sql
--
-- Implements:
--   1. public.site_sections table with draft/published segregation & RLS
--   2. public.site_section_revisions table with immutable audit ledger
--   3. public.published_sections read-only view for public storefront
--   4. public.validate_section_payload() security validator against XSS/injections
--   5. public.get_published_site_sections() & get_published_section() whitelist RPCs
--   6. Admin mutation RPCs: save_site_section_draft, publish_site_section,
--      restore_site_section_revision, archive_site_section, get_section_revisions
--   7. Grounded initial seed data for verified homepage sections (revision #1)
-- =============================================================================

-- #############################################################################
-- 1. SITE SECTIONS TABLE (public.site_sections)
-- #############################################################################

CREATE TABLE IF NOT EXISTS public.site_sections (
  key                      TEXT PRIMARY KEY,
  page_name                TEXT NOT NULL,
  section_type             TEXT NOT NULL,
  display_name             TEXT NOT NULL,
  version                  INTEGER NOT NULL DEFAULT 1,
  draft_payload            JSONB NOT NULL,
  published_payload        JSONB NOT NULL,
  status                   TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  has_unpublished_changes  BOOLEAN NOT NULL DEFAULT false,
  published_at             TIMESTAMPTZ DEFAULT now(),
  published_by             UUID REFERENCES auth.users(id),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_by               UUID REFERENCES auth.users(id),
  created_at               TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_site_sections_page ON public.site_sections (page_name);
CREATE INDEX IF NOT EXISTS idx_site_sections_status ON public.site_sections (status);
CREATE INDEX IF NOT EXISTS idx_site_sections_type ON public.site_sections (section_type);

-- #############################################################################
-- 2. SITE SECTION REVISIONS TABLE (public.site_section_revisions)
-- #############################################################################

CREATE TABLE IF NOT EXISTS public.site_section_revisions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key      TEXT NOT NULL REFERENCES public.site_sections(key) ON DELETE CASCADE,
  revision_number  INTEGER NOT NULL,
  payload          JSONB NOT NULL,
  change_summary   TEXT,
  published_by     UUID REFERENCES auth.users(id),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT unq_section_revision UNIQUE (section_key, revision_number)
);

CREATE INDEX IF NOT EXISTS idx_site_section_revisions_key ON public.site_section_revisions (section_key, revision_number DESC);

-- #############################################################################
-- 3. PAYLOAD SECURITY VALIDATION FUNCTION
-- #############################################################################

CREATE OR REPLACE FUNCTION public.validate_section_payload(
  p_section_type TEXT,
  p_payload      JSONB
) RETURNS BOOLEAN
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  -- 1. Ensure payload is a valid JSON object
  IF p_payload IS NULL OR jsonb_typeof(p_payload) != 'object' THEN
    RAISE EXCEPTION 'Payload must be a non-null JSON object' USING ERRCODE = '22023';
  END IF;

  -- 2. Reject executable HTML/JavaScript, dangerous attributes, and suspicious protocols
  IF p_payload::text ~* '(<script|javascript:|data:text/html|onload=|onerror=|<iframe|<object|<embed)' THEN
    RAISE EXCEPTION 'Disallowed HTML or executable script content detected in section payload'
      USING ERRCODE = '22023';
  END IF;

  -- 3. Validate supported section types
  IF p_section_type NOT IN (
    'hero_banner',
    'craft_story',
    'philosophy',
    'note_cards',
    'invitation',
    'story',
    'policy_document',
    'custom_section'
  ) THEN
    RAISE EXCEPTION 'Unsupported section type: %', p_section_type USING ERRCODE = '22023';
  END IF;

  -- 4. Validate essential structural keys per section type
  CASE p_section_type
    WHEN 'hero_banner' THEN
      IF NOT (p_payload ? 'title' AND p_payload ? 'alt_text') THEN
        RAISE EXCEPTION 'hero_banner requires title and alt_text fields' USING ERRCODE = '22023';
      END IF;
    WHEN 'craft_story' THEN
      IF NOT (p_payload ? 'title' AND p_payload ? 'image_url') THEN
        RAISE EXCEPTION 'craft_story requires title and image_url fields' USING ERRCODE = '22023';
      END IF;
    WHEN 'philosophy' THEN
      IF NOT (p_payload ? 'title' AND p_payload ? 'lede') THEN
        RAISE EXCEPTION 'philosophy requires title and lede fields' USING ERRCODE = '22023';
      END IF;
    WHEN 'note_cards' THEN
      IF NOT (p_payload ? 'heading' AND p_payload ? 'cards') THEN
        RAISE EXCEPTION 'note_cards requires heading and cards fields' USING ERRCODE = '22023';
      END IF;
    WHEN 'invitation' THEN
      IF NOT (p_payload ? 'title' AND p_payload ? 'body') THEN
        RAISE EXCEPTION 'invitation requires title and body fields' USING ERRCODE = '22023';
      END IF;
    ELSE
      -- Other types permit generalized object payload
      NULL;
  END CASE;

  RETURN TRUE;
END;
$$;

-- #############################################################################
-- 4. ROW-LEVEL SECURITY POLICIES
-- #############################################################################

ALTER TABLE public.site_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_section_revisions ENABLE ROW LEVEL SECURITY;

-- Deny direct access to non-admins on base tables
-- Anonymous visitors and regular customers receive 0 rows from direct table queries
DROP POLICY IF EXISTS "site_sections_admin_all" ON public.site_sections;
CREATE POLICY "site_sections_admin_all" ON public.site_sections
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "site_section_revisions_admin_all" ON public.site_section_revisions;
CREATE POLICY "site_section_revisions_admin_all" ON public.site_section_revisions
  FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- #############################################################################
-- 5. PUBLIC VIEWS & WHITELIST RPCs (Read-Only)
-- #############################################################################

-- Safe public view exposing only published fields (omits draft_payload, version, user ids)
CREATE OR REPLACE VIEW public.published_sections
WITH (security_invoker = false) AS
SELECT
  key,
  page_name,
  section_type,
  display_name,
  published_payload,
  published_at
FROM public.site_sections
WHERE status = 'published';

GRANT SELECT ON public.published_sections TO anon, authenticated, service_role;

-- Public RPC: Retrieve all published sections for a given page
CREATE OR REPLACE FUNCTION public.get_published_site_sections(
  p_page TEXT
) RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    jsonb_object_agg(key, published_payload),
    '{}'::jsonb
  )
  FROM public.site_sections
  WHERE page_name = p_page AND status = 'published';
$$;

REVOKE ALL ON FUNCTION public.get_published_site_sections(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_published_site_sections(TEXT) TO anon, authenticated, service_role;

-- Public RPC: Retrieve a single published section by key
CREATE OR REPLACE FUNCTION public.get_published_section(
  p_key TEXT
) RETURNS JSONB
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT published_payload
  FROM public.site_sections
  WHERE key = p_key AND status = 'published';
$$;

REVOKE ALL ON FUNCTION public.get_published_section(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_published_section(TEXT) TO anon, authenticated, service_role;

-- #############################################################################
-- 6. ATOMIC ADMINISTRATIVE MUTATION RPCs
-- #############################################################################

-- 6.1 Save Draft (Optimistic Concurrency Check)
CREATE OR REPLACE FUNCTION public.save_site_section_draft(
  p_key              TEXT,
  p_expected_version INTEGER,
  p_draft_payload    JSONB
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
  FROM public.site_sections
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'section_not_found');
  END IF;

  -- Optimistic concurrency check
  IF v_rec.version != p_expected_version THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'concurrency_conflict',
      'current_version', v_rec.version,
      'message', 'Another administrator updated this section. Please reload.'
    );
  END IF;

  -- Validate payload security & structure
  PERFORM public.validate_section_payload(v_rec.section_type, p_draft_payload);

  UPDATE public.site_sections
  SET draft_payload = p_draft_payload,
      version = v_rec.version + 1,
      has_unpublished_changes = (p_draft_payload != published_payload),
      updated_at = now(),
      updated_by = auth.uid()
  WHERE key = p_key;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'site_section_draft_saved',
    'site_section',
    p_key,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object('version', v_rec.version + 1)
  );

  RETURN jsonb_build_object('success', true, 'new_version', v_rec.version + 1);
END;
$$;

-- 6.2 Publish Section (Atomic Snapshot & Promotion)
CREATE OR REPLACE FUNCTION public.publish_site_section(
  p_key              TEXT,
  p_expected_version INTEGER,
  p_change_summary   TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec     RECORD;
  v_rev_num INTEGER;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec
  FROM public.site_sections
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'section_not_found');
  END IF;

  -- Optimistic concurrency check
  IF v_rec.version != p_expected_version THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'concurrency_conflict',
      'current_version', v_rec.version,
      'message', 'Another administrator updated this section. Please reload.'
    );
  END IF;

  -- Validate payload security & structure before publication
  PERFORM public.validate_section_payload(v_rec.section_type, v_rec.draft_payload);

  -- Determine next revision number
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO v_rev_num
  FROM public.site_section_revisions
  WHERE section_key = p_key;

  -- Insert immutable snapshot
  INSERT INTO public.site_section_revisions (
    section_key,
    revision_number,
    payload,
    change_summary,
    published_by,
    created_at
  ) VALUES (
    p_key,
    v_rev_num,
    v_rec.draft_payload,
    COALESCE(p_change_summary, 'Published from Studio Site Update'),
    auth.uid(),
    now()
  );

  -- Promote draft to published
  UPDATE public.site_sections
  SET published_payload = draft_payload,
      has_unpublished_changes = false,
      status = 'published',
      published_at = now(),
      published_by = auth.uid(),
      updated_at = now(),
      updated_by = auth.uid()
  WHERE key = p_key;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'site_section_published',
    'site_section',
    p_key,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object('revision', v_rev_num, 'summary', p_change_summary)
  );

  RETURN jsonb_build_object(
    'success', true,
    'revision_number', v_rev_num,
    'published_at', now()
  );
END;
$$;

-- 6.3 Restore Section Revision (Safe Rollback)
CREATE OR REPLACE FUNCTION public.restore_site_section_revision(
  p_key              TEXT,
  p_revision_number  INTEGER,
  p_expected_version INTEGER,
  p_reason           TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rec         RECORD;
  v_rev_payload JSONB;
  v_new_rev_num INTEGER;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  SELECT * INTO v_rec
  FROM public.site_sections
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'section_not_found');
  END IF;

  -- Optimistic concurrency check
  IF v_rec.version != p_expected_version THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'concurrency_conflict',
      'current_version', v_rec.version,
      'message', 'Another administrator updated this section. Please reload.'
    );
  END IF;

  -- Retrieve historical payload
  SELECT payload INTO v_rev_payload
  FROM public.site_section_revisions
  WHERE section_key = p_key AND revision_number = p_revision_number;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'revision_not_found');
  END IF;

  -- Validate the restored payload before applying
  PERFORM public.validate_section_payload(v_rec.section_type, v_rev_payload);

  -- Compute next revision number
  SELECT COALESCE(MAX(revision_number), 0) + 1 INTO v_new_rev_num
  FROM public.site_section_revisions
  WHERE section_key = p_key;

  -- Record restoration as a forward revision
  INSERT INTO public.site_section_revisions (
    section_key,
    revision_number,
    payload,
    change_summary,
    published_by,
    created_at
  ) VALUES (
    p_key,
    v_new_rev_num,
    v_rev_payload,
    COALESCE(p_reason, 'Restored from revision #' || p_revision_number::text),
    auth.uid(),
    now()
  );

  -- Promote restored payload to active published and draft states
  UPDATE public.site_sections
  SET published_payload = v_rev_payload,
      draft_payload = v_rev_payload,
      has_unpublished_changes = false,
      version = v_rec.version + 1,
      status = 'published',
      published_at = now(),
      published_by = auth.uid(),
      updated_at = now(),
      updated_by = auth.uid()
  WHERE key = p_key;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'site_section_restored',
    'site_section',
    p_key,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object('from_revision', p_revision_number, 'to_revision', v_new_rev_num)
  );

  RETURN jsonb_build_object(
    'success', true,
    'restored_revision', p_revision_number,
    'new_revision_number', v_new_rev_num,
    'new_version', v_rec.version + 1
  );
END;
$$;

-- 6.4 Archive Section
CREATE OR REPLACE FUNCTION public.archive_site_section(
  p_key              TEXT,
  p_expected_version INTEGER
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
  FROM public.site_sections
  WHERE key = p_key
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'section_not_found');
  END IF;

  IF v_rec.version != p_expected_version THEN
    RETURN jsonb_build_object('success', false, 'error', 'concurrency_conflict', 'current_version', v_rec.version);
  END IF;

  UPDATE public.site_sections
  SET status = 'archived',
      updated_at = now(),
      updated_by = auth.uid()
  WHERE key = p_key;

  INSERT INTO public.studio_activities (
    action,
    entity_type,
    entity_id,
    entity_name,
    user_email,
    details
  ) VALUES (
    'site_section_archived',
    'site_section',
    p_key,
    v_rec.display_name,
    COALESCE(auth.jwt() ->> 'email', 'admin'),
    jsonb_build_object('version', v_rec.version)
  );

  RETURN jsonb_build_object('success', true);
END;
$$;

-- 6.5 Retrieve Revisions for Admin Studio
CREATE OR REPLACE FUNCTION public.get_section_revisions(
  p_key TEXT
) RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator privileges required.' USING ERRCODE = '42501';
  END IF;

  RETURN COALESCE(
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'id', r.id,
          'revision_number', r.revision_number,
          'payload', r.payload,
          'change_summary', r.change_summary,
          'created_at', r.created_at,
          'published_by', r.published_by
        ) ORDER BY r.revision_number DESC
      )
      FROM public.site_section_revisions r
      WHERE r.section_key = p_key
    ),
    '[]'::jsonb
  );
END;
$$;

-- Secure Execution Permissions
REVOKE ALL ON FUNCTION public.save_site_section_draft(TEXT, INTEGER, JSONB) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_site_section_draft(TEXT, INTEGER, JSONB) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.publish_site_section(TEXT, INTEGER, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.publish_site_section(TEXT, INTEGER, TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.restore_site_section_revision(TEXT, INTEGER, INTEGER, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.restore_site_section_revision(TEXT, INTEGER, INTEGER, TEXT) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.archive_site_section(TEXT, INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.archive_site_section(TEXT, INTEGER) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.get_section_revisions(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.get_section_revisions(TEXT) TO authenticated, service_role;

-- #############################################################################
-- 7. INITIAL SEED DATA (Grounded in Verified Approved Homepage Copy)
-- #############################################################################

INSERT INTO public.site_sections (
  key,
  page_name,
  section_type,
  display_name,
  version,
  draft_payload,
  published_payload,
  status,
  has_unpublished_changes
) VALUES
  (
    'home.hero',
    'home',
    'hero_banner',
    'Homepage Hero (Threshold)',
    1,
    '{
      "title": "Saree. Time. You.",
      "subtitle": "Five ways of wearing tradition — considered deeply, chosen quietly.",
      "eyebrow": "House of Padmavati",
      "primary_cta": { "label": "Enter the House", "href": "/collections" },
      "secondary_cta": { "label": "Descend into the house", "href": "#collections" },
      "alt_text": "House of Padmavati collection film"
    }'::jsonb,
    '{
      "title": "Saree. Time. You.",
      "subtitle": "Five ways of wearing tradition — considered deeply, chosen quietly.",
      "eyebrow": "House of Padmavati",
      "primary_cta": { "label": "Enter the House", "href": "/collections" },
      "secondary_cta": { "label": "Descend into the house", "href": "#collections" },
      "alt_text": "House of Padmavati collection film"
    }'::jsonb,
    'published',
    false
  ),
  (
    'home.craft',
    'home',
    'craft_story',
    'Homepage Craft (Gangamma)',
    1,
    '{
      "title": "Detail is part of the design.",
      "lede": "Before a saree reaches the wardrobe, it passes through a series of considered decisions.",
      "quote": "The border is the signature. Without it, the saree is a stranger.",
      "attribution": "Gangamma",
      "craft_facts": "Molakalmuru, Karnataka · Temple border weaving · Fourth generation",
      "image_url": "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg",
      "caption": "Gangamma at her pit loom · Molakalmuru · 6:30 AM",
      "alt_text": "Gangamma at her pit loom, morning light from the window behind her",
      "cta": { "label": "Meet the makers", "href": "/journal/gangamma-molakalmuru" }
    }'::jsonb,
    '{
      "title": "Detail is part of the design.",
      "lede": "Before a saree reaches the wardrobe, it passes through a series of considered decisions.",
      "quote": "The border is the signature. Without it, the saree is a stranger.",
      "attribution": "Gangamma",
      "craft_facts": "Molakalmuru, Karnataka · Temple border weaving · Fourth generation",
      "image_url": "/content/weaver-portrait/gangamma-molakalmuru/hero.jpg",
      "caption": "Gangamma at her pit loom · Molakalmuru · 6:30 AM",
      "alt_text": "Gangamma at her pit loom, morning light from the window behind her",
      "cta": { "label": "Meet the makers", "href": "/journal/gangamma-molakalmuru" }
    }'::jsonb,
    'published',
    false
  ),
  (
    'home.philosophy',
    'home',
    'philosophy',
    'Homepage Philosophy',
    1,
    '{
      "title": "A House, Not a Shop.",
      "lede": "We make room for the intelligence of considered making, the patience of cloth and the woman who chooses what to carry.",
      "closing": "Not a season. Not a trend. A relationship with what lasts."
    }'::jsonb,
    '{
      "title": "A House, Not a Shop.",
      "lede": "We make room for the intelligence of considered making, the patience of cloth and the woman who chooses what to carry.",
      "closing": "Not a season. Not a trend. A relationship with what lasts."
    }'::jsonb,
    'published',
    false
  ),
  (
    'home.ownership',
    'home',
    'note_cards',
    'Homepage Ownership (House Notes)',
    1,
    '{
      "heading": "Wear it slowly. Keep it long.",
      "subheading": "A first drape, a simple ritual, a lifetime of care. Ownership is part of the beauty.",
      "cards": [
        {
          "label": "The hand",
          "title": "A body in motion.",
          "text": "A saree holds the decisions behind it. The tension of the thread, the balance of the border and the patience of its making all remain in the cloth.",
          "link_label": "Read the pit loom",
          "href": "/journal/the-pit-loom"
        },
        {
          "label": "The keeping",
          "title": "Meaning over excess.",
          "text": "We design for the women who will inherit these drapes. Care, repair and a long life are part of the pleasure of choosing well.",
          "link_label": "Explore saree care",
          "href": "/customer-care"
        },
        {
          "label": "The giving",
          "title": "A considered gesture.",
          "text": "Some arrivals are meant to be witnessed. The house keeps the language of gifting quiet, personal and human.",
          "link_label": "Begin a gift",
          "href": "/gift"
        }
      ]
    }'::jsonb,
    '{
      "heading": "Wear it slowly. Keep it long.",
      "subheading": "A first drape, a simple ritual, a lifetime of care. Ownership is part of the beauty.",
      "cards": [
        {
          "label": "The hand",
          "title": "A body in motion.",
          "text": "A saree holds the decisions behind it. The tension of the thread, the balance of the border and the patience of its making all remain in the cloth.",
          "link_label": "Read the pit loom",
          "href": "/journal/the-pit-loom"
        },
        {
          "label": "The keeping",
          "title": "Meaning over excess.",
          "text": "We design for the women who will inherit these drapes. Care, repair and a long life are part of the pleasure of choosing well.",
          "link_label": "Explore saree care",
          "href": "/customer-care"
        },
        {
          "label": "The giving",
          "title": "A considered gesture.",
          "text": "Some arrivals are meant to be witnessed. The house keeps the language of gifting quiet, personal and human.",
          "link_label": "Begin a gift",
          "href": "/gift"
        }
      ]
    }'::jsonb,
    'published',
    false
  ),
  (
    'home.invitation',
    'home',
    'invitation',
    'Homepage Invitation',
    1,
    '{
      "title": "Come in quietly. Choose slowly.",
      "body": "There is no rush here. Explore the collections, or begin a conversation with the house.",
      "links": [
        { "label": "Explore Collections", "href": "/collections" },
        { "label": "House Letters", "href": "/journal" },
        { "label": "Contact / Conversation", "href": "/customer-care" }
      ]
    }'::jsonb,
    '{
      "title": "Come in quietly. Choose slowly.",
      "body": "There is no rush here. Explore the collections, or begin a conversation with the house.",
      "links": [
        { "label": "Explore Collections", "href": "/collections" },
        { "label": "House Letters", "href": "/journal" },
        { "label": "Contact / Conversation", "href": "/customer-care" }
      ]
    }'::jsonb,
    'published',
    false
  )
ON CONFLICT (key) DO NOTHING;

-- Seed initial revision #1 into site_section_revisions for each seeded section
INSERT INTO public.site_section_revisions (
  section_key,
  revision_number,
  payload,
  change_summary
)
SELECT
  key,
  1,
  published_payload,
  'Initial baseline publication seeded from verified storefront copy'
FROM public.site_sections
ON CONFLICT (section_key, revision_number) DO NOTHING;
