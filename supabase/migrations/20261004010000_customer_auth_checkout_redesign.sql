-- =============================================================================
-- House of Padmavati — Customer Auth & Checkout Redesign
-- Migration: 20261004010000
-- Description:
-- 1. Add address_type to shipping_addresses (HOME, WORK, OTHER)
-- 2. Update upsert_customer_profile to accept and persist phone number
-- 3. Add get_current_customer_profile RPC for single-roundtrip hydration
-- 4. Add save_customer_address RPC with ownership and auto-default handling
-- 5. Harden RLS policies with case-insensitive email matching
-- =============================================================================

-- 1. Add address_type to shipping_addresses
ALTER TABLE shipping_addresses
ADD COLUMN IF NOT EXISTS address_type TEXT NOT NULL DEFAULT 'HOME';

-- Ensure is_default column exists
ALTER TABLE shipping_addresses
ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT false;

-- Unique partial index: only one default address per customer
CREATE UNIQUE INDEX IF NOT EXISTS shipping_addresses_one_default_per_customer
ON shipping_addresses (customer_id)
WHERE is_default = true;

-- 2. Enhanced upsert_customer_profile RPC with phone persistence
CREATE OR REPLACE FUNCTION upsert_customer_profile(
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_id UUID;
BEGIN
  -- Verify the caller owns this email if authenticated
  IF auth.email() IS NOT NULL AND LOWER(auth.email()) != LOWER(p_email) THEN
    RAISE EXCEPTION 'unauthorized: email mismatch';
  END IF;

  INSERT INTO customers (email, full_name, phone)
  VALUES (p_email, p_full_name, p_phone)
  ON CONFLICT (LOWER(email)) DO UPDATE
  SET full_name = EXCLUDED.full_name,
      phone = COALESCE(EXCLUDED.phone, customers.phone)
  RETURNING id INTO v_id;

  RETURN jsonb_build_object('success', true, 'id', v_id);
END;
$$;

GRANT EXECUTE ON FUNCTION upsert_customer_profile(TEXT, TEXT, TEXT) TO authenticated, anon;

-- 3. Optimized single-query RPC: get_current_customer_profile
-- Eliminates sequential waterfalls: loads customer, saved addresses, and default address in 1 call.
CREATE OR REPLACE FUNCTION get_current_customer_profile()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer RECORD;
  v_default_address RECORD;
  v_addresses JSONB;
BEGIN
  IF auth.email() IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'unauthorized');
  END IF;

  SELECT * INTO v_customer
  FROM customers
  WHERE LOWER(email) = LOWER(auth.email())
  LIMIT 1;

  IF v_customer IS NULL THEN
    RETURN jsonb_build_object(
      'success', true,
      'customer', null,
      'addresses', '[]'::jsonb,
      'default_address', null
    );
  END IF;

  -- If customer has addresses but none marked default, designate the most recent
  IF EXISTS (
    SELECT 1 FROM shipping_addresses
    WHERE customer_id = v_customer.id
  ) AND NOT EXISTS (
    SELECT 1 FROM shipping_addresses
    WHERE customer_id = v_customer.id AND is_default = true
  ) THEN
    UPDATE shipping_addresses
    SET is_default = true
    WHERE id = (
      SELECT id FROM shipping_addresses
      WHERE customer_id = v_customer.id
      ORDER BY created_at DESC
      LIMIT 1
    );
  END IF;

  SELECT jsonb_agg(to_jsonb(a) ORDER BY a.is_default DESC, a.created_at DESC) INTO v_addresses
  FROM shipping_addresses a
  WHERE a.customer_id = v_customer.id;

  SELECT * INTO v_default_address
  FROM shipping_addresses
  WHERE customer_id = v_customer.id AND is_default = true
  LIMIT 1;

  RETURN jsonb_build_object(
    'success', true,
    'customer', to_jsonb(v_customer),
    'addresses', COALESCE(v_addresses, '[]'::jsonb),
    'default_address', CASE WHEN v_default_address IS NOT NULL THEN to_jsonb(v_default_address) ELSE null END
  );
END;
$$;

GRANT EXECUTE ON FUNCTION get_current_customer_profile() TO authenticated;

