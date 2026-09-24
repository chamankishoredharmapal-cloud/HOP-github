# Razorpay Staging Validation — Standard Operating Procedure (SOP)

> **Version**: 1.0  
> **Created**: 2026-09-16  
> **Last Updated**: 2026-09-16  
> **Status**: ACTIVE

---

## 1. Purpose

Validate the complete Razorpay payment lifecycle on the HOP staging environment to confirm:

- Order creation and Razorpay integration are functional
- Payment verification (signature-based) is secure
- Webhook processing is reliable and idempotent
- Failed payments are handled safely
- Delivery-payment (admin COD settlement) is authorized and atomic
- Database state transitions are consistent and auditable
- No production resources are touched

---

## 2. Scope

This SOP covers the end-to-end payment flow for House of Padmavati (HOP):

| Component | Location |
|-----------|----------|
| Frontend checkout | `src/pages/Checkout.tsx`, `src/hooks/usePayment.ts`, `src/lib/razorpay.ts`, `src/services/paymentService.ts` |
| Create order | `supabase/functions/create-razorpay-order/index.ts` → `create_order` RPC |
| Verify payment | `supabase/functions/verify-payment/index.ts` → `confirm_paid_order` RPC |
| Webhook handler | `supabase/functions/razorpay-webhook/index.ts` → `confirm_paid_order` / `release_order_inventory` RPC |
| Cancel payment | `supabase/functions/cancel-payment/index.ts` → `release_order_inventory` RPC |
| Mark delivery paid | `supabase/functions/mark-delivery-paid/index.ts` → `mark_delivery_paid_rpc` RPC |
| Order confirmation | `supabase/functions/get-order-confirmation/index.ts` |

---

## 3. Environment Lock

### Staging Environment (ONLY environment for testing)

| Resource | Value |
|----------|-------|
| Supabase project name | `hop-staging` |
| Supabase project ref | `dovnhgbisiturzbjgvei` |
| Supabase URL | `https://dovnhgbisiturzbjgvei.supabase.co` |
| Frontend URL | `https://hop-staging.chamankishoredharmapal.workers.dev/` (Cloudflare Pages) |
| Razorpay mode | **TEST** |
| Webhook endpoint | `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/razorpay-webhook` |

### Production Environment (DO NOT USE)

| Resource | Value |
|----------|-------|
| Supabase project ref | `kbvjmcnaaogkbnerjcoc` |
| Status | **READ-ONLY REFERENCE** |

> **⚠️ CRITICAL**: `supabase/config.toml` currently has `project_id = "kbvjmcnaaogkbnerjcoc"` (production). All CLI commands that use this config file MUST explicitly target staging via `--project-ref dovnhgbisiturzbjgvei`. Do NOT run `supabase db push`, `supabase functions deploy`, or `supabase migrations` without verifying the target.

---

## 4. Safety Rules

1. **Never** use production Supabase URL or project ref for test operations
2. **Never** deploy functions, run migrations, or modify data on `kbvjmcnaaogkbnerjcoc`
3. **Never** log, print, or store secret values (API keys, service role keys, webhook secrets)
4. **Never** disable RLS policies
5. **Never** bypass signature verification
6. **Never** use real payment methods — Razorpay TEST mode only
7. **Never** weaken authentication or authorization checks
8. **Always** verify the Supabase URL in API calls starts with `dovnhgbisiturzbjgvei`
9. **Always** verify Razorpay key IDs start with `rzp_test_`
10. **Always** redact sensitive data in evidence logs

---

## 5. Required Credentials and Secret Names

| Secret Name | Purpose | Where Set |
|-------------|---------|-----------|
| `SUPABASE_URL` | Supabase project URL (staging) | Edge Function env vars |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role access | Edge Function env vars |
| `RAZORPAY_KEY_ID` | Razorpay API key (must be `rzp_test_*`) | Edge Function env vars |
| `RAZORPAY_KEY_SECRET` | Razorpay API secret | Edge Function env vars |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook signature validation | Edge Function env vars |
| `FRONTEND_URL` | CORS origin | Edge Function env vars |
| `VITE_SUPABASE_URL` | Frontend Supabase URL | `.env.local` / Vercel env |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Frontend anon key | `.env.local` / Vercel env |

---

## 6. Required Edge Functions

