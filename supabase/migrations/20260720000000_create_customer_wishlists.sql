-- =============================================================================
-- House of Padmavati — Customer Wishlist Persistence Table
-- Migration: 20260720000000
-- Description: Creates the customer_wishlists table for persisting wishlist
-- items per customer_id, with a unique constraint on (customer_id, product_id).
-- =============================================================================

CREATE TABLE IF NOT EXISTS customer_wishlists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id, product_id)
);

-- Row Level Security
ALTER TABLE customer_wishlists ENABLE ROW LEVEL SECURITY;

-- Customers can read their own wishlist
CREATE POLICY "customer_wishlists_select_own"
  ON customer_wishlists
  FOR SELECT
  USING (customer_id = auth.uid());

-- Customers can insert into their own wishlist
CREATE POLICY "customer_wishlists_insert_own"
  ON customer_wishlists
  FOR INSERT
  WITH CHECK (customer_id = auth.uid());

-- Customers can delete from their own wishlist
CREATE POLICY "customer_wishlists_delete_own"
  ON customer_wishlists
  FOR DELETE
  USING (customer_id = auth.uid());

-- Index for faster lookup
CREATE INDEX IF NOT EXISTS idx_customer_wishlists_customer_id
  ON customer_wishlists(customer_id);
