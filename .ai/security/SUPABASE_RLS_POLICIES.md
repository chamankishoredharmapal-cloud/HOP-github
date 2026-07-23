# Supabase RLS Policies — House of Padmavati

## Policy Template

```sql
-- Enable RLS
ALTER TABLE {table_name} ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "{description} — public read"
  ON {table_name}
  FOR SELECT
  USING (true);

-- Admin write (service_role)
CREATE POLICY "{description} — admin insert"
  ON {table_name}
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "{description} — admin update"
  ON {table_name}
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "{description} — admin delete"
  ON {table_name}
  FOR DELETE
  USING (auth.role() = 'service_role');
```

## Table Policies

### products
```sql
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Products — public read active"
  ON products FOR SELECT
  USING (status = 'active' OR auth.role() = 'service_role');

-- Admin can write
CREATE POLICY "Products — admin write"
  ON products FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Products — admin update"
  ON products FOR UPDATE
  USING (auth.role() = 'service_role');
```

### orders
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Customers can read own orders
CREATE POLICY "Orders — customer read own"
  ON orders FOR SELECT
  USING (
    auth.uid() = customer_id
    OR auth.role() = 'service_role'
  );

-- Only Edge Functions can insert
CREATE POLICY "Orders — service insert"
  ON orders FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

### customers
```sql
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Customers can read own data
CREATE POLICY "Customers — read own"
  ON customers FOR SELECT
  USING (
    auth.uid() = id
    OR auth.role() = 'service_role'
  );

-- Service can create during checkout
CREATE POLICY "Customers — service insert"
  ON customers FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

### collections
```sql
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Collections — public read"
  ON collections FOR SELECT
  USING (true);

-- Admin write
CREATE POLICY "Collections — admin write"
  ON collections FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

### payments
```sql
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Service role only
CREATE POLICY "Payments — service only"
  ON payments FOR ALL
  USING (auth.role() = 'service_role');
```

## Testing RLS Policies

```sql
-- Test as anonymous user
SELECT * FROM products;
-- Should only see active products

-- Test as authenticated user
SELECT * FROM orders;
-- Should only see own orders

-- Test insert as anonymous
INSERT INTO products (name) VALUES ('test');
-- Should fail (no INSERT policy for public)

-- Verify admin access
SET ROLE service_role;
SELECT * FROM orders;
-- Should see all orders
```

## RLS Checklist

- [ ] RLS enabled on all tables
- [ ] Public tables have SELECT policy for anonymous
- [ ] Admin tables have write policies for service_role
- [ ] Customer data is scoped to authenticated user
- [ ] Payment data is service_role only
- [ ] No public INSERT/UPDATE/DELETE policies
- [ ] Policies are specific (no catch-all USING (true) on sensitive tables)
- [ ] Policies tested with different roles
