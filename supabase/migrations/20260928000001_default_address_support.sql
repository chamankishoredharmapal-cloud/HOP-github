-- =============================================================================
-- House of Padmavati — Default Address Support
-- Migration: 20260928000001
-- Description: Add is_default column to shipping_addresses, unique partial index,
-- and set_default_address RPC with ownership enforcement.
-- =============================================================================

-- 1. Add is_default column to shipping_addresses
ALTER TABLE shipping_addresses
ADD COLUMN IF NOT EXISTS is_default BOOLEAN NOT NULL DEFAULT false;

-- 2. Unique partial index: only one default address per customer
CREATE UNIQUE INDEX IF NOT EXISTS shipping_addresses_one_default_per_customer
ON shipping_addresses (customer_id)
WHERE is_default = true;

-- 3. FIX: set_default_address RPC with ownership enforcement
-- Atomically sets the given address as default and unsets any other default for the same customer.
-- Enforces ownership via auth.email() -> customer_id linkage.
CREATE OR REPLACE FUNCTION set_default_address(
  p_address_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_address_customer_id UUID;
BEGIN
  -- Verify authentication
  IF auth.email() IS NULL THEN
    RAISE EXCEPTION 'unauthorized: no authenticated user';
  END IF;

  -- Find the customer for the current auth user
  SELECT id INTO v_customer_id
  FROM customers
  WHERE LOWER(email) = LOWER(auth.email());

  IF v_customer_id IS NULL THEN
    RAISE EXCEPTION 'customer_not_found';
  END IF;

  -- Verify the address belongs to this customer
  SELECT customer_id INTO v_address_customer_id
  FROM shipping_addresses
  WHERE id = p_address_id;

  IF v_address_customer_id IS NULL THEN
    RAISE EXCEPTION 'address_not_found';
  END IF;

  IF v_address_customer_id != v_customer_id THEN
    RAISE EXCEPTION 'forbidden: address does not belong to customer';
  END IF;

  -- Atomically set this address as default and unset any other default for the same customer
  UPDATE shipping_addresses
  SET is_default = false
  WHERE customer_id = v_customer_id AND is_default = true;

  UPDATE shipping_addresses
  SET is_default = true
  WHERE id = p_address_id;

  RETURN jsonb_build_object('success', true, 'address_id', p_address_id);
END;
$$;

-- 4. RPC to get default address for a customer
CREATE OR REPLACE FUNCTION get_default_address(
  p_customer_id UUID
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_address RECORD;
BEGIN
  SELECT * INTO v_address
  FROM shipping_addresses
  WHERE customer_id = p_customer_id
    AND is_default = true
  LIMIT 1;

  IF v_address IS NULL THEN
    RETURN jsonb_build_object('success', true, 'address', null);
  END IF;

  RETURN jsonb_build_object('success', true, 'address', to_jsonb(v_address));
END;
$$;

-- 4. Grant execute on RPCs to authenticated role
GRANT EXECUTE ON FUNCTION set_default_address(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_default_address(UUID) TO authenticated;

-- 5. No additional RLS changes needed - existing policies cover is_default column
-- The existing policies already cover UPDATE/DELETE by customer_id ownership.
-- is_default is just a boolean column covered by existing policies.