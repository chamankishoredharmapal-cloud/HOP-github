-- =============================================================================
-- Migration: 20261025012500_safeguard_create_order_require_published_products.sql
-- Description: Server-side purchase validation safeguard for create_order.
--
-- Security Guarantees:
-- 1. Drops legacy unvalidated 16-parameter overload of create_order that accepted
--    client-supplied subtotal/total and bypassed product status/stock validation.
-- 2. Replaces canonical create_order to strictly enforce that every requested product
--    in p_items exists and has status = 'published' at order creation time.
-- 3. Employs row-level locking (FOR SHARE) on products to eliminate concurrent status
--    modification races.
-- 4. Fixes p.image_url column reference to subquery product_images (is_primary = true).
-- 5. Fixes adjust_product_stock v_order_id type cast to TEXT.
-- 6. Re-grants EXECUTE to authenticated, service_role, and anon for full compatibility.
-- =============================================================================

-- Step 1: Drop the legacy unvalidated 16-parameter overload
DROP FUNCTION IF EXISTS public.create_order(
  text, text, text, text, text, text, text, text, text,
  integer, integer, jsonb, text, text, integer, text
);

-- Step 2: Redefine the canonical create_order with published product safeguard
CREATE OR REPLACE FUNCTION public.create_order(
  p_customer_email text,
  p_customer_full_name text,
  p_customer_phone text,
  p_shipping_recipient_name text,
  p_shipping_phone text,
  p_shipping_address text,
  p_shipping_city text,
  p_shipping_state text,
  p_shipping_postal_code text,
  p_shipping_country text DEFAULT 'India'::text,
  p_shipping_landmark text DEFAULT NULL::text,
  p_shipping_option text DEFAULT 'standard'::text,
  p_notes text DEFAULT NULL::text,
  p_items jsonb DEFAULT NULL::jsonb,
  p_amount integer DEFAULT NULL::integer,
  p_payment_model text DEFAULT 'full'::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
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
  v_standard_shipping_cost INTEGER := 9900;
  v_is_deposit BOOLEAN := false;
  v_item JSONB;
  v_product_id UUID;
  v_product_record RECORD;
BEGIN
  -- Validate mandatory input fields
  IF p_customer_email IS NULL OR trim(p_customer_email) = '' OR
     p_customer_full_name IS NULL OR trim(p_customer_full_name) = '' OR
     p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'missing_required_fields';
  END IF;

  -- Security Safeguard: Validate every item in p_items.
  -- 1. Must have valid UUID product_id and positive quantity.
  -- 2. Product must exist in products table.
  -- 3. Product must have status = 'published'.
  -- 4. Lock row with FOR SHARE to prevent concurrent status modification during checkout.
  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items) LOOP
    IF v_item->>'product_id' IS NULL OR 
       (v_item->>'quantity')::INTEGER IS NULL OR 
       (v_item->>'quantity')::INTEGER <= 0 THEN
      RAISE EXCEPTION 'invalid_order_items';
    END IF;

    BEGIN
      v_product_id := (v_item->>'product_id')::UUID;
    EXCEPTION WHEN invalid_text_representation THEN
      RAISE EXCEPTION 'invalid_order_items';
    END;

    SELECT id, status INTO v_product_record
    FROM public.products
    WHERE id = v_product_id
    FOR SHARE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'product_not_available';
    END IF;

    IF v_product_record.status != 'published' THEN
      RAISE EXCEPTION 'product_not_available';
    END IF;
  END LOOP;

  -- Get standard shipping cost from settings
  SELECT COALESCE(
    (value->'shipping'->>'standard_rate')::NUMERIC * 100,
    9900
  )::INTEGER INTO v_standard_shipping_cost
  FROM settings
  WHERE key = 'store_settings';

  IF v_standard_shipping_cost IS NULL OR v_standard_shipping_cost = 0 THEN
    SELECT COALESCE(value::INTEGER, 9900) INTO v_standard_shipping_cost
    FROM settings
    WHERE key = 'standard_shipping_cost';
  END IF;

  IF v_standard_shipping_cost IS NULL OR v_standard_shipping_cost = 0 THEN
    v_standard_shipping_cost := 9900;
  END IF;

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

  -- Calculate order totals strictly from verified product selling prices
  SELECT COALESCE(SUM(p.selling_price * (i.item->>'quantity')::INTEGER), 0) INTO v_subtotal
  FROM jsonb_array_elements(p_items) AS i(item)
  JOIN products p ON p.id = (i.item->>'product_id')::UUID;

  -- Calculate shipping cost based on option AND first-order eligibility
  CASE p_shipping_option
    WHEN 'express' THEN v_shipping_cost := 20000; -- ₹200
    WHEN 'standard' THEN 
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
    IF p_amount != 20000 THEN
      RAISE EXCEPTION 'invalid_deposit_amount';
    END IF;
    IF v_order_total <= 20000 THEN
      RAISE EXCEPTION 'order_total_too_low';
    END IF;
    v_is_deposit := true;
  END IF;

  -- Generate branded order number
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
    (SELECT url FROM product_images WHERE product_id = p.id AND is_primary = true LIMIT 1)
  FROM jsonb_array_elements(p_items) AS i(item)
  JOIN products p ON p.id = (i.item->>'product_id')::UUID;

  -- Reserve inventory (adjust_product_stock locks row and validates stock availability)
  PERFORM adjust_product_stock(
    (i.item->>'product_id')::UUID,
    - (i.item->>'quantity')::INTEGER,
    'order_created',
    v_order_id::TEXT
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

-- Step 3: Ensure canonical permissions
REVOKE ALL ON FUNCTION public.create_order(text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text) TO authenticated, service_role, anon;
