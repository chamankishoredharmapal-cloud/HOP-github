-- =============================================================================
-- House of Padmavati — Order System
-- Migration: 20260706000001
-- Description: Complete order lifecycle schema
--   - Collections, Products, Product Images
--   - Customers, Addresses, Orders, Order Items, Order Status History
--   - Payments (Razorpay), Inventory (product-level), Coupons, Wishlist
--   - Auto-generated order numbers (HOP-YYYYMM-NNNNNN)
--   - Automatic order status audit trail
--   - Row-Level Security policies
-- =============================================================================

-- #############################################################################
-- EXTENSIONS
-- #############################################################################
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- #############################################################################
-- ENUMS
-- #############################################################################
CREATE TYPE order_status AS ENUM (
  'pending',
  'paid',
  'packed',
  'shipped',
  'delivered',
  'completed',
  'cancelled',
  'refunded',
  'partially_refunded'
);

CREATE TYPE payment_status AS ENUM (
  'pending',
  'processing',
  'completed',
  'failed',
  'refunded',
  'partially_refunded'
);

CREATE TYPE payment_method AS ENUM (
  'credit_card',
  'debit_card',
  'upi',
  'net_banking',
  'cod',
  'wallet'
);

CREATE TYPE product_status AS ENUM (
  'draft',
  'active',
  'archived'
);

CREATE TYPE coupon_type AS ENUM (
  'percentage',
  'fixed_amount',
  'free_shipping'
);

-- #############################################################################
-- SEQUENCES
-- #############################################################################
CREATE SEQUENCE IF NOT EXISTS order_number_seq
  START 1
  INCREMENT 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

