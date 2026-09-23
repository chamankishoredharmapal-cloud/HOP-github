-- =============================================================================
-- House of Padmavati — Missing Objects Forward Migration
-- Migration: 20260718000001
-- Description: Creates objects that were part of unapplied migrations:
--   - payment_events table        (from 20260717000000)
--   - inventory_history table     (from 20260713000000)
--   - confirm_paid_order function (from 20260718000000)
--   - RLS policies for orders, order_items, customers, shipping_addresses, payments
--
-- This migration is fully idempotent and safe to run multiple times.
-- It does NOT recreate orders, payments, customers, or products.
-- =============================================================================

-- #############################################################################
-- 1. inventory_history — stock deduction audit trail
-- #############################################################################
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

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inventory_history'
      AND policyname = 'Authenticated users can read inventory_history'
  ) THEN
    CREATE POLICY "Authenticated users can read inventory_history"
      ON inventory_history FOR SELECT TO authenticated USING (true);
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'inventory_history'
      AND policyname = 'Authenticated users can insert inventory_history'
  ) THEN
    CREATE POLICY "Authenticated users can insert inventory_history"
      ON inventory_history FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
END;
$$;

-- #############################################################################
-- 2. payment_events — idempotency log for webhooks & verification
-- #############################################################################
CREATE TABLE IF NOT EXISTS payment_events (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id            TEXT        NOT NULL UNIQUE,
  event_type          TEXT        NOT NULL,
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payment_events_event_id ON payment_events (event_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_razorpay_order_id ON payment_events (razorpay_order_id);

ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'payment_events'
      AND policyname = 'payment_events_all_service'
  ) THEN
    CREATE POLICY payment_events_all_service ON payment_events
      FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 3. RLS Policies for Order-Related Tables
-- #############################################################################
-- These tables were created in earlier migrations but have RLS enabled with zero policies.
-- This section adds the missing SELECT policies for authenticated users and service_role.

-- Customers: authenticated users can read their own record by email
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'customers' AND policyname = 'customers_self_select'
  ) THEN
    CREATE POLICY customers_self_select ON customers FOR SELECT USING (email = auth.email());
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'customers' AND policyname = 'customers_service_all'
  ) THEN
    CREATE POLICY customers_service_all ON customers FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- Shipping Addresses: authenticated users can read their own addresses
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'shipping_addresses' AND policyname = 'shipping_addresses_customer_select'
  ) THEN
    CREATE POLICY shipping_addresses_customer_select ON shipping_addresses FOR SELECT USING (
      customer_id IN (SELECT id FROM customers WHERE email = auth.email())
    );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'shipping_addresses' AND policyname = 'shipping_addresses_service_all'
  ) THEN
    CREATE POLICY shipping_addresses_service_all ON shipping_addresses FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- Orders: authenticated users can read their own orders
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'orders_customer_select'
  ) THEN
    CREATE POLICY orders_customer_select ON orders FOR SELECT USING (
      customer_id IN (SELECT id FROM customers WHERE email = auth.email())
    );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'orders' AND policyname = 'orders_service_all'
  ) THEN
    CREATE POLICY orders_service_all ON orders FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- Order Items: authenticated users can read their own order items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'order_items_customer_select'
  ) THEN
    CREATE POLICY order_items_customer_select ON order_items FOR SELECT USING (
      order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE email = auth.email()))
    );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'order_items' AND policyname = 'order_items_service_all'
  ) THEN
    CREATE POLICY order_items_service_all ON order_items FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- Payments: authenticated users can read their own payments
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'payments_customer_select'
  ) THEN
    CREATE POLICY payments_customer_select ON payments FOR SELECT USING (
      order_id IN (SELECT id FROM orders WHERE customer_id IN (SELECT id FROM customers WHERE email = auth.email()))
    );
  END IF;
END;
$$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'payments' AND policyname = 'payments_service_all'
  ) THEN
    CREATE POLICY payments_service_all ON payments FOR ALL USING (auth.role() = 'service_role');
  END IF;
END;
$$;

-- #############################################################################
-- 5. Orders — payment tracking columns (partial-payment/deposit model)
-- #############################################################################
-- These columns support the partial-payment/deposit model where:
-- - Customer pays ₹200 online deposit at checkout
-- - Order is confirmed/reserved after deposit verification
-- - Remaining balance is collected at delivery
-- - Existing full-payment flow remains intact
-- Idempotent: ALTER TABLE IF EXISTS ensures safe re-run.
--
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'total_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN total_amount INTEGER NOT NULL DEFAULT 0;
    COMMENT ON COLUMN public.orders.total_amount IS 'Full order total in paise (set at order creation)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'paid_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN paid_amount INTEGER NOT NULL DEFAULT 0;
    COMMENT ON COLUMN public.orders.paid_amount IS 'Amount paid so far in paise (20000 for deposit, full total for full payment)';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'orders' AND column_name = 'remaining_amount'
  ) THEN
    ALTER TABLE public.orders ADD COLUMN remaining_amount INTEGER NOT NULL DEFAULT 0;
    COMMENT ON COLUMN public.orders.remaining_amount IS 'total_amount - paid_amount (computed, stored for quick queries)';
  END IF;
END
$$;
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
  v_order_total  INTEGER;
  v_payment_amount INTEGER;
BEGIN
  SELECT id, order_id, status INTO v_payment_id, v_order_id, v_payment_status
  FROM payments
  WHERE razorpay_order_id = p_razorpay_order_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_found');
  END IF;

  IF v_payment_status = 'paid' THEN
    RETURN jsonb_build_object('success', true, 'already_processed', true, 'order_id', v_order_id);
  END IF;

  IF v_payment_status != 'pending' THEN
    RETURN jsonb_build_object('success', false, 'error', 'payment_not_pending');
  END IF;

  -- Get order total and payment amount to detect deposit vs full payment
  SELECT o.total_amount, p.amount INTO v_order_total, v_payment_amount
  FROM orders o
  JOIN payments p ON o.id = p.order_id
  WHERE p.razorpay_order_id = p_razorpay_order_id;

  -- If payment amount is less than order total, it's a deposit payment
  IF v_payment_amount IS NOT NULL AND v_order_total IS NOT NULL AND v_payment_amount > 0 AND v_payment_amount < v_order_total THEN
    -- Deposit payment: partial deposit (e.g., ₹200) + balance at delivery
    UPDATE payments
    SET status = 'paid',
        razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id)
    WHERE id = v_payment_id;

    UPDATE orders
    SET payment_status = 'deposit_paid',
        paid_amount = v_payment_amount,
        remaining_amount = v_order_total - v_payment_amount,
        status = 'confirmed',
        updated_at = now()
    WHERE id = v_order_id;
  ELSE
    -- Full payment (existing behavior)
    UPDATE payments
    SET status = 'paid',
        razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id)
    WHERE id = v_payment_id;

    UPDATE orders
    SET payment_status = 'paid',
        status = 'confirmed',
        updated_at = now()
    WHERE id = v_order_id;
  END IF;

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
    'deposit', (v_payment_amount IS NOT NULL AND v_payment_amount < v_order_total)
  );

  RETURN v_result;
END;
$$;

-- #############################################################################
-- 6. Refund Deposit RPC
-- #############################################################################
-- Refunds the ₹200 deposit when a deposit order is cancelled before delivery.
-- Restores inventory and resets order to pending_payment state.
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

  -- Reset order to pending_payment state
  UPDATE orders
  SET payment_status = 'pending_payment',
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
    'payment_status', 'pending_payment',
    'order_status', 'cancelled'
  );

  RETURN v_result;
END;
$$;