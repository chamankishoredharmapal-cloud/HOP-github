-- =============================================================================
-- House of Padmavati - Harden Studio Admin Policies
-- Phase 1: Critical Security
--
-- Admin source:
--   Supabase Auth JWT app_metadata must contain either:
--   - { "role": "admin" }
--   - { "roles": ["admin"] }
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid DEFAULT auth.uid())
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    user_id IS NOT NULL
    AND (
      COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      OR COALESCE(auth.jwt() -> 'app_metadata' -> 'roles', '[]'::jsonb) ? 'admin'
    );
$$;

-- -----------------------------------------------------------------------------
-- Catalog table policies
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Authenticated users can read collections" ON collections;
DROP POLICY IF EXISTS "Authenticated users can insert collections" ON collections;
DROP POLICY IF EXISTS "Authenticated users can update collections" ON collections;
DROP POLICY IF EXISTS "Authenticated users can delete collections" ON collections;
DROP POLICY IF EXISTS "Public can read collections" ON collections;
DROP POLICY IF EXISTS collections_read_public ON collections;
DROP POLICY IF EXISTS collections_all_admin ON collections;

ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY collections_read_published_public
  ON collections FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY collections_admin_all
  ON collections FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS products_read_public ON products;
DROP POLICY IF EXISTS products_all_admin ON products;

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_read_published_public
  ON products FOR SELECT
  TO anon, authenticated
  USING (status::text IN ('active', 'published'));

CREATE POLICY products_admin_all
  ON products FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can read product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can insert product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can update product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can delete product_images" ON product_images;
DROP POLICY IF EXISTS product_images_read_public ON product_images;
DROP POLICY IF EXISTS product_images_all_admin ON product_images;

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_images_read_public
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY product_images_admin_all
  ON product_images FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- Inventory history policies
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Authenticated users can read inventory_history" ON inventory_history;
DROP POLICY IF EXISTS "Authenticated users can insert inventory_history" ON inventory_history;

ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_history_admin_read
  ON inventory_history FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY inventory_history_admin_insert
  ON inventory_history FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

-- -----------------------------------------------------------------------------
-- Storage policies
-- -----------------------------------------------------------------------------

DROP POLICY IF EXISTS "Authenticated users can read product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product-images" ON storage.objects;

CREATE POLICY "Public can read product-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Admins can upload product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can update product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "Admins can delete product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Authenticated users can read HOP-films" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to HOP-films" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update HOP-films" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from HOP-films" ON storage.objects;

CREATE POLICY "Admins can upload HOP-films"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'HOP-films' AND public.is_admin());

CREATE POLICY "Admins can update HOP-films"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'HOP-films' AND public.is_admin())
  WITH CHECK (bucket_id = 'HOP-films' AND public.is_admin());

CREATE POLICY "Admins can delete HOP-films"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'HOP-films' AND public.is_admin());
