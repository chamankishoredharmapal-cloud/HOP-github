-- =============================================================================
-- House of Padmavati — Phase 3: Homepage Video (Living Saree) Section Baseline Seed
-- Migration: 20261024000000_seed_homepage_video_section.sql
--
-- Implements:
--   1. Baseline record in public.site_sections for:
--      - home.video (Homepage Video Placeholder / Living Saree Visual Study)
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
  'home.video',
  'home',
  'custom_section',
  'Homepage Video (Living Saree)',
  1,
  '{
    "is_enabled": true,
    "video_url": "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/KALYANI+1.mp4",
    "mobile_video_url": "",
    "poster_url": "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/1791499518383-gemini_generated_video_abe263ad-poster.jpg",
    "alt_text": "Living Saree visual study",
    "autoplay": true,
    "loop": true,
    "muted": true,
    "aspect_ratio": "16:9"
  }'::jsonb,
  '{
    "is_enabled": true,
    "video_url": "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/KALYANI+1.mp4",
    "mobile_video_url": "",
    "poster_url": "https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/1791499518383-gemini_generated_video_abe263ad-poster.jpg",
    "alt_text": "Living Saree visual study",
    "autoplay": true,
    "loop": true,
    "muted": true,
    "aspect_ratio": "16:9"
  }'::jsonb,
  'published',
  false,
  NOW()
) ON CONFLICT (key) DO NOTHING;

-- Seed revision #1 if not already present
INSERT INTO public.site_section_revisions (
  section_key,
  revision_number,
  payload,
  change_summary,
  created_at
)
SELECT
  'home.video',
  1,
  published_payload,
  'Baseline initial publication for homepage video placeholder',
  NOW()
FROM public.site_sections
WHERE key = 'home.video'
  AND NOT EXISTS (
    SELECT 1 FROM public.site_section_revisions
    WHERE section_key = 'home.video' AND revision_number = 1
  );
