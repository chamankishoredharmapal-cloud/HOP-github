# 05 — PRODUCTION CLEANUP EXECUTION REPORT

**Date:** 2026-08-18
**Executed by:** HOP Production Database Cleanup Engineer (AI-assisted, supervised scope)

---

## 1. Production project identity

| Attribute | Value |
|---|---|
| Project ref | **`kbvjmcnaaogkbnerjcoc`** (HOP's Project, South Asia / Mumbai) |
| Linked CLI project (unchanged) | `zalbmbhchzouhrdboucfe` — STAGING ("test server") — never targeted for deletion |
| Connection method | Supabase Management API `database/query` (postgres role), ref hard-coded; staging link untouched |
| PostgreSQL version | 17.6 |
| Credentials | Never printed, logged, or committed; read in-process only |

Destructive target verified twice (hard-coded ref + data cross-check against production values) before execution.

## 2. Pre-cleanup counts (2026-08-18, verified immediately before execution)

| Table | Count |
|---|---|
| collections | 5 |
| products | 4 |
| product_images | 6 |
| customers | 2 |
| shipping_addresses | 31 |
| orders | 31 |
| order_items | 53 |
| order_events | 0 |
| payments | 10 |
| payment_events | 0 |
| inventory_history | 2 |
| customer_wishlists | 0 |
| settings | 0 |
| storage objects | 12 (6 HOP-films + 6 product-images) |
| auth.users | 1 |

## 3. Deleted records (exact)

| Table | Deleted | Basis |
|---|---|---|
| customers | 2 | abcd 123 (abcd123@gmail.com), "ninja hatori" — synthetic identities |
| shipping_addresses | 31 | fictional addresses (country "kerenahalli", postal "99"/"010101") |
| orders | 31 | HOP-20260708-000001 … HOP-20260817-000031; all `payment_status='pending'`, zero paid, joke/placeholder notes |
| order_items | 53 | all items of deleted orders |
| order_events | 0 | — |
| payments | 10 | all `pending`, `razorpay_payment_id IS NULL`; Razorpay test-era orders |
| payment_events | 0 | — |
| products | 2 | empty product (`5215d2f7…`) + "abc" (`3d123e03…`), Studio test artifacts 2026-08-05 |
| product_images | 2 | images of the two test products |
| **DB rows total** | **131** | |

### Storage objects deleted (via Storage API, canonical path)
- `product-images/5215d2f7-82b1-4b98-8d5b-e5d68e3bf034/a8c8eaf9-3bb2-4d87-b452-f785851d9d72.png`
- `product-images/3d123e03-be1b-4454-a0c3-14e809146d92/4de69a01-5526-4486-b99c-17b100f29201.png`

Verified: metadata rows gone (4 remain in bucket); public URL of deleted object returns 400; kept image returns 200 (124,299 bytes).

### Auth users deleted
**None.** `994bae3f-c5e0-4cf3-8f14-81c4b199f6d1` (siddhanveg@gmail.com) retained — operator/admin account, not conclusively test.

## 4. Preserved records (post-cleanup verified)

| Table | Count | Notes |
|---|---|---|
| collections | 5 | Kalyani, Viara, Arya, Spandana, Padma — intact |
| products | 2 | kalyani1 (HOP-01, stock 7), VIARA (HOP-02, stock 8) — intact |
| product_images | 4 | 3× kalyani1 + 1× VIARA — intact |
| inventory_history | 2 | audit rows retained (ambiguous → KEEP) |
| settings / wishlists / events | 0 | untouched |
| storage HOP-films | 6 | collection films intact |
| auth.users | 1 | admin account intact |

## 5. Integrity verification (post-cleanup)

| Check | Result |
|---|---|
| FK constraints count | 12/12 unchanged |
| Orphaned rows (all FK relationships) | 0 |
| RLS enabled on all public tables | YES (0 tables without RLS) |
| RLS policies | 45 (unchanged) |
| RPCs / functions | 7 (unchanged) |
| Triggers | 0 (unchanged) |
| Migration history | 18/18 (unchanged) |
| Schema (tables/columns/enums) | unchanged (pure DML cleanup) |
| Storage buckets | 2 (unchanged) |

## 6. Application verification

| Check | Result |
|---|---|
| Storefront product data (PostgREST, anon) | 2 published products served (kalyani1, VIARA) — test products gone |
| Collections (PostgREST, anon) | 4 active collections served (Padma inactive — pre-existing state) |
| Product images (public storage URL) | HTTP 200 |
| Edge functions (production) | 4 ACTIVE (create-razorpay-order, verify-payment, razorpay-webhook, get-order-confirmation) |
| Homepage/collections/PDP/cart/checkout page loads | **Not browser-executable** — no public deployment URL exists (DNS NXDOMAIN per phase-4; Vercel deployment is a pending human action). Data layer fully verified instead. |
| Razorpay LIVE transaction | **NOT performed** (prohibited) |

## 7. Remaining suspicious/ambiguous data (KEPT by policy)

| Item | Reason | Action |
|---|---|---|
| `inventory_history` (2 rows, 2026-07-10, product VIARA) | Audit records of stock adjustments; ambiguous → KEEP | Human review (HR-2) |
| Product names "kalyani1" / "VIARA" | Dev-era naming but the live published catalog → KEEP | Optional rebrand (human decision) |
| Auth user siddhanveg@gmail.com | Only account; presumed admin → KEEP | Human review (HR-1) |

## 8. Remaining risks / observations (out of cleanup scope)

1. **Edge function parity:** production has 4 deployed functions vs 7 on staging (cancel-payment, release-inventory, send-email not seen on production) — deployment matter for the release engineer; **not modified**.
2. **No public storefront URL** — deployment/DNS pending human action (phase-4/5 records).
3. `.env` and `supabase/config.toml` reference the production ref while CLI links staging — pre-existing documented configuration; **not modified**.
4. Live traffic during cleanup: none observed (counts stable pre/post inventory window). Any future order placed via the storefront would be real data — outside this cleanup's scope.

## 9. Human action register (from this cleanup)

| # | Item |
|---|---|
| HR-1 | Confirm `994bae3f…` (siddhanveg@gmail.com) remains the intended admin account |
| HR-2 | Decide whether the 2 `inventory_history` audit rows (2026-07-10) should remain |
| HR-3 | No public app URL exists — execute browser-level post-cleanup verification after deployment |

## 10. Recovery artifacts

- `production/cleanup/snapshots/` — full before-state JSON of every deleted record:
  `customers_before.json`, `shipping_addresses_before.json`, `orders_before.json`, `order_items_before.json`, `payments_before.json`, `products_before.json`, `product_images_before.json`, `storage_objects_before.json`
- `production/cleanup/cleanup_transaction.sql` — the exact executed transaction (atomic DO block)

---

## FINAL VERDICT: **CLEANUP COMPLETE**

- All 131 test rows removed (transactional, atomic).
- 2 test storage objects removed via Storage API.
- All legitimate catalog/customer-adjacent data, schema, RLS, RPCs, triggers, migrations preserved.
- 0 orphans, 0 FK violations, catalog serving correctly.
- Auth users: none deleted.
- No schema/migration/deployment/Razorpay changes; staging link untouched.
- Browser-level app verification deferred to post-deployment (HR-3) — data layer verified.