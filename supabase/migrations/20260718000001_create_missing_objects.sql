-- =============================================================================
-- House of Padmavati — Missing Objects Forward Migration (RECONCILIED)
-- Migration: 20260718000001
-- Description: Creates objects that were part of unapplied migrations:
--   - payment_events table        (from 20260717000000)
--   - inventory_history table     (from 20260713000000)
--   - confirm_paid_order function (from 20260718000000, FIXED for live schema)
--   - RLS policies for anon order lookup (for frontend order confirmation)
--
-- RECONCILIATION NOTE:
--   The confirm_paid_order RPC does NOT reference payments.updated_at
--   because the live payments table (from migration 20260708000000) does
--   NOT have that column. orders.updated_at IS referenced because that
--   column does exist in the live orders table.
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
-- 3. confirm_paid_order — atomic payment + order + inventory update
-- #############################################################################
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

  -- NOTE: payments.updated_at does not exist in the live schema
  -- (migration 20260708000000). Only orders has updated_at.
  UPDATE payments
  SET status = 'paid',
      razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id)
  WHERE id = v_payment_id;

  UPDATE orders
  SET payment_status = 'paid',
      status = 'confirmed',
      updated_at = now()
  WHERE id = v_order_id;

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
    'payment_id', v_payment_id
  );

  RETURN v_result;
END;
$$;

-- #############################################################################
-- 4. Security note: Anonymous RLS policies are NOT created.
-- The order confirmation page accesses data through the
-- get-order-confirmation Edge Function using service_role.
-- Commerce tables remain protected from anon/authenticated roles.
-- #############################################################################