-- #############################################################################
-- COLLECTIONS
-- #############################################################################
CREATE TABLE collections (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text        NOT NULL,
  slug        text        NOT NULL,
  description text,
  image_url   text,
  is_active   boolean     NOT NULL DEFAULT true,
  sort_order  integer     NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX collections_slug_idx ON collections (slug);
CREATE INDEX collections_active_idx ON collections (is_active);

-- #############################################################################
-- PRODUCTS
-- #############################################################################
CREATE TABLE products (
  id                      uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  sku                     text        NOT NULL,
  name                    text        NOT NULL,
  slug                    text        NOT NULL,
  description             text,
  price                   integer     NOT NULL CHECK (price >= 0),
  fabric                  text,
  weave                   text,
  colour                  text,
  occasion                text,
  weight                  text,
  estimated_dispatch_days integer     NOT NULL DEFAULT 3,
  care_instructions       text,
  collection_id           uuid        REFERENCES collections (id) ON DELETE SET NULL,
  featured              boolean         NOT NULL DEFAULT false,
  status                product_status  NOT NULL DEFAULT 'active',
  created_at            timestamptz     NOT NULL DEFAULT now(),
  updated_at            timestamptz     NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX products_sku_idx ON products (sku);
CREATE UNIQUE INDEX products_slug_idx ON products (slug);
CREATE INDEX products_collection_idx ON products (collection_id);
CREATE INDEX products_status_idx ON products (status) WHERE status = 'active';
CREATE INDEX products_featured_idx ON products (featured) WHERE featured = true;

COMMENT ON COLUMN products.price IS 'Amount in paise (e.g. 48000 = INR 480.00)';
COMMENT ON COLUMN products.estimated_dispatch_days IS 'Business days until dispatch';

-- #############################################################################
-- PRODUCT IMAGES (normalized, replaces jsonb images column)
-- #############################################################################
CREATE TABLE product_images (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid        NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  url         text        NOT NULL,
  alt_text    text,
  sort_order  integer     NOT NULL DEFAULT 0,
  is_primary  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX product_images_product_idx ON product_images (product_id);
CREATE UNIQUE INDEX product_images_product_sort_idx ON product_images (product_id, sort_order);
CREATE UNIQUE INDEX product_images_primary_idx ON product_images (product_id) WHERE is_primary = true;

-- #############################################################################
-- CUSTOMERS
-- #############################################################################
CREATE TABLE customers (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id uuid        UNIQUE REFERENCES auth.users (id) ON DELETE SET NULL,
  full_name        text,
  email            text,
  phone            text,
  is_guest         boolean     NOT NULL DEFAULT true,
  notes            text,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX customers_email_idx ON customers (email);
CREATE INDEX customers_phone_idx ON customers (phone);

COMMENT ON COLUMN customers.is_guest IS 'True for guest checkout; false after account registration';
COMMENT ON COLUMN customers.supabase_user_id IS 'Links to auth.users when customer registers an account';

-- #############################################################################
-- ADDRESSES
-- #############################################################################
CREATE TABLE addresses (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid        REFERENCES customers (id) ON DELETE CASCADE,
  full_name   text        NOT NULL,
  phone       text        NOT NULL,
  line1       text        NOT NULL,
  line2       text,
  city        text        NOT NULL,
  state       text        NOT NULL,
  pincode     text        NOT NULL,
  country     text        NOT NULL DEFAULT 'India',
  is_default  boolean     NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX addresses_customer_idx ON addresses (customer_id);
CREATE INDEX addresses_customer_default_idx ON addresses (customer_id, is_default) WHERE is_default = true;

-- #############################################################################
-- ORDERS
-- #############################################################################
CREATE TABLE orders (
  id                  uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number        text          UNIQUE NOT NULL,
  customer_id         uuid          NOT NULL REFERENCES customers (id),
  guest_email         text,
  status              order_status  NOT NULL DEFAULT 'pending',
  subtotal            integer       NOT NULL CHECK (subtotal >= 0),
  shipping_cost       integer       NOT NULL DEFAULT 0 CHECK (shipping_cost >= 0),
  tax                 integer       NOT NULL DEFAULT 0 CHECK (tax >= 0),
  discount            integer       NOT NULL DEFAULT 0 CHECK (discount >= 0),
  total               integer       NOT NULL CHECK (total >= 0),
  currency            text          NOT NULL DEFAULT 'INR',
  shipping_address_id uuid          REFERENCES addresses (id) ON DELETE SET NULL,
  billing_address_id  uuid          REFERENCES addresses (id) ON DELETE SET NULL,
  order_notes         text,
  is_gift             boolean       NOT NULL DEFAULT false,
  recipient_name      text,
  gift_message        text,
  gift_wrap           boolean       NOT NULL DEFAULT false,
  tracking_number     text,
  courier_name        text,
  paid_at             timestamptz,
  packed_at           timestamptz,
  shipped_at          timestamptz,
  delivered_at        timestamptz,
  cancelled_at        timestamptz,
  cancelled_reason    text,
  refunded_at         timestamptz,
  refund_amount       integer       CHECK (refund_amount IS NULL OR refund_amount >= 0),
  created_at          timestamptz   NOT NULL DEFAULT now(),
  updated_at          timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX orders_customer_idx ON orders (customer_id);
CREATE INDEX orders_status_idx ON orders (status);
CREATE INDEX orders_created_idx ON orders (created_at DESC);
CREATE INDEX orders_guest_email_idx ON orders (guest_email);

COMMENT ON COLUMN orders.order_number IS 'Format: HOP-YYYYMM-NNNNNN';
COMMENT ON COLUMN orders.guest_email IS 'Captured at checkout for guest order lookup';
COMMENT ON COLUMN orders.subtotal IS 'Amount in paise. Sum of order item subtotals before tax/shipping/discount';
COMMENT ON COLUMN orders.shipping_cost IS 'Amount in paise';
COMMENT ON COLUMN orders.tax IS 'Amount in paise';
COMMENT ON COLUMN orders.discount IS 'Amount in paise';
COMMENT ON COLUMN orders.total IS 'Amount in paise. Final amount charged (subtotal + shipping + tax - discount)';
COMMENT ON COLUMN orders.refund_amount IS 'Amount in paise. NULL until a refund is processed';

-- #############################################################################
-- ORDER ITEMS
-- #############################################################################
CREATE TABLE order_items (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id      uuid        NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  product_id    uuid        REFERENCES products (id) ON DELETE SET NULL,
  product_name  text        NOT NULL,
  product_price integer     NOT NULL CHECK (product_price >= 0),
  quantity      integer     NOT NULL CHECK (quantity > 0),
  subtotal      integer     NOT NULL CHECK (subtotal >= 0),
  image_url     text,
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX order_items_order_idx ON order_items (order_id);
CREATE INDEX order_items_product_idx ON order_items (product_id);

COMMENT ON COLUMN order_items.product_name IS 'Snapshot of product name at time of order';
COMMENT ON COLUMN order_items.product_price IS 'Snapshot of unit price at time of order (paise)';
COMMENT ON COLUMN order_items.subtotal IS 'product_price * quantity';

-- #############################################################################
-- ORDER STATUS HISTORY (audit trail for every status transition)
-- #############################################################################
CREATE TABLE order_status_history (
  id          uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id    uuid          NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
  from_status order_status,
  to_status   order_status  NOT NULL,
  changed_by  text          NOT NULL DEFAULT 'system',
  notes       text,
  created_at  timestamptz   NOT NULL DEFAULT now()
);

CREATE INDEX order_status_history_order_idx ON order_status_history (order_id);
CREATE INDEX order_status_history_created_idx ON order_status_history (created_at DESC);

COMMENT ON COLUMN order_status_history.from_status IS 'NULL for the initial creation event';
COMMENT ON COLUMN order_status_history.changed_by IS 'One of: system | customer | admin | payment_gateway';

-- #############################################################################
-- PAYMENTS (Razorpay)
-- #############################################################################
CREATE TABLE payments (
  id                 uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id           uuid            NOT NULL REFERENCES orders (id),
  payment_method     payment_method  NOT NULL,
  payment_gateway    text            NOT NULL DEFAULT 'razorpay',
  gateway_payment_id text,
  gateway_order_id   text,
  gateway_signature  text,
  amount             integer         NOT NULL CHECK (amount >= 0),
  currency           text            NOT NULL DEFAULT 'INR',
  status             payment_status  NOT NULL DEFAULT 'pending',
  paid_at            timestamptz,
  refunded_at        timestamptz,
  refund_amount      integer         CHECK (refund_amount IS NULL OR refund_amount >= 0),
  failure_reason     text,
  failure_code       text,
  created_at         timestamptz     NOT NULL DEFAULT now(),
  updated_at         timestamptz     NOT NULL DEFAULT now()
);

CREATE INDEX payments_order_idx ON payments (order_id);
CREATE INDEX payments_gateway_payment_idx ON payments (gateway_payment_id);
CREATE INDEX payments_status_idx ON payments (status);

COMMENT ON COLUMN payments.amount IS 'Amount in paise';
COMMENT ON COLUMN payments.refund_amount IS 'Amount in paise. NULL until a refund is processed';
COMMENT ON COLUMN payments.gateway_payment_id IS 'Razorpay payment_id';
COMMENT ON COLUMN payments.gateway_order_id IS 'Razorpay order_id';
COMMENT ON COLUMN payments.gateway_signature IS 'Razorpay signature for payment verification';

-- #############################################################################
-- INVENTORY (product-level stock)
-- #############################################################################
CREATE TABLE inventory (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id         uuid        NOT NULL UNIQUE REFERENCES products (id) ON DELETE CASCADE,
  quantity           integer     NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  low_stock_threshold integer    NOT NULL DEFAULT 5,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE inventory IS 'Product-level stock. One row per product. No size variants.';

-- #############################################################################
-- WISHLIST
-- #############################################################################
CREATE TABLE wishlist_items (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid        NOT NULL REFERENCES customers (id) ON DELETE CASCADE,
  product_id  uuid        NOT NULL REFERENCES products (id) ON DELETE CASCADE,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX wishlist_customer_idx ON wishlist_items (customer_id);
CREATE UNIQUE INDEX wishlist_customer_product_idx ON wishlist_items (customer_id, product_id);

-- #############################################################################
-- COUPONS (standalone — not yet connected to orders)
-- #############################################################################
CREATE TABLE coupons (
  id                uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  code              text          NOT NULL,
  description       text,
  type              coupon_type   NOT NULL,
  value             integer       NOT NULL CHECK (value > 0),
  min_order_amount  integer       CHECK (min_order_amount IS NULL OR min_order_amount >= 0),
  max_discount      integer       CHECK (max_discount IS NULL OR max_discount >= 0),
  usage_limit       integer       CHECK (usage_limit IS NULL OR usage_limit > 0),
  used_count        integer       NOT NULL DEFAULT 0 CHECK (used_count >= 0),
  is_active         boolean       NOT NULL DEFAULT true,
  valid_from        timestamptz   NOT NULL,
  valid_until       timestamptz   NOT NULL,
  created_at        timestamptz   NOT NULL DEFAULT now(),
  updated_at        timestamptz   NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX coupons_code_idx ON coupons (code);
CREATE INDEX coupons_active_idx ON coupons (is_active) WHERE is_active = true;

COMMENT ON COLUMN coupons.value IS 'Percentage (1-100) for percentage type; amount in paise for fixed_amount';
COMMENT ON COLUMN coupons.min_order_amount IS 'Minimum order total in paise for this coupon to apply';
COMMENT ON COLUMN coupons.max_discount IS 'Maximum discount in paise (cap for percentage coupons)';

-- #############################################################################
-- TRIGGER FUNCTIONS
-- #############################################################################

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Generate branded order number: HOP-YYYYMM-NNNNNN
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'HOP-'
    || to_char(now(), 'YYYYMM')
    || '-'
    || LPAD(nextval('order_number_seq')::text, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Record every order status transition into order_status_history
CREATE OR REPLACE FUNCTION update_order_status_history()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by, notes)
    VALUES (NEW.id, NULL, NEW.status, 'system', 'Order created');
  ELSIF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO order_status_history (order_id, from_status, to_status, changed_by)
    VALUES (NEW.id, OLD.status, NEW.status, 'system');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set the corresponding audit timestamp on the orders row when status changes
CREATE OR REPLACE FUNCTION update_order_status_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'paid' THEN
        NEW.paid_at = now();
      WHEN 'packed' THEN
        NEW.packed_at = now();
      WHEN 'shipped' THEN
        NEW.shipped_at = now();
      WHEN 'delivered' THEN
        NEW.delivered_at = now();
      WHEN 'cancelled' THEN
        NEW.cancelled_at = now();
      WHEN 'refunded' THEN
        NEW.refunded_at = now();
      ELSE
        NULL;
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- #############################################################################
-- TRIGGERS
-- #############################################################################

-- updated_at auto-update triggers
CREATE TRIGGER trg_collections_updated_at BEFORE UPDATE ON collections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_customers_updated_at BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_inventory_updated_at BEFORE UPDATE ON inventory
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_coupons_updated_at BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Order number generation on insert
CREATE TRIGGER trg_set_order_number BEFORE INSERT ON orders
  FOR EACH ROW EXECUTE FUNCTION generate_order_number();

-- Order status audit trail (insert + update)
CREATE TRIGGER trg_update_order_status_history
  AFTER INSERT OR UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION update_order_status_history();

-- Order status timestamp auto-set (before update only)
CREATE TRIGGER trg_update_order_status_timestamps
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION update_order_status_timestamps();

-- #############################################################################
-- ROW-LEVEL SECURITY
-- #############################################################################
-- Note: Guest checkout operations create orders via Edge Functions
-- (service_role), which bypass RLS. These policies protect data when
-- customers interact directly via Supabase Anon Key (e.g. authenticated
-- users viewing their order history).

-- Collections: public read, admin write
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE POLICY collections_read_public ON collections
  FOR SELECT USING (true);

CREATE POLICY collections_all_admin ON collections
  FOR ALL USING (auth.role() = 'service_role');

-- Products: public read (active only), admin full access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY products_read_public ON products
  FOR SELECT USING (status = 'active');

CREATE POLICY products_all_admin ON products
  FOR ALL USING (auth.role() = 'service_role');

-- Product Images: public read, admin write
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY product_images_read_public ON product_images
  FOR SELECT USING (true);

CREATE POLICY product_images_all_admin ON product_images
  FOR ALL USING (auth.role() = 'service_role');

-- Customers: own record access
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY customers_read_own ON customers
  FOR SELECT USING (auth.uid() = supabase_user_id);

CREATE POLICY customers_update_own ON customers
  FOR UPDATE USING (auth.uid() = supabase_user_id);

CREATE POLICY customers_all_admin ON customers
  FOR ALL USING (auth.role() = 'service_role');

-- Addresses: own access via customer relationship
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY addresses_read_own ON addresses
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY addresses_write_own ON addresses
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY addresses_update_own ON addresses
  FOR UPDATE USING (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY addresses_delete_own ON addresses
  FOR DELETE USING (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY addresses_all_admin ON addresses
  FOR ALL USING (auth.role() = 'service_role');

-- Orders: own access via customer relationship
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY orders_read_own ON orders
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY orders_all_admin ON orders
  FOR ALL USING (auth.role() = 'service_role');

-- Order Items: own access via order relationship
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_items_read_own ON order_items
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.supabase_user_id = auth.uid()
    )
  );

CREATE POLICY order_items_all_admin ON order_items
  FOR ALL USING (auth.role() = 'service_role');

-- Order Status History: own read via order relationship
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY order_status_history_read_own ON order_status_history
  FOR SELECT USING (
    order_id IN (
      SELECT o.id FROM orders o
      JOIN customers c ON c.id = o.customer_id
      WHERE c.supabase_user_id = auth.uid()
    )
  );

CREATE POLICY order_status_history_all_admin ON order_status_history
  FOR ALL USING (auth.role() = 'service_role');

-- Payments: admin only (security-sensitive)
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY payments_all_admin ON payments
  FOR ALL USING (auth.role() = 'service_role');

-- Inventory: admin only (stock data not exposed directly)
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY inventory_all_admin ON inventory
  FOR ALL USING (auth.role() = 'service_role');

-- Wishlist: own access
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY wishlist_read_own ON wishlist_items
  FOR SELECT USING (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY wishlist_write_own ON wishlist_items
  FOR INSERT WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY wishlist_delete_own ON wishlist_items
  FOR DELETE USING (
    customer_id IN (
      SELECT id FROM customers WHERE supabase_user_id = auth.uid()
    )
  );

CREATE POLICY wishlist_all_admin ON wishlist_items
  FOR ALL USING (auth.role() = 'service_role');

-- Coupons: admin only (validation happens server-side)
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;

CREATE POLICY coupons_all_admin ON coupons
  FOR ALL USING (auth.role() = 'service_role');
