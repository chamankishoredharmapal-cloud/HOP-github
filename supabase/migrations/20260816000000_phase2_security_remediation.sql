-- =============================================================================
-- House of Padmavati — Phase 2 Security Remediation
-- Migration: 20260816000000
-- Description: Fixes customer identity linkage, wishlist RLS, addresses RLS,
-- and provides an RPC for safe profile upserts linking guest checkouts to auth.
-- =============================================================================

-- 1. FIX: Missing INSERT policy for customers
CREATE POLICY customers_self_insert ON customers
  FOR INSERT WITH CHECK (email = auth.email());

-- 2. FIX: Missing UPDATE/DELETE policies for shipping_addresses
CREATE POLICY shipping_addresses_customer_update ON shipping_addresses
  FOR UPDATE USING (customer_id IN (SELECT id FROM customers WHERE email = auth.email()))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE email = auth.email()));

CREATE POLICY shipping_addresses_customer_delete ON shipping_addresses
  FOR DELETE USING (customer_id IN (SELECT id FROM customers WHERE email = auth.email()));

-- 3. FIX: customer_wishlists RLS tied to auth.uid() instead of email
-- This broke because guest checkouts create a customer row with a random UUID,
-- so when they sign up, auth.uid() != customers.id.
DROP POLICY IF EXISTS customer_wishlists_select_own ON customer_wishlists;
DROP POLICY IF EXISTS customer_wishlists_insert_own ON customer_wishlists;
DROP POLICY IF EXISTS customer_wishlists_delete_own ON customer_wishlists;

CREATE POLICY customer_wishlists_select_own ON customer_wishlists
  FOR SELECT USING (customer_id IN (SELECT id FROM customers WHERE email = auth.email()));

CREATE POLICY customer_wishlists_insert_own ON customer_wishlists
  FOR INSERT WITH CHECK (customer_id IN (SELECT id FROM customers WHERE email = auth.email()));

CREATE POLICY customer_wishlists_delete_own ON customer_wishlists
  FOR DELETE USING (customer_id IN (SELECT id FROM customers WHERE email = auth.email()));

-- 4. FIX: Safe profile upsert RPC
-- Instead of trying to insert with id = auth.uid() which violates the unique email
-- constraint if they already checked out as a guest, we use this RPC.
CREATE OR REPLACE FUNCTION upsert_customer_profile(
  p_email TEXT,
  p_full_name TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Verify the caller actually owns this email
  IF auth.email() IS NULL OR auth.email() != p_email THEN
    RAISE EXCEPTION 'unauthorized: email mismatch';
  END IF;

  INSERT INTO customers (email, full_name)
  VALUES (p_email, p_full_name)
  ON CONFLICT (LOWER(email)) DO UPDATE
  SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$$;
