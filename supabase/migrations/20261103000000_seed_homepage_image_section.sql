-- =============================================================================
-- House of Padmavati - Phase 3: Homepage Full-Screen Image Section Baseline Seed
-- Migration: 20261103000000_seed_homepage_image_section.sql
--
-- Implements:
--   1. Baseline record in public.site_sections for home.image
--   2. Revision #1 in public.site_section_revisions
--   3. Idempotent execution via ON CONFLICT (key) DO NOTHING
-- =============================================================================

INSERT INTO public.site_sections (
  key,
  page_name,
  section_type,
  display_name,
  version,
  draft_payload,
  published_payload,
  status,
  has_unpublished_changes,
  published_at
) VALUES (
  'home.image',
  'home',
  'custom_section',
  'Homepage Full-Screen Image',
  1,
  '{
    "image_url": "/optimized/hero-image/hero-image-1824w.webp",
    "mobile_image_url": "/optimized/hero-image/hero-image-1200w.webp",
    "alt_text": "Two women wearing House of Padmavati sarees in window light",
    "focal_point": "right"
  }'::jsonb,
  '{
    "image_url": "/optimized/hero-image/hero-image-1824w.webp",
    "mobile_image_url": "/optimized/hero-image/hero-image-1200w.webp",
    "alt_text": "Two women wearing House of Padmavati sarees in window light",
    "focal_point": "right"
  }'::jsonb,
  'published',
  false,
  NOW()
) ON CONFLICT (key) DO NOTHING;

INSERT INTO public.site_section_revisions (
  section_key,
  revision_number,
  payload,
  change_summary,
  created_at
)
SELECT
  'home.image',
  1,
  published_payload,
  'Baseline initial publication for homepage full-screen image',
  NOW()
FROM public.site_sections
WHERE key = 'home.image'
  AND NOT EXISTS (
    SELECT 1 FROM public.site_section_revisions
    WHERE section_key = 'home.image' AND revision_number = 1
  );
