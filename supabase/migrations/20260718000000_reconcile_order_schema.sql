-- =============================================================================
-- House of Padmavati — Reconcile Order & Payment Schema
-- Migration: 20260718000000
--
-- Resolves conflicting definitions between two earlier migrations:
--   20260706000001_create_order_system.sql  (OLD — first attempt)
--   20260708000000_create_orders_schema.sql (NEW — target canonical schema)
--
-- Because 20260708000000 used CREATE TABLE IF NOT EXISTS, the OLD schema
-- silently persisted. This migration drops the OLD conflicting objects and
-- recreates the CANONICAL schema (from 20260708000000) with these refinements:
--   3.1  Reconcile conflicting enums and tables
--   3.2  order_items.product_id → UUID with FK REFERENCES products(id)
--   3.3  adjust_product_stock() RPC for atomic inventory concurrency
-- =============================================================================

-- #############################################################################
-- 3.1 — DROP CONFLICTING OBJECTS
-- #############################################################################

-- Drop shipping_addresses first (FK depends on customers which will be recreated)
DROP TABLE IF EXISTS shipping_addresses CASCADE;

-- Drop conflicting enums. CASCADE propagates through:
--   order_status    → orders, order_status_history
--   payment_status  → payments (old schema), orders
--   payment_method  → payments (old schema)
--   coupon_type     → coupons
-- FK-dependent tables (order_items, payments, etc.) are also cascaded.
DROP TYPE IF EXISTS order_status CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS payment_method CASCADE;
DROP TYPE IF EXISTS coupon_type CASCADE;

-- Drop remaining old tables not covered by enum cascades
DROP TABLE IF EXISTS addresses CASCADE;
DROP TABLE IF EXISTS inventory CASCADE;
DROP TABLE IF EXISTS wishlist_items CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- Drop old sequence (named without trailing 's')
DROP SEQUENCE IF EXISTS order_number_seq;

-- #############################################################################
-- 3.1 — CREATE CANONICAL TYPES
-- #############################################################################

CREATE TYPE order_status AS ENUM (
  'pending_payment',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'returned'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded',
  'partially_refunded'
);

CREATE TYPE payment_transaction_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

-- #############################################################################
-- 3.1 — CREATE CANONICAL SEQUENCE
-- #############################################################################

CREATE SEQUENCE IF NOT EXISTS orders_number_seq
  START 1
  INCREMENT 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

-- #############################################################################
-- 3.1 — CREATE CANONICAL TABLES
-- #############################################################################

-- -------------------------
-- Updated-at trigger helper
-- -------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- -------------------------
-- 1. Customers (simplified)
-- -------------------------
CREATE TABLE customers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_customers_email ON customers (LOWER(email));

