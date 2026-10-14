-- =============================================================================
-- Migration: 20261015020000_fix_inventory_double_decrement.sql
-- Description: Prevent double-decrement of product stock on paid order confirmation.
--
-- Context:
-- In migration 20261009020000, create_order() was updated to reserve product
-- inventory at order creation time via adjust_product_stock(-quantity, 'order_created').
-- When payment completes, confirm_paid_order() previously decremented products.stock
-- a second time.
-- This migration reconciles confirm_paid_order() so it confirms the existing
-- reservation in inventory_history without double-decrementing products.stock.
-- =============================================================================

CREATE OR REPLACE FUNCTION confirm_paid_order(
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

GRANT EXECUTE ON FUNCTION confirm_paid_order(TEXT, TEXT, TEXT) TO authenticated, service_role;
