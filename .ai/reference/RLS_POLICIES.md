# Row Level Security Policies — House of Padmavati

> From: old `security/SUPABASE_RLS_POLICIES.md` + relevant sections of `rules/SUPABASE_STANDARDS.md`

## Principle
RLS enabled on all tables. Public = SELECT only. Admin = full CRUD via `service_role`. Payments = `service_role` only. Customer data = scoped to `auth.uid()`.

## Policy Templates

```sql
ALTER TABLE {table} ENABLE ROW LEVEL SECURITY;
CREATE POLICY "{desc} — public read" ON {table} FOR SELECT USING (true);
CREATE POLICY "{desc} — admin write" ON {table} FOR INSERT WITH CHECK (auth.role() = 'service_role');
```

## Per-Table Policies

### `products`
- Public: SELECT WHERE `status = 'active'` (or service_role sees all)
- Admin: INSERT, UPDATE with `auth.role() = 'service_role'`

### `collections`
- Public: SELECT (true)
- Admin: INSERT, UPDATE with service_role

### `orders`
- Customer: SELECT WHERE `customer_id = auth.uid()`
- Admin: ALL with service_role
- Insert: service_role only

### `customers`
- Customer: SELECT WHERE `id = auth.uid()`
- Admin/service: SELECT with service_role
- Insert: service_role only

### `payments`, `payment_events`
- ALL operations: service_role only

### `order_items`, `shipping_addresses`
- Customer: SELECT via order relationship
- Admin: ALL with service_role

### `inventory_history`
- ALL: service_role only (written by triggers/Edge Functions)

## Testing

```sql
-- As anonymous
SELECT * FROM products;  -- only active products
INSERT INTO products ... -- should fail

-- As service_role
SET ROLE service_role;
SELECT * FROM orders; -- all orders
INSERT INTO products ... -- succeeds
```