-- 4. Safe address save RPC with auto-default and ownership enforcement
CREATE OR REPLACE FUNCTION save_customer_address(
  p_recipient_name TEXT,
  p_phone TEXT,
  p_address TEXT,
  p_city TEXT,
  p_state TEXT,
  p_postal_code TEXT,
  p_country TEXT DEFAULT 'India',
  p_landmark TEXT DEFAULT NULL,
  p_address_type TEXT DEFAULT 'HOME',
  p_set_as_default BOOLEAN DEFAULT false,
  p_address_id UUID DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_address_id UUID;
  v_is_first BOOLEAN;
  v_make_default BOOLEAN;
BEGIN
  IF auth.email() IS NULL THEN
    RAISE EXCEPTION 'unauthorized: no authenticated user';
  END IF;

  SELECT id INTO v_customer_id
  FROM customers
  WHERE LOWER(email) = LOWER(auth.email());

  IF v_customer_id IS NULL THEN
    INSERT INTO customers (email, full_name, phone)
    VALUES (auth.email(), p_recipient_name, p_phone)
    RETURNING id INTO v_customer_id;
  END IF;

  -- Check if this will be the customer's first address
  SELECT NOT EXISTS (
    SELECT 1 FROM shipping_addresses
    WHERE customer_id = v_customer_id AND (p_address_id IS NULL OR id != p_address_id)
  ) INTO v_is_first;

  v_make_default := p_set_as_default OR v_is_first;

  IF v_make_default THEN
    UPDATE shipping_addresses
    SET is_default = false
    WHERE customer_id = v_customer_id AND is_default = true;
  END IF;

  IF p_address_id IS NOT NULL THEN
    UPDATE shipping_addresses
    SET recipient_name = p_recipient_name,
        phone = p_phone,
        address = p_address,
        city = p_city,
        state = p_state,
        postal_code = p_postal_code,
        country = p_country,
        landmark = p_landmark,
        address_type = p_address_type,
        is_default = CASE WHEN v_make_default THEN true ELSE is_default END
    WHERE id = p_address_id AND customer_id = v_customer_id
    RETURNING id INTO v_address_id;

    IF v_address_id IS NULL THEN
      RAISE EXCEPTION 'address_not_found_or_forbidden';
    END IF;
  ELSE
    INSERT INTO shipping_addresses (
      customer_id, recipient_name, phone, address, city, state, postal_code, country, landmark, address_type, is_default
    ) VALUES (
      v_customer_id, p_recipient_name, p_phone, p_address, p_city, p_state, p_postal_code, p_country, p_landmark, p_address_type, v_make_default
    ) RETURNING id INTO v_address_id;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'address_id', v_address_id,
    'is_default', v_make_default
  );
END;
$$;

GRANT EXECUTE ON FUNCTION save_customer_address(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN, UUID) TO authenticated;

-- 5. Harden RLS policies with case-insensitive LOWER(email) matching
DROP POLICY IF EXISTS customers_self_select ON customers;
CREATE POLICY customers_self_select
  ON customers FOR SELECT
  USING (LOWER(email) = LOWER(auth.email()));

DROP POLICY IF EXISTS customers_self_update ON customers;
CREATE POLICY customers_self_update
  ON customers FOR UPDATE
  USING (LOWER(email) = LOWER(auth.email()))
  WITH CHECK (LOWER(email) = LOWER(auth.email()));

DROP POLICY IF EXISTS shipping_addresses_customer_select ON shipping_addresses;
CREATE POLICY shipping_addresses_customer_select
  ON shipping_addresses FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE LOWER(email) = LOWER(auth.email())
  ));

DROP POLICY IF EXISTS shipping_addresses_customer_insert ON shipping_addresses;
CREATE POLICY shipping_addresses_customer_insert
  ON shipping_addresses FOR INSERT
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE LOWER(email) = LOWER(auth.email())
  ));

DROP POLICY IF EXISTS shipping_addresses_customer_update ON shipping_addresses;
CREATE POLICY shipping_addresses_customer_update ON shipping_addresses
  FOR UPDATE
  USING (customer_id IN (SELECT id FROM customers WHERE LOWER(email) = LOWER(auth.email())))
  WITH CHECK (customer_id IN (SELECT id FROM customers WHERE LOWER(email) = LOWER(auth.email())));

DROP POLICY IF EXISTS shipping_addresses_customer_delete ON shipping_addresses;
CREATE POLICY shipping_addresses_customer_delete ON shipping_addresses
  FOR DELETE
  USING (customer_id IN (SELECT id FROM customers WHERE LOWER(email) = LOWER(auth.email())));