| Function | Purpose | Auth Required |
|----------|---------|---------------|
| `create-razorpay-order` | Creates DB order + Razorpay order | User JWT (via `Authorization` header) |
| `verify-payment` | Verifies Razorpay signature, confirms payment | None (signature-based) |
| `razorpay-webhook` | Processes async Razorpay events | Razorpay signature (`x-razorpay-signature`) |
| `cancel-payment` | Cancels order, releases inventory | User JWT (owner or admin) |
| `mark-delivery-paid` | Admin settles delivery balance | Admin JWT only |
| `get-order-confirmation` | Retrieves order summary | User JWT (owner or admin) |

---

## 7. Required Database Tables

| Table | Key Columns | Purpose |
|-------|-------------|---------|
| `orders` | `id`, `order_number`, `status` (order_status), `payment_status` (payment_status), `total`, `total_amount`, `paid_amount`, `remaining_amount` | Order records |
| `order_items` | `id`, `order_id`, `product_id`, `product_name`, `product_price`, `quantity` | Line items |
| `payments` | `id`, `order_id`, `razorpay_order_id`, `razorpay_payment_id`, `amount`, `status` (payment_transaction_status) | Payment records |
| `payment_events` | `id`, `event_id` (UNIQUE), `event_type`, `razorpay_order_id`, `razorpay_payment_id` | Idempotency tracking |
| `order_events` | `id`, `order_id`, `event_type`, `from_status`, `to_status`, `metadata` | Order audit trail |
| `customers` | `id`, `email`, `full_name`, `phone` | Customer records |
| `shipping_addresses` | `id`, `customer_id`, `recipient_name`, `address`, `city`, `state`, `postal_code` | Shipping info |
| `products` | `id`, `name`, `selling_price`, `stock`, `status` | Product catalog |
| `inventory_history` | `id`, `product_id`, `change`, `previous_stock`, `new_stock`, `reason` | Stock audit trail |

### Status Enums

**`order_status`**: `pending_payment` → `confirmed` → `processing` → `shipped` → `delivered` | `cancelled` | `returned`

**`payment_status`** (on orders): `pending`, `paid`, `failed`, `refunded`, `partially_refunded`, `deposit_pending`, `deposit_paid`, `partially_paid`, `fully_paid`, `balance_due`, `cancelled`

**`payment_transaction_status`** (on payments): `pending`, `paid`, `failed`, `refunded`

---

## 8. Test Data Strategy

- Use Razorpay TEST mode credentials only
- Use synthetic customer data: `test_staging_YYYYMMDD_HHMMSS@example.com`
- Use Razorpay test card: `4111 1111 1111 1111` (or UPI test flows)
- Test products must exist in staging database with `status = 'active'` or `'published'`
- Deposit amount is hardcoded to ₹200 (20000 paise)
- All test orders are prefixed with `HOP-YYYYMMDD-NNNNNN`

---

## 9. Test Execution Order

1. **T01** — Environment Verification
2. **T02** — Create Test Order (via Edge Function)
3. **T03** — Complete Successful Test Payment (via Razorpay Checkout)
4. **T04** — Verify Payment (via `verify-payment` Edge Function)
5. **T05** — Webhook Processing (via `razorpay-webhook` Edge Function)
6. **T06** — Failed Payment Handling
7. **T07** — Delivery Payment Marking (via `mark-delivery-paid` Edge Function)
8. **T08** — Database & State Consistency Verification
9. **T09** — Security Verification
10. **T10** — Production Isolation Verification

---

## 10. Expected Results

| Test | Expected Outcome |
|------|------------------|
| Create order | `orders.status = 'pending_payment'`, `payments.status = 'pending'`, Razorpay order ID starts with `order_` |
| Successful payment | `payments.status = 'paid'`, `orders.payment_status = 'paid'` (full) or `'deposit_paid'` (deposit), `orders.status = 'confirmed'` |
| Verify-payment idempotency | Second call returns `{success: true, already_processed: true}` |
| Invalid signature | Returns 400, `payments.status = 'failed'`, inventory released |
| Webhook `payment.captured` | `confirm_paid_order` RPC called, `payment_events` recorded |
| Webhook replay | Returns 200 with `already_processed: true`, no state mutation |
| Webhook invalid signature | Returns 400, no database changes |
| Failed payment webhook | `payments.status = 'failed'`, inventory released |
| Mark delivery paid (admin) | `orders.payment_status = 'fully_paid'`, `orders.status = 'delivered'` |
| Mark delivery paid (non-admin) | Returns 403 |
| Mark delivery paid (wrong state) | Returns 400 with `invalid_order_state` |
| Mark delivery paid (duplicate) | Returns `{success: true, already_processed: true}` |

---

## 11. Failure Conditions

A test FAILS if:

