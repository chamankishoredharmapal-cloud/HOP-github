# 01 — PRODUCTION DATA INVENTORY

**Date:** 2026-08-18
**Project:** HOP's Project — `kbvjmcnaaogkbnerjcoc` (South Asia / Mumbai)
**Connection:** Supabase Management API `database/query` endpoint (verified `current_database() = postgres`, `current_user = postgres`, PostgreSQL 17.6)
**Method:** Read-only inspection. No deletions performed at this stage.

---

## 1. Environment verification

| Check | Result |
|---|---|
| Currently linked Supabase project (CLI) | `zalbmbhczouhrdboucfe` — "test server" (STAGING) — unchanged, untouched |
| Production project | `kbvjmcnaaogkbnerjcoc` — "HOP's Project" |
| CLI link state | Staging remains linked; production accessed via hard-coded ref in `run_prod_sql.ps1` |
| Storefront config (`.env`) | `VITE_SUPABASE_PROJECT_ID="kbvjmcnaaogkbnerjcoc"` — production is the storefront DB |

## 2. Schema state (production)

- PostgreSQL **17.6**, database `postgres`
- **All 18 canonical migrations applied** in `supabase_migrations.schema_migrations`
  (20260706000001 … 20260816000001) — matches the repository migration set exactly.
- 13 public tables present, matching canonical HOP architecture.
- RLS **enabled** on all 13 public tables (verified `relrowsecurity = true`).
- 7 RPCs present: `confirm_paid_order`, `create_order`, `generate_order_number`, `is_admin`,
  `release_order_inventory`, `update_updated_at_column`, `upsert_customer_profile`.
- **No user-defined triggers** on public tables.
- No foreign keys from non-public schemas reference public tables.

## 3. Row counts and date ranges (read-only)

| Table | Rows | Earliest | Latest |
|---|---|---|---|
| collections | 5 | 2026-07-09 21:43:54 | 2026-07-09 21:43:54 |
| products | 4 | 2026-07-09 21:30:23 | 2026-08-05 08:35:56 |
| product_images | 6 | 2026-07-09 21:40:19 | 2026-08-05 08:35:58 |
| customers | 2 | 2026-07-08 13:34:54 | 2026-07-17 15:40:55 |
| shipping_addresses | 31 | 2026-07-08 13:34:54 | 2026-08-17 09:27:46 |
| orders | 31 | 2026-07-08 13:34:54 | 2026-08-17 09:27:46 |
| order_items | 53 | 2026-07-08 13:34:54 | 2026-08-17 09:27:47 |
| order_events | 0 | — | — |
| payments | 10 | 2026-07-16 00:02:41 | 2026-08-04 22:24:44 |
| payment_events | 0 | — | — |
| inventory_history | 2 | 2026-07-10 19:43:28 | 2026-07-10 19:43:48 |
| customer_wishlists | 0 | — | — |
| settings | 0 | — | — |

## 4. Storage buckets / objects

| Bucket | Objects | Notes |
|---|---|---|
| `HOP-films` | 6 (ARYA+.mp4, HERO.mp4, KALYANI+1.mp4, PADMA.mp4, SPANDANA.mp4, VIARA3.mp4) | Uploaded 2026-07-09 — collection hero films |
| `product-images` | 6 (see inventory below) | 4 catalog + 2 test |

### product-images objects

| Object path | Product | Created | Classification |
|---|---|---|---|
| `a2799dd3-…/f20a3f3c-….png` | kalyani1 (KEEP) | 2026-07-09 | KEEP |
| `a2799dd3-…/b7d8adae-….png` | kalyani1 (KEEP) | 2026-07-09 | KEEP |
| `a2799dd3-…/72aa5fda-….png` | kalyani1 (KEEP) | 2026-07-09 | KEEP |
| `d31d9bdc-…/fb796cf4-….png` | VIARA (KEEP) | 2026-07-10 | KEEP |
| `5215d2f7-…/a8c8eaf9-….png` | empty product (TEST) | 2026-08-05 08:23 | **TEST** |
| `3d123e03-…/4de69a01-….png` | "abc" product (TEST) | 2026-08-05 08:35 | **TEST** |

## 5. Auth users (read-only, no secret material inspected)

| id | email | created | last sign-in | email confirmed | Notes |
|---|---|---|---|---|---|
| 994bae3f-c5e0-4cf3-8f14-81c4b199f6d1 | siddhanveg@gmail.com | 2026-07-09 | 2026-08-09 | yes | Developer/admin account — NOT linked to `customers` (no FK). |

No customer record references this auth user via FK. `customers` has no FK to `auth.users`.

## 6. Key observations

1. **Zero completed payments** in the entire history: all 10 `payments` rows are `status='pending'` with `razorpay_payment_id IS NULL`. No order has ever reached `payment_status='paid'`.
2. All 31 orders are `pending_payment`/`confirmed`/`processing` with `payment_status='pending'`.
3. Order notes contain placeholder/meme content (see `02_TEST_DATA_IDENTIFICATION.md`).
4. `inventory_history` (2 rows) documents stock adjustments made on the day the VIARA product was created (development-era, 2026-07-10); `created_by` FK → `auth.users(id)` of the admin account.
5. No orphaned `order_items` (0 rows without parent order).
6. No order item references the two test products.

## 7. Protected (never to be touched)

- All 5 collections (Kalyani, Viara, Arya, Spandana, Padma)
- Products `a2799dd3-…` (kalyani1, HOP-01) and `d31d9bdc-…` (VIARA, HOP-02) and their 4 images
- All 6 `HOP-films` objects
- `inventory_history` (2 rows — audit records, ambiguous, KEEP)
- Auth user `994bae3f-…` (admin account)
- Schema, enums, RPCs, functions, triggers, RLS, migrations, storage buckets