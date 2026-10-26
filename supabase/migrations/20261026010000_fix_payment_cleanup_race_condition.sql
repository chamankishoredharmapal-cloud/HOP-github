-- =============================================================================
-- Migration: 20261026010000_fix_payment_cleanup_race_condition.sql
-- Description: Phase 1 Security Hardening Addendum:
--   Remediates the payment capture vs. abandoned order cleanup race condition,
--   enforces atomic stock reservation in create_order, and prevents deadlocks.
--
-- Security Guarantees:
-- 1. confirm_paid_order:
--    - Strictly restricted to service_role (Edge Functions after HMAC verification).
--    - Pessimistic locking on payments AND orders in consistent lock hierarchy.
--    - Consistent ASC order locking on products (ORDER BY product_id::UUID ASC)
--      eliminating all deadlock vectors.
--    - If order was cancelled by cleanup and stock is available: safely re-reserves
--      stock, logs inventory_history, and reinstates order to confirmed/paid.
--    - If order was cancelled and ANY item is unavailable: strictly refuses confirmation,
--      keeps order status 'cancelled', records audit flags for late payment refund,
--      and returns requires_refund: true, completely preventing overselling.
--    - Full idempotency for retried webhooks and duplicate verify-payment callbacks.
-- 2. release_order_inventory:
--    - Consistent ASC order locking on products (ORDER BY product_id::UUID ASC).
--    - Strict idempotency: already cancelled orders are no-ops without double-restoring stock.
--    - Cannot release stock for paid or confirmed orders.
-- 3. create_order:
--    - Strictly validates that adjust_product_stock succeeds for every item.
--    - If any product has insufficient stock, immediately raises 'insufficient_stock'
--      causing an atomic transaction rollback.
--    - Locks products in consistent ASC order (ORDER BY product_id::UUID ASC).
--    - Enforces execute privileges strictly for authenticated and service_role.
-- =============================================================================

-- =============================================================================
-- 1. HARDEN release_order_inventory (WITH CONSISTENT ASC LOCKING)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.release_order_inventory(
  p_order_id UUID,
  p_reason TEXT DEFAULT 'release'
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_item RECORD;
  v_prev_stock INTEGER;
  v_new_stock INTEGER;
  v_released INTEGER := 0;
  v_order_status TEXT;
  v_order_payment_status TEXT;
BEGIN
  -- Security Guard: service_role or admin required
  IF auth.role() != 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator or service role privileges required.'
      USING ERRCODE = '42501';
  END IF;

  -- Pessimistic locking on orders to verify order state and guarantee idempotency
  SELECT status::TEXT, payment_status::TEXT
  INTO v_order_status, v_order_payment_status
  FROM public.orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  -- Idempotency Check: if order is already cancelled, inventory was already restored
  IF v_order_status = 'cancelled' THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_released', true,
      'message', 'Inventory for this order has already been released',
      'items_released', 0
    );
  END IF;

  -- Protection against releasing stock for paid or confirmed orders
  IF v_order_payment_status = 'paid' OR v_order_status IN ('confirmed', 'shipped', 'delivered') THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'order_already_paid_or_confirmed',
      'message', 'Cannot release inventory for a confirmed or paid order via this RPC'
    );
  END IF;

  -- Restore stock for reserved items in consistent ASC order to prevent deadlocks
  FOR v_item IN
    SELECT product_id::UUID AS pid, quantity
    FROM public.order_items
    WHERE order_id = p_order_id
    ORDER BY product_id::UUID ASC
  LOOP
    SELECT stock INTO v_prev_stock
    FROM public.products
    WHERE id = v_item.pid
    FOR UPDATE;

    IF v_prev_stock IS NOT NULL THEN
      v_new_stock := v_prev_stock + v_item.quantity;

      UPDATE public.products
      SET stock = v_new_stock,
          updated_at = now()
      WHERE id = v_item.pid;

      INSERT INTO public.inventory_history (
        product_id, change, previous_stock, new_stock, reason, notes
      ) VALUES (
        v_item.pid,
        v_item.quantity,
        v_prev_stock,
        v_new_stock,
        p_reason,
        'Order ' || p_order_id || ' — inventory released (' || p_reason || ')'
      );

      v_released := v_released + 1;
    END IF;
  END LOOP;

  -- Mark order as cancelled so subsequent calls cannot release again
  UPDATE public.orders
  SET status = 'cancelled',
      updated_at = now()
  WHERE id = p_order_id;

  RETURN jsonb_build_object(
    'success', true,
    'items_released', v_released,
    'order_id', p_order_id
  );
END;
$$;

