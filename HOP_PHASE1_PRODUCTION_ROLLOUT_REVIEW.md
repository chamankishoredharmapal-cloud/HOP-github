# HOP — Phase 1 Production Rollout Readiness Review

**Target Migration:** [`supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql)  
**Production Supabase:** `kbvjmcnaaogkbnerjcoc` (Mumbai `ap-south-1`) — **READ ONLY**  
**Staging Supabase:** `dovnhgbisiturzbjgvei` (Mumbai `ap-south-1`)  
**Review Timestamp:** 2026-10-26 00:35:00 IST (2026-10-25 19:05:00 UTC)  
**Reviewer:** HOP Principal Security & Release Architecture  

---

## 1. Executive Verdict

### **VERDICT: READY WITH CONDITIONS**

The Phase 1 Security Hardening migration is verified to be backward-compatible, semantically sound, and mathematically safe. It completely closes the high-risk payment confirmation bypass and administrative RPC exposure without breaking any legitimate customer checkout or Edge Function call path.

### Deployment Conditions
1. **Pre-requisite Verification:** Production database must have [`20261025012500_safeguard_create_order_require_published_products.sql`](file:///E:/HOP/supabase/migrations/20261025012500_safeguard_create_order_require_published_products.sql) recorded as its latest migration (Confirmed verified: production is currently at `20261025012500`).
2. **Transaction Isolation:** Migration must be executed in a single atomic database transaction (`BEGIN ... COMMIT`) to ensure zero window of partial permission application.
3. **Abandoned-Order Scheduler Activation:** The newly introduced cleanup function `cleanup_expired_pending_orders` is defined in PostgreSQL, but requires a periodic trigger (e.g. `pg_cron` or Cloudflare Worker Cron) to become operational. Until scheduled, stock from abandoned checkouts must be cleaned up via manual RPC invocation or administrative dashboard.
4. **Owner Authorization:** In accordance with HOP deployment governance, this review concludes in a stop state. **No production modifications have been executed.** Production rollout requires explicit owner authorization.

---

## 2. Migration Metadata & Cryptographic Integrity

| Attribute | Value |
| :--- | :--- |
| **File Path** | [`supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql) |
| **File Size** | 21,399 bytes (657 lines) |
| **SHA-256 Checksum** | `78CFFF560DD4C524695093E6709F991D7BA1629D95636C646B873760B4DFC79D` |
| **Previous Migration** | `20261025012500_safeguard_create_order_require_published_products.sql` |
| **Target Database** | Supabase PostgreSQL 15 (`public` schema) |
| **Transaction Boundary** | Fully transactional DDL/DML (`CREATE OR REPLACE`, `REVOKE`, `GRANT`) |

---

## 3. Detailed Source Inspection & Security Analysis

### A. [`public.confirm_paid_order`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L48-L140)
- **Signature:** `confirm_paid_order(p_razorpay_order_id TEXT, p_razorpay_payment_id TEXT DEFAULT NULL, p_razorpay_signature TEXT DEFAULT NULL) RETURNS JSONB`
- **Execution Mode:** `SECURITY DEFINER` (Owner: `postgres`, `SET search_path = public`)
- **Caller Guard ([Lines 66–69](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L66-L69)):**
  ```sql
  IF auth.role() != 'service_role' THEN
    RAISE EXCEPTION 'Access denied. Service role required.'
      USING ERRCODE = '42501';
  END IF;
  ```
- **Privilege Grants ([Lines 138–139](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L138-L139)):**
  `REVOKE ALL ON FUNCTION public.confirm_paid_order FROM PUBLIC, anon, authenticated;`  
  `GRANT EXECUTE ON FUNCTION public.confirm_paid_order TO service_role;`
