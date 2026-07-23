-- ============================================================
-- Migration: Create Orders Schema
-- Sprint 3.1 — Order Creation & Storage
-- House of Padmavati
-- ============================================================
-- Modifications applied:
--   1. full_name replaces first_name + last_name
--   2. size removed from order_items
--   3. product_id added to order_items
--   4. shipping_addresses expanded (recipient_name, phone, state, landmark)
--   5. Monetary values use INTEGER (paise) throughout
--   6. create_order() RPC with transactional semantics
--   7. Branded order number generated inside DB function (HOP-YYYYMMDD-XXXXXX)
--   8. payment_status separated from order status
--   9. payments table added for future Razorpay integration
--  10. RLS enabled on all tables, default-deny (no policies), service_role only
-- ============================================================

-- -------------------------
-- Sequence for order numbers
-- -------------------------
CREATE SEQUENCE IF NOT EXISTS orders_number_seq
  START 1
  INCREMENT 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

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
-- 1. Customers
-- -------------------------
CREATE TABLE IF NOT EXISTS customers (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT        NOT NULL,
  full_name   TEXT        NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_email ON customers (LOWER(email));

-- -------------------------
-- 2. Shipping Addresses
-- -------------------------
CREATE TABLE IF NOT EXISTS shipping_addresses (
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

CREATE INDEX IF NOT EXISTS idx_shipping_addresses_customer_id
  ON shipping_addresses (customer_id);

-- -------------------------
-- 3. Orders
-- -------------------------
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

CREATE TABLE IF NOT EXISTS orders (
  id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id       UUID          NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  shipping_address_id UUID        NOT NULL REFERENCES shipping_addresses(id) ON DELETE CASCADE,
  order_number      TEXT          NOT NULL,
  status            order_status  NOT NULL DEFAULT 'pending_payment',
  payment_status    payment_status NOT NULL DEFAULT 'pending',
  subtotal          INTEGER       NOT NULL CHECK (subtotal >= 0),
  shipping_cost     INTEGER       NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  total             INTEGER       NOT NULL CHECK (total >= 0),
  notes             TEXT,
  created_at        TIMESTAMPTZ   NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ   NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders (order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders (customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders (status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders (payment_status);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- -------------------------
-- 4. Order Items
-- -------------------------
CREATE TABLE IF NOT EXISTS order_items (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id    TEXT        NOT NULL,
  product_name  TEXT        NOT NULL,
  product_price INTEGER     NOT NULL CHECK (product_price >= 0),
  quantity      INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items (order_id);

-- -------------------------
-- 5. Payments (future Razorpay)
-- -------------------------
CREATE TYPE payment_transaction_status AS ENUM (
  'pending',
  'paid',
  'failed',
  'refunded'
);

CREATE TABLE IF NOT EXISTS payments (
  id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id          UUID        NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  razorpay_payment_id  TEXT,
  razorpay_order_id    TEXT,
  amount            INTEGER     NOT NULL CHECK (amount >= 0),
  currency          TEXT        NOT NULL DEFAULT 'INR',
  status            payment_transaction_status NOT NULL DEFAULT 'pending',
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments (order_id);

-- -------------------------
-- 6. Row-Level Security
-- -------------------------
-- Default-deny: RLS is enabled with zero policies.
-- Only the service_role key (which bypasses RLS) can access tables directly.
-- The create_order() RPC below uses SECURITY DEFINER to write on behalf of
-- callers. Customer-facing policies can be added later once auth is wired.

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- -------------------------
-- 7. Order Number Generator
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
-- 8. Create Order RPC (transactional, server-side pricing)
-- -------------------------
-- The client sends only product IDs and quantities.
-- All pricing is computed server-side from the products table.
-- p_items: JSONB array of
--   [{
--     "product_id": "<UUID>",
--     "quantity": <INTEGER>
--   }]

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
  -- ------------------------------------------------------------------
  -- Step 1: Compute shipping cost from option
  -- ------------------------------------------------------------------
  IF p_shipping_option = 'express' THEN
    v_shipping_cost := 800;
  ELSIF p_shipping_option = 'overnight' THEN
    v_shipping_cost := 2400;
  ELSE
    v_shipping_cost := 0;
  END IF;

  -- ------------------------------------------------------------------
  -- Step 2: Validate and compute subtotal from products table
  -- ------------------------------------------------------------------
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

  -- ------------------------------------------------------------------
  -- Step 3: Find or create Customer by email (case-insensitive)
  -- ------------------------------------------------------------------
  SELECT id INTO v_customer_id
  FROM customers
  WHERE LOWER(email) = LOWER(p_customer_email);

  IF NOT FOUND THEN
    INSERT INTO customers (email, full_name, phone)
    VALUES (p_customer_email, p_customer_full_name, p_customer_phone)
    RETURNING id INTO v_customer_id;
  END IF;

  -- ------------------------------------------------------------------
  -- Step 4: Create Shipping Address
  -- ------------------------------------------------------------------
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

  -- ------------------------------------------------------------------
  -- Step 5: Generate branded order number
  -- ------------------------------------------------------------------
  v_order_number := generate_order_number();

  -- ------------------------------------------------------------------
  -- Step 6: Create Order (pending_payment / pending)
  -- ------------------------------------------------------------------
  INSERT INTO orders (
    customer_id, shipping_address_id, order_number,
    status, payment_status,
    subtotal, shipping_cost, total, notes
  ) VALUES (
    v_customer_id, v_shipping_address_id, v_order_number,
    'pending_payment', 'pending',
    v_subtotal, v_shipping_cost, v_total, p_notes
  ) RETURNING id INTO v_order_id;

  -- ------------------------------------------------------------------
  -- Step 7: Create Order Items (snapshots from database values)
  -- ------------------------------------------------------------------
  IF p_items IS NOT NULL AND jsonb_array_length(p_items) > 0 THEN
    INSERT INTO order_items (order_id, product_id, product_name, product_price, quantity, image_url)
    SELECT
      v_order_id,
      (item->>'product_id')::TEXT,
      (SELECT name FROM products WHERE id = (item->>'product_id')::UUID),
      (SELECT selling_price FROM products WHERE id = (item->>'product_id')::UUID),
      (item->>'quantity')::INTEGER,
      (SELECT url FROM product_images WHERE product_id = (item->>'product_id')::UUID AND is_primary = true LIMIT 1)
    FROM jsonb_array_elements(p_items) AS item;
  END IF;

  -- ------------------------------------------------------------------
  -- Step 8: Return result including canonical total for payment
  -- ------------------------------------------------------------------
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
