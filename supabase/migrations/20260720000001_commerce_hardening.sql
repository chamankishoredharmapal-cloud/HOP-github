-- =============================================================================
-- House of Padmavati — Commerce Hardening Migration
-- Migration: 20260720000001
-- Description: RLS policies, order_events table, order lifecycle fixes,
--              and security hardening for production readiness.
-- =============================================================================

-- #############################################################################
-- 1. ORDER EVENTS — audit trail for order lifecycle
-- #############################################################################
CREATE TABLE IF NOT EXISTS order_events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  event_type  TEXT NOT NULL,
  from_status TEXT,
  to_status   TEXT,
  metadata    JSONB DEFAULT '{}'::jsonb,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_events_order_id
  ON order_events(order_id);

ALTER TABLE order_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_events_admin_all
  ON order_events FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- #############################################################################
-- 2. RLS — COMMERCE TABLES
-- #############################################################################

-- Orders: admin full access, customers can read own
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS orders_admin_all ON orders;
CREATE POLICY orders_admin_all
  ON orders FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS orders_customer_select ON orders;
CREATE POLICY orders_customer_select
  ON orders FOR SELECT
  USING (auth.role() = 'authenticated' AND customer_id IN (
    SELECT id FROM customers WHERE email = auth.email()
  ));

-- Order items: admin full access, customers can read own
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS order_items_admin_all ON order_items;
CREATE POLICY order_items_admin_all
  ON order_items FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS order_items_customer_select ON order_items;
CREATE POLICY order_items_customer_select
  ON order_items FOR SELECT
  USING (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE email = auth.email()
    )
  ));

-- Payments: admin full access, customers can read own
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payments_admin_all ON payments;
CREATE POLICY payments_admin_all
  ON payments FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS payments_customer_select ON payments;
CREATE POLICY payments_customer_select
  ON payments FOR SELECT
  USING (order_id IN (
    SELECT id FROM orders WHERE customer_id IN (
      SELECT id FROM customers WHERE email = auth.email()
    )
  ));

-- Payment events: admin only
ALTER TABLE payment_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS payment_events_admin_all ON payment_events;
CREATE POLICY payment_events_admin_all
  ON payment_events FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Inventory history: admin only
ALTER TABLE inventory_history ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS inventory_history_admin_all ON inventory_history;
CREATE POLICY inventory_history_admin_all
  ON inventory_history FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Shipping addresses: admin all, customers read own
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS shipping_addresses_admin_all ON shipping_addresses;
CREATE POLICY shipping_addresses_admin_all
  ON shipping_addresses FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS shipping_addresses_customer_select ON shipping_addresses;
CREATE POLICY shipping_addresses_customer_select
  ON shipping_addresses FOR SELECT
  USING (customer_id IN (
    SELECT id FROM customers WHERE email = auth.email()
  ));

DROP POLICY IF EXISTS shipping_addresses_customer_insert ON shipping_addresses;
CREATE POLICY shipping_addresses_customer_insert
  ON shipping_addresses FOR INSERT
  WITH CHECK (customer_id IN (
    SELECT id FROM customers WHERE email = auth.email()
  ));

-- #############################################################################
-- 3. ADD order_number INDEX for faster lookups
-- #############################################################################
CREATE INDEX IF NOT EXISTS idx_orders_order_number
  ON orders(order_number);

-- #############################################################################
-- 4. ENSURE products.stock cannot go negative
-- #############################################################################
ALTER TABLE products DROP CONSTRAINT IF EXISTS products_stock_non_negative;
ALTER TABLE products ADD CONSTRAINT products_stock_non_negative
  CHECK (stock >= 0);

-- #############################################################################
-- 5. HELPER FUNCTION — release inventory for an order
-- #############################################################################
CREATE OR REPLACE FUNCTION release_order_inventory(
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
BEGIN
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
      SET stock = v_new_stock
      WHERE id = v_item.pid;

      INSERT INTO inventory_history (
        product_id, change, previous_stock, new_stock, reason, notes
      ) VALUES (
        v_item.pid,
        v_item.quantity,
        v_prev_stock,
        v_new_stock,
        p_reason,
        'Order ' || p_order_id || ' — inventory released'
      );

      v_released := v_released + 1;
    END IF;
  END LOOP;

  RETURN jsonb_build_object(
    'success', true,
    'items_released', v_released
  );
END;
$$;

-- #############################################################################
-- 6. ENSURE customers table has RLS
-- #############################################################################
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS customers_admin_all ON customers;
CREATE POLICY customers_admin_all
  ON customers FOR ALL
  USING (auth.role() = 'authenticated' AND EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

DROP POLICY IF EXISTS customers_self_select ON customers;
CREATE POLICY customers_self_select
  ON customers FOR SELECT
  USING (email = auth.email());

DROP POLICY IF EXISTS customers_self_update ON customers;
CREATE POLICY customers_self_update
  ON customers FOR UPDATE
  USING (email = auth.email())
  WITH CHECK (email = auth.email());
