-- =============================================================================
-- House of Padmavati — Phase 2 Closure Security Hardening
-- Migration: 20260816000001
-- Description: Fixes three P0/P1 security vulnerabilities discovered during
-- independent Phase 2 verification:
--   1. inventory_history: permissive policies accidentally re-introduced
--   2. settings: wide-open to all authenticated users
--   3. Admin verification inconsistency: standardize on is_admin()
-- =============================================================================

-- #############################################################################
-- 1. FIX P0: inventory_history — drop permissive policies
--    Migration 0716 hardened this to admin-only.
--    Migration 0718-01 accidentally re-introduced permissive policies.
--    Migration 0720-01 added yet another admin policy.
--    Net effect: permissive policies defeat admin-only (OR-combined).
--    Fix: drop ALL permissive policies, keep only admin-gated ones.
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can read inventory_history" ON inventory_history;
DROP POLICY IF EXISTS "Authenticated users can insert inventory_history" ON inventory_history;
-- Also drop the fragmented policies from 0716 and 0720-01 to consolidate
DROP POLICY IF EXISTS inventory_history_admin_read ON inventory_history;
DROP POLICY IF EXISTS inventory_history_admin_insert ON inventory_history;
DROP POLICY IF EXISTS inventory_history_admin_all ON inventory_history;

-- Recreate a single, clean admin-only policy using is_admin()
CREATE POLICY inventory_history_admin_all
  ON inventory_history FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- #############################################################################
-- 2. FIX P0: settings — restrict to admin only
--    Any authenticated user could overwrite store configuration.
-- #############################################################################

DROP POLICY IF EXISTS "Authenticated users can manage settings" ON settings;

CREATE POLICY settings_admin_all
  ON settings FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Allow all authenticated users to READ settings (needed for storefront config)
CREATE POLICY settings_read_authenticated
  ON settings FOR SELECT
  TO authenticated
  USING (true);

-- #############################################################################
-- 3. FIX P1: Admin verification — standardize order-related policies
--    Some policies use EXISTS(profiles) while others use is_admin().
--    Standardize on is_admin() which checks JWT app_metadata.
--    This ensures admin status is derived from the token, not a table
--    that could have stale data.
-- #############################################################################

-- orders
DROP POLICY IF EXISTS orders_admin_all ON orders;
CREATE POLICY orders_admin_all
  ON orders FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- order_items
DROP POLICY IF EXISTS order_items_admin_all ON order_items;
CREATE POLICY order_items_admin_all
  ON order_items FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- payments
DROP POLICY IF EXISTS payments_admin_all ON payments;
CREATE POLICY payments_admin_all
  ON payments FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- payment_events
DROP POLICY IF EXISTS payment_events_admin_all ON payment_events;
CREATE POLICY payment_events_admin_all
  ON payment_events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- shipping_addresses
DROP POLICY IF EXISTS shipping_addresses_admin_all ON shipping_addresses;
CREATE POLICY shipping_addresses_admin_all
  ON shipping_addresses FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- customers
DROP POLICY IF EXISTS customers_admin_all ON customers;
CREATE POLICY customers_admin_all
  ON customers FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- order_events
DROP POLICY IF EXISTS order_events_admin_all ON order_events;
CREATE POLICY order_events_admin_all
  ON order_events FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
