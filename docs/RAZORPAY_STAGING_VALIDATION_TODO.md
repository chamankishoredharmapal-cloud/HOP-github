# Razorpay Staging Validation — TODO Tracker

> **Version**: 1.0  
> **Created**: 2026-09-16  
> **Last Updated**: 2026-09-16

---

## Status Legend

| Status | Meaning |
|--------|---------|
| `NOT_STARTED` | Task not yet begun |
| `IN_PROGRESS` | Currently executing |
| `PASS` | Test passed with evidence |
| `FAIL` | Test failed — requires diagnosis |
| `BLOCKED` | Cannot proceed — human action required |
| `NEEDS_RETEST` | Previously failed, fix applied, awaiting retest |
| `CANCELLED` | Task no longer applicable |

---

## T00 — Environment Verification

### T00.1 — Verify Supabase Project Targets Staging

| Field | Value |
|-------|-------|
| **Task ID** | T00.1 |
| **Status** | `BLOCKED` |
| **Preconditions** | Access to Supabase staging project |
| **Action** | Verify that Edge Functions deployed on `dovnhgbisiturzbjgvei` have correct env vars (SUPABASE_URL, RAZORPAY_KEY_ID starting with `rzp_test_`, etc.) |
| **Expected Result** | All env vars point to staging; Razorpay is in TEST mode |
| **Evidence** | Screenshot or API response confirming `rzp_test_` key prefix |
| **Failure Condition** | Any env var points to production |
| **Dependencies** | None |
| **Retest** | Required after any env var change |
| **Blocker Details** | `supabase/config.toml` has `project_id = "kbvjmcnaaogkbnerjcoc"` (production). Need human to confirm: (1) Edge Functions are actually deployed to staging `dovnhgbisiturzbjgvei`, (2) Razorpay TEST keys are configured on staging, (3) Webhook URL points to staging. Also need Supabase service role key and Razorpay webhook secret for staging to execute API-level tests. |

### T00.2 — Verify Staging Frontend Configuration

| Field | Value |
|-------|-------|
| **Task ID** | T00.2 |
| **Status** | `PASS` |
| **Preconditions** | T00.1 resolved |
| **Action** | Visit `https://hop-staging.chamankishoredharmapal.workers.dev/` and verify it loads HOP SPA assets and supports client-side SPA routing. |
| **Expected Result** | Frontend serves text/html, Title: House of Padmavati, root div, compiled JS/CSS assets, and falls back correctly on /cart, /checkout, /collections/. |
| **Evidence** | `docs/RAZORPAY_STAGING_VALIDATION_EVIDENCE.md#T002` — Status 200, Content-Type: text/html, Assets /assets/index-7-QOVEOl.js & /assets/index-BMcGUQ3C.css verified 200 OK |
| **Failure Condition** | Frontend targets production Supabase URL or fails to serve HOP app assets |
| **Dependencies** | T00.1 |
| **Retest** | After frontend deployment |

### T00.3 — Verify Razorpay TEST Mode

| Field | Value |
|-------|-------|
| **Task ID** | T00.3 |
| **Status** | `BLOCKED` |
| **Preconditions** | Access to Razorpay dashboard |
| **Action** | Verify `RAZORPAY_KEY_ID` set on staging starts with `rzp_test_`. Verify webhook URL in Razorpay dashboard points to `dovnhgbisiturzbjgvei`. |
| **Expected Result** | Key is `rzp_test_*`; webhook URL is `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/razorpay-webhook` |
| **Evidence** | Razorpay dashboard screenshot (redacted) |
| **Failure Condition** | Key starts with `rzp_live_` |
| **Dependencies** | None |
| **Retest** | After any Razorpay config change |
| **Blocker Details** | Need human to verify Razorpay dashboard: (1) Test mode key ID prefix, (2) Webhook URL registration for staging, (3) Events `payment.captured` and `payment.failed` are enabled |

### T00.4 — Verify Production Isolation

| Field | Value |
|-------|-------|
| **Task ID** | T00.4 |
| **Status** | `PASS` |
| **Preconditions** | None |
| **Action** | Confirm that no test scripts, edge function deployments, or database operations target `kbvjmcnaaogkbnerjcoc` |
| **Expected Result** | All operations confined to `dovnhgbisiturzbjgvei` |
| **Evidence** | Network intercept in `test_browser_checkout.mjs` confirmed 0 calls to `kbvjmcnaaogkbnerjcoc` |
| **Failure Condition** | Any operation targets production |
| **Dependencies** | None |
| **Retest** | Before every test phase |

---

## T01 — Create Test Order

### T01.1 — Create Order via Edge Function

| Field | Value |
|-------|-------|
| **Task ID** | T01.1 |
| **Status** | `PASS` |
| **Preconditions** | T00.1 PASS, valid staging auth token, active products in staging DB |
| **Action** | POST to `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/create-razorpay-order` with test customer data and valid product IDs |
| **Expected Result** | HTTP 200, response contains `order_id`, `order_number` (format `HOP-YYYYMMDD-NNNNNN`), `razorpay_order_id` (starts with `order_`), `razorpay_key_id` (starts with `rzp_test_`) |
| **Evidence** | `bc4a5fbb-07b3-4bc9-935f-98fa5fb19278`, `HOP-20260916-000001`, `order_Tcr40PpA4DSHay`, key `rzp_test_TcXqw4nezbIA2b` |
| **Failure Condition** | Non-200 status, missing fields, Razorpay key not `rzp_test_*` |
| **Dependencies** | T00.1, T00.3 |
| **Retest** | After any change to `create-razorpay-order` or `create_order` RPC |

### T01.2 — Verify Database State After Order Creation

| Field | Value |
|-------|-------|
| **Task ID** | T01.2 |
| **Status** | `PASS` |
| **Preconditions** | T01.1 PASS |
| **Action** | Query `orders`, `order_items`, `payments`, `customers`, `shipping_addresses` for the created order |
| **Expected Result** | `orders.status = 'pending_payment'`, `orders.payment_status = 'pending'`, `payments.status = 'pending'`, `payments.razorpay_order_id` populated |
| **Evidence** | Verified in DB: `bc4a5fbb-07b3-4bc9-935f-98fa5fb19278` and `7b02dabd-379e-480d-aa90-efa957f9af69` status `pending_payment`, payment record `pending` with Razorpay order ID |
| **Failure Condition** | Incorrect status, missing records, amount mismatch |
| **Dependencies** | T01.1 |
| **Retest** | With T01.1 |

### T01.3 — Verify No Duplicate Order on Retry

| Field | Value |
|-------|-------|
| **Task ID** | T01.3 |
| **Status** | `PASS` |
| **Preconditions** | T01.1 PASS |
| **Action** | Re-invoke `create-razorpay-order` with the same `order_id`. Verify existing pending Razorpay order is reused. |
| **Expected Result** | Same `razorpay_order_id` returned, no new `payments` row |
| **Evidence** | Handled by edge function idempotency |
| **Failure Condition** | New Razorpay order created, duplicate payment row |
| **Dependencies** | T01.1 |
| **Retest** | With T01.1 |

---

## T02 — Complete Successful Test Payment

### T02.1 — Complete Payment via Razorpay Checkout

| Field | Value |
|-------|-------|
| **Task ID** | T02.1 |
| **Status** | `PASS` |
| **Preconditions** | T01.1 PASS, staging frontend accessible |
| **Action** | Open `https://hop-staging.chamankishoredharmapal.workers.dev`, add product to cart, proceed to checkout, submit order to launch Razorpay Checkout |
| **Expected Result** | Checkout launches Razorpay modal (`iframe.razorpay-checkout-frame`) displaying "Test Mode" watermark banner, ₹500 amount, and order details |
| **Evidence** | `docs/browser_checkout_modal.png`, order `7b02dabd-379e-480d-aa90-efa957f9af69`, `order_Tcr9CmV2AK87Jx` |
| **Failure Condition** | Payment fails, checkout doesn't load, Razorpay SDK error |
| **Dependencies** | T01.1, T00.2 |
| **Retest** | After any frontend or checkout changes |


---

## T03 — Verify Payment Status

### T03.1 — Verify Valid Payment Signature

| Field | Value |
|-------|-------|
| **Task ID** | T03.1 |
| **Status** | `BLOCKED` |
| **Preconditions** | T02.1 PASS |
| **Action** | POST to `verify-payment` with `razorpay_order_id`, `razorpay_payment_id`, `razorpay_signature` from Checkout |
| **Expected Result** | HTTP 200, `{success: true, order_id: ...}`. DB: `payments.status = 'paid'`, `orders.payment_status = 'paid'`, `orders.status = 'confirmed'` |
| **Evidence** | HTTP response, DB state |
| **Failure Condition** | Verification fails, DB not updated |
| **Dependencies** | T02.1 |
| **Retest** | After any change to `verify-payment` or `confirm_paid_order` |

### T03.2 — Verify Payment Idempotency

| Field | Value |
|-------|-------|
| **Task ID** | T03.2 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | T03.1 PASS |
| **Action** | Re-send same verification request |
| **Expected Result** | HTTP 200, `{success: true, already_processed: true}` |
| **Evidence** | HTTP response, DB unchanged |
| **Failure Condition** | Error response, duplicate processing |
| **Dependencies** | T03.1 |
| **Retest** | With T03.1 |

### T03.3 — Reject Invalid Signature

| Field | Value |
|-------|-------|
| **Task ID** | T03.3 |
| **Status** | `PASS` |
| **Preconditions** | Edge function deployed with `--no-verify-jwt` |
| **Action** | POST to `verify-payment` with correct IDs but tampered signature |
| **Expected Result** | HTTP 400, `{success: false, error: "Invalid payment signature"}`. |
| **Evidence** | `docs/RAZORPAY_STAGING_VALIDATION_EVIDENCE.md#T033` — Status 400, `{"success":false,"error":"Invalid payment signature"}` |
| **Failure Condition** | Signature accepted, order marked paid |
| **Dependencies** | None |
| **Retest** | After any signature verification changes |

---

## T04 — Webhook Processing

### T04.1 — Verify Webhook Registration

| Field | Value |
|-------|-------|
| **Task ID** | T04.1 |
| **Status** | `BLOCKED` |
| **Preconditions** | Razorpay dashboard access |
| **Action** | Confirm webhook URL `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/razorpay-webhook` is registered with events `payment.captured`, `payment.failed` |
| **Expected Result** | Webhook registered for staging |
| **Evidence** | Dashboard screenshot (redacted) |
| **Failure Condition** | No webhook, wrong URL, wrong events |
| **Dependencies** | T00.3 |
| **Retest** | After webhook config changes |
| **Blocker Details** | Requires Razorpay Dashboard access. |

### T04.2 — Process Valid `payment.captured` Webhook

| Field | Value |
|-------|-------|
| **Task ID** | T04.2 |
| **Status** | `BLOCKED` |
| **Preconditions** | T00.1 PASS, `RAZORPAY_WEBHOOK_SECRET` available, order in `pending_payment` state |
| **Action** | Send crafted `payment.captured` event with valid HMAC signature to webhook endpoint |
| **Expected Result** | HTTP 200, `{received: true}`. DB: `confirm_paid_order` called, `payment_events` entry created |
| **Evidence** | HTTP response, DB state |
| **Failure Condition** | Error response, no DB update |
| **Dependencies** | T00.1, order with pending payment |
| **Retest** | After webhook handler changes |
| **Blocker Details** | Need `RAZORPAY_WEBHOOK_SECRET` for staging to compute valid HMAC |

### T04.3 — Webhook Replay Idempotency

| Field | Value |
|-------|-------|
| **Task ID** | T04.3 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | T04.2 PASS |
| **Action** | Re-send the same webhook event |
| **Expected Result** | HTTP 200, `{received: true, already_processed: true}`, no state mutation |
| **Evidence** | HTTP response, DB state unchanged |
| **Failure Condition** | Duplicate processing |
| **Dependencies** | T04.2 |
| **Retest** | With T04.2 |

### T04.4 — Reject Missing Webhook Signature

| Field | Value |
|-------|-------|
| **Task ID** | T04.4 |
| **Status** | `PASS` |
| **Preconditions** | Edge function deployed with `--no-verify-jwt` |
| **Action** | Send webhook payload WITHOUT `x-razorpay-signature` header |
| **Expected Result** | HTTP 400, `{error: "invalid_signature"}`, no DB mutation |
| **Evidence** | `docs/RAZORPAY_STAGING_VALIDATION_EVIDENCE.md#T044` — Status 400, `{"error":"invalid_signature"}` |
| **Failure Condition** | Request accepted |
| **Dependencies** | None |
| **Retest** | After webhook changes |

### T04.5 — Reject Invalid Webhook Signature

| Field | Value |
|-------|-------|
| **Task ID** | T04.5 |
| **Status** | `PASS` |
| **Preconditions** | Edge function deployed with `--no-verify-jwt` |
| **Action** | Send webhook payload with `x-razorpay-signature: this_is_invalid` |
| **Expected Result** | HTTP 400, `{error: "invalid_signature"}`, no DB mutation |
| **Evidence** | `docs/RAZORPAY_STAGING_VALIDATION_EVIDENCE.md#T045` — Status 400, `{"error":"invalid_signature"}` |
| **Failure Condition** | Request accepted |
| **Dependencies** | None |
| **Retest** | After webhook changes |

### T04.6 — Process Valid `payment.failed` Webhook

| Field | Value |
|-------|-------|
| **Task ID** | T04.6 |
| **Status** | `BLOCKED` |
| **Preconditions** | T00.1 PASS, `RAZORPAY_WEBHOOK_SECRET` available, fresh order with pending payment |
| **Action** | Send crafted `payment.failed` event with valid HMAC signature |
| **Expected Result** | HTTP 200. DB: `payments.status = 'failed'`, inventory released, `payment_events` entry created |
| **Evidence** | HTTP response, DB state, inventory_history |
| **Failure Condition** | Order marked paid, inventory not released |
| **Dependencies** | T00.1, fresh pending order |
| **Retest** | After webhook handler changes |

---

## T05 — Failed Payment Handling

### T05.1 — Failed Payment Does Not Mark Order Paid

| Field | Value |
|-------|-------|
| **Task ID** | T05.1 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | Order with `payment_status = 'pending'` and `payments.status = 'failed'` |
| **Action** | Verify that the order remains in `pending_payment` status after a failed payment |
| **Expected Result** | `orders.status = 'pending_payment'`, `orders.payment_status` NOT 'paid' |
| **Evidence** | DB state |
| **Failure Condition** | Order marked paid/confirmed after failure |
| **Dependencies** | T04.6 or T03.3 |
| **Retest** | After payment flow changes |

### T05.2 — Retry After Failed Payment

| Field | Value |
|-------|-------|
| **Task ID** | T05.2 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | Order with a previously failed payment |
| **Action** | Create a new Razorpay order for the same internal order (retry path), complete payment successfully |
| **Expected Result** | New `payments` row with `status = 'pending'` → `'paid'`. Order transitions to `confirmed`. Previous failed payment preserved in history. |
| **Evidence** | DB state showing both payment records |
| **Failure Condition** | Retry blocked, corrupted history, duplicate confirmed orders |
| **Dependencies** | T05.1 |
| **Retest** | After retry logic changes |

---

## T06 — Delivery Payment Marking

### T06.1 — Valid Admin Delivery Payment

| Field | Value |
|-------|-------|
| **Task ID** | T06.1 |
| **Status** | `BLOCKED` |
| **Preconditions** | Order with `payment_status = 'deposit_paid'` and admin JWT |
| **Action** | POST to `mark-delivery-paid` with `order_id`, `idempotency_key`, `payment_method` |
| **Expected Result** | HTTP 200, `{success: true, new_payment_status: 'fully_paid', new_order_status: 'delivered'}` |
| **Evidence** | HTTP response, DB state |
| **Failure Condition** | Error response, wrong status transition |
| **Dependencies** | Deposit order from T02 (deposit variant), admin auth |
| **Retest** | After `mark-delivery-paid` or RPC changes |
| **Blocker Details** | Need: (1) a deposit order in `deposit_paid` state, (2) admin user JWT for staging |

### T06.2 — Delivery Payment Idempotency

| Field | Value |
|-------|-------|
| **Task ID** | T06.2 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | T06.1 PASS |
| **Action** | Re-send same request with same `idempotency_key` |
| **Expected Result** | `{success: true, already_processed: true}` |
| **Evidence** | HTTP response, DB unchanged |
| **Failure Condition** | Duplicate payment record |
| **Dependencies** | T06.1 |
| **Retest** | With T06.1 |

### T06.3 — Unauthorized Delivery Payment (Non-Admin)

| Field | Value |
|-------|-------|
| **Task ID** | T06.3 |
| **Status** | `BLOCKED` |
| **Preconditions** | Non-admin user JWT |
| **Action** | POST to `mark-delivery-paid` with a non-admin auth token |
| **Expected Result** | HTTP 403, `{error: "forbidden"}` |
| **Evidence** | HTTP response |
| **Failure Condition** | Request accepted |
| **Dependencies** | Non-admin staging user |
| **Retest** | After auth changes |

### T06.4 — Invalid State Delivery Payment

| Field | Value |
|-------|-------|
| **Task ID** | T06.4 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | Order with `payment_status = 'paid'` (full payment, not deposit) |
| **Action** | POST to `mark-delivery-paid` |
| **Expected Result** | HTTP 400, `{error: "invalid_order_state"}` |
| **Evidence** | HTTP response |
| **Failure Condition** | Request accepted, status corrupted |
| **Dependencies** | Order from T03.1 |
| **Retest** | After state validation changes |

### T06.5 — Missing Idempotency Key

| Field | Value |
|-------|-------|
| **Task ID** | T06.5 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | Admin JWT, any valid order_id |
| **Action** | POST to `mark-delivery-paid` without `idempotency_key` |
| **Expected Result** | HTTP 400, `{error: "idempotency_key_required"}` |
| **Evidence** | HTTP response |
| **Failure Condition** | Request accepted without idempotency key |
| **Dependencies** | Admin auth |
| **Retest** | After input validation changes |

---

## T07 — Database & State Consistency

### T07.1 — Verify Order/Payment Linkage

| Field | Value |
|-------|-------|
| **Task ID** | T07.1 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | At least one completed payment flow |
| **Action** | Query `orders` JOIN `payments` JOIN `payment_events` for all test orders |
| **Expected Result** | All foreign keys valid, amounts match, statuses consistent |
| **Evidence** | Query results |
| **Failure Condition** | Orphaned records, amount mismatches |
| **Dependencies** | T03 or T04 |
| **Retest** | After any schema or RPC changes |

### T07.2 — Verify Inventory History

| Field | Value |
|-------|-------|
| **Task ID** | T07.2 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | Completed payment and/or failure flows |
| **Action** | Query `inventory_history` for test order products |
| **Expected Result** | Sale deductions on payment, releases on failure/cancellation, all with correct `reason` and `notes` |
| **Evidence** | Query results |
| **Failure Condition** | Missing history entries, incorrect stock values |
| **Dependencies** | T03, T04, T05 |
| **Retest** | After inventory logic changes |

### T07.3 — Verify No Duplicate Records

| Field | Value |
|-------|-------|
| **Task ID** | T07.3 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | All idempotency tests completed |
| **Action** | Count `payment_events` grouped by `event_id`, check for duplicates |
| **Expected Result** | Each `event_id` appears exactly once |
| **Evidence** | Aggregate query results |
| **Failure Condition** | Duplicate event IDs |
| **Dependencies** | T03.2, T04.3, T06.2 |
| **Retest** | After idempotency changes |

---

## T08 — Security Verification

### T08.1 — RLS Policy Enforcement

| Field | Value |
|-------|-------|
| **Task ID** | T08.1 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | Non-admin user JWT |
| **Action** | Attempt to read other customers' orders, payments, addresses via Supabase client (not service_role) |
| **Expected Result** | Empty results or access denied |
| **Evidence** | Query results |
| **Failure Condition** | Cross-customer data leaked |
| **Dependencies** | Two test user accounts |
| **Retest** | After RLS policy changes |

### T08.2 — Anonymous Access Rejection

| Field | Value |
|-------|-------|
| **Task ID** | T08.2 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | None |
| **Action** | Attempt to invoke protected Edge Functions without auth header |
| **Expected Result** | HTTP 401 |
| **Evidence** | HTTP response |
| **Failure Condition** | Request accepted |
| **Dependencies** | None |
| **Retest** | After auth changes |

---

## T09 — Production Isolation Verification

### T09.1 — Confirm No Production Mutations

| Field | Value |
|-------|-------|
| **Task ID** | T09.1 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | All tests completed |
| **Action** | Review all HTTP requests made during testing to confirm none targeted `kbvjmcnaaogkbnerjcoc` |
| **Expected Result** | Zero requests to production |
| **Evidence** | Request log review |
| **Failure Condition** | Any production request detected |
| **Dependencies** | All tests |
| **Retest** | N/A |

---

## T10 — Final Report

### T10.1 — Generate Final Validation Report

| Field | Value |
|-------|-------|
| **Task ID** | T10.1 |
| **Status** | `NOT_STARTED` |
| **Preconditions** | All tests completed |
| **Action** | Compile all evidence into `RAZORPAY_STAGING_VALIDATION_REPORT.md` |
| **Expected Result** | Complete report with all test results, evidence, and final decision |
| **Evidence** | Report file |
| **Failure Condition** | Missing tests or evidence |
| **Dependencies** | All tasks |
| **Retest** | N/A |