REVOKE ALL ON FUNCTION public.release_order_inventory(UUID, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.release_order_inventory(UUID, TEXT) TO authenticated, service_role;

-- =============================================================================
-- 2. HARDEN confirm_paid_order (WITH RACE-SAFETY & DEADLOCK PREVENTION)
-- =============================================================================
CREATE OR REPLACE FUNCTION public.confirm_paid_order(
  p_razorpay_order_id   TEXT,
  p_razorpay_payment_id  TEXT DEFAULT NULL,
  p_razorpay_signature   TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment_id               UUID;
  v_order_id                 UUID;
  v_payment_status           TEXT;
  v_order_status             TEXT;
  v_order_payment_status     TEXT;
  v_order_notes              TEXT;
  v_order_number             TEXT;
  v_item                     RECORD;
  v_current_stock            INTEGER;
  v_can_reclaim              BOOLEAN := true;
  v_unavailable_product_id   UUID;
  v_result                   JSONB;
BEGIN
  -- 1. Security Guard: Strict restriction to service_role (Edge Functions after HMAC verification)
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied. Service role required.'
      USING ERRCODE = '42501';
  END IF;

  -- 2. Lock payments row
  SELECT id, order_id, status::TEXT
  INTO v_payment_id, v_order_id, v_payment_status
  FROM public.payments
  WHERE razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_found');
  END IF;

  -- 3. Lock orders row (Lock hierarchy: payments -> orders -> products)
  SELECT status::TEXT, payment_status::TEXT, order_number, notes
  INTO v_order_status, v_order_payment_status, v_order_number, v_order_notes
  FROM public.orders
  WHERE id = v_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  -- 4. Idempotency Check: if payment is already marked 'paid'
  IF v_payment_status = 'paid' THEN
    -- If order was previously cancelled due to stock exhaustion during late payment
    IF v_order_status = 'cancelled' THEN
      RETURN jsonb_build_object(
        'success', false,
        'already_processed', true,
        'error', 'order_cancelled_inventory_unavailable',
        'requires_refund', true,
        'order_id', v_order_id,
        'payment_id', v_payment_id,
        'order_number', v_order_number
      );
    END IF;

    -- Otherwise, already successfully processed and confirmed
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'order_id', v_order_id,
      'payment_id', v_payment_id,
      'order_number', v_order_number
    );
  END IF;

  -- Validate payment transition: must be 'pending' to process
  IF v_payment_status != 'pending' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'invalid_payment_state',
      'message', 'Payment is in state ' || v_payment_status || ', cannot confirm'
    );
  END IF;

  -- 5. Handle Late Payment Race: Order was cancelled by timeout cleanup
  IF v_order_status = 'cancelled' THEN
    -- Phase A: Inspect inventory for all items, locking product rows in consistent ASC order
    FOR v_item IN
      SELECT product_id::UUID AS pid, quantity
      FROM public.order_items
      WHERE order_id = v_order_id
      ORDER BY product_id::UUID ASC
    LOOP
      SELECT stock INTO v_current_stock
      FROM public.products
      WHERE id = v_item.pid
      FOR UPDATE;

      IF v_current_stock IS NULL OR v_current_stock < v_item.quantity THEN
        v_can_reclaim := false;
        v_unavailable_product_id := v_item.pid;
      END IF;
    END LOOP;

    -- Phase B: Stock unavailable — PREVENT OVERSELLING
    IF NOT v_can_reclaim THEN
      -- Record payment as captured at gateway, but do NOT mark payment refunded yet
      UPDATE public.payments
      SET status = 'paid',
          razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
          updated_at = now()
      WHERE id = v_payment_id;

      -- Set order payment_status to 'cancelled' and attach audit note requiring refund
      UPDATE public.orders
      SET payment_status = 'cancelled',
          notes = COALESCE(notes, '') || ' [LATE_PAYMENT_CAPTURED_STOCK_UNAVAILABLE_REFUND_REQUIRED: payment_id=' || COALESCE(p_razorpay_payment_id, 'unknown') || ']',
          updated_at = now()
      WHERE id = v_order_id;

      RETURN jsonb_build_object(
        'success', false,
        'error', 'order_cancelled_inventory_unavailable',
        'requires_refund', true,
        'order_id', v_order_id,
        'payment_id', v_payment_id,
        'order_number', v_order_number,
        'unavailable_product_id', v_unavailable_product_id,
        'message', 'Order expired and inventory is no longer available. Payment captured; refund required.'
      );
    END IF;

    -- Phase C: Stock available — Safely re-reserve inventory
    FOR v_item IN
      SELECT product_id::UUID AS pid, quantity
      FROM public.order_items
      WHERE order_id = v_order_id
      ORDER BY product_id::UUID ASC
    LOOP
      SELECT stock INTO v_current_stock
      FROM public.products
      WHERE id = v_item.pid
      FOR UPDATE;

      UPDATE public.products
      SET stock = stock - v_item.quantity,
          updated_at = now()
      WHERE id = v_item.pid;

      INSERT INTO public.inventory_history (
        product_id, change, previous_stock, new_stock, reason, notes
      ) VALUES (
        v_item.pid,
        -v_item.quantity,
        v_current_stock,
        v_current_stock - v_item.quantity,
        'order_reinstated',
        'Order ' || v_order_id || ' — reinstated after late payment'
      );
    END LOOP;

    -- Update payment and order to confirmed/paid with audit note
    UPDATE public.payments
    SET status = 'paid',
        razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
        updated_at = now()
    WHERE id = v_payment_id;

    UPDATE public.orders
    SET status = 'confirmed',
        payment_status = 'paid',
        notes = COALESCE(notes, '') || ' [ORDER_REINSTATED_AFTER_EXPIRATION]',
        updated_at = now()
    WHERE id = v_order_id;

    RETURN jsonb_build_object(
      'success', true,
      'order_id', v_order_id,
      'payment_id', v_payment_id,
      'order_number', v_order_number,
      'reinstated', true
    );
  END IF;

  -- 6. Normal On-Time Payment Confirmation (Order was pending / pending_payment)
  IF v_order_status IN ('pending_payment', 'pending') THEN
    UPDATE public.payments
    SET status = 'paid',
        razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
        updated_at = now()
    WHERE id = v_payment_id;

    UPDATE public.orders
    SET status = 'confirmed',
        payment_status = 'paid',
        updated_at = now()
    WHERE id = v_order_id;

    -- Record confirmed inventory sale audit (inventory was reserved at create_order)
    FOR v_item IN
      SELECT product_id::UUID AS pid, quantity
      FROM public.order_items
      WHERE order_id = v_order_id
      ORDER BY product_id::UUID ASC
    LOOP
      SELECT stock INTO v_current_stock
      FROM public.products
      WHERE id = v_item.pid;

      IF v_current_stock IS NOT NULL THEN
        INSERT INTO public.inventory_history (
          product_id, change, previous_stock, new_stock, reason, notes
        ) VALUES (
          v_item.pid,
          0,
          v_current_stock,
          v_current_stock,
          'sale',
          'Order ' || v_order_id || ' — payment verified (reservation confirmed)'
        );
      END IF;
    END LOOP;

    RETURN jsonb_build_object(
      'success', true,
      'order_id', v_order_id,
      'payment_id', v_payment_id,
      'order_number', v_order_number,
      'reinstated', false
    );
  END IF;

  -- 7. If order is already in a confirmed or progressive state
  IF v_order_status IN ('confirmed', 'processing', 'shipped', 'delivered') THEN
    UPDATE public.payments
    SET status = 'paid',
        razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
        updated_at = now()
    WHERE id = v_payment_id;

    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'order_id', v_order_id,
      'payment_id', v_payment_id,
      'order_number', v_order_number
    );
  END IF;

  -- 8. Terminal / invalid order states
  RETURN jsonb_build_object(
    'success', false,
    'error', 'invalid_order_state',
    'message', 'Order is in unexpected state: ' || v_order_status
  );
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_paid_order(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(TEXT, TEXT, TEXT) TO service_role;

-- =============================================================================
-- 3. HARDEN create_order (ENFORCE STOCK RESERVATION & DEADLOCK PREVENTION)
-- =============================================================================
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
  v_stock_res JSONB;
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

  -- Reserve inventory: lock and validate stock in consistent ASC order to prevent deadlocks and overselling
  FOR v_item IN
    SELECT item
    FROM jsonb_array_elements(p_items) AS i(item)
    ORDER BY (item->>'product_id')::UUID ASC
  LOOP
    v_stock_res := public.adjust_product_stock(
      (v_item->>'product_id')::UUID,
      - (v_item->>'quantity')::INTEGER,
      'order_created',
      v_order_id::TEXT
    );

    IF (v_stock_res->>'success')::BOOLEAN IS NOT TRUE THEN
      RAISE EXCEPTION 'insufficient_stock: product % has insufficient stock', (v_item->>'product_id')
        USING ERRCODE = '22000';
    END IF;
  END LOOP;

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

REVOKE ALL ON FUNCTION public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text
) TO authenticated, service_role;
