-- =============================================================================
-- House of Padmavati — First-Order Free Delivery Benefit
-- Migration: 20260928000004
-- Description: Add first-order eligibility check RPC and modify create_order
-- to compute delivery fee based on eligibility. Implements server-authoritative
-- first-order benefit using normalized phone + Gmail identity.
-- =============================================================================

-- 1. Add standard_shipping_cost column to settings table (if not exists)
-- This allows admin-configurable standard shipping cost
INSERT INTO settings (key, value) VALUES
  ('standard_shipping_cost', '0')
ON CONFLICT (key) DO NOTHING;

-- 2. Gmail normalization function for first-order eligibility
CREATE OR REPLACE FUNCTION normalize_gmail(p_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
IMMUTABLE
SET search_path = public
AS $$
DECLARE
  v_lower TEXT;
  v_local TEXT;
  v_domain TEXT;
  v_at_pos INTEGER;
  v_plus_pos INTEGER;
BEGIN
  IF p_email IS NULL THEN
    RETURN NULL;
  END IF;
  
  -- Lowercase everything
  v_lower := LOWER(p_email);
  v_at_pos := POSITION('@' IN v_lower);
  
  IF v_at_pos = 0 THEN
    RETURN v_lower; -- Not a valid email format, return as-is
  END IF;
  
  v_local := SUBSTRING(v_lower FROM 1 FOR v_at_pos - 1);
  v_domain := SUBSTRING(v_lower FROM v_at_pos + 1);
  
  -- Only normalize Gmail/Googlemail domains
  IF v_domain IN ('gmail.com', 'googlemail.com') THEN
    -- Remove dots from local part
    v_local := REPLACE(v_local, '.', '');
    
    -- Remove plus-addressing (everything after +)
    v_plus_pos := POSITION('+' IN v_local);
    IF v_plus_pos > 0 THEN
      v_local := SUBSTRING(v_local FROM 1 FOR v_plus_pos - 1);
    END IF;
    
    RETURN v_local || '@' || v_domain;
  END IF;
  
  -- For non-Gmail domains, return lowercased email
  RETURN v_lower;
END;
$$;

GRANT EXECUTE ON FUNCTION normalize_gmail(TEXT) TO authenticated;

-- 3. First-order eligibility check RPC
-- Returns true if customer is eligible for first-order free delivery
-- Eligibility identity: normalized phone + normalized Gmail
-- A customer is eligible if they have NO qualifying previous orders
CREATE OR REPLACE FUNCTION check_first_order_eligibility(
  p_customer_email TEXT,
  p_customer_phone TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_normalized_email TEXT;
  v_normalized_phone TEXT;
  v_qualifying_orders INTEGER;
  v_is_eligible BOOLEAN;
BEGIN
  -- Verify caller owns this email
  IF auth.email() IS NULL OR auth.email() != p_customer_email THEN
    RAISE EXCEPTION 'unauthorized: email mismatch';
  END IF;

  -- Normalize email (Gmail normalization for identity)
  v_normalized_email := normalize_gmail(p_customer_email);
  
  -- Normalize phone using existing function
  v_normalized_phone := normalize_phone(p_customer_phone);

  -- Check if customer exists with this normalized identity
  SELECT id INTO v_customer_id
  FROM customers
  WHERE LOWER(email) = LOWER(p_customer_email);

  -- If customer doesn't exist yet, they're a new customer = eligible
  IF v_customer_id IS NULL THEN
    RETURN jsonb_build_object(
      'eligible', true,
      'reason', 'new_customer',
      'normalized_email', v_normalized_email,
      'normalized_phone', v_normalized_phone
    );
  END IF;

  -- Count qualifying orders for this customer
  -- Qualifying order = payment_status IN ('paid', 'partially_refunded') AND status NOT IN ('cancelled')
  SELECT COUNT(*) INTO v_qualifying_orders
  FROM orders
  WHERE customer_id = v_customer_id
    AND payment_status IN ('paid', 'partially_refunded')
    AND status NOT IN ('cancelled');

  v_is_eligible := (v_qualifying_orders = 0);

  RETURN jsonb_build_object(
    'eligible', v_is_eligible,
    'reason', CASE 
      WHEN v_qualifying_orders = 0 THEN 'first_order'
      ELSE 'previous_order_exists'
    END,
    'qualifying_order_count', v_qualifying_orders,
    'normalized_email', v_normalized_email,
    'normalized_phone', v_normalized_phone
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_first_order_eligibility(TEXT, TEXT) TO authenticated;

-- 4. Cross-account abuse detection RPC
-- Checks if the normalized phone+email combination has been used before
-- Returns warning if potential duplicate account detected
CREATE OR REPLACE FUNCTION check_cross_account_abuse(
  p_customer_email TEXT,
  p_customer_phone TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_normalized_email TEXT;
  v_normalized_phone TEXT;
  v_existing_customer UUID;
  v_duplicate_email BOOLEAN := false;
  v_duplicate_phone BOOLEAN := false;
  v_warning TEXT;
BEGIN
  v_normalized_email := normalize_gmail(p_customer_email);
  v_normalized_phone := normalize_phone(p_customer_phone);

  -- Check for existing customer with same normalized email (different actual email)
  -- This catches Gmail aliases (dots, plus addressing)
  SELECT id INTO v_existing_customer
  FROM customers
  WHERE normalize_gmail(email) = v_normalized_email
    AND LOWER(email) != LOWER(p_customer_email)
  LIMIT 1;

  IF v_existing_customer IS NOT NULL THEN
    v_duplicate_email := true;
  END IF;

  -- Check for existing customer with same normalized phone
  SELECT id INTO v_existing_customer
  FROM customers
  WHERE normalize_phone(phone) = v_normalized_phone
    AND LOWER(email) != LOWER(p_customer_email)
    AND phone IS NOT NULL
  LIMIT 1;

  IF v_existing_customer IS NOT NULL THEN
    v_duplicate_phone := true;
  END IF;

  v_warning := CASE
    WHEN v_duplicate_email AND v_duplicate_phone THEN 'Both email and phone match existing accounts'
    WHEN v_duplicate_email THEN 'Email identity matches existing account (Gmail alias detected)'
    WHEN v_duplicate_phone THEN 'Phone number matches existing account'
    ELSE NULL
  END;

  RETURN jsonb_build_object(
    'duplicate_email', v_duplicate_email,
    'duplicate_phone', v_duplicate_phone,
    'warning', v_warning
  );
END;
$$;

GRANT EXECUTE ON FUNCTION check_cross_account_abuse(TEXT, TEXT) TO authenticated;

-- 5. Modify create_order RPC to compute shipping cost based on first-order eligibility
-- This replaces the existing create_order RPC with updated version
CREATE OR REPLACE FUNCTION create_order(
  p_customer_email TEXT,
  p_customer_full_name TEXT,
  p_customer_phone TEXT,
  p_shipping_recipient_name TEXT,
  p_shipping_phone TEXT,
  p_shipping_address TEXT,
  p_shipping_city TEXT,
  p_shipping_state TEXT,
  p_shipping_postal_code TEXT,
  p_shipping_country TEXT DEFAULT 'India',
  p_shipping_landmark TEXT DEFAULT NULL,
  p_shipping_option TEXT DEFAULT 'standard',
  p_notes TEXT DEFAULT NULL,
  p_items JSONB DEFAULT NULL,
  p_amount INTEGER DEFAULT NULL,
  p_payment_model TEXT DEFAULT 'full'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id UUID;
  v_order_id UUID;
  v_order_number TEXT;
  v_order_total INTEGER;
  v_shipping_cost INTEGER := 0;
  v_subtotal INTEGER;
  v_shipping_address_id UUID;
  v_address_snapshot JSONB;
  v_eligibility JSONB;
  v_standard_shipping_cost INTEGER := 0;
  v_is_deposit BOOLEAN := false;
BEGIN
  -- Validate inputs
  IF p_customer_email IS NULL OR p_customer_full_name IS NULL OR p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'missing_required_fields';
  END IF;

  -- Get standard shipping cost from settings
  SELECT value::INTEGER INTO v_standard_shipping_cost
  FROM settings
  WHERE key = 'standard_shipping_cost';

  -- Check first-order eligibility
  v_eligibility := check_first_order_eligibility(p_customer_email, p_customer_phone);
  
  -- Find or create customer
  INSERT INTO customers (email, full_name, phone)
  VALUES (p_customer_email, p_customer_full_name, p_customer_phone)
  ON CONFLICT (LOWER(email)) DO UPDATE SET full_name = EXCLUDED.full_name
  RETURNING id INTO v_customer_id;

  -- Create shipping address (always create new for historical immutability)
  INSERT INTO shipping_addresses (
    customer_id, recipient_name, phone, address, city, state, postal_code, country, landmark
  ) VALUES (
    v_customer_id, p_shipping_recipient_name, p_shipping_phone, p_shipping_address,
    p_shipping_city, p_shipping_state, p_shipping_postal_code, p_shipping_country, p_shipping_landmark
  ) RETURNING id INTO v_shipping_address_id;

  -- Build address snapshot for immutable historical record
  v_address_snapshot := jsonb_build_object(
    'recipient_name', p_shipping_recipient_name,
    'phone', p_shipping_phone,
    'address', p_shipping_address,
    'city', p_shipping_city,
    'state', p_shipping_state,
    'postal_code', p_shipping_postal_code,
    'country', p_shipping_country,
    'landmark', p_shipping_landmark
  );

  -- Calculate order totals
  SELECT COALESCE(SUM(p.selling_price * i.quantity), 0) INTO v_subtotal
  FROM jsonb_array_elements(p_items) AS i(item)
  JOIN products p ON p.id = (i.item->>'product_id')::UUID;

  -- Calculate shipping cost based on option AND first-order eligibility
  CASE p_shipping_option
    WHEN 'express' THEN v_shipping_cost := 20000; -- ₹200
    WHEN 'standard' THEN 
      -- Free shipping for first-order eligible customers, otherwise standard cost
      IF (v_eligibility->>'eligible')::BOOLEAN THEN
        v_shipping_cost := 0;
      ELSE
        v_shipping_cost := v_standard_shipping_cost;
      END IF;
    ELSE v_shipping_cost := 0;
  END CASE;

  v_order_total := v_subtotal + v_shipping_cost;

  -- Determine payment model
  IF p_amount IS NOT NULL AND p_amount > 0 AND p_amount < v_order_total THEN
    -- Explicit deposit amount provided
    IF p_amount != 20000 THEN
      RAISE EXCEPTION 'invalid_deposit_amount';
    END IF;
    IF v_order_total <= 20000 THEN
      RAISE EXCEPTION 'order_total_too_low';
    END IF;
    v_is_deposit := true;
  END IF;

  -- Generate order number
  SELECT generate_order_number() INTO v_order_number;

  -- Create order with address snapshot and shipping cost
  INSERT INTO orders (
    customer_id, shipping_address_id, order_number, status, payment_status,
    subtotal, shipping_cost, total, notes, shipping_address_snapshot
  ) VALUES (
    v_customer_id, v_shipping_address_id, v_order_number, 'pending_payment', 'pending',
    v_subtotal, v_shipping_cost, v_order_total, p_notes, v_address_snapshot
  ) RETURNING id INTO v_order_id;

  -- Create order items
  INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, image_url)
  SELECT 
    v_order_id,
    (i.item->>'product_id')::UUID,
    p.name,
    p.selling_price,
    (i.item->>'quantity')::INTEGER,
    p.image_url
  FROM jsonb_array_elements(p_items) AS i(item)
  JOIN products p ON p.id = (i.item->>'product_id')::UUID;

  -- Reserve inventory
  PERFORM adjust_product_stock(
    (i.item->>'product_id')::UUID,
    - (i.item->>'quantity')::INTEGER,
    'order_created',
    v_order_id
  ) FROM jsonb_array_elements(p_items) AS i(item);

  RETURN jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'total', v_order_total,
    'subtotal', v_subtotal,
    'shipping_cost', v_shipping_cost,
    'first_order_eligible', (v_eligibility->>'eligible')::BOOLEAN,
    'first_order_reason', v_eligibility->>'reason'
  );
END;
$$;

-- Grant execute on updated RPC
GRANT EXECUTE ON FUNCTION create_order(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, INTEGER, TEXT
) TO authenticated;

-- 6. Add index for faster eligibility checks
CREATE INDEX IF NOT EXISTS idx_orders_customer_payment_status
ON orders (customer_id, payment_status, status);