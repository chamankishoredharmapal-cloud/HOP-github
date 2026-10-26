# HOP — Phase 1 Security Hardening Report: Staging Implementation & Verification

**Target Environment:** Staging Supabase `dovnhgbisiturzbjgvei` (Mumbai `ap-south-1`)  
**Production Status:** Supabase `kbvjmcnaaogkbnerjcoc` — **STRICTLY UNTOUCHED & PRISTINE**  
**Execution Timestamp:** 2026-10-25 23:55:00 IST (2026-10-25 18:25:00 UTC)  
**Release Branch:** `release/v1.1-launch-candidate`  
**Applied Migration:** [`supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql)  
**Security Status:** **15 / 15 STAGING GATES PASSED (100%)**

---

## 1. Executive Summary

In response to the vulnerabilities identified in [`HOP_ANONYMOUS_ORDER_INVENTORY_SECURITY_REVIEW.md`](file:///E:/HOP/HOP_ANONYMOUS_ORDER_INVENTORY_SECURITY_REVIEW.md), a comprehensive Phase 1 Security Hardening migration was developed, dry-run tested, and applied exclusively to the dedicated staging environment (`dovnhgbisiturzbjgvei`).

### Key Remediation Results
1. **Direct Payment Confirmation Bypass Blocked:**  
   [`public.confirm_paid_order`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L33-L113) now strictly enforces `auth.role() = 'service_role'`. Execution privileges for `PUBLIC`, `anon`, and `authenticated` were completely revoked. Payment confirmation can now only be executed by server-side Edge Functions ([`verify-payment`](file:///E:/HOP/supabase/functions/verify-payment/index.ts) and [`razorpay-webhook`](file:///E:/HOP/supabase/functions/razorpay-webhook/index.ts)) after cryptographic HMAC-SHA256 signature verification.
2. **Administrative Order RPCs Hardened:**  
   [`release_order_inventory`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L118-L208), [`refund_deposit`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L213-L309), and [`mark_delivery_paid_rpc`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L314-L425) now require `auth.role() = 'service_role' OR public.is_admin()`. Unauthenticated and customer callers are rejected with SQLSTATE `42501`.
3. **Inventory Release Made Strictly Idempotent:**  
   [`release_order_inventory`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L118-L208) now locks the order row, checks if `orders.status = 'cancelled'`, and returns `{ already_released: true, items_released: 0 }` on duplicate calls without incrementing stock again. It additionally blocks releasing inventory for paid or confirmed orders.
4. **Checkout Service-Role Blocker Resolved:**  
   [`check_first_order_eligibility`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L430-L506) now explicitly permits `auth.role() = 'service_role'`, allowing [`create-razorpay-order`](file:///E:/HOP/supabase/functions/create-razorpay-order/index.ts) to execute checkouts without failing on `auth.email() IS NULL`. Customer identity validation (`auth.email() = p_customer_email`) remains strictly enforced for authenticated user calls.
5. **Abandoned Checkout Stock Recovery Implemented:**  
   New administrative RPC [`cleanup_expired_pending_orders`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L518-L566) safely finds stale orders in `pending_payment` older than the timeout threshold (e.g., 30 minutes) and restores inventory idempotently.
6. **Legacy Overload Cleaned Up:**  
   The stale 14-parameter legacy overload of `create_order` was dropped. `create_order` now has a single canonical 16-parameter definition, and `anon` execution rights were revoked.
7. **Production Remains 100% Pristine:**  
   All tests and migrations were executed against staging `dovnhgbisiturzbjgvei`. Read-only assertions confirmed zero production mutations or state drift.

---

## 2. Validation of the Four Reported RPC Findings

| RPC Function | Pre-Hardening Staging State | Legitimate Callers | Role Required | Finding Verdict |
| :--- | :--- | :--- | :--- | :--- |
| **`confirm_paid_order`** | SECDEF, owned by `postgres`, ACL `{=X, anon=X, ...}`. No caller auth check. | `verify-payment` and `razorpay-webhook` Edge Functions | `service_role` | **CONFIRMED VULNERABLE & FIXED** |
| **`release_order_inventory`** | SECDEF, owned by `postgres`, ACL `{=X, anon=X, ...}`. No caller auth check. Incremented stock repeatedly on every call. | `cancel-payment`, `verify-payment`, `release-inventory`, `razorpay-webhook` | `service_role` or `is_admin()` | **CONFIRMED VULNERABLE & FIXED** |
| **`refund_deposit`** | SECDEF, owned by `postgres`, ACL `{=X, anon=X, ...}`. No caller auth check. | Admin Studio / Settlement workflow | `service_role` or `is_admin()` | **CONFIRMED VULNERABLE & FIXED** |
| **`mark_delivery_paid_rpc`** | SECDEF, owned by `postgres`, ACL `{=X, anon=X, ...}`. No caller auth check. | `mark-delivery-paid` Edge Function | `service_role` or `is_admin()` | **CONFIRMED VULNERABLE & FIXED** |

### Additional Associated Functions Validated
- **`check_first_order_eligibility`:**  
  Confirmed that when invoked by `create-razorpay-order` via `service_role`, `auth.email()` evaluated to `NULL`, raising `unauthorized: email mismatch`. Fixed by adding `IF auth.role() = 'service_role' THEN NULL;`.
- **`create_order`:**  
  Staging had a lingering 14-parameter overload (OID 18080) and 16-parameter overload (OID 18595). Dropped 14-param overload and revoked `anon` execution.
- **`adjust_product_stock`:**  
  Confirmed to already contain `IF (auth.role() = 'authenticated' AND NOT public.is_admin()) OR auth.role() = 'anon' THEN RAISE 42501`. Intact and unchanged.

---

## 3. RPC Permission Changes & Authorization Matrix

| Object Name | Parameter Signature | Previous ACL | Hardened ACL | Enforced Authorization Guard |
| :--- | :--- | :--- | :--- | :--- |
| **`confirm_paid_order`** | `(text, text, text)` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | `{postgres=X, service_role=X}` | `IF auth.role() != 'service_role' THEN RAISE 42501` |
| **`release_order_inventory`** | `(uuid, text)` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | `{postgres=X, authenticated=X, service_role=X}` | `IF auth.role() != 'service_role' AND NOT is_admin() THEN RAISE 42501` + Order status check |
| **`refund_deposit`** | `(uuid)` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | `{postgres=X, authenticated=X, service_role=X}` | `IF auth.role() != 'service_role' AND NOT is_admin() THEN RAISE 42501` |
| **`mark_delivery_paid_rpc`** | `(uuid, text, text, text)` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | `{postgres=X, authenticated=X, service_role=X}` | `IF auth.role() != 'service_role' AND NOT is_admin() THEN RAISE 42501` |
| **`check_first_order_eligibility`** | `(text, text)` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | `{postgres=X, authenticated=X, service_role=X}` | `service_role` permitted; `authenticated` requires `auth.email() = p_customer_email` |
| **`create_order`** | `(..., jsonb)` *(14 params)* | `{=X, ...}` | **DROPPED** | Function dropped |
| **`create_order`** | `(..., integer, text)` *(16 params)* | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | `{postgres=X, authenticated=X, service_role=X}` | `anon` revoked; server calculates prices & locks rows |
| **`cleanup_expired_pending_orders`** | `(integer)` | *New* | `{postgres=X, authenticated=X, service_role=X}` | `IF auth.role() != 'service_role' AND NOT is_admin() THEN RAISE 42501` |

---

## 4. Staging Verification Suite: Observed Test Results

The test suite was executed against `https://dovnhgbisiturzbjgvei.supabase.co`:

```
=================================================================
TOTAL GATES: 15 | PASSED: 15 | FAILED: 0
OVERALL SUITE VERDICT: ALL GATES PASSED (100%)
=================================================================
```

### Detailed Gate Audit Log

- **[PASS] Gate 1 — Anonymous `confirm_paid_order` Rejected:**  
  `POST /rest/v1/rpc/confirm_paid_order` with `anon` key returned `HTTP 401: {"code":"42501", "message":"permission denied for function confirm_paid_order"}`.
- **[PASS] Gate 2 — Ordinary Customer `confirm_paid_order` Rejected:**  
  `POST /rest/v1/rpc/confirm_paid_order` with customer JWT returned `HTTP 403: {"code":"42501", "message":"permission denied for function confirm_paid_order"}`.
- **[PASS] Gate 3 — Anonymous `release_order_inventory` Rejected:**  
  `POST /rest/v1/rpc/release_order_inventory` with `anon` key returned `HTTP 401: {"code":"42501", "message":"permission denied for function release_order_inventory"}`.
- **[PASS] Gate 4 — Ordinary Customer `release_order_inventory` Rejected:**  
  `POST /rest/v1/rpc/release_order_inventory` with customer JWT returned `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
- **[PASS] Gate 5 — Anonymous `refund_deposit` Rejected:**  
  `POST /rest/v1/rpc/refund_deposit` with `anon` key returned `HTTP 401: {"code":"42501", "message":"permission denied for function refund_deposit"}`.
- **[PASS] Gate 6 — Ordinary Customer `refund_deposit` Rejected:**  
  `POST /rest/v1/rpc/refund_deposit` with customer JWT returned `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
- **[PASS] Gate 7 — Anonymous `mark_delivery_paid_rpc` Rejected:**  
  `POST /rest/v1/rpc/mark_delivery_paid_rpc` with `anon` key returned `HTTP 401: {"code":"42501", "message":"permission denied for function mark_delivery_paid_rpc"}`.
- **[PASS] Gate 8 — Ordinary Customer `mark_delivery_paid_rpc` Rejected:**  
  `POST /rest/v1/rpc/mark_delivery_paid_rpc` with customer JWT returned `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
- **[PASS] Gate 9 — Anonymous `create_order` Rejected:**  
  `POST /rest/v1/rpc/create_order` with `anon` key returned `HTTP 404: PGRST202` (function inaccessible to `anon`).
- **[PASS] Gate 10 — Service Role `check_first_order_eligibility` Unblocked:**  
  `POST /rest/v1/rpc/check_first_order_eligibility` with `SUPABASE_SERVICE_ROLE_KEY` returned `HTTP 200: {"eligible":true, "reason":"new_customer", "normalized_email":"siddhanveg@gmail.com"}`.
- **[PASS] Gate 11 — Customer Identity Validation Enforced:**  
  - Customer calling with matching email returned `HTTP 200: {"eligible":true, ...}`.
  - Customer calling with mismatched email (`victim@example.com`) returned `HTTP 400: {"code":"P0001", "message":"unauthorized: email mismatch"}`.
- **[PASS] Gate 12 — Trusted Payment Confirmation Lifecycle:**  
  - Test order created and pending payment record inserted.
  - Call via `service_role` returned `HTTP 200: {"success":true, "order_id": "...", "payment_id": "..."}`.
  - Subsequent call returned `HTTP 200: {"success":true, "already_processed":true}` (strictly idempotent).
- **[PASS] Gate 13 — Invalid Payment Confirmation Handled Gracefully:**  
  Nonexistent payment order ID returned `HTTP 200: {"success":false, "error":"payment_not_found"}`.
- **[PASS] Gate 14 — Inventory Release Idempotency & Paid Protection:**  
  - Order created reserving 1 saree (initial stock: 48).
  - First `release_order_inventory` call: `items_released: 1` (stock: 48 -> 49).
  - Second `release_order_inventory` call: `already_released: true, items_released: 0` (stock: 49 -> 49, **zero duplicate stock creation**).
  - Attempted release on paid order returned: `{"success":false, "error":"order_already_paid_or_confirmed"}`.
- **[PASS] Gate 15 — Abandoned Checkout Recovery Function:**  
  `cleanup_expired_pending_orders(60)` executed via `service_role` returned `HTTP 200: {"success":true, "expired_orders_cleaned":2, "total_items_released":2}`.

---

## 5. Non-Interference Proof: Production Untouched

Read-only inspection of production project `kbvjmcnaaogkbnerjcoc` executed at 23:55:38 IST:

1. **Schema Migrations Check:**
   - Production latest migration: `20261025012500` (Safeguard create_order).
   - `20261026000000` is **NOT applied to production**.
2. **Product Catalogue Check:**
   - Total products: 3 (`kalyani1`: `draft`, `VIARA`: `draft`, `Dharmavaram`: `review`).
   - Published products exposed to public: **0**.
3. **Orders Table Check:**
   - Total orders: 3 (identical to pre-audit count).
   - Zero test orders, payments, or refunds created in production.
4. **Credential Security:**
   - Temporary credential tokens used during testing were deleted from disk.

---

## 6. Migration Diff & File References

- **Migration File:** [`supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql)
- **Unit Test Suite:** 83 / 83 Vitest tests passing (`npm test`).

---

## 7. Instructions for Production Rollout Review

When authorized by the repository owner, the production rollout can proceed using the following safe steps:

1. **Pre-Deployment Safety Check:**
   Verify production project reference is `kbvjmcnaaogkbnerjcoc`.
2. **Execute Transactional Migration:**
   Apply `supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql` inside a single transaction:
   ```sql
   BEGIN;
   -- Apply 20261026000000_harden_checkout_and_order_rpcs.sql
   INSERT INTO supabase_migrations.schema_migrations (version) VALUES ('20261026000000');
   COMMIT;
   ```
3. **Post-Deployment Verification:**
   Verify `confirm_paid_order` ACL has only `{postgres=X, service_role=X}` and `create_order` only has `{postgres=X, authenticated=X, service_role=X}`.
4. **Deploy Edge Functions:**
   Deploy updated Edge Functions (`create-razorpay-order`, `verify-payment`, `razorpay-webhook`) to production if any configuration updates are made.
5. **Proceed to Catalogue Remediation:**
   Upload authentic product assets, update specifications, and publish `kalyani1` and `VIARA`.

---
*Status: Staging verification complete. Stopping here per instructions. Awaiting owner authorization for production deployment.*