- HTTP status does not match expected value
- Database state does not transition correctly
- Signature verification accepts invalid signatures
- Webhook allows unsigned requests
- Payment amount/currency mismatch
- Duplicate processing creates duplicate records
- Unauthorized users can access admin functions
- Inventory is not released on failure
- Production database is modified

---

## 12. Evidence Requirements

For every test, record:

- Test ID, timestamp, environment confirmation
- Internal order ID, Razorpay order ID, payment ID
- HTTP status code and response body (redacted)
- Database state before and after
- `payment_events` entries created
- `order_events` entries created
- `inventory_history` entries created
- Idempotency verification result

**REDACT**: API keys, service role keys, webhook secrets, auth tokens, full customer PII

---

## 13. Security Checks

- [ ] `verify-payment` uses constant-time HMAC SHA-256 comparison
- [ ] `razorpay-webhook` fails closed when `RAZORPAY_WEBHOOK_SECRET` is missing (HTTP 500)
- [ ] `razorpay-webhook` rejects requests without valid `x-razorpay-signature`
- [ ] `create-razorpay-order` validates JWT and enforces IDOR prevention
- [ ] `mark-delivery-paid` requires admin role (via `is_admin` RPC)
- [ ] `cancel-payment` validates ownership (owner or admin)
- [ ] All RLS policies are enabled on commerce tables
- [ ] `payment_events` is accessible only via `service_role`

---

## 14. Idempotency Checks

| Operation | Idempotency Key | Table | Expected Behavior |
|-----------|----------------|-------|--------------------|
| `verify-payment` | `verify_{razorpay_order_id}_{razorpay_payment_id}` | `payment_events` | Returns `already_processed: true` |
| `razorpay-webhook` (captured) | `payment.captured_{payment_id}` | `payment_events` | Skips processing, returns 200 |
| `razorpay-webhook` (failed) | `payment.failed_{payment_id}` | `payment_events` | Skips via unique constraint (23505) |
| `confirm_paid_order` RPC | N/A (checks `payments.status = 'paid'`) | `payments` | Returns `already_processed: true` |
| `mark_delivery_paid_rpc` | `mark_delivery_paid_{idempotency_key}` | `payment_events` | Returns `already_processed: true` |

---

## 15. Database Consistency Checks

- [ ] `orders.total = orders.subtotal + orders.shipping_cost`
- [ ] `orders.total_amount = orders.total` (where applicable)
- [ ] `orders.paid_amount + orders.remaining_amount = orders.total_amount` (deposit orders)
- [ ] `payments.amount` matches Razorpay order amount
- [ ] `payments.currency = 'INR'`
- [ ] No orphaned `payment_events` without corresponding `payments`
- [ ] No duplicate `payment_events.event_id` entries
- [ ] `inventory_history` accurately tracks stock changes
- [ ] `products.stock >= 0` (enforced by CHECK constraint)

---

## 16. Retest Protocol

When a test fails:

1. Record the failure with full evidence
2. Reproduce the failure
3. Inspect code, logs, schema, and network responses
4. Identify root cause (do not guess)
5. Apply the smallest safe fix
6. Re-run the failed test
7. Re-run all dependent tests (regression)
8. Update SOP, TODO, evidence, and decision log

---

## 17. Completion Criteria

The validation is complete when ALL of the following are true:

- [ ] All T01–T10 tests have a final status (PASS, FAIL, or BLOCKED with justification)
- [ ] Successful payment lifecycle is verified end-to-end
- [ ] Invalid signatures are rejected with correct error handling
- [ ] Webhook processing is functional and idempotent
- [ ] Failed payments do not result in paid orders
- [ ] Delivery-payment is authorized and state-validated
- [ ] Database records are consistent across all tables
- [ ] No production resources were modified
- [ ] No secrets were exposed
- [ ] Final report is generated

---

## 18. Human Approval Points

Stop and request human approval when:

- Razorpay Dashboard access is needed (webhook registration, key verification)
- A Supabase secret must be manually provided or verified
- A destructive database operation is proposed
- A migration needs to run against the staging database
- The intended business rule is ambiguous
- Production impact cannot be ruled out
- Real money could be involved

---

## 19. Final Report Format

The final report (`RAZORPAY_STAGING_VALIDATION_REPORT.md`) must contain:

1. Executive summary (PASS / FAIL / BLOCKED)
2. Environment verification evidence
3. Test matrix with all results
4. Evidence identifiers for each test
5. Failures discovered and fixes applied
6. Regression test results
7. Remaining blockers
8. Security verification summary
9. Database consistency verification
10. Production isolation confirmation
11. Final staging-readiness decision
