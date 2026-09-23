-- =============================================================================
-- House of Padmavati — Atomic mark_delivery_paid RPC
-- Migration: 20260916020000
-- Description: Creates an atomic RPC for marking delivery balance as paid.
-- Handles idempotency, concurrent requests, and atomic payment+order update.
-- =============================================================================

-- =============================================================================
-- 1. Add 'mark_delivery_paid' to payment_events event_type CHECK constraint
-- The event_type column uses a CHECK constraint, not an enum type.
-- =============================================================================
ALTER TABLE payment_events DROP CONSTRAINT IF EXISTS payment_events_type_check;
ALTER TABLE payment_events ADD CONSTRAINT payment_events_type_check
  CHECK (event_type IN (
    'verify_payment',
    'refund',
    'chargeback',
    'payment.failed',
    'payment.captured',
    'mark_delivery_paid'
  ));

-- =============================================================================
-- 2. mark_delivery_paid_rpc
-- Atomically marks the remaining balance of a deposit order as paid.
-- Uses FOR UPDATE locking and payment_events idempotency to ensure safety.
-- 
-- Idempotency: The RPC accepts a client-provided p_idempotency_key.
-- The event_id is deterministically derived from this key.
-- If the client reuses the same key, the UNIQUE constraint on event_id
-- ensures the duplicate is detected and returns already_processed.
-- The client MUST provide the same p_idempotency_key for retries.
-- =============================================================================

CREATE OR REPLACE FUNCTION mark_delivery_paid_rpc(
  p_order_id UUID,
  p_idempotency_key TEXT,  -- REQUIRED: Client-provided idempotency key
  p_payment_method TEXT DEFAULT 'cash_on_delivery',
  p_notes TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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
  SELECT id, total_amount, paid_amount, remaining_amount, payment_status, status
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
  INSERT INTO payment_events (event_id, event_type, razorpay_order_id, razorpay_payment_id)
  VALUES (v_event_id, 'mark_delivery_paid', NULL, NULL);

  -- Return success with details
  RETURN jsonb_build_object(
    'success', true,
    'order_id', v_order_id,
    'order_number', (SELECT order_number FROM orders WHERE id = v_order_id),
    'payment_id', v_payment_id,
    'amount_settled', v_remaining_amount,
    'new_payment_status', 'fully_paid',
    'new_order_status', 'delivered'
  );

EXCEPTION
  WHEN unique_violation THEN
    -- Duplicate event_id (idempotency key collision)
    RETURN jsonb_build_object(
      'success', true,
      'already_processed', true,
      'message', 'Already processed with this idempotency key'
    );
  WHEN check_violation THEN
    -- Invalid enum value (e.g., payment_status, event_type)
    RETURN jsonb_build_object('success', false, 'error', 'invalid_enum_value');
  WHEN foreign_key_violation THEN
    RETURN jsonb_build_object('success', false, 'error', 'order_not_found');
  WHEN OTHERS THEN
    RAISE NOTICE 'mark_delivery_paid_rpc error: %', SQLERRM;
    RETURN jsonb_build_object('success', false, 'error', 'internal_error');
END;
$$;

-- =============================================================================
-- Grant execute permission to service_role (Edge Functions use service_role)
-- =============================================================================
GRANT EXECUTE ON FUNCTION mark_delivery_paid_rpc(UUID, TEXT, TEXT, TEXT) TO service_role;

-- =============================================================================
-- Note: 
-- - Edge Functions calling this RPC must use the service_role key.
-- - The RPC does NOT check admin authorization; that MUST be done at the 
--   Edge Function layer before calling the RPC.
-- - Client MUST provide a stable idempotency_key for retries.
--   Recommended format: "mark_delivery_paid_<order_id>_<admin_user_id>"
-- =============================================================================