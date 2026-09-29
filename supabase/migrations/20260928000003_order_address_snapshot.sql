-- =============================================================================
-- House of Padmavati — Immutable Order Shipping Address Snapshots
-- Migration: 20260928000003
-- Description: Add address snapshot columns to orders table and modify
-- create_order RPC to store a snapshot of the address at order creation time.
-- This ensures historical order addresses remain immutable even if the
-- customer's saved address is later edited or deleted.
-- =============================================================================

-- 1. Add address snapshot columns to orders table
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS shipping_address_snapshot JSONB;

-- 2. Add comment to document the purpose
COMMENT ON COLUMN orders.shipping_address_snapshot IS 
'Immutable snapshot of the shipping address at time of order creation. Contains: recipient_name, phone, address, city, state, postal_code, country, landmark.';

-- 3. Create index for faster lookups if needed
CREATE INDEX IF NOT EXISTS idx_orders_shipping_address_snapshot
ON orders USING GIN (shipping_address_snapshot);

-- 4. Modify create_order RPC to snapshot the address
-- We need to get the full address details and store them as a JSON snapshot
-- This replaces the existing create_order RPC with an updated version that includes snapshot

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
  v_is_deposit BOOLEAN := false;
BEGIN
  -- Validate inputs
  IF p_customer_email IS NULL OR p_customer_full_name IS NULL OR p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'missing_required_fields';
  END IF;

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

  -- Calculate shipping cost based on option
  CASE p_shipping_option
    WHEN 'express' THEN v_shipping_cost := 20000; -- ₹200
    WHEN 'standard' THEN v_shipping_cost := 0;
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
  END IF;

  -- Generate order number
  SELECT generate_order_number() INTO v_order_number;

  -- Create order with address snapshot
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
    'shipping_cost', v_shipping_cost
  );
END;
$$;

-- Grant execute on updated RPC
GRANT EXECUTE ON FUNCTION create_order(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB, INTEGER, TEXT
) TO authenticated;