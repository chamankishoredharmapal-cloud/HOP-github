# 03 — DELETION DEPENDENCY MAP

**Project:** `kbvjmcnaaogkbnerjcoc` (PRODUCTION)
**Source:** Live `pg_constraint` inspection, 2026-08-18

## 1. Actual foreign-key constraints (production)

| # | Child table | Constraint | Definition | Action |
|---|---|---|---|---|
| 1 | customer_wishlists | customer_wishlists_customer_id_fkey | customer_id → customers(id) | ON DELETE **CASCADE** |
| 2 | customer_wishlists | customer_wishlists_product_id_fkey | product_id → products(id) | ON DELETE **CASCADE** |
| 3 | inventory_history | inventory_history_created_by_fkey | created_by → auth.users(id) | NO ACTION |
| 4 | inventory_history | inventory_history_product_id_fkey | product_id → products(id) | ON DELETE **CASCADE** |
| 5 | order_events | order_events_order_id_fkey | order_id → orders(id) | ON DELETE **CASCADE** |
| 6 | order_items | order_items_order_id_fkey | order_id → orders(id) | ON DELETE **CASCADE** |
| 7 | orders | orders_customer_id_fkey | customer_id → customers(id) | ON DELETE **CASCADE** |
| 8 | orders | orders_shipping_address_id_fkey | shipping_address_id → shipping_addresses(id) | ON DELETE **CASCADE** |
| 9 | payments | payments_order_id_fkey | order_id → orders(id) | ON DELETE **CASCADE** |
| 10 | product_images | product_images_product_id_fkey | product_id → products(id) | ON DELETE **CASCADE** |
| 11 | products | products_collection_id_fkey | collection_id → collections(id) | ON DELETE **SET NULL** |
| 12 | shipping_addresses | shipping_addresses_customer_id_fkey | customer_id → customers(id) | ON DELETE **CASCADE** |

Notes:
- `order_items.product_id` is `text` — **no FK** to `products` (snapshot column).
- `customers` has **no FK** to `auth.users`.
- No FK from any non-public schema points at public tables.
- No user-defined triggers fire on deletion.

## 2. Dependency graph

```
auth.users (KEPT — admin)
   └── inventory_history.created_by (NO ACTION — unaffected, KEPT)

collections (KEPT)
   └── products.collection_id (SET NULL — not triggered; products kept)

products (TEST: 2)                       customers (TEST: 2)
   ├── product_images (TEST: 2)  CASCADE     ├── shipping_addresses (TEST: 31)  CASCADE
   └── inventory_history  CASCADE (none      └── orders (TEST: 31)  CASCADE
        for test products)                       ├── order_items (TEST: 53)  CASCADE
                                                 ├── order_events (0)  CASCADE
                                                 └── payments (TEST: 10)  CASCADE
```

## 3. Canonical deletion order

All downstream FKs are `ON DELETE CASCADE`, so order is deterministic. For defense-in-depth, explicit deletes are executed **children-first** inside a single transaction:

1. `product_images` — 2 rows (test products' images)
2. `products` — 2 rows (test products; cascades would cover images, explicit for clarity)
3. `payments` — 10 rows (test orders)
4. `order_items` — 53 rows (test orders)
5. `order_events` — 0 rows (no-op, executed for completeness)
6. `orders` — 31 rows (test)
7. `shipping_addresses` — 31 rows (test)
8. `customers` — 2 rows (test)

Storage (independent, after DB transaction):
9. `storage.objects` — 2 test objects via Storage API (canonical path, removes metadata + backing file)

Auth users: **no deletions**.

## 4. Pre-delete existence guards

Each DELETE statement is constrained to the exact record ids enumerated in `04_PRODUCTION_CLEANUP_PLAN.md`. No `DELETE FROM <table>` without `WHERE`, no `TRUNCATE`, no schema changes.