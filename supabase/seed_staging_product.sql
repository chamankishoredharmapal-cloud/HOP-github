-- Staging-only seed product for autonomous payment validation
-- Project: dovnhgbisiturzbjgvei (HOP Staging)

INSERT INTO collections (id, name, slug, description, status)
VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'Staging Test Collection',
  'staging-test-collection',
  'Collection for staging Razorpay validation',
  'published'
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  slug = EXCLUDED.slug,
  status = 'published';

INSERT INTO products (
  id,
  sku,
  name,
  slug,
  story,
  short_description,
  customer_description,
  selling_price,
  mrp,
  stock,
  status,
  collection_id,
  fabric,
  weave,
  colour,
  occasion,
  length,
  weight,
  blouse_included,
  care_instructions,
  country_of_origin,
  estimated_dispatch_days,
  featured
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'SKU-STAGING-TEST-001',
  'Staging Validation Saree',
  'staging-validation-saree',
  'Synthetic saree created strictly on staging for end-to-end payment workflow validation.',
  'Staging validation test item',
  'Staging validation test item',
  50000, -- ₹500 in paise (50000 paise)
  100000, -- ₹1000 in paise
  50,
  'published'::product_status,
  'c0000000-0000-0000-0000-000000000001',
  'Silk',
  'Zari',
  'Crimson',
  'Festive',
  '5.5m',
  '600g',
  true,
  'Dry clean only',
  'India',
  3,
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  selling_price = EXCLUDED.selling_price,
  stock = 50,
  status = 'published'::product_status;

INSERT INTO product_images (
  id,
  product_id,
  url,
  alt_text,
  is_primary,
  sort_order
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'https://hop-staging.chamankishoredharmapal.workers.dev/assets/hop-hero-CdNzEp8V.jpg',
  'Staging Validation Saree Image',
  true,
  0
) ON CONFLICT (id) DO UPDATE SET
  url = EXCLUDED.url,
  is_primary = true;
