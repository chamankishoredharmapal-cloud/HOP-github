-- =============================================================================
-- House of Padmavati — Product Workspace (Combined)
-- Sprint 4.2
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================================================

-- 1. Product & Collection Tables
-- (from 20260709000000_create_product_tables.sql)
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS collections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL,
  description text,
  image_url   text,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS collections_slug_idx ON collections (slug);
CREATE INDEX IF NOT EXISTS collections_active_idx ON collections (is_active);

  CREATE TABLE IF NOT EXISTS products (
  id                      uuid              PRIMARY KEY DEFAULT gen_random_uuid(),
  sku                     text              NOT NULL,
  name                    text              NOT NULL,
  slug                    text              NOT NULL,
  story                   text,
  price                   integer           NOT NULL CHECK (price >= 0),
  fabric                  text,
  weave                   text,
  colour                  text,
  occasion                text,
  weight                  text,
  estimated_dispatch_days integer           NOT NULL DEFAULT 3,
  care_instructions       text,
  collection_id           uuid              REFERENCES collections (id) ON DELETE SET NULL,
  featured                boolean           NOT NULL DEFAULT false,
  status                  product_status    NOT NULL DEFAULT 'active',
  created_at              timestamptz       NOT NULL DEFAULT now(),
  updated_at              timestamptz       NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS products_sku_idx ON products (sku);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products (slug);
CREATE INDEX IF NOT EXISTS products_collection_idx ON products (collection_id);
CREATE INDEX IF NOT EXISTS products_status_idx ON products (status) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS products_featured_idx ON products (featured) WHERE featured = true;

-- =============================================================================
-- 2. Product Workspace Extension
-- (from 20260710000000_create_product_workspace.sql)
-- =============================================================================

ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'review';
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'published';

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS short_description       text,
  ADD COLUMN IF NOT EXISTS customer_description     text,
  ADD COLUMN IF NOT EXISTS mrp                      integer NOT NULL DEFAULT 0 CHECK (mrp >= 0),
  ADD COLUMN IF NOT EXISTS cost_price               integer NOT NULL DEFAULT 0 CHECK (cost_price >= 0),
  ADD COLUMN IF NOT EXISTS stock                     integer NOT NULL DEFAULT 0 CHECK (stock >= 0),
  ADD COLUMN IF NOT EXISTS low_stock_alert           integer NOT NULL DEFAULT 5,
  ADD COLUMN IF NOT EXISTS length                    text,
  ADD COLUMN IF NOT EXISTS blouse_included           boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS country_of_origin         text DEFAULT 'India',
  ADD COLUMN IF NOT EXISTS meta_title                text,
  ADD COLUMN IF NOT EXISTS meta_description          text,
  ADD COLUMN IF NOT EXISTS og_image_url              text;

ALTER TABLE products
  RENAME COLUMN price TO selling_price;

COMMENT ON COLUMN products.selling_price IS 'Amount in paise';
COMMENT ON COLUMN products.mrp IS 'Amount in paise. Maximum retail price';
COMMENT ON COLUMN products.cost_price IS 'Amount in paise';
COMMENT ON COLUMN products.story IS 'Editorial story / main description';
COMMENT ON COLUMN products.short_description IS 'Short summary for listings';
COMMENT ON COLUMN products.customer_description IS 'Customer-facing details';
COMMENT ON COLUMN products.meta_title IS 'SEO meta title';
COMMENT ON COLUMN products.meta_description IS 'SEO meta description';

CREATE TABLE IF NOT EXISTS product_images (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  url         text        NOT NULL,
  alt_text    text,
  sort_order  integer     NOT NULL DEFAULT 0,
  is_primary  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images (product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_sort_order ON product_images (product_id, sort_order);

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- =============================================================================
-- 3. RLS: Allow authenticated users to read/write product data
-- =============================================================================

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read collections"
    ON collections FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert collections"
    ON collections FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update collections"
    ON collections FOR UPDATE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete collections"
    ON collections FOR DELETE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read products"
    ON products FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert products"
    ON products FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update products"
    ON products FOR UPDATE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete products"
    ON products FOR DELETE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read product_images"
    ON product_images FOR SELECT TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can insert product_images"
    ON product_images FOR INSERT TO authenticated WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update product_images"
    ON product_images FOR UPDATE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete product_images"
    ON product_images FOR DELETE TO authenticated USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- =============================================================================
-- 4. RLS: Storage bucket — allow authenticated users to upload/delete
-- =============================================================================

DO $$ BEGIN
  CREATE POLICY "Authenticated users can read product-images"
    ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can upload product-images"
    ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can update product-images"
    ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Authenticated users can delete product-images"
    ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images');
EXCEPTION WHEN duplicate_object THEN null;
END $$;
