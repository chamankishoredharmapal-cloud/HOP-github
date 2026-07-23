-- House of Padmavati Studio — Product Workspace Schema
-- Sprint 4.2

-- Extend product_status enum
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'review';
ALTER TYPE product_status ADD VALUE IF NOT EXISTS 'published';

-- Extend products table with editorial, pricing, technical, and SEO fields
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

-- Ensure product_images table
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

-- Ensure storage bucket for product images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;
