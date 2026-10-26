-- =============================================================================
-- Migration: 20261026000000_harden_checkout_and_order_rpcs.sql
-- Description: Phase 1 Security Hardening for Checkout and Order RPC Functions.
--
-- Security Guarantees & Access Matrix:
-- 1. confirm_paid_order:
--    - Enforces auth.role() = 'service_role'.
--    - Revokes execute from PUBLIC, anon, and authenticated.
--    - Preserves legitimate trusted execution by verify-payment and razorpay-webhook Edge Functions.
-- 2. release_order_inventory:
--    - Enforces auth.role() = 'service_role' OR public.is_admin().
--    - Revokes execute from PUBLIC and anon.
--    - Enforces STRICT IDEMPOTENCY: checks order status. If already cancelled, returns
--      already_released without double-incrementing stock.
--    - Prevents releasing inventory for paid/confirmed/shipped/delivered orders.
--    - Updates order status to 'cancelled' upon release.
-- 3. refund_deposit:
--    - Enforces auth.role() = 'service_role' OR public.is_admin().
--    - Revokes execute from PUBLIC and anon.
-- 4. mark_delivery_paid_rpc:
--    - Enforces auth.role() = 'service_role' OR public.is_admin().
--    - Revokes execute from PUBLIC and anon.
-- 5. check_first_order_eligibility:
--    - Resolves checkout blocker: permits auth.role() = 'service_role' (Edge Functions).
--    - Strictly enforces auth.email() = p_customer_email for authenticated users.
--    - Rejects anon callers with 'unauthorized: email mismatch'.
--    - Revokes execute from PUBLIC and anon.
-- 6. create_order:
--    - Drops lingering legacy 14-parameter overload.
--    - Revokes execute from PUBLIC and anon on canonical 16-parameter overload.
--    - Grants execute strictly to authenticated and service_role.
-- 7. cleanup_expired_pending_orders:
--    - Automated recovery RPC for abandoned checkouts.
--    - Restricted to service_role and is_admin().
--    - Only targets orders with status = 'pending_payment' AND payment_status = 'pending'.
-- =============================================================================

-- =============================================================================
-- 1. DROP LEGACY OVERLOADS
-- =============================================================================
DROP FUNCTION IF EXISTS public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb
);

-- =============================================================================
-- 2. HARDEN confirm_paid_order
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
  v_payment_id     UUID;
  v_order_id       UUID;
  v_payment_status TEXT;
  v_item           RECORD;
  v_current_stock  INTEGER;
  v_result         JSONB;
