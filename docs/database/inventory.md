# Database: Inventory History

## `inventory_history`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `uuid` PK | `gen_random_uuid()` | |
| `product_id` | `uuid` FK → `products(id)` ON DELETE CASCADE | | Product whose stock changed |
| `change` | `integer` | | Positive for additions, negative for removals |
| `previous_stock` | `integer` | | Stock before adjustment |
| `new_stock` | `integer` | | Stock after adjustment |
| `reason` | `text` | | One of: `initial_stock`, `purchase`, `sale`, `return`, `damage`, `manual_adjustment`, `correction` |
| `notes` | `text` | | Optional free-text notes |
| `created_by` | `uuid` FK → `auth.users(id)` | | User who made the adjustment |
| `created_at` | `timestamptz` | `now()` | |

## RLS

| Role | Policy |
|------|--------|
| `authenticated` | `SELECT` — all authenticated users can read history |
| `authenticated` | `INSERT` — all authenticated users can record adjustments |

## Indexes

- `idx_inventory_history_product_id` on `product_id` — fast lookup by product
- `idx_inventory_history_created_at` on `created_at DESC` — chronological queries

## Stock Management

The canonical stock value lives on `products.stock`. The `inventory_history` table only records the audit trail — it does not track current stock. Every adjustment:

1. Reads current `products.stock` as `previous_stock`
2. Computes `new_stock = max(0, previous_stock + change)`
3. Updates `products.stock` to `new_stock`
4. Inserts history row with all metadata

This ensures the stock value is never silently overwritten.
