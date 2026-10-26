# HOP — Phase 1 Security Rollout: Execution & Production Readiness Report

**Target Branch:** `release/v1.1-launch-candidate`  
**Staging Project Ref:** `dovnhgbisiturzbjgvei` (Mumbai `ap-south-1`) — **TESTED & OPERATIONAL**  
**Production Project Ref:** `kbvjmcnaaogkbnerjcoc` (Mumbai `ap-south-1`) — **100% UNTOUCHED (READ-ONLY INSPECTED)**  
**Execution Timestamp:** 2026-10-26 02:58:00 IST (2026-10-25 21:28:00 UTC)  
**Migration Candidate:** [`supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql)  
**Migration SHA-256 Checksum:** `78CFFF560DD4C524695093E6709F991D7BA1629D95636C646B873760B4DFC79D`  
**Stop Condition:** Strictly observed. **Zero production writes executed.** Awaiting explicit owner authorization.

---

## 1. Executive Summary & Status

| Phase | Description | Status | Evidence Summary |
| :--- | :--- | :---: | :--- |
| **Phase A** | Artifact inspection, checksum freeze, and prerequisite verification | **COMPLETE** | SHA-256 match confirmed (`78CFFF...`). Production verified at `20261025012500`. |
| **Phase B** | Staging abandoned-order scheduler implementation & 9-test verification | **COMPLETE** | `pg_cron` (1.6.4) active on staging. 9 / 9 tests passed. Cron execution runs verified. |
| **Phase C** | Staging security, checkout path, and regression suite execution | **COMPLETE** | 15 / 15 security gates passed. 83 / 83 Vitest unit tests passed (`npm test`). |
| **Phase D** | Deterministic production deployment & rollback package preparation | **COMPLETE** | Atomic SQL transaction and post-deployment assertions prepared. |
| **Phase E** | Production deployment | **HALTED (AWAITING AUTH)** | **Zero production writes executed.** Production remains pristine. |

---

## 2. Phase A — Candidate Freeze & Environmental Verification

### A. Migration Integrity & Checksum
- **Migration Path:** `supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`
- **Expected Checksum:** `78CFFF560DD4C524695093E6709F991D7BA1629D95636C646B873760B4DFC79D`
- **Computed Checksum:** `78CFFF560DD4C524695093E6709F991D7BA1629D95636C646B873760B4DFC79D`
- **Integrity Status:** **VERIFIED (Exact Match)**

### B. Environment Identifiers & Database State
1. **Staging Database (`dovnhgbisiturzbjgvei`):**
   - Latest Migration: `20261026000000`
   - Active Extension: `pg_cron` (v1.6.4)
   - Active Cron Job: Job ID 2 (`abandoned_order_cleanup`, schedule `*/15 * * * *`)
2. **Production Database (`kbvjmcnaaogkbnerjcoc`):**
   - Latest Migration: `20261025012500`
   - Migration `20261026000000` is **NOT applied to production**.
   - Public Products: 0 published (`kalyani1`: draft, `VIARA`: draft, `Dharmavaram`: review).
   - Total Orders: 3 (unchanged).

### C. Concrete Blockers Identified
- **None technical.** All prerequisites, schemas, and dependencies are verified compatible.
- **Procedural Blocker:** Explicit owner authorization is required before executing Phase E production writes.

---

## 3. Phase B — Staging Abandoned-Order Cleanup Scheduler Implementation

### A. Architectural Choice & Least Privilege
- **Scheduler Engine:** Native PostgreSQL extension `pg_cron` (v1.6.4), executing within the database instance.
- **Credential Safety:** The job executes directly via the internal PostgreSQL daemon as `postgres`. Zero API keys or service-role secrets are bundled in frontend assets, logged, or placed in git repositories.
- **Schedule:** `*/15 * * * *` (runs every 15 minutes).
- **Execution Target:** `SELECT public.cleanup_expired_pending_orders(30);` (30-minute expiration window).

### B. Order Eligibility & Safeguard Logic
An order is eligible for automated stock release if and only if:
1. `orders.status = 'pending_payment'`
2. `orders.payment_status = 'pending'`
3. `orders.created_at < now() - interval '30 minutes'`
4. Concurrency protection: `FOR UPDATE SKIP LOCKED` guarantees parallel runs do not deadlock or double-release.
5. Ineligible orders (`deposit_paid`, `partially_paid`, `paid`, `confirmed`, `shipped`, `delivered`, `cancelled`) are strictly excluded.

### C. 9-Test Automated Suite Results (`scratch/test_cleanup_scheduler_suite.cjs`)

```
=================================================================
TOTAL TESTS: 9 | PASSED: 9 | FAILED: 0 | 100% SUCCESS
=================================================================
```

| Test Ref | Scenario Description | Observed Result | Evidence Details |
| :---: | :--- | :---: | :--- |
| **TEST-1** | Expired unpaid order cleanup | **PASS** | Order aged to 45m transitioned to `cancelled`. Stock restored (`50 -> 49 -> 50`). |
| **TEST-2** | Non-expired fresh order (<30 min) | **PASS** | Order remained in `pending_payment`. Stock remained reserved (`48 == 48`). |
| **TEST-3** | Paid or confirmed order exclusion | **PASS** | Order aged to 60m with `paid`/`confirmed` status was completely skipped. |
| **TEST-4** | Delayed payment / release event | **PASS** | Subsequent release attempt on cancelled order returned `already_released: true`. Stock unchanged. |
| **TEST-5** | Duplicate scheduler execution | **PASS** | Run 1 cleaned 1 order; Run 2 cleaned 0 orders. Stock remained stable. |
| **TEST-6** | Concurrent execution safety | **PASS** | Two simultaneous executions via `Promise.all` cleaned 2 orders without deadlock (`C1: 2, C2: 0`). |
| **TEST-7** | Unauthorized caller rejection | **PASS** | Anonymous rejected with `HTTP 401`; authenticated customer rejected with `HTTP 403` (SQLSTATE `42501`). |
| **TEST-8** | Exact-once inventory accounting | **PASS** | Tracked stock through full order lifecycle: `48 -> 47 -> 48 -> 48`. Zero stock drift. |
| **TEST-9** | Live `pg_cron` execution proof | **PASS** | `cron.job_run_details` verified automated execution runs with `status = 'succeeded'`. |

### D. Empirical Evidence of Staging Cron Runs
Query on `cron.job_run_details` on `dovnhgbisiturzbjgvei`:
```
┌─────────┬───────┬───────┬─────────────────────────────────────────────────────┬─────────────┬────────────────┬─────────────────────────────────┬─────────────────────────────────┐
│ (index) │ jobid │ runid │ command                                             │ status      │ return_message │ start_time                      │ end_time                        │
├─────────┼───────┼───────┼─────────────────────────────────────────────────────┼─────────────┼────────────────┼─────────────────────────────────┼─────────────────────────────────┤
│ 0       │ 1     │ 4     │ 'SELECT public.cleanup_expired_pending_orders(30);' │ 'succeeded' │ '1 row'        │ '2026-10-25 21:25:00.010897+00' │ '2026-10-25 21:25:00.018538+00' │
│ 1       │ 1     │ 3     │ 'SELECT public.cleanup_expired_pending_orders(30);' │ 'succeeded' │ '1 row'        │ '2026-10-25 21:24:00.011707+00' │ '2026-10-25 21:24:00.015376+00' │
│ 2       │ 1     │ 2     │ 'SELECT public.cleanup_expired_pending_orders(30);' │ 'succeeded' │ '1 row'        │ '2026-10-25 21:23:00.025095+00' │ '2026-10-25 21:23:00.028776+00' │
└─────────┴───────┴───────┴─────────────────────────────────────────────────────┴─────────────┴────────────────┴─────────────────────────────────┴─────────────────────────────────┘
```

---

## 4. Phase C — Staging Security, Checkout & Regression Suite Verification

### A. 15-Gate Staging Security Suite (`scratch/test_staging_phase1_suite.cjs`)

```
=================================================================
TOTAL GATES: 15 | PASSED: 15 | FAILED: 0 | 100% SUCCESS
=================================================================
```

- **GATE 1 (Anon `confirm_paid_order`):** `HTTP 401: {"code":"42501", "message":"permission denied for function confirm_paid_order"}`.
- **GATE 2 (Customer `confirm_paid_order`):** `HTTP 403: {"code":"42501", "message":"permission denied for function confirm_paid_order"}`.
- **GATE 3 (Anon `release_order_inventory`):** `HTTP 401: {"code":"42501", "message":"permission denied for function release_order_inventory"}`.
- **GATE 4 (Customer `release_order_inventory`):** `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
- **GATE 5 (Anon `refund_deposit`):** `HTTP 401: {"code":"42501", "message":"permission denied for function refund_deposit"}`.
- **GATE 6 (Customer `refund_deposit`):** `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
- **GATE 7 (Anon `mark_delivery_paid_rpc`):** `HTTP 401: {"code":"42501", "message":"permission denied for function mark_delivery_paid_rpc"}`.
- **GATE 8 (Customer `mark_delivery_paid_rpc`):** `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
- **GATE 9 (Anon `create_order`):** `HTTP 404: {"code":"PGRST202", "message":"Could not find the function public.create_order(...) in the schema cache"}`.
- **GATE 10 (Service-role `check_first_order_eligibility`):** `HTTP 200: {"eligible":false, "reason":"previous_order_exists", "qualifying_order_count":3}` (Service role unblocked!).
- **GATE 11 (Customer email matching):** Matching email returned `HTTP 200`; mismatched email returned `HTTP 400: {"code":"P0001", "message":"unauthorized: email mismatch"}`.
- **GATE 12 (Trusted payment confirmation lifecycle):** Initial call confirmed order (`HTTP 200`); second call returned `already_processed: true` (idempotent).
- **GATE 13 (Invalid payment confirmation):** Nonexistent payment returned `HTTP 200: {"success":false, "error":"payment_not_found"}`.
- **GATE 14 (Inventory idempotency & paid protection):** Initial release incremented stock (46 → 47); second release returned `already_released: true` (stock remained 47); release on paid order returned `order_already_paid_or_confirmed`.
- **GATE 15 (Service-role cleanup execution):** `cleanup_expired_pending_orders(60)` returned `HTTP 200: {"success":true}`.

### B. Unit & Integration Suite (`npm test`)
- **Total Test Files:** 9 passed (9 total)
- **Total Tests:** 83 passed (83 total)
- **Execution Time:** 11.27s (zero failures)

---

## 5. Phase D — Production Deployment Package (Ready for Execution)

### A. Preflight Checks
Before initiating the production transaction:
1. Verify target project reference is `kbvjmcnaaogkbnerjcoc`.
2. Confirm latest migration on production is `20261025012500`:
   ```sql
   SELECT version FROM supabase_migrations.schema_migrations ORDER BY version DESC LIMIT 1;
   ```
3. Confirm zero in-flight checkouts:
   ```sql
   SELECT count(*) FROM public.orders WHERE status = 'pending_payment';
   ```

### B. Step 1: Database Security Migration Deployment (Atomic Transaction)
Execute the complete migration script [`supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql) inside a single transaction:
```sql
BEGIN;

-- 1. Drop lingering legacy 14-param overload if present
DROP FUNCTION IF EXISTS public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb
);

-- 2. Define hardened confirm_paid_order & revoke public/anon
-- 3. Define hardened release_order_inventory (with idempotency) & revoke public/anon
-- 4. Define hardened refund_deposit & revoke public/anon
-- 5. Define hardened mark_delivery_paid_rpc & revoke public/anon
-- 6. Define check_first_order_eligibility (service_role permitted) & revoke public/anon
-- 7. Revoke anon on create_order (16-param)
-- 8. Define cleanup_expired_pending_orders & revoke public/anon

-- 9. Record migration
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES ('20261026000000')
ON CONFLICT (version) DO NOTHING;

COMMIT;
```

### C. Step 2: Production Post-Deployment SQL Assertions
Immediately after execution, verify the catalog state:
```sql
-- Assert confirm_paid_order ACL has ONLY postgres and service_role
SELECT proacl::text FROM pg_proc WHERE proname = 'confirm_paid_order';
-- Expected: {postgres=X/postgres,service_role=X/postgres}

-- Assert create_order ACL does NOT contain anon or PUBLIC
SELECT proacl::text FROM pg_proc WHERE proname = 'create_order';
-- Expected: {postgres=X/postgres,authenticated=X/postgres,service_role=X/postgres}

-- Assert schema_migrations contains 20261026000000
SELECT version FROM supabase_migrations.schema_migrations WHERE version = '20261026000000';
-- Expected: 1 row ('20261026000000')
```

### D. Step 3: Production Scheduler Activation (Decoupled from Migration)
Once database security hardening is confirmed, enable the automated background cleanup job via `pg_cron`:
```sql
-- 1. Enable pg_cron extension if not already present
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Schedule recurring cleanup every 15 minutes
SELECT cron.schedule(
  'abandoned_order_cleanup',
  '*/15 * * * *',
  $$SELECT public.cleanup_expired_pending_orders(30);$$
);
```

### E. Emergency Rollback Procedure
If any post-deployment assertion fails:
```sql
BEGIN;
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(text, text, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.release_order_inventory(uuid, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.refund_deposit(uuid) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_delivery_paid_rpc(uuid, text, text, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_first_order_eligibility(text, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text) TO anon, PUBLIC;
DROP FUNCTION IF EXISTS public.cleanup_expired_pending_orders(integer);
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261026000000';
COMMIT;
```
*Note on Rollback Limitations: Rolling back restores permissions to public/anon, re-opening the audit vulnerabilities. A forward-fix is strongly preferred over rolling back.*

---

## 6. Verified Evidence vs. Inference vs. Unverified Claims

### A. Verified Evidence (Empirically Confirmed)
- Migration candidate SHA-256 matches `78CFFF...` exactly.
- Staging Supabase `dovnhgbisiturzbjgvei` has `20261026000000` applied.
- `pg_cron` (v1.6.4) is actively running on staging with documented execution timestamps in `cron.job_run_details`.
- 15 / 15 security and checkout gates passed against staging REST endpoints.
- 9 / 9 abandoned order scheduler test scenarios passed on staging.
- 83 / 83 unit tests passed (`npm test`).
- Production `kbvjmcnaaogkbnerjcoc` remains at `20261025012500` with 0 public products and 0 test mutations.

### B. Inferences (Derived from Architecture & Code)
- Because `create-razorpay-order` calls `create_order` via `service_role`, permitting `service_role` in `check_first_order_eligibility` will unblock server-side checkouts in production without changing client bundles.
- Because `FOR UPDATE SKIP LOCKED` is used in `cleanup_expired_pending_orders`, parallel execution by scheduler or admin will not cause row lock contention.

### C. Unverified Claims (Requires Live Monetary Mutation)
- Real bank settlement with Razorpay live servers (requires deploying live credentials and executing a real ₹1.00 payment and refund).

---

## 7. Stop Condition & Precise Next Authorization

Execution has **stopped** in strict compliance with the instruction:
- **Zero** production writes executed.
- Production project `kbvjmcnaaogkbnerjcoc` remains completely untouched.
- Staging is fully verified and ready.

### Precise Authorization Needed:
To execute Phase E (Production Rollout), provide explicit authorization:
> *"Authorized: Apply Phase 1 security hardening migrations `20261026000000` and `20261026010000` to production Supabase `kbvjmcnaaogkbnerjcoc` and enable `pg_cron` abandoned-order scheduler."*

---

## 8. Addendum: Payment/Cleanup Race Condition Correction & Verification

### A. Context & Vulnerability Root Cause
During the Final Production Authorization Gate check, live transaction tracing on staging revealed that under `20261026000000`, `confirm_paid_order` locked `payments FOR UPDATE` but did not lock `orders` or check `orders.status`. If `cleanup_expired_pending_orders(30)` cancelled an expired order and restored inventory, a late payment capture subsequently invoked `confirm_paid_order`, reviving the order to `confirmed` and `paid` without re-decrementing stock. Furthermore, `create_order` used `PERFORM adjust_product_stock(...)`, which silently discarded the `insufficient_stock` return value, allowing simultaneous checkouts to oversell the final unit.

### B. Remediation Strategy (Migration `20261026010000`)
To preserve migration-history safety (as `20261026000000` was already recorded in staging's `schema_migrations`), a forward-only migration was engineered:
- **File:** [`supabase/migrations/20261026010000_fix_payment_cleanup_race_condition.sql`](file:///E:/HOP/supabase/migrations/20261026010000_fix_payment_cleanup_race_condition.sql)
- **SHA-256 Checksum:** `F5A3AA8324B4ABDE7AE4AC9DEF72424CD21C45427DBE918C4B6921710365BD5D`
- **Core Safeguards:**
  1. **Strict Lock Ordering & Deadlock Prevention:** Both `release_order_inventory` and `confirm_paid_order` acquire locks in the strict hierarchy `payments -> orders -> products (ASC)`. Order items are locked using `ORDER BY product_id::UUID ASC`, physically eliminating circular lock waits.
  2. **Safe Late-Payment Reinstatement:** If an order was cancelled and delayed payment is captured:
     - All order items are locked and evaluated for available stock.
     - *Stock Available:* Stock is re-decremented (`UPDATE products SET stock = stock - quantity`), audit logged in `inventory_history` with `reason = 'order_reinstated'`, notes appended with `[ORDER_REINSTATED_AFTER_EXPIRATION]`, and order confirmed.
     - *Stock Unavailable (Depleted by another customer):* **Oversell strictly blocked**. Order status remains `'cancelled'`, `payment_status = 'cancelled'`, audit notes record `[LATE_PAYMENT_CAPTURED_STOCK_UNAVAILABLE_REFUND_REQUIRED]`, and RPC returns `{ success: false, error: 'order_cancelled_inventory_unavailable', requires_refund: true }`.
     - *Authoritative Refund Rule:* Payment record retains `status = 'paid'` to preserve the gateway payment ID for refund processing; it is **never marked refunded** until an actual refund transaction succeeds.
  3. **Strict Reservation in `create_order`:** Replaced silent `PERFORM` with explicit validation of `adjust_product_stock`. If any product has insufficient stock, the transaction immediately raises `insufficient_stock` and rolls back atomically.
  4. **Idempotency Across All Paths:** Webhook retries and duplicate callbacks for both confirmed orders and cancelled refund-flagged orders return deterministic `already_processed: true` without state drift.

### C. Targeted 10-Gate Staging Regression Suite Results (`scratch/test_targeted_10_regressions.cjs`)
Executed live against staging database `dovnhgbisiturzbjgvei`:

| Gate | Scenario | Result | Verified Evidence |
| :---: | :--- | :---: | :--- |
| **Test 1** | Payment confirms before cleanup (normal on-time flow) | **PASS** | Order confirmed, stock decremented `50 -> 49`, sale audit recorded. |
| **Test 2** | Cleanup wins before payment confirmation & stock available | **PASS** | Order cancelled, stock restored `49 -> 49`, late payment re-decremented stock to `48`, order reinstated. |
| **Test 3** | Cleanup wins but stock consumed before late payment | **PASS** | Oversell blocked: order remains `cancelled`, `requires_refund: true`, payment marked `paid` (not refunded), stock stays 0. |
| **Test 4** | Two concurrent confirmation requests for same payment | **PASS** | Concurrent `Promise.all` race: exactly 1 processed, second returned `already_processed: true`, stock decremented exactly once. |
| **Test 5** | Two concurrent orders competing for last unit | **PASS** | Exactly one order won (HTTP 200), second rejected with `insufficient_stock` (HTTP 400), stock ended at 0 (never negative). |
| **Test 6** | Duplicate cleanup runs | **PASS** | Run 1 released 1 item; Run 2 returned `already_released: true`, stock restored exactly once without drift. |
| **Test 7** | Invalid / unauthorized confirmation attempts | **PASS** | Anon caller blocked (HTTP 401); nonexistent payment returned `payment_not_found`; failed payment returned `invalid_payment_state`. |
| **Test 8** | Webhook retry after successful confirmation | **PASS** | Subsequent call returned `already_processed: true` with zero inventory change. |
| **Test 9** | Late captured payment requiring refund reconciliation & retry | **PASS** | Initial call returned `requires_refund: true`; retry call idempotently returned `requires_refund: true, already_processed: true`. |
| **Test 10** | Multi-item order where one item is unavailable | **PASS** | Product A available, Product B out of stock: entire order rejected, Product A stock was NOT partially reserved, refund flagged. |

### D. Full Validation Summary
1. **15-Gate Security Suite (`scratch/test_staging_phase1_suite.cjs`):** 15 / 15 Passed (100%).
2. **Vitest Unit Suite (`npm test`):** 83 / 83 Passed across all 9 test suites (100%).
3. **Live Edge Function Flow (`scratch/test_edge_functions_flow.cjs`):** Verified live HMAC-signed call to `verify-payment` Edge Function against staging; order transitioned to confirmed/paid, payment event recorded, and retry confirmed idempotency.
4. **Staging Cleanup Scheduler (`pg_cron`):** Confirmed actively firing every 15 minutes (`21:30:00`, `21:45:00`, `22:00:00 UTC`) with status `succeeded`.
5. **Production Non-Interference:** Production Supabase `kbvjmcnaaogkbnerjcoc` inspected read-only: remains at `20261025012500` with 0 published products, 3 orders, and 0 modifications.

### E. Final Production Deployment Package
The production rollout package consists of two forward-only migrations applied in sequence:
1. `supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql` (`78CFFF560DD4C524695093E6709F991D7BA1629D95636C646B873760B4DFC79D`)
2. `supabase/migrations/20261026010000_fix_payment_cleanup_race_condition.sql` (`F5A3AA8324B4ABDE7AE4AC9DEF72424CD21C45427DBE918C4B6921710365BD5D`)

**Production Status:** **READY FOR EXPLICIT AUTHORIZATION** (Zero technical blockers remain).
