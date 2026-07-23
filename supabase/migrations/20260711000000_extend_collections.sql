-- =============================================================================
-- House of Padmavati — Extend Collections Table
-- Sprint 4.3 — Collections CMS & Dynamic Homepage Films
-- Run AFTER combined product workspace migration + seed
-- =============================================================================

-- Phase 1: Rename columns safely (each wrapped in EXCEPTION so a failure
-- doesn't abort the entire batch — the Supabase SQL Editor stops on any
-- unhandled error and skips all remaining statements)

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

-- Phase 2: Add new columns (each individually for isolation; hero_image_url
-- included as a fallback in case the rename above was skipped)
ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_image_url       text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS hero_video_url       text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS editorial_story      text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS tagline              text;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS featured_on_homepage boolean NOT NULL DEFAULT false;
ALTER TABLE collections ADD COLUMN IF NOT EXISTS status               text NOT NULL DEFAULT 'published';

-- Phase 3: Migrate is_active → status for existing rows
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'is_active'
  ) THEN
    UPDATE collections SET status = 'draft' WHERE is_active = false AND status = 'published';
  END IF;
END $$;

-- Phase 4: Drop old columns that have been replaced, keeping only those that
-- still exist and whose replacements are confirmed present
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'image_url'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'hero_image_url'
  ) THEN
    ALTER TABLE collections DROP COLUMN IF EXISTS image_url;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped drop image_url: %', SQLERRM;
END $$;

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'is_active'
  ) THEN
    ALTER TABLE collections DROP COLUMN IF EXISTS is_active;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped drop is_active: %', SQLERRM;
END $$;

-- Phase 5: Drop the old sort_order if it wasn't renamed and display_order exists
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'sort_order'
  ) AND EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'collections' AND column_name = 'display_order'
  ) THEN
    ALTER TABLE collections DROP COLUMN IF EXISTS sort_order;
  END IF;
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'Skipped drop sort_order: %', SQLERRM;
END $$;

-- Phase 6: Index for homepage featured queries
CREATE INDEX IF NOT EXISTS idx_collections_featured
  ON collections (featured_on_homepage, display_order)
  WHERE featured_on_homepage = true AND status = 'published';

-- Phase 7: Seed editorial content for the five known collections
UPDATE collections SET
  editorial_story = CASE slug
    WHEN 'kalyani'  THEN 'Kalyani is named for the woman who enters a room and changes its temperature without a word. These are not wedding sarees for the ceremony alone — they are for the engagement dinner, the reception glare, the quiet moment before the vows, and the morning after, when the jewellery is put away but the silk stays on. Each saree in this collection carries a weight of occasion — not heavy, but felt.'
    WHEN 'viara'    THEN 'Viara is the collection that announces itself without raising its voice. These are sarees for evenings that demand a certain kind of attention — not loud, but undeniable. Cut to a winter reception in Udaipur, a gallery opening in Mumbai, a milestone birthday in Chennai. Viara is the saree that outlasts the conversation and is remembered the next morning.'
    WHEN 'arya'     THEN 'Arya is a rhythm, not a category. These sarees are built for women who move through their day in layers — boardroom in the morning, coffee with a friend by afternoon, dinner by the sea at night. Light drapes that hold their shape, linens that breathe through a long day, cottons that feel like a second skin. Arya is not about occasion. It is about the woman who defines it.'
    WHEN 'padma'    THEN 'Padma is our weave laboratory — a collection born at the intersection of craft and mathematics. Every saree in this archive begins with a geometric question: what happens when the weaver shifts the thread count by one? When the pattern repeats at a different interval? The result is a collection of sarees that feel architectural, composed, deliberate. Each one is a small thesis on the beauty of structure.'
    WHEN 'spandana' THEN 'Spandana is where the saree steps out of tradition and into the contemporary frame. These are not heirlooms in waiting — they are statements for now. Unconventional drapes, experimental textures, colours that refuse to sit quietly. Spandana is for the woman who wears the saree because she chooses to, not because the calendar told her to. It is confidence, woven.'
  END,
  tagline = CASE slug
    WHEN 'kalyani'  THEN 'Wedding Elegance · Heritage Luxury'
    WHEN 'viara'    THEN 'Luxury Reception · The Flagship'
    WHEN 'arya'     THEN 'Modern Working Woman · Social'
    WHEN 'padma'    THEN 'Geometry · Structure · Craft'
    WHEN 'spandana' THEN 'Contemporary Luxury · Fashion Forward'
  END,
  featured_on_homepage = true,
  status = 'published'
WHERE slug IN ('kalyani', 'viara', 'arya', 'padma', 'spandana');

-- =============================================================================
-- RLS: Allow anonymous users to read collections (storefront needs this)
-- =============================================================================

DO $$ BEGIN
  CREATE POLICY "Public can read collections"
    ON collections FOR SELECT TO anon USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- RLS: Storage bucket HOP-films — allow public reads + authenticated management
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