BEGIN
  -- Security Guard: Restrict strictly to service_role (Edge Functions after HMAC verification)
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied. Service role required.'
      USING ERRCODE = '42501';
  END IF;

  -- Pessimistic row locking on payments
  SELECT id, order_id, status INTO v_payment_id, v_order_id, v_payment_status
  FROM payments
  WHERE razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_found');
  END IF;

  -- Idempotency check: if already marked paid, return success without duplicate work
  IF v_payment_status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'already_processed', true, 'order_id', v_order_id);
  END IF;

  IF v_payment_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_pending');
  END IF;

  -- Mark payment as paid
  UPDATE payments
  SET status = 'paid',
      razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id)
  WHERE id = v_payment_id;

  -- Mark order as paid and confirmed
  UPDATE orders
  SET payment_status = 'paid',
      status = 'confirmed',
      updated_at = now()
  WHERE id = v_order_id;

  -- Record confirmed inventory sale in audit history without double-decrementing stock.
  -- Product stock was already reserved upon create_order via adjust_product_stock.
  FOR v_item IN
    SELECT product_id::UUID AS pid, quantity
    FROM order_items
    WHERE order_id = v_order_id
  LOOP
    SELECT stock INTO v_current_stock
    FROM products
    WHERE id = v_item.pid;

    IF v_current_stock IS NOT NULL THEN
      INSERT INTO inventory_history (
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

  v_result := jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'payment_id', v_payment_id
  );

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.confirm_paid_order(TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(TEXT, TEXT, TEXT) TO service_role;

-- =============================================================================
-- 3. HARDEN release_order_inventory (WITH IDEMPOTENCY)
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
  FROM orders
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

  -- Restore stock for reserved items
  FOR v_item IN
    SELECT product_id::UUID AS pid, quantity
    FROM order_items
    WHERE order_id = p_order_id
  LOOP
    SELECT stock INTO v_prev_stock
    FROM products
    WHERE id = v_item.pid
    FOR UPDATE;

    IF v_prev_stock IS NOT NULL THEN
      v_new_stock := v_prev_stock + v_item.quantity;

      UPDATE products
      SET stock = v_new_stock,
          updated_at = now()
      WHERE id = v_item.pid;

      INSERT INTO inventory_history (
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
  UPDATE orders
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
-- 4. HARDEN refund_deposit
-- =============================================================================
CREATE OR REPLACE FUNCTION public.refund_deposit(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id     UUID := p_order_id;
  v_payment_id   UUID;
  v_payment_amount INTEGER;
  v_order_total  INTEGER;
  v_payment_status TEXT;
  v_status         TEXT;
  v_prev_stock   INTEGER;
  v_new_stock    INTEGER;
  v_item         RECORD;
  v_result       JSONB;
BEGIN
  -- Security Guard: service_role or admin required
  IF auth.role() != 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator or service role privileges required.'
      USING ERRCODE = '42501';
  END IF;

  -- Find the deposit payment for this order
  SELECT id, amount INTO v_payment_id, v_payment_amount
  FROM payments
  WHERE order_id = p_order_id
    AND status = 'paid'
    AND amount < (SELECT total_amount FROM orders WHERE id = p_order_id)
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'deposit_payment_not_found');
  END IF;

  -- Get order details with row lock
  SELECT id, total_amount, payment_status::TEXT, status::TEXT
  INTO v_order_id, v_order_total, v_payment_status, v_status
  FROM orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  -- Verify order is in a refundable state
  IF v_payment_status NOT IN ('deposit_paid', 'partially_paid') THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_refundable');
  END IF;

  IF v_status = 'delivered' THEN
    RETURN jsonb_build_object('success', false, 'error', 'cannot_refund_delivered_order');
  END IF;

  -- Update payment status to refunded
  UPDATE payments
  SET status = 'refunded'
  WHERE id = v_payment_id;

  -- Reset order to cancelled state
  UPDATE orders
  SET payment_status = 'pending',
      paid_amount = 0,
      remaining_amount = v_order_total,
      status = 'cancelled',
      updated_at = now()
  WHERE id = v_order_id;

  -- Restore inventory
  FOR v_item IN
    SELECT product_id::UUID AS pid, quantity
    FROM order_items
    WHERE order_id = v_order_id
  LOOP
    SELECT stock INTO v_prev_stock
    FROM products
    WHERE id = v_item.pid
    FOR UPDATE;

    IF v_prev_stock IS NOT NULL THEN
      v_new_stock := v_prev_stock + v_item.quantity;

      UPDATE products
      SET stock = v_new_stock,
          updated_at = now()
      WHERE id = v_item.pid;

      INSERT INTO inventory_history (
        product_id, change, previous_stock, new_stock, reason, notes
      ) VALUES (
        v_item.pid,
        v_item.quantity,
        v_prev_stock,
        v_new_stock,
        'refund',
        'Order ' || v_order_id || ' — deposit refunded, inventory restored'
      );
    END IF;
  END LOOP;

  v_result := jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'refunded_amount', v_payment_amount,
    'payment_status', 'pending',
    'order_status', 'cancelled'
  );

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.refund_deposit(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.refund_deposit(UUID) TO authenticated, service_role;

-- =============================================================================
-- 5. HARDEN mark_delivery_paid_rpc
-- =============================================================================
CREATE OR REPLACE FUNCTION public.mark_delivery_paid_rpc(
  p_order_id uuid,
  p_idempotency_key text,
  p_payment_method text DEFAULT 'cash_on_delivery'::text,
  p_notes text DEFAULT NULL::text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_order_id           UUID := p_order_id;
  v_payment_id         UUID;
  v_order_total        INTEGER;
  v_paid_amount        INTEGER;
  v_remaining_amount   INTEGER;
  v_payment_status     TEXT;
  v_order_status       TEXT;
  v_event_id           TEXT;
  v_result             JSONB;
BEGIN
  -- Security Guard: service_role or admin required
  IF auth.role() != 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator or service role privileges required.'
      USING ERRCODE = '42501';
  END IF;

  -- Require idempotency key from client
  IF p_idempotency_key IS NULL OR p_idempotency_key = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'idempotency_key_required',
      'message', 'Client must provide an idempotency_key for this operation'
    );
  END IF;

  -- Deterministic event_id from client-provided key
  v_event_id := 'mark_delivery_paid_' || p_idempotency_key;

  -- Fast-path idempotency check (before locking)
  IF EXISTS (SELECT 1 FROM payment_events WHERE event_id = v_event_id) THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'message', 'Already processed with this idempotency key'
    );
  END IF;

  -- Lock the order row for update to prevent concurrent modifications
  SELECT id, total_amount, paid_amount, remaining_amount, payment_status::TEXT, status::TEXT
  INTO v_order_id, v_order_total, v_paid_amount, v_remaining_amount, v_payment_status, v_order_status
  FROM orders
  WHERE id = p_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  END IF;

  -- Validate order is in a state where balance can be settled
  IF v_payment_status NOT IN ('deposit_paid', 'partially_paid') THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_order_state', 'message', 'Order must have deposit paid or be partially paid');
  END IF;

  -- Already fully paid - idempotent success
  IF v_payment_status = 'fully_paid' THEN
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'message', 'Order already fully paid',
      'order_id', v_order_id,
      'payment_status', v_payment_status
    );
  END IF;

  -- Validate remaining amount
  IF v_remaining_amount IS NULL OR v_remaining_amount <= 0 THEN
    RETURN jsonb_build_object('success', false, 'error', 'no_balance_due', 'message', 'No remaining balance to settle');
  END IF;

  -- Cannot settle delivered/cancelled/returned/refunded orders unless already fully_paid
  IF v_order_status IN ('delivered', 'cancelled', 'returned', 'refunded') AND v_payment_status != 'fully_paid' THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_order_state', 'message', 'Order is in terminal state');
  END IF;

  -- Validate payment method
  IF p_payment_method NOT IN ('cash_on_delivery', 'upi', 'card', 'other') THEN
    RETURN jsonb_build_object('success', false, 'error', 'invalid_payment_method', 'message', 'Invalid payment method');
  END IF;

  -- Validate mathematical consistency
  IF v_paid_amount + v_remaining_amount != v_order_total THEN
    RETURN jsonb_build_object('success', false, 'error', 'inconsistent_amounts', 'message', 'paid_amount + remaining_amount != total_amount');
  END IF;

  -- Insert payment record for the remaining balance
  INSERT INTO payments (order_id, amount, currency, status)
  VALUES (v_order_id, v_remaining_amount, 'INR', 'paid')
  RETURNING id INTO v_payment_id;

  -- Update order to fully paid
  UPDATE orders
  SET payment_status = 'fully_paid',
      paid_amount = v_order_total,
      remaining_amount = 0,
      status = 'delivered',
      updated_at = NOW()
  WHERE id = v_order_id;

  -- Record in payment_events for idempotency/audit
  INSERT INTO payment_events (event_id, event_type, payment_id, order_id, payload)
  VALUES (
    v_event_id,
    'delivery_paid',
    v_payment_id,
    v_order_id,
    jsonb_build_object(
      'payment_method', p_payment_method,
      'amount_settled', v_remaining_amount,
      'total_amount', v_order_total,
      'notes', p_notes,
      'timestamp', extract(epoch from now())::bigint
    )
  );

  v_result := jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'payment_id', v_payment_id,
    'total_amount', v_order_total,
    'paid_amount', v_order_total,
    'remaining_amount', 0,
    'payment_status', 'fully_paid',
    'order_status', 'delivered'
  );

  RETURN v_result;
