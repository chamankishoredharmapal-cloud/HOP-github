-- Inventory history audit trail
-- Records every stock adjustment for traceability

CREATE TABLE IF NOT EXISTS inventory_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  change INTEGER NOT NULL,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  reason TEXT NOT NULL,
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inventory_history_product_id ON inventory_history(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_history_created_at ON inventory_history(created_at DESC);

ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read inventory_history"
  ON inventory_history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert inventory_history"
  ON inventory_history FOR INSERT TO authenticated WITH CHECK (true);

-- =============================================================================
-- confirm_paid_order RPC
-- Atomically marks payment as paid, updates order, deducts inventory, and
-- records inventory history — all in a single transaction.
-- Called by verify-payment Edge Function and razorpay-webhook Edge Function.
-- Idempotent: repeated calls with the same razorpay_order_id are safe.
-- =============================================================================

CREATE OR REPLACE FUNCTION confirm_paid_order(
  p_razorpay_order_id  TEXT,
  p_razorpay_payment_id TEXT DEFAULT NULL,
  p_razorpay_signature  TEXT DEFAULT NULL
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_payment_id   UUID;
  v_order_id     UUID;
  v_payment_status TEXT;
  v_item         RECORD;
  v_prev_stock   INTEGER;
  v_new_stock    INTEGER;
  v_result       JSONB;
BEGIN
  -- Lock and read payment row
  SELECT id, order_id, status INTO v_payment_id, v_order_id, v_payment_status
  FROM payments
  WHERE razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_found');
  END IF;

  -- Idempotency: already paid
  IF v_payment_status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'already_processed', true, 'order_id', v_order_id);
  END IF;

  -- Reject non-pending payments
  IF v_payment_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_pending');
  END IF;

  -- Update payment record
  UPDATE payments
  SET status = 'paid',
      razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
      updated_at = now()
  WHERE id = v_payment_id;

  -- Update order status
  UPDATE orders
  SET payment_status = 'paid',
      status = 'confirmed',
      updated_at = now()
  WHERE id = v_order_id;

  -- Deduct inventory for each order item
  FOR v_item IN
    SELECT product_id::UUID AS pid, quantity
    FROM order_items
    WHERE order_id = v_order_id
  LOOP
    -- Guarded update: prevent negative stock
    SELECT stock INTO v_prev_stock
    FROM products
    WHERE id = v_item.pid
    FOR UPDATE;

    IF v_prev_stock IS NOT NULL THEN
      v_new_stock := GREATEST(0, v_prev_stock - v_item.quantity);

      UPDATE products
      SET stock = v_new_stock
      WHERE id = v_item.pid;

      INSERT INTO inventory_history (
        product_id, change, previous_stock, new_stock, reason, notes
      ) VALUES (
        v_item.pid,
        -v_item.quantity,
        v_prev_stock,
        v_new_stock,
        'sale',
        'Order ' || v_order_id || ' — payment verified'
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