-- -------------------------
-- 2. Shipping Addresses
-- -------------------------
CREATE TABLE shipping_addresses (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id     UUID        NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  recipient_name  TEXT        NOT NULL,
  phone           TEXT,
  address         TEXT        NOT NULL,
  city            TEXT        NOT NULL,
  state           TEXT        NOT NULL,
  postal_code     TEXT        NOT NULL,
  country         TEXT        NOT NULL DEFAULT 'India',
  landmark        TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_shipping_addresses_customer_id
  ON shipping_addresses (customer_id);

-- -------------------------
-- 3. Orders
-- -------------------------
CREATE TABLE orders (
  id                  UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id         UUID          NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  shipping_address_id UUID          NOT NULL REFERENCES shipping_addresses(id) ON DELETE CASCADE,
  order_number        TEXT          NOT NULL,
  status              order_status  NOT NULL DEFAULT 'pending_payment',
  payment_status      payment_status NOT NULL DEFAULT 'pending',
  subtotal            INTEGER       NOT NULL CHECK (subtotal >= 0),
  shipping_cost       INTEGER       NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total               INTEGER       NOT NULL CHECK (total >= 0),
  notes               TEXT,
  created_at          TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_orders_order_number ON orders (order_number);
CREATE INDEX idx_orders_customer_id ON orders (customer_id);
CREATE INDEX idx_orders_status ON orders (status);
CREATE INDEX idx_orders_payment_status ON orders (payment_status);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -------------------------
-- 4. Order Items (3.2: UUID product_id with FK)
-- -------------------------
CREATE TABLE order_items (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    UUID        REFERENCES products(id) ON DELETE SET NULL,
  product_name  TEXT        NOT NULL,
  product_price INTEGER     NOT NULL CHECK (product_price >= 0),
  quantity      INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_order_items_order_id ON order_items (order_id);
CREATE INDEX idx_order_items_product_id ON order_items (product_id);

-- -------------------------
-- 5. Payments (razorpay column names)
-- -------------------------
CREATE TABLE payments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_payment_id  TEXT,
  razorpay_order_id    TEXT,
  amount            INTEGER     NOT NULL CHECK (amount >= 0),
  currency          TEXT        NOT NULL DEFAULT 'INR',
  status            payment_transaction_status NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payments_order_id ON payments (order_id);

-- -------------------------
-- 6. Row-Level Security (default-deny, no customer policies)
-- -------------------------
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- #############################################################################
-- 3.1 — RECREATE FUNCTIONS & RPCS
-- #############################################################################

-- -------------------------
-- Order Number Generator
-- -------------------------
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  seq_num BIGINT;
  date_str TEXT;
BEGIN
  seq_num := nextval('orders_number_seq');
  date_str := TO_CHAR(NOW(), 'YYYYMMDD');
  RETURN 'HOP-' || date_str || '-' || LPAD(seq_num::TEXT, 6, '0');
END;
$$;

-- -------------------------
-- Create Order RPC (3.2: product_id stored as UUID)
-- -------------------------
CREATE OR REPLACE FUNCTION create_order(
  p_customer_email          TEXT,
  p_customer_full_name      TEXT,
  p_customer_phone          TEXT,
  p_shipping_recipient_name TEXT,
  p_shipping_phone          TEXT,
  p_shipping_address        TEXT,
  p_shipping_city           TEXT,
  p_shipping_state          TEXT,
  p_shipping_postal_code    TEXT,
  p_shipping_country        TEXT DEFAULT 'India',
  p_shipping_landmark       TEXT DEFAULT NULL,
  p_shipping_option         TEXT DEFAULT 'standard',
  p_notes                   TEXT DEFAULT NULL,
  p_items                   JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_customer_id        UUID;
  v_shipping_address_id UUID;
  v_order_id           UUID;
  v_order_number       TEXT;
  v_item               JSONB;
  v_product_id         UUID;
  v_product            RECORD;
  v_quantity           INTEGER;
  v_subtotal           INTEGER := 0;
  v_shipping_cost      INTEGER;
  v_total              INTEGER;
  v_item_price         INTEGER;
  v_item_name          TEXT;
  v_item_image         TEXT;
  v_result             JSONB;
BEGIN
  IF p_shipping_option = 'express' THEN
    v_shipping_cost := 800;
  ELSIF p_shipping_option = 'overnight' THEN
    v_shipping_cost := 2400;
  ELSE
    v_shipping_cost := 0;
  END IF;

  FOR v_item IN SELECT * FROM jsonb_array_elements(p_items)
  LOOP
    v_product_id := (v_item->>'product_id')::UUID;
    v_quantity := (v_item->>'quantity')::INTEGER;

    IF v_quantity <= 0 THEN
      RAISE EXCEPTION 'Invalid quantity for product %', v_product_id;
    END IF;

    SELECT id, selling_price, name, status,
      (SELECT url FROM product_images WHERE product_id = v_product_id AND is_primary = true LIMIT 1) AS image_url
    INTO v_product
    FROM products
    WHERE id = v_product_id;

    IF v_product.id IS NULL THEN
      RAISE EXCEPTION 'Product % not found', v_product_id;
    END IF;

    IF v_product.status NOT IN ('active', 'published') THEN
      RAISE EXCEPTION 'Product % is not available', v_product_id;
    END IF;

    v_subtotal := v_subtotal + (v_product.selling_price * v_quantity);
  END LOOP;

  v_total := v_subtotal + v_shipping_cost;

  SELECT id INTO v_customer_id
  FROM customers
  WHERE LOWER(email) = LOWER(p_customer_email);

  IF NOT FOUND THEN
    INSERT INTO customers (email, full_name, phone)
    VALUES (p_customer_email, p_customer_full_name, p_customer_phone)
    RETURNING id INTO v_customer_id;
  END IF;

  INSERT INTO shipping_addresses (
    customer_id, recipient_name, phone,
    address, city, state, postal_code, country, landmark
  ) VALUES (
    v_customer_id,
    p_shipping_recipient_name,
    p_shipping_phone,
    p_shipping_address,
    p_shipping_city,
    p_shipping_state,
    p_shipping_postal_code,
    p_shipping_country,
    p_shipping_landmark
  ) RETURNING id INTO v_shipping_address_id;

  v_order_number := generate_order_number();

  INSERT INTO orders (
    customer_id, shipping_address_id, order_number,
    status, payment_status,
    subtotal, shipping_cost, total, notes
  ) VALUES (
    v_customer_id, v_shipping_address_id, v_order_number,
    'pending_payment', 'pending',
    v_subtotal, v_shipping_cost, v_total, p_notes
  ) RETURNING id INTO v_order_id;

  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, image_url)
    SELECT
      v_order_id,
      (item->>'product_id')::UUID,
      (SELECT name FROM products WHERE id = (item->>'product_id')::UUID),
      (SELECT selling_price FROM products WHERE id = (item->>'product_id')::UUID),
      (item->>'quantity')::INTEGER,
      (SELECT url FROM product_images WHERE product_id = (item->>'product_id')::UUID AND is_primary = true LIMIT 1)
    FROM jsonb_array_elements(p_items) AS item;
  END IF;

  v_result := jsonb_build_object(
    'order_id',     v_order_id,
    'order_number',  v_order_number,
    'customer_id',   v_customer_id,
    'total',         v_total
  );

  RETURN v_result;
EXCEPTION
  WHEN OTHERS THEN
    RAISE EXCEPTION 'create_order failed: %', SQLERRM
      USING HINT = 'All changes have been rolled back.';
END;
$$;

-- -------------------------
-- Confirm Paid Order RPC (idempotent, atomic inventory deduction)
-- -------------------------
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

  UPDATE payments
  SET status = 'paid',
      razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
      updated_at = now()
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
-- 3.3 — ATOMIC INVENTORY ADJUSTMENT RPC
-- SELECT … FOR UPDATE with pessimistic locking prevents concurrent
-- overwrites.  Returns JSONB with { success, previous_stock, new_stock }
-- or { success: false, error } on failure.
-- #############################################################################

CREATE OR REPLACE FUNCTION adjust_product_stock(
  p_product_id   UUID,
  p_quantity     INTEGER,
  p_reason       TEXT,
  p_notes        TEXT DEFAULT NULL,
  p_allow_negative BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_previous_stock INTEGER;
  v_new_stock      INTEGER;
BEGIN
  SELECT stock INTO v_previous_stock
  FROM products
  WHERE id = p_product_id
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'product_not_found');
  END IF;

  v_new_stock := v_previous_stock + p_quantity;

  IF NOT p_allow_negative AND v_new_stock < 0 THEN
    RETURN jsonb_build_object(
      'success', false, 'error', 'insufficient_stock',
      'available', v_previous_stock,
      'requested', -p_quantity
    );
  END IF;

  UPDATE products SET stock = v_new_stock WHERE id = p_product_id;

  INSERT INTO inventory_history (product_id, change, previous_stock, new_stock, reason, notes)
  VALUES (p_product_id, p_quantity, v_previous_stock, v_new_stock, p_reason, p_notes);

  RETURN jsonb_build_object(
    'success', true,
    'previous_stock', v_previous_stock,
    'new_stock', v_new_stock
  );
END;
$$;
