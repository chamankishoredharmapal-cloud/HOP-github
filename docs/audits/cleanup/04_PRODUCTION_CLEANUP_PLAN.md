# 04 — PRODUCTION CLEANUP PLAN

**Project:** `kbvjmcnaaogkbnerjcoc` (PRODUCTION — HOP's Project)
**Date:** 2026-08-18
**Scope:** Delete ONLY test/unwanted records identified in `02_TEST_DATA_IDENTIFICATION.md`.
**Guarantees:** No schema/table/enum/RPC/trigger/RLS/migration changes. No auth user deletion. No Razorpay config changes.

---

## 1. Exact records proposed for deletion (by id)

### 1.1 customers (2)
- `a0a858ba-a982-480a-92f9-eb97df4e86ad` — "abcd 123" / abcd123@gmail.com
- `2e2f333a-cb06-44b2-843f-804768f043cf` — "ninja hatori" / siddhanveg@gmail.com (customer record only; auth user with same email is KEPT)

### 1.2 shipping_addresses (31)
All 31 addresses belonging to the two test customers (ids listed in inventory; all carry fictional address data — "kerenahalli", postal "99", "010101", etc.).

### 1.3 orders (31)
`HOP-20260708-000001` … `HOP-20260817-000031` (all 31). Every order: `payment_status='pending'`; zero completed payments; joke/placeholder notes; synthetic addresses/customers.

### 1.4 order_items (53)
All items under the 31 test orders.

### 1.5 order_events (0) — no-op

### 1.6 payments (10)
All payments on test orders (`razorpay_payment_id IS NULL`, `status='pending'`):
`8f934352-e02c-4619-afac-cfba307daf79`, `427abadf-1b78-4eda-a4ff-180705cd889e`, `ced027f6-761c-42ab-a5c6-19b6f6242d55`, `a82f3b8a-4f07-4c46-b87e-803b5450acf0`, `2d644dc3-343c-44f3-a912-e480d386c5e0`, `930a572a-d327-4bab-94bb-9902b1ce7465`, `46750a1e-8be4-4914-aa83-a7b49a51ab91`, `d6b8bbe6-e6a9-46cd-86f4-a4e08db1be01`, `78f70f3a-4e26-4529-b275-d5accb8adb93`, `277984e0-0190-4963-b6df-fe4b64230ad6`

### 1.7 products (2) — test products only
- `5215d2f7-82b1-4b98-8d5b-e5d68e3bf034` — empty product (all fields blank/zero), Studio test artifact 2026-08-05
- `3d123e03-be1b-4454-a0c3-14e809146d92` — "abc" / sku `aaa444`, Studio test product 2026-08-05

### 1.8 product_images (2)
- `afdf9a93-34f7-494a-bb31-75fa872ceb98` (product `5215d2f7…`)
- `c34c1a2c-da5b-4b80-ac4f-4b3fb26d2ddb` (product `3d123e03…`)

### 1.9 Storage objects (2) — via Storage API
- `product-images/5215d2f7-82b1-4b98-8d5b-e5d68e3bf034/a8c8eaf9-3bb2-4d87-b452-f785851d9d72.png`
- `product-images/3d123e03-be1b-4454-a0c3-14e809146d92/4de69a01-5526-4486-b99c-17b100f29201.png`

### 1.10 Auth users (0) — **no deletion**
`994bae3f-c5e0-4cf3-8f14-81c4b199f6d1` (siddhanveg@gmail.com) is KEPT (admin account, not conclusively test).

## 2. Reason each record is test (summary)

See `02_TEST_DATA_IDENTIFICATION.md` for full evidence per record. Highlights:
- 0/31 orders ever paid; all `payment_status='pending'`; Razorpay payment IDs NULL on all 10 payments.
- Synthetic customers ("abcd 123", "ninja hatori"; phones 7878787878, 01010101010).
- Fictional addresses (country "kerenahalli", postal "99", "010101").
- Joke/meme order notes ("Gift for kattappa: why u kill bhau-lully", …).
- 14 identical ₹3,59,00,000 carts in a repeat-test loop (2026-07-10 → 07-12).
- Test products created 2026-08-05 during Studio testing (empty product; "abc" product).
- Razorpay test-mode era only; live webhook never configured (phase-5 HA-04 PENDING).

## 3. Rows affected

| Table | Rows deleted |
|---|---|
| customers | 2 |
| shipping_addresses | 31 |
| orders | 31 |
| order_items | 53 |
| order_events | 0 |
| payments | 10 |
| payment_events | 0 |
| products | 2 |
| product_images | 2 |
| storage objects | 2 |
| auth.users | 0 |
| **Total DB rows** | **131** |

Dependent records affected: all the above are dependents of the two customers / two products (no further dependents exist).

## 4. Records explicitly protected from deletion

- All 5 collections (Kalyani, Viara, Arya, Spandana, Padma)
- Products `a2799dd3-…` (kalyani1) and `d31d9bdc-…` (VIARA) + their 4 product_images
- All 6 `HOP-films` storage objects
- `inventory_history` (2 audit rows)
- Auth user `994bae3f-…` (admin)
- `settings`, `order_events`, `payment_events`, `customer_wishlists` (empty — untouched)
- Schema, enums, RPCs, functions, triggers, RLS policies, migrations, buckets

## 5. Expected post-cleanup counts

| Table | Before | After |
|---|---|---|
| collections | 5 | 5 |
| products | 4 | 2 |
| product_images | 6 | 4 |
| customers | 2 | 0 |
| shipping_addresses | 31 | 0 |
| orders | 31 | 0 |
| order_items | 53 | 0 |
| order_events | 0 | 0 |
| payments | 10 | 0 |
| payment_events | 0 | 0 |
| inventory_history | 2 | 2 |
| customer_wishlists | 0 | 0 |
| settings | 0 | 0 |
| storage objects | 12 | 10 |
| auth.users | 1 | 1 |

## 6. Execution mechanics

- Single SQL batch in one **transaction** (BEGIN/COMMIT with ROLLBACK on error).
- Explicit `DELETE … WHERE id IN (…)` with enumerated ids only — deterministic, narrowly scoped.
- Storage objects removed via Storage API (`DELETE /storage/v1/object/product-images/<path>`) using the production service-role key read in-process (never printed/logged).
- After commit, re-verify counts, FK integrity, RLS, RPCs, migrations (Phase 7).

## 7. Rollback / recovery

- Postgres logical backup is NOT available via the Management API; therefore a pre-delete read-only snapshot of every affected row (full field dump, stored below as JSON export) is retained in `production/cleanup/snapshots/` to permit manual reconstruction if ever needed.
- Because these records are test records with zero real transactions, recovery need is minimal; snapshot provides full auditable before-state.

## 8. Risk register

| Risk | Mitigation |
|---|---|
| Accidentally deleting legitimate data | Enumerated id list; KEEP policy for ambiguous records |
| Orphaned rows after delete | All dependents deleted children-first; FK CASCADE covers any miss; post-check verifies 0 orphans |
| Storage API failure | Re-verified after; objects deletable via Dashboard if API fails (human action) |
| Live traffic creating new orders during cleanup | All orders are test (no paid order exists); any new order would be a NEW test checkout — out of scope, flagged in report |
| Auth admin lockout | Auth user untouched |