- **Analysis:**
  - **Legitimate Callers:** [`verify-payment`](file:///E:/HOP/supabase/functions/verify-payment/index.ts#L173) and [`razorpay-webhook`](file:///E:/HOP/supabase/functions/razorpay-webhook/index.ts#L158). Both invoke the function via `supabase` initialized with `SUPABASE_SERVICE_ROLE_KEY` after verifying cryptographic HMAC-SHA256 signatures.
  - **Attack Surface Eliminated:** Anonymous or authenticated users attempting to invoke `POST /rest/v1/rpc/confirm_paid_order` receive HTTP 401/403 (SQLSTATE `42501`). Unpaid orders can never be transitioned to `paid` or `confirmed` through direct PostgREST calls.
  - **Idempotency:** Lines 81–84 verify `IF v_payment_status = 'paid' THEN RETURN jsonb_build_object('success', true, 'already_processed', true, ...);`. Retries by webhook or frontend verification do not perform duplicate state updates or corrupt inventory logs.

---

### B. [`public.release_order_inventory`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L144-L246)
- **Signature:** `release_order_inventory(p_order_id UUID, p_reason TEXT DEFAULT 'release') RETURNS JSONB`
- **Execution Mode:** `SECURITY DEFINER` (Owner: `postgres`, `SET search_path = public`)
- **Caller Guard ([Lines 160–164](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L160-L164)):**
  ```sql
  IF auth.role() != 'service_role' AND NOT public.is_admin() THEN
    RAISE EXCEPTION 'Access denied. Administrator or service role privileges required.'
      USING ERRCODE = '42501';
  END IF;
  ```
- **Idempotency & State Validation ([Lines 166–194](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L166-L194)):**
  - Locks the target order row with `SELECT status, payment_status ... FOR UPDATE`.
  - **Zero Duplicate Release Guarantee:** If `orders.status = 'cancelled'`, returns `{ success: true, already_released: true, items_released: 0 }`. Products table is never updated on repeat calls.
  - **Paid Order Protection:** If `payment_status = 'paid'` or `status IN ('confirmed', 'shipped', 'delivered')`, the call aborts with `{ success: false, error: 'order_already_paid_or_confirmed' }`. Inventory for confirmed sales cannot be accidentally or maliciously released.
  - Upon release, atomically updates `orders.status = 'cancelled'`.
- **Privilege Grants ([Lines 244–245](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L244-L245)):**
  `REVOKE ALL ... FROM PUBLIC, anon;`  
  `GRANT EXECUTE ... TO authenticated, service_role;` (Non-admin authenticated callers blocked by line 161 check).

---

### C. [`public.refund_deposit`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L250-L367)
- **Signature:** `refund_deposit(p_order_id UUID) RETURNS JSONB`
- **Execution Mode:** `SECURITY DEFINER` (Owner: `postgres`, `SET search_path = public`)
- **Caller Guard ([Lines 268–272](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L268-L272)):**
  Enforces `auth.role() = 'service_role' OR public.is_admin()`.
- **State Validation:**
  - Verifies deposit payment exists with `status = 'paid'`.
  - Verifies `payment_status IN ('deposit_paid', 'partially_paid')`.
  - Disallows refund if `status = 'delivered'`.
  - Updates `payments.status = 'refunded'`, `orders.status = 'cancelled'`. Restores inventory and writes audit log to `inventory_history`.
- **Privilege Grants:** Revoked from `PUBLIC, anon`; granted to `authenticated, service_role`.

---

### D. [`public.mark_delivery_paid_rpc`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L371-L514)
- **Signature:** `mark_delivery_paid_rpc(p_order_id UUID, p_idempotency_key TEXT, p_payment_method TEXT DEFAULT 'cash_on_delivery', p_notes TEXT DEFAULT NULL) RETURNS JSONB`
- **Execution Mode:** `SECURITY DEFINER` (Owner: `postgres`, `SET search_path = public`)
- **Caller Guard ([Lines 393–397](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L393-L397)):**
  Enforces `auth.role() = 'service_role' OR public.is_admin()`.
- **Idempotency & Accounting Check:**
  - Checks deterministic `payment_events` record `mark_delivery_paid_{idempotency_key}`.
  - Verifies mathematical consistency: `paid_amount + remaining_amount == total_amount`.
  - Transitions order to `fully_paid` and `delivered`.

---

### E. [`public.check_first_order_eligibility`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L518-L594)
- **Signature:** `check_first_order_eligibility(p_customer_email TEXT, p_customer_phone TEXT) RETURNS JSONB`
- **Execution Mode:** `SECURITY DEFINER` (Owner: `postgres`, `SET search_path = public`)
- **Checkout Identity Resolution ([Lines 534–547](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L534-L547)):**
  ```sql
  IF auth.role() = 'service_role' THEN
    NULL; -- Trusted server-side Edge Function invocation
  ELSIF auth.role() = 'authenticated' THEN
    IF auth.email() IS NULL OR lower(trim(auth.email())) != lower(trim(p_customer_email)) THEN
      RAISE EXCEPTION 'unauthorized: email mismatch';
    END IF;
  ELSE
    RAISE EXCEPTION 'unauthorized: email mismatch';
  END IF;
  ```
- **Analysis:**
  - **Resolves Operational Blocker:** [`create-razorpay-order`](file:///E:/HOP/supabase/functions/create-razorpay-order/index.ts#L61-L78) validates customer authentication via user JWT, then calls `create_order` via `service_role`. The previous check aborted because service-role tokens have no email claim. Allowing `service_role` unblocks server checkout.
  - **Preserves Customer Email Verification:** Direct authenticated RPC calls by users cannot query eligibility for emails other than their own authenticated session email (`auth.email()`).
  - **Anonymous Defense:** Unauthenticated REST callers are strictly rejected with `unauthorized: email mismatch`.

---

### F. [`public.create_order`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L41-L43) & Grants ([Lines 598–605](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L598-L605))
- Drops lingering legacy 14-parameter overload if present:
  `DROP FUNCTION IF EXISTS public.create_order(text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb);`
- Retains canonical 16-parameter overload ([lines 24–41 of `20261025012500`](file:///E:/HOP/supabase/migrations/20261025012500_safeguard_create_order_require_published_products.sql#L24-L41)).
- `REVOKE EXECUTE ... FROM PUBLIC, anon;`  
  `GRANT EXECUTE ... TO authenticated, service_role;`
- Direct anonymous order creation via PostgREST is eliminated at the schema routing layer.

---

### G. [`public.cleanup_expired_pending_orders`](file:///E:/HOP/supabase/migrations/20261026000000_harden_checkout_and_order_rpcs.sql#L609-L657)
- **Signature:** `cleanup_expired_pending_orders(p_timeout_minutes INTEGER DEFAULT 30) RETURNS JSONB`
- **Execution Mode:** `SECURITY DEFINER` (Owner: `postgres`, `SET search_path = public`)
- **Caller Guard:** Restricts execution to `service_role` and `is_admin()`.
- **Query Precision:**
  ```sql
  SELECT o.id, o.order_number
  FROM orders o
  WHERE o.status = 'pending_payment'
    AND o.payment_status = 'pending'
    AND o.created_at < (now() - (p_timeout_minutes || ' minutes')::INTERVAL)
  ORDER BY o.created_at ASC
  FOR UPDATE SKIP LOCKED
  ```
- **Safety Properties:**
  - Targets **strictly** orders with `status = 'pending_payment'` and `payment_status = 'pending'`.
  - Never touches orders in `deposit_paid`, `partially_paid`, `paid`, `confirmed`, `shipped`, or `delivered`.
  - `FOR UPDATE SKIP LOCKED` avoids concurrency bottlenecks or table deadlocks.
  - Invokes `release_order_inventory(v_order.id, 'abandoned_checkout_timeout')`, ensuring stock restoration is logged and idempotent.

---

## 4. Production vs. Staging Environmental Comparison

Extracted directly via PostgreSQL catalog queries (`pg_proc`, `pg_roles`, `pg_namespace`, `supabase_migrations.schema_migrations`):

| Comparison Dimension | Staging (`dovnhgbisiturzbjgvei`) | Production (`kbvjmcnaaogkbnerjcoc`) | Impact on Production Rollout |
| :--- | :--- | :--- | :--- |
| **Applied Migrations** | 43 migrations (includes `20261025012500` & `20261026000000`) | 42 migrations (latest is `20261025012500`) | **Exact prerequisite match.** Migration `20261026000000` is next in sequence. |
| **`confirm_paid_order` ACL** | `{postgres=X, service_role=X}` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | Production currently has identical vulnerability. Will be hardened to match staging. |
| **`release_order_inventory` ACL** | `{postgres=X, authenticated=X, service_role=X}` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | Production currently exposed to public. Will be hardened to match staging. |
| **`refund_deposit` ACL** | `{postgres=X, authenticated=X, service_role=X}` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | Production currently exposed to public. Will be hardened to match staging. |
| **`mark_delivery_paid_rpc` ACL** | `{postgres=X, authenticated=X, service_role=X}` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | Production currently exposed to public. Will be hardened to match staging. |
| **`check_first_order_eligibility` ACL** | `{postgres=X, authenticated=X, service_role=X}` | `{=X, postgres=X, anon=X, authenticated=X, service_role=X}` | Production currently fails service-role checkouts. Migration unblocks it. |
| **`create_order` Overloads** | 1 overload (16-param OID 18595; 14-param OID 18080 was dropped) | 1 overload (16-param OID 42305; 14-param does not exist) | `DROP FUNCTION IF EXISTS ... (14 params)` is safe no-op on production. |
| **`create_order` ACL** | `{postgres=X, authenticated=X, service_role=X}` | `{postgres=X, anon=X, authenticated=X, service_role=X}` | Migration strips `anon` on production. |
| **`cleanup_expired_pending_orders`** | Deployed (OID 33727) | Does not exist | Migration safely introduces function without side effects. |
| **Table Schemas (`orders`, `payments`, etc.)** | Identical columns, types, constraints, and triggers | Identical columns, types, constraints, and triggers | Schema compatibility verified 100%. |

---

## 5. Verification of Test Evidence

### A. 15-Gate Staging Suite (`scratch/staging_test_results.json`)

All 15 verification gates passed against live staging environment `https://dovnhgbisiturzbjgvei.supabase.co`:

```
=================================================================
TOTAL GATES: 15 | PASSED: 15 | FAILED: 0 | 100% SUCCESS
=================================================================
```

1. **Gate 1 (Anon `confirm_paid_order`):** `HTTP 401: {"code":"42501", "message":"permission denied for function confirm_paid_order"}`.
2. **Gate 2 (Customer `confirm_paid_order`):** `HTTP 403: {"code":"42501", "message":"permission denied for function confirm_paid_order"}`.
3. **Gate 3 (Anon `release_order_inventory`):** `HTTP 401: {"code":"42501", "message":"permission denied for function release_order_inventory"}`.
4. **Gate 4 (Customer `release_order_inventory`):** `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
5. **Gate 5 (Anon `refund_deposit`):** `HTTP 401: {"code":"42501", "message":"permission denied for function refund_deposit"}`.
6. **Gate 6 (Customer `refund_deposit`):** `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
7. **Gate 7 (Anon `mark_delivery_paid_rpc`):** `HTTP 401: {"code":"42501", "message":"permission denied for function mark_delivery_paid_rpc"}`.
8. **Gate 8 (Customer `mark_delivery_paid_rpc`):** `HTTP 403: {"code":"42501", "message":"Access denied. Administrator or service role privileges required."}`.
9. **Gate 9 (Anon `create_order`):** `HTTP 404: {"code":"PGRST202", "message":"Could not find the function public.create_order(...) in the schema cache"}`.
10. **Gate 10 (Service-role `check_first_order_eligibility`):** `HTTP 200: {"eligible":true, "reason":"new_customer", "normalized_email":"siddhanveg@gmail.com"}`.
11. **Gate 11 (Customer email matching):** Match returned `HTTP 200`; mismatch returned `HTTP 400: {"code":"P0001", "message":"unauthorized: email mismatch"}`.
12. **Gate 12 (Trusted payment confirmation lifecycle):** Initial confirmation succeeded (`HTTP 200`); second invocation returned `already_processed: true`.
13. **Gate 13 (Invalid payment confirmation):** Nonexistent order returned `HTTP 200: {"success":false, "error":"payment_not_found"}`.
14. **Gate 14 (Inventory idempotency & paid protection):** Initial release incremented stock (48 → 49); second release returned `already_released: true` (stock remained 49); release on paid order returned `order_already_paid_or_confirmed`.
15. **Gate 15 (Abandoned checkout recovery):** `cleanup_expired_pending_orders(60)` cleaned 2 stale test orders and restored 2 stock units.

### B. Unit & Integration Test Suite (`npm test`)

- **Total Test Files:** 9 passed (9 total)
- **Total Tests:** 83 passed (83 total)
- **Coverage:** `siteSectionValidation`, `cinematicHeroSlider`, `editorialResilience`, `CustomerAuthCheckout`, `videoAspectRatioValidation`, `homepageVideoSection`, `supabaseImage`, `mediaCatalog`, `formatPrice`.

---

## 6. Operational Risk Assessment

| Risk Vector | Likelihood | Impact | Mitigation in Migration |
| :--- | :---: | :---: | :--- |
| **Breaking Existing Callers** | None | High | Zero legitimate client calls use the revoked permissions. All server-side flows use `service_role` and were verified intact. |
| **Race Conditions during Checkout** | Negligible | Medium | Row-level locks (`FOR UPDATE` on payments/orders, `FOR SHARE` on products) prevent concurrent update anomalies. |
| **Premature Inventory Release of Slow Checkouts** | Very Low | Medium | Cleanup window defaults to 30 minutes (`p_timeout_minutes = 30`). Razorpay standard payment modal expires in 15–20 minutes. |
| **Accidental Inventory Release for Paid Orders** | Zero | High | Hardcoded condition in `release_order_inventory`: checks `payment_status = 'paid'` or `status IN ('confirmed', 'shipped', 'delivered')` and aborts. |
| **Deadlock on Batch Cleanup** | Very Low | Low | `cleanup_expired_pending_orders` specifies `FOR UPDATE SKIP LOCKED`, avoiding contention with active orders. |

---

## 7. Operational Scheduling of Abandoned-Order Cleanup

Function `cleanup_expired_pending_orders(p_timeout_minutes integer DEFAULT 30)` is a database function. To make it execute on an automated recurring schedule, one of the following two mechanisms must be activated:

### Option A: Supabase `pg_cron` (Recommended if enabled on project)
Run in Supabase SQL Editor on production:
```sql
-- Run every 15 minutes to release reservations older than 30 minutes
SELECT cron.schedule(
  'cleanup_abandoned_checkouts',
  '*/15 * * * *',
  $$SELECT public.cleanup_expired_pending_orders(30);$$
);
```

### Option B: Cloudflare Workers Cron Trigger or GitHub Actions
Deploy a lightweight Cloudflare Worker or Edge Function invoked via cron trigger every 15 minutes:
```bash
curl -X POST https://kbvjmcnaaogkbnerjcoc.supabase.co/rest/v1/rpc/cleanup_expired_pending_orders \
  -H "apikey: <SERVICE_ROLE_KEY>" \
  -H "Authorization: Bearer <SERVICE_ROLE_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"p_timeout_minutes": 30}'
```

Until scheduled, the function remains safe and inert, ready to be called manually by administrators whenever needed.

---

## 8. Rollout Plan & Execution Checklist

### Phase 1: Preflight Verification
- [ ] Confirm Git HEAD is on `release/v1.1-launch-candidate`.
- [ ] Verify production project reference is `kbvjmcnaaogkbnerjcoc`.
- [ ] Verify latest production migration is `20261025012500`.
- [ ] Verify zero active orders in `pending_payment` status at time of execution:
  ```sql
  SELECT count(*) FROM public.orders WHERE status = 'pending_payment';
  ```

### Phase 2: Transactional Execution
Execute in a single transaction via the Supabase Management API or authenticated SQL Editor:
```sql
BEGIN;

-- 1. Drop legacy overloads (safe no-op on production)
DROP FUNCTION IF EXISTS public.create_order(
  text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb
);

-- 2. Apply confirm_paid_order definition & grants
-- [Lines 48–140 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 3. Apply release_order_inventory definition & grants
-- [Lines 144–246 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 4. Apply refund_deposit definition & grants
-- [Lines 250–367 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 5. Apply mark_delivery_paid_rpc definition & grants
-- [Lines 371–514 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 6. Apply check_first_order_eligibility definition & grants
-- [Lines 518–594 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 7. Apply create_order privileges
-- [Lines 598–605 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 8. Apply cleanup_expired_pending_orders definition & grants
-- [Lines 609–657 of 20261026000000_harden_checkout_and_order_rpcs.sql]

-- 9. Record migration version
INSERT INTO supabase_migrations.schema_migrations (version)
VALUES ('20261026000000')
ON CONFLICT (version) DO NOTHING;

COMMIT;
```

### Phase 3: Post-Deployment Verification
- [ ] Verify `confirm_paid_order` ACL has strictly `{postgres=X, service_role=X}`.
- [ ] Verify `create_order` ACL has strictly `{postgres=X, authenticated=X, service_role=X}`.
- [ ] Verify anonymous REST call to `POST /rest/v1/rpc/confirm_paid_order` returns `HTTP 401`.
- [ ] Verify anonymous REST call to `POST /rest/v1/rpc/create_order` returns `HTTP 404`.
- [ ] Verify `schema_migrations` contains `20261026000000`.

### Phase 4: Rollback Criteria & Script
If any post-deployment check fails or an Edge Function reports authorization errors, execute the immediate rollback script inside a transaction:

```sql
BEGIN;

-- Restore pre-hardening ACLs
GRANT EXECUTE ON FUNCTION public.confirm_paid_order(text, text, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.release_order_inventory(uuid, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.refund_deposit(uuid) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.mark_delivery_paid_rpc(uuid, text, text, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_first_order_eligibility(text, text) TO authenticated, anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_order(text, text, text, text, text, text, text, text, text, text, text, text, text, jsonb, integer, text) TO anon, PUBLIC;

-- Drop new cleanup function
DROP FUNCTION IF EXISTS public.cleanup_expired_pending_orders(integer);

-- Remove migration record
DELETE FROM supabase_migrations.schema_migrations WHERE version = '20261026000000';

COMMIT;
```

---

## 9. Remaining Unverified Items

1. **Live Gateway Webhook Delivery:** Actual signature validation with Razorpay live servers cannot be tested without deploying live keys and initiating a live ₹1.00 transaction.
2. **Extreme Concurrent Load:** PostgreSQL row lock behavior under thousands of concurrent simultaneous requests for the same product was verified through SQL semantics (`FOR SHARE` and `FOR UPDATE`), not a live production load-test harness.

---

## 10. Non-Interference Statement

We confirm that throughout this review:
- **Zero** database records were modified or deleted in production `kbvjmcnaaogkbnerjcoc`.
- **Zero** migrations were executed against production.
- **Zero** orders, inventory movements, or payments were initiated in production.
- Production Supabase project `kbvjmcnaaogkbnerjcoc` remains **100% untouched and pristine**.

---
*Report preserved in repository root: [`HOP_PHASE1_PRODUCTION_ROLLOUT_REVIEW.md`](file:///E:/HOP/HOP_PHASE1_PRODUCTION_ROLLOUT_REVIEW.md).*
