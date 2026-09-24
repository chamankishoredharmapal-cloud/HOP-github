# 02 — TEST DATA IDENTIFICATION

**Project:** `kbvjmcnaaogkbnerjcoc` (PRODUCTION)
**Date:** 2026-08-18
**Rule applied:** Records are classified as TEST only with positive evidence. Ambiguous records are classified KEEP.

---

## 1. Customers (2 of 2 classified TEST)

| id | email | name | phone | Evidence |
|---|---|---|---|---|
| `a0a858ba-a982-480a-92f9-eb97df4e86ad` | abcd123@gmail.com | "abcd 123" | 7878787878 | Synthetic placeholder name ("abcd 123"), synthetic email with `123` suffix, repeated-digit phone `7878787878`. Used exclusively by orders with joke notes and fake addresses (below). |
| `2e2f333a-cb06-44b2-843f-804768f043cf` | siddhanveg@gmail.com | "ninja hatori" | 01010101010 | Meme name ("ninja hatori"), patterned phone `01010101010`, fake address "dubai street, cannada corner", postal `010101`. All associated orders are test orders (joke notes, zero completed payments). Email is the developer's address used as test input; **the auth user of the same email is a separate record and is KEPT**. |

## 2. Orders (31 of 31 classified TEST)

Global evidence applicable to **every** order:

1. **No completed payment exists** for any order — `payments` for these orders are all `pending`, `razorpay_payment_id IS NULL`; no order has `payment_status='paid'` (0/31).
2. Order notes contain joke/meme placeholder text:
   - `"Gift for alla bob : bless you child"` (HOP-20260715-000018)
   - `"Gift for alla bob : bless u bob"` (HOP-20260716-000021)
   - `"Gift for kattappa: why u kill bhau-lully"` (HOP-20260717-000022)
   - `"Gift for ma frindu: thinnava ra picchoda"` (HOP-20260717-000023)
   - `"Gift for alla bob : bullreddy died"` (HOP-20260726-000026)
   - `"Gift for "` (empty recipient, HOP-20260715-000018)
3. Repeated identical cart values: orders HOP-20260710-000003 → HOP-20260712-000017 (14 orders) all subtotal `35900000` — an automated/manual repeat-test loop using the old dev prices (kalyani1 25000000 + VIARA 10900000).
4. All orders were created by only the two synthetic customers above.
5. Shipping addresses are fictional (see §4).
6. Development-phase artifacts: order HOP-20260708-000001 references legacy seed product id `product-2`; 18 order items reference legacy prefixed id `product-a2799dd3-…` — pre-schema-era seed references, consistent with dev seeding.
7. The Razorpay orders referenced (`order_TDy9OSXJn9x1gO`, `order_TDyqiA7dIu76mw`, …) were created in the Razorpay **test-mode** period documented in `production/phase-3` ("Razorpay test mode only"; live webhook never configured — `13_HUMAN_ACTION_REGISTER.md` HA-04 PENDING).

Full order list (31): HOP-20260708-000001 … HOP-20260817-000031 (sequential; all `payment_status='pending'`).

## 3. Payments (10 of 10 classified TEST)

All belong to test orders above; all `status='pending'`, `razorpay_payment_id IS NULL`; created 2026-07-16 → 2026-08-04. No real (live) transaction ever occurred — Razorpay live webhook was never configured (phase-5 HUMAN ACTION REGISTER HA-04: PENDING AUTHORIZATION).

## 4. Shipping addresses (31 of 31 classified TEST)

Two repeating fictional templates (one per test customer):

| Template | Values |
|---|---|
| A (customer `a0a858ba…`) | recipient "abcd 123", phone 7878787878 / 8217669200, address "efg-sterrt", city "dubai"/"dodabalapur", postal "99"/"561203", country **"kerenahalli"** (fictional — not a real country) |
| B (customer `2e2f333a…`) | recipient "ninja hatori", phone 01010101010, address "dubai street, cannada corner ,", city "anakapalli", postal "010101", country "kerenahalli" |

Addresses are duplicated across orders (same address copied to each new order) — consistent with repeated test checkouts, not real customers.

## 5. Order items (53 of 53 classified TEST)

All belong to the 31 test orders. Products referenced are the dev-era catalog ("kalyani1", "VIARA") with legacy prefixed product ids. They will be removed with their parent orders.

## 6. Products (2 of 4 classified TEST)

| id | name | Evidence |
|---|---|---|
| `5215d2f7-82b1-4b98-8d5b-e5d68e3bf034` | *(empty)* | Completely empty product: `sku=''`, `name=''`, `slug=''`, all prices 0, `stock=0`, `collection_id=NULL`. Created 2026-08-05 08:23 — matching the Studio-fix commit period (`fix(studio): resolve product creation and image upload…`). An accidental/aborted Studio test creation. |
| `3d123e03-be1b-4454-a0c3-14e809146d92` | "abc" | Placeholder product: `sku='aaa444'`, `name='abc'`, `slug='abc'`, all prices 12300, `stock=0`. Created 2026-08-05 08:35 — Studio test product. |

**KEPT:** `a2799dd3-…` (kalyani1, HOP-01) and `d31d9bdc-…` (VIARA, HOP-02) — the published live catalog served by the storefront; ambiguous at worst → KEEP per rule.

## 7. Product images (2 of 6 classified TEST)

- `afdf9a93-34f7-494a-bb31-75fa872ceb98` → product `5215d2f7…` (empty test product)
- `c34c1a2c-da5b-4b80-ac4f-4b3fb26d2ddb` → product `3d123e03…` ("abc" test product)

## 8. Storage objects (2 of 12 classified TEST)

- `product-images/5215d2f7-82b1-4b98-8d5b-e5d68e3bf034/a8c8eaf9-3bb2-4d87-b452-f785851d9d72.png` (created 2026-08-05 08:23)
- `product-images/3d123e03-be1b-4454-a0c3-14e809146d92/4de69a01-5526-4486-b99c-17b100f29201.png` (created 2026-08-05 08:35)

## 9. Auth users (0 of 1 classified TEST)

`994bae3f-c5e0-4cf3-8f14-81c4b199f6d1` (siddhanveg@gmail.com) — **KEPT**. It is the only auth user; most plausibly the operator's admin/studio account. Not conclusively test → KEEP. Flagged for human review (HR-1).

## 10. Ambiguous records classified KEEP

| Records | Reason |
|---|---|
| `inventory_history` (2 rows, product d31d9bdc…) | Audit records of legitimate stock adjustments made at product creation (2026-07-10). Harmless; not conclusively test → KEEP. Flagged for human review (HR-2). |
| Products kalyani1 + VIARA, all 5 collections, 4 catalog images, 6 HOP-films | Live catalog; never delete legitimate catalog data → KEEP. |

## 11. Summary of classification

| Table | Total | TEST | KEEP |
|---|---|---|---|
| customers | 2 | 2 | 0 |
| shipping_addresses | 31 | 31 | 0 |
| orders | 31 | 31 | 0 |
| order_items | 53 | 53 | 0 |
| payments | 10 | 10 | 0 |
| order_events | 0 | 0 | 0 |
| payment_events | 0 | 0 | 0 |
| products | 4 | 2 | 2 |
| product_images | 6 | 2 | 4 |
| inventory_history | 2 | 0 | 2 |
| collections | 5 | 0 | 5 |
| settings | 0 | 0 | 0 |
| customer_wishlists | 0 | 0 | 0 |
| storage objects | 12 | 2 | 10 |
| auth.users | 1 | 0 | 1 |