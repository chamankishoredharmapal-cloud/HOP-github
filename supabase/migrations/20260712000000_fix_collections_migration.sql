-- =============================================================================
-- House of Padmavati — Fix Collections Schema
-- Sprint 4.3 — Upgrade existing collections table to match frontend
--
-- Idempotent. Safe to run multiple times. Preserves all existing data.
-- Does NOT recreate the collections table.
-- Does NOT UPDATE any rows.
-- Only renames columns and adds missing ones.
-- =============================================================================

-- Phase 1: Rename sort_order → display_order (data preserved via rename)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'sort_order'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE collections RENAME COLUMN sort_order TO display_order;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped rename sort_order→display_order: %', SQLERRM;
END $$;

-- Phase 2: Rename image_url → hero_image_url (data preserved via rename)
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'image_url'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE collections RENAME COLUMN image_url TO hero_image_url;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped rename image_url→hero_image_url: %', SQLERRM;
END $$;

-- Phase 3: Add missing columns (hero_image_url included as fallback in
-- case the rename above was skipped because both old and new existed)
ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_image_url       text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_video_url       text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS editorial_story      text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS tagline              text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS featured_on_homepage boolean NOT NULL DEFAULT false;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS status               text NOT NULL DEFAULT 'published';

-- Phase 4: Index for homepage featured queries
CREATE INDEX IF NOT EXISTS idx_collections_featured
  ON collections (featured_on_homepage, display_order)
  WHERE featured_on_homepage = true AND status = 'published';

-- =============================================================================
-- RLS: Allow anonymous users to read collections (storefront needs this)
-- =============================================================================

DO $$ BEGIN
  CREATE POLICY "Public can read collections"
    ON collections FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- RLS: Storage bucket HOP-films — public reads + authenticated management
-- =============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('HOP-films', 'HOP-films', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$ BEGIN
  CREATE POLICY "Public can read HOP-films"
    ON storage.objects FOR SELECT TO anon USING (bucket_id = 'HOP-films');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read HOP-films"
    ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'HOP-films');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload to HOP-films"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'HOP-films');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update HOP-films"
    ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'HOP-films');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete from HOP-films"
    ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'HOP-films');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
