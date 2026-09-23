-- =============================================================================
-- House of Padmavati — Fix refund_deposit payment_status bug
-- Migration: 20260916010000
-- Description: Fixes refund_deposit RPC to use correct payment_status enum value.
-- The function was incorrectly setting orders.payment_status = 'pending_payment'
-- which is an order_status value. The correct payment_status value is 'pending'.
-- =============================================================================

CREATE OR REPLACE FUNCTION refund_deposit(
  p_order_id UUID
) RETURNS JSONB
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

  -- Get order details
  SELECT id, total_amount, payment_status, status INTO v_order_id, v_order_total, v_payment_status, v_status
  FROM orders
  WHERE id = p_order_id;

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

  -- Reset order to pending payment state
  UPDATE orders
  SET payment_status = 'pending',  -- FIXED: was 'pending_payment' (order_status value)
      paid_amount = 0,
      remaining_amount = v_order_total,
      status = 'cancelled',  -- order_status = 'cancelled' (correct)
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
      SET stock = v_new_stock
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
    'payment_status', 'pending',  -- FIXED: was 'pending_payment'
    'order_status', 'cancelled'
  );

  RETURN v_result;
END;
$$;