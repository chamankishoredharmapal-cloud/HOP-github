# Production TODO Research â€” Area C: Edge Functions

**Document ID**: HOP-PROD-TODO-RES-C
**Version**: 1.0.0
**Status**: COMPLETE
**Last Updated**: 2026-09-26
**Source**: Repository evidence (supabase/functions/, production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md)

---

## C.1 Edge Function Inventory (8 Functions)

All 8 functions exist in `supabase/functions/` and are **deployed on staging**. Production has **0/8** deployed.

| # | Function | Path | Purpose | Dependencies | Auth Required |
|---|----------|------|---------|--------------|---------------|
| 1 | **cancel-payment** | `supabase/functions/cancel-payment/index.ts` | Cancel pending payment, release inventory, mark order cancelled | `supabase-js`, `release_order_inventory` RPC | Yes (Bearer token) |
| 2 | **create-razorpay-order** | `supabase/functions/create-razorpay-order/index.ts` | Create Razorpay order (full/deposit), insert payment record | `razorpay` npm, `create_order` RPC, `payments` table | Yes (Bearer token) |
| 3 | **get-order-confirmation** | `supabase/functions/get-order-confirmation/index.ts` | Fetch order confirmation details by order_number | `supabase-js`, `orders`, `order_items`, `shipping_addresses` | Yes (Bearer token) |
| 4 | **mark-delivery-paid** | `supabase/functions/mark-delivery-paid/index.ts` | Mark COD/delivery payment as paid (admin only) | `mark_delivery_paid_rpc` (atomic, idempotency key) | Yes (Admin only) |
| 5 | **razorpay-webhook** | `supabase/functions/razorpay-webhook/index.ts` | Handle Razorpay webhooks (payment.captured, payment.failed, order.paid) | `supabase-js`, `confirm_paid_order` RPC, `payment_events` table | No (webhook signature) |
| 6 | **release-inventory** | `supabase/functions/release-inventory/index.ts` | Admin-triggered inventory release for failed/cancelled orders | `release_order_inventory` RPC | Yes (Admin only) |
| 7 | **send-email** | `supabase/functions/send-email/index.ts` | Send transactional emails via Resend (or log only) | `resend` API (optional), `RESEND_API_KEY` | Yes (Bearer token) |
| 8 | **verify-payment** | `supabase/functions/verify-payment/index.ts` | Client-side payment verification (signature + confirm_paid_order) | `supabase-js`, `confirm_paid_order` RPC, `payment_events` table | Yes (Bearer token) |

**Evidence**: `supabase/functions/` directory listing; `production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md:38` ("7 Supabase Edge Functions active" â€” note: 8 exist, mark-delivery-padded added later).

---

## C.2 Function Details & Production Requirements

### C.2.1 cancel-payment
- **Trigger**: Customer cancels checkout before payment
- **Input**: `{ order_id: string }` + Authorization header
- **Logic**: Verify ownership (email match or admin) â†’ `release_order_inventory` RPC â†’ update order status to `cancelled` â†’ update payments to `failed` â†’ insert `order_events`
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL` (CORS)
- **CORS**: `Access-Control-Allow-Origin: ${FRONTEND_URL}`

### C.2.2 create-razorpay-order
- **Trigger**: Checkout â€” create new order or retry existing
- **Input**: Full order details (customer, shipping, items) OR `{ order_id }` for retry
- **Logic**: 
  - New: `create_order` RPC â†’ create Razorpay order (full or â‚¹200 deposit) â†’ insert `payments` record
  - Retry: Verify ownership â†’ reuse existing pending Razorpay order OR create new
- **Payment Models**: `full` (default) or `deposit` (â‚¹200 fixed)
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `FRONTEND_URL`
- **CORS**: `Access-Control-Allow-Origin: ${FRONTEND_URL}`

### C.2.3 get-order-confirmation
- **Trigger**: Order confirmation page load
- **Input**: `{ order_number: string }` (format: `HOP-YYYYMMDD-HHMMSS`)
- **Logic**: Verify ownership â†’ fetch order + items + shipping address + estimated delivery
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`

### C.2.4 mark-delivery-paid
- **Trigger**: Admin marks COD/partial delivery as paid (Studio)
- **Input**: `{ order_id, payment_method, notes, idempotency_key }` + Authorization header
- **Logic**: Admin check â†’ `mark_delivery_paid_rpc` (atomic, idempotency key required)
- **Idempotency**: Client MUST provide stable key (format: `mark_delivery_paid_<order_id>_<admin_user_id>`)
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`

### C.2.5 razorpay-webhook âš ï¸ CRITICAL
- **Trigger**: Razorpay server â†’ `POST /functions/v1/razorpay-webhook`
- **Events**: `payment.captured`, `payment.failed`, `order.paid`
- **Security**: **FAIL-CLOSED** â€” returns 500 if `RAZORPAY_WEBHOOK_SECRET` not configured
- **Verification**: Constant-time HMAC-SHA256 (XOR comparison) on raw body
- **Idempotency**: `payment_events` table with unique `event_id`
- **Logic**: 
  - `payment.captured` â†’ `confirm_paid_order` RPC â†’ record event
  - `payment.failed` â†’ update payment status â†’ `release_order_inventory` RPC
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_WEBHOOK_SECRET`, `FRONTEND_URL`
- **CORS**: Not applicable (server-to-server)

**Evidence**: `supabase/functions/razorpay-webhook/index.ts:91-100` (fail-closed), `production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md:41` ("constant-time validation & at-most-once idempotency")

### C.2.6 release-inventory
- **Trigger**: Admin manually releases stuck inventory
- **Input**: `{ order_id, reason }` + Authorization header
- **Logic**: Admin check â†’ `release_order_inventory` RPC
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `FRONTEND_URL`

### C.2.7 send-email
- **Trigger**: Order confirmation, welcome, shipping updates
- **Input**: `{ to, subject, body, type }` + Authorization header
- **Security**: Non-admin users can only email themselves
- **Provider**: Resend (optional â€” logs only if `RESEND_API_KEY` not set)
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `EMAIL_FROM`, `FRONTEND_URL`

### C.2.8 verify-payment
- **Trigger**: Client-side after Razorpay modal success
- **Input**: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }` + Authorization header
- **Logic**: Constant-time signature verification â†’ idempotency check (`payment_events`) â†’ `confirm_paid_order` RPC â†’ record event
- **Production Env Vars**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RAZORPAY_KEY_SECRET`, `FRONTEND_URL`

---

## C.3 Common Environment Variables (All Functions)

| Variable | Source | Required | Notes |
|----------|--------|----------|-------|
| `SUPABASE_URL` | Supabase project | YES | `https://kbvjmcnaaogkbnerjcoc.supabase.co` (prod) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase vault | YES | **Secret** â€” never in frontend |
| `SUPABASE_ANON_KEY` | Supabase vault | send-email only | Public key OK |
| `FRONTEND_URL` | Cloudflare Pages production domain | YES | `https://houseofpadmavati.com` (CORS) |
| `RAZORPAY_KEY_ID` | Razorpay dashboard | create-razorpay-order, verify-payment | Public key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay dashboard | create-razorpay-order, verify-payment | **Secret** |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay dashboard | razorpay-webhook | **Secret** â€” fail-closed if missing |
| `RESEND_API_KEY` | Resend dashboard | send-email | Optional â€” logs only if absent |
| `EMAIL_FROM` | Config | send-email | e.g., `orders@houseofpadmavati.com` |

---

## C.4 Deployment Procedure (Production)

**Prerequisites** (Human-only â€” Backend DevOps Lead):
- [ ] Supabase CLI authenticated (`supabase login`)
- [ ] Linked to production project (`supabase link --project-ref kbvjmcnaaogkbnerjcoc`)
- [ ] All production secrets configured in Supabase Dashboard â†’ Edge Functions â†’ Secrets

**Execution Steps**:

```powershell
# For each function (8 total):
supabase functions deploy cancel-payment --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy create-razorpay-order --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy get-order-confirmation --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy mark-delivery-paid --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy razorpay-webhook --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy release-inventory --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy send-email --project-ref kbvjmcnaaogkbnerjcoc
supabase functions deploy verify-payment --project-ref kbvjmcnaaogkbnerjcoc
```

**Verification** (per COND-02):
```powershell
supabase functions list --project-ref kbvjmcnaaogkbnerjcoc
# Expected: 8 functions showing "ACTIVE"
```

**Test Payloads** (staging verification pattern, adapt for production):
```powershell
# Test webhook signature verification
curl -X POST "https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook" \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: <valid_signature>" \
  -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_test","order_id":"order_test","status":"captured","amount":10000,"currency":"INR"}}}}'
```

---

## C.5 Verification Criteria (from COND-02)

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Functions deployed | `supabase functions list` | 8 functions, all ACTIVE |
| Webhook reachable | `curl` to production URL | HTTP 200/400 (not 500/timeout) |
| CORS headers | `curl -I` with Origin | `Access-Control-Allow-Origin: https://houseofpadmavati.com` |
| Secrets configured | Supabase Dashboard â†’ Functions â†’ Secrets | All 8 secrets present per function |

---

## C.6 Rollback Procedure

If a function deployment breaks production:
1. **Immediate**: Redeploy previous version via Supabase Dashboard (version history)
2. **Code**: Revert function source in Git, redeploy
3. **DNS/Traffic**: No DNS change needed (functions are backend-only)
4. **Verification**: Re-run test payloads

**Rollback Time**: < 5 minutes per function

---

## C.7 Unknown / Requires Verification

| Item | Status | Action Required |
|------|--------|-----------------|
| Exact production function URL pattern | UNKNOWN | Confirm: `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/<name>` |
| Function timeout limits (prod tier) | UNKNOWN | Check Supabase prod plan limits |
| Concurrent execution limits | UNKNOWN | Check Supabase prod plan limits |
| `send-email` Resend integration tested | UNKNOWN | Verify `RESEND_API_KEY` works in production |
| Webhook retry policy (Razorpay â†’ Supabase) | UNKNOWN | Document Razorpay retry behavior |

---

## C.8 Research Area C â€” COMPLETENESS: PASS

All required sub-areas covered:
- âœ… All 8 functions inventoried with purpose, dependencies, auth
- âœ… Detailed logic for each function documented
- âœ… Production environment variables enumerated
- âœ… Deployment procedure documented (human-only)
- âœ… Verification criteria from COND-02 captured
- âœ… Rollback procedure defined
- âœ… Unknown items explicitly marked
