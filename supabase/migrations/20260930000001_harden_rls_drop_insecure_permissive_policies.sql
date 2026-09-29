-- =============================================================================
-- House of Padmavati — Production Security Hardening
-- Migration: 20260930000001
-- Description: Drop legacy permissive "Authenticated users can..." policies
-- that circumvented RLS isolation on customer data (orders, addresses, payments,
-- customer profiles) and admin catalog resources (collections, products, storage).
-- Enforce strict role-based access control (RBAC) and customer-isolated RLS.
-- =============================================================================

-- #############################################################################
-- 1. CUSTOMERS TABLE
-- Drop blanket authenticated access; enforce self-only access + admin + service_role
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read customers" ON customers;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'customers' AND policyname = 'customers_service_all'
  ) THEN
    CREATE POLICY customers_service_all ON customers FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 2. SHIPPING_ADDRESSES TABLE
-- Drop blanket authenticated access; enforce customer ownership + admin + service_role
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read shipping_addresses" ON shipping_addresses;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'shipping_addresses' AND policyname = 'shipping_addresses_service_all'
  ) THEN
    CREATE POLICY shipping_addresses_service_all ON shipping_addresses FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 3. ORDERS TABLE
-- Drop blanket read/update access; enforce customer ownership + admin + service_role
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read orders" ON orders;
DROP POLICY IF EXISTS "Authenticated users can update orders" ON orders;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'orders_service_all'
  ) THEN
    CREATE POLICY orders_service_all ON orders FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 4. ORDER_ITEMS TABLE
-- Drop blanket read access; enforce parent order customer ownership + admin + service_role
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read order_items" ON order_items;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'order_items_service_all'
  ) THEN
    CREATE POLICY order_items_service_all ON order_items FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 5. PAYMENTS TABLE
-- Drop blanket read access; enforce parent order customer ownership + admin + service_role
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read payments" ON payments;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'payments_service_all'
  ) THEN
    CREATE POLICY payments_service_all ON payments FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 6. PRODUCTS TABLE
-- Drop legacy mutation/read policies; enforce published public read + admin full access
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can insert products" ON products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON products;
DROP POLICY IF EXISTS "Authenticated users can read products" ON products;
DROP POLICY IF EXISTS "Public can read products" ON products;
DROP POLICY IF EXISTS products_read_published_public ON products;

CREATE POLICY products_read_published_public
  ON products FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'products' AND policyname = 'products_admin_all'
  ) THEN
    CREATE POLICY products_admin_all
      ON products FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END;
$$;

-- #############################################################################
-- 7. PRODUCT_IMAGES TABLE
-- Drop legacy mutation/read policies; enforce public read + admin full access
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can insert product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can update product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can delete product_images" ON product_images;
DROP POLICY IF EXISTS "Authenticated users can read product_images" ON product_images;
DROP POLICY IF EXISTS "Public can read product_images" ON product_images;
DROP POLICY IF EXISTS product_images_read_public ON product_images;

CREATE POLICY product_images_read_public
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'product_images' AND policyname = 'product_images_admin_all'
  ) THEN
    CREATE POLICY product_images_admin_all
      ON product_images FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END;
$$;

-- #############################################################################
-- 8. COLLECTIONS TABLE
-- Drop legacy mutation/read policies; enforce published public read + admin full access
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can insert collections" ON collections;
DROP POLICY IF EXISTS "Authenticated users can update collections" ON collections;
DROP POLICY IF EXISTS "Authenticated users can delete collections" ON collections;
DROP POLICY IF EXISTS "Authenticated users can read collections" ON collections;
DROP POLICY IF EXISTS "Public can read collections" ON collections;
DROP POLICY IF EXISTS collections_read_published_public ON collections;

CREATE POLICY collections_read_published_public
  ON collections FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'collections' AND policyname = 'collections_admin_all'
  ) THEN
    CREATE POLICY collections_admin_all
      ON collections FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END;
$$;

-- #############################################################################
-- 9. STORAGE OBJECTS (HOP-films & product-images buckets)
-- Drop non-admin mutation policies; enforce public read + admin full access
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update product-images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete product-images" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can read HOP-films" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload to HOP-films" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update HOP-films" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete from HOP-films" ON storage.objects;

DROP POLICY IF EXISTS "Public can read product-images" ON storage.objects;
CREATE POLICY "Public can read product-images"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Admins can upload product-images" ON storage.objects;
CREATE POLICY "Admins can upload product-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update product-images" ON storage.objects;
CREATE POLICY "Admins can update product-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin())
  WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete product-images" ON storage.objects;
CREATE POLICY "Admins can delete product-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND public.is_admin());

DROP POLICY IF EXISTS "Public can read HOP-films" ON storage.objects;
CREATE POLICY "Public can read HOP-films"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'HOP-films');

DROP POLICY IF EXISTS "Admins can upload HOP-films" ON storage.objects;
CREATE POLICY "Admins can upload HOP-films"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'HOP-films' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can update HOP-films" ON storage.objects;
CREATE POLICY "Admins can update HOP-films"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'HOP-films' AND public.is_admin())
  WITH CHECK (bucket_id = 'HOP-films' AND public.is_admin());

DROP POLICY IF EXISTS "Admins can delete HOP-films" ON storage.objects;
CREATE POLICY "Admins can delete HOP-films"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'HOP-films' AND public.is_admin());