END;
$$;

REVOKE ALL ON FUNCTION public.mark_delivery_paid_rpc(UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.mark_delivery_paid_rpc(UUID, TEXT, TEXT, TEXT) TO authenticated, service_role;

-- =============================================================================
-- 6. RESOLVE CHECKOUT BLOCKER: check_first_order_eligibility
-- =============================================================================
CREATE OR REPLACE FUNCTION public.check_first_order_eligibility(
  p_customer_email text,
  p_customer_phone text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_customer_id UUID;
  v_normalized_email TEXT;
  v_normalized_phone TEXT;
  v_qualifying_orders INTEGER;
  v_is_eligible BOOLEAN;
BEGIN
  -- Caller authorization:
  -- 1. If called by service_role (Edge Functions during checkout), trusted server context.
  -- 2. If called by authenticated user, auth.email() must match p_customer_email.
  -- 3. Anonymous callers or email mismatches are rejected.
  IF auth.role() = 'service_role' THEN
    NULL; -- Trusted server-side Edge Function invocation
  ELSIF auth.role() = 'authenticated' THEN
    IF auth.email() IS NULL OR lower(trim(auth.email())) != lower(trim(p_customer_email)) THEN
      RAISE EXCEPTION 'unauthorized: email mismatch';
    END IF;
  ELSE
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

REVOKE ALL ON FUNCTION public.check_first_order_eligibility(TEXT, TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.check_first_order_eligibility(TEXT, TEXT) TO authenticated, service_role;

-- =============================================================================
-- 7. HARDEN create_order PRIVILEGES
-- =============================================================================
REVOKE EXECUTE ON FUNCTION public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text
) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text
) TO authenticated, service_role;

-- =============================================================================
-- 8. AUTOMATED ABANDONED CHECKOUT INVENTORY RECOVERY
-- =============================================================================
CREATE OR REPLACE FUNCTION public.cleanup_expired_pending_orders(
  p_timeout_minutes integer DEFAULT 30
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order RECORD;
  v_released_orders_count INTEGER := 0;
  v_total_items_released INTEGER := 0;
  v_release_res JSONB;
BEGIN
  -- Strict caller verification: service_role or admin required
  IF auth.role() != 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator or service role privileges required.'
      USING ERRCODE = '42501';
  END IF;

  -- Only target orders strictly in 'pending_payment' with 'pending' payment status older than timeout
  FOR v_order IN
    SELECT o.id, o.order_number
    FROM orders o
    WHERE o.status = 'pending_payment'
      AND o.payment_status = 'pending'
      AND o.created_at < (now() - (p_timeout_minutes || ' minutes')::INTERVAL)
    ORDER BY o.created_at ASC
    FOR UPDATE SKIP LOCKED
  LOOP
    v_release_res := public.release_order_inventory(v_order.id, 'abandoned_checkout_timeout');

    IF (v_release_res->>'success')::BOOLEAN = true THEN
      v_released_orders_count := v_released_orders_count + 1;
      v_total_items_released := v_total_items_released + COALESCE((v_release_res->>'items_released')::INTEGER, 0);
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'expired_orders_cleaned', v_released_orders_count,
    'total_items_released', v_total_items_released,
    'timeout_minutes', p_timeout_minutes
  );
END;
$$;

REVOKE ALL ON FUNCTION public.cleanup_expired_pending_orders(INTEGER) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.cleanup_expired_pending_orders(INTEGER) TO service_role, authenticated;
