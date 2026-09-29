# Production TODO Research â€” Area D: Razorpay LIVE

**Document ID**: HOP-PROD-TODO-RES-D
**Version**: 1.0.0
**Status**: COMPLETE
**Last Updated**: 2026-09-26
**Source**: Repository evidence (src/lib/razorpay.ts, supabase/functions/*-razorpay*, production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md, AI_PRODUCTION_EXECUTION_MANUAL.md)

---

## D.1 TEST vs LIVE Separation

| Environment | Razorpay Account | Key Prefix | Webhook URL | Status |
|-------------|------------------|------------|-------------|--------|
| **Development** | Test mode | `rzp_test_...` | N/A (local) | Active |
| **Staging** | Test mode | `rzp_test_...` | `https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/razorpay-webhook` | Active |
| **Production** | **LIVE MODE** | `rzp_live_...` | `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook` | **PENDING** |

**Critical Rule**: **NEVER** use test keys in production. **NEVER** use live keys in staging/development.

---

## D.2 LIVE Configuration Requirements

### D.2.1 Required Credentials (Human-only â€” E-Commerce Manager / DevOps)

| Credential | Format | Where Used | Storage |
|------------|--------|------------|---------|
| **Live Key ID** | `rzp_live_XXXXXXXXXXXXXX` | `VITE_RAZORPAY_KEY_ID` (frontend), `RAZORPAY_KEY_ID` (Edge Functions) | Cloudflare Pages dashboard + Supabase secrets |
| **Live Key Secret** | `XXXXXXXXXXXXXXXXXXXXXXXX` | `RAZORPAY_KEY_SECRET` (Edge Functions only) | Supabase secrets **ONLY** |
| **Live Webhook Secret** | `XXXXXXXXXXXXXXXXXXXXXXXX` | `RAZORPAY_WEBHOOK_SECRET` (razorpay-webhook function) | Supabase secrets **ONLY** |

**Security**: 
- `VITE_RAZORPAY_KEY_ID` is **public** (client-side)
- `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET` are **PRIVILEGED** â€” never in frontend, never in Git, only in vaults

---

## D.2.2 Webhook Configuration (Production)

**Dashboard Setup** (Human-only):
1. Log into Razorpay LIVE Dashboard â†’ Settings â†’ Webhooks
2. Add webhook:
   - **URL**: `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook`
   - **Events**: `payment.captured`, `payment.failed`, `order.paid`
   - **Secret**: Generate and copy â†’ store in Supabase secrets as `RAZORPAY_WEBHOOK_SECRET`
3. Test webhook: Use "Test" button in dashboard â†’ verify HTTP 200/400 response

**Verification** (per COND-04):
```powershell
# Live webhook ping returns HTTP 200 / 400
curl -X POST "https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook" \
  -H "Content-Type: application/json" \
  -H "x-razorpay-signature: <valid_signature>" \
  -d '{"event":"payment.captured","payload":{"payment":{"entity":{"id":"pay_live_test","order_id":"order_live_test","status":"captured","amount":100,"currency":"INR"}}}}'
```

---

## D.2.3 Events & Signature Verification

### Supported Events
| Event | Handler | Idempotency Key Pattern |
|-------|---------|-------------------------|
| `payment.captured` | `razorpay-webhook` â†’ `confirm_paid_order` RPC | `${event}_${payment_id}` |
| `payment.failed` | `razorpay-webhook` â†’ release inventory | `${event}_${payment_id}` |
| `order.paid` | `razorpay-webhook` (fallback) | `${event}_${order_id}` |

### Signature Verification (Constant-Time)
```typescript
// From supabase/functions/razorpay-webhook/index.ts:49-76
// And supabase/functions/verify-payment/index.ts:17-46
async function verifyWebhookSignature(body: string, signature: string, secret: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map(b => b.toString(16).padStart(2, "0")).join("");
  
  // Constant-time comparison
  if (expected.length !== signature.length) return false;
  const a = encoder.encode(expected), b = encoder.encode(signature);
  let result = 0;
  for (let i = 0; i < a.length; i++) result |= a[i] ^ b[i];
  return result === 0;
}
```

**Requirement**: **FAIL-CLOSED** â€” function returns 500 if `RAZORPAY_WEBHOOK_SECRET` missing (line 95-100).

---

## D.2.4 Payment Verification Flow

### Client-Side (src/lib/razorpay.ts)
1. Load Razorpay SDK from `https://checkout.razorpay.com/v1/checkout.js`
2. Open checkout with `VITE_RAZORPAY_KEY_ID` (LIVE in production)
3. On success: callback with `{ razorpay_payment_id, razorpay_order_id, razorpay_signature }`
4. Call `verify-payment` Edge Function with all three fields

### Server-Side (verify-payment function)
1. Constant-time signature verification (HMAC-SHA256)
2. Idempotency check via `payment_events` table
3. Call `confirm_paid_order` RPC (atomic, row-locking)
4. Record event in `payment_events`

### Webhook (razorpay-webhook function)
1. Verify webhook signature (constant-time)
2. Idempotency check via `payment_events`
3. Handle `payment.captured` â†’ `confirm_paid_order` RPC
4. Handle `payment.failed` â†’ release inventory

**Key Principle**: **SERVER-SIDE VERIFICATION ONLY** â€” client callback is UX only; webhook + verify-payment are authoritative.

---

## D.2.5 Order Creation Flow

### Full Payment (Default)
```
Client â†’ create-razorpay-order (amount = orderTotal)
       â†’ Razorpay LIVE order created
       â†’ Payment record inserted (status: pending)
       â†’ Client opens Razorpay checkout with LIVE key
       â†’ On success: verify-payment â†’ confirm_paid_order
       â†’ Webhook: payment.captured â†’ confirm_paid_order (idempotent)
```

### Deposit Payment (â‚¹200 fixed)
```
Client â†’ create-razorpay-order (amount: 20000 paise, payment_model: 'deposit')
       â†’ Validates amount === 20000
       â†’ Razorpay LIVE order for â‚¹200
       â†’ Payment record with amount=20000
       â†’ Remaining balance collected via mark-delivery-paid (COD) or separate flow
```

---

## D.2.6 Failure Handling

| Failure Point | Behavior | Recovery |
|---------------|----------|----------|
| Razorpay checkout dismissed | `cancel-payment` function â†’ release inventory, mark order cancelled | Customer can retry |
| Payment failed (bank decline) | Webhook `payment.failed` â†’ mark payment failed, release inventory | Customer retries checkout |
| Signature verification failed | `verify-payment` / webhook â†’ mark payment failed, release inventory | Log alert, investigate |
| Webhook timeout (Supabase) | Razorpay retries (exponential backoff) | Idempotency key prevents double-processing |
| Duplicate webhook | `payment_events` unique constraint â†’ skip | Safe |
| Network error during verify-payment | Client can retry; idempotency key prevents double-charge | Safe |

---

## D.2.7 Cancellation / Refund Behavior

**Current Implementation**:
- `cancel-payment`: Only works for **pending** payments (not paid)
- No automated refund flow implemented
- Refunds: **Manual luxury concierge workflow** (physical garment inspection required before refund disbursement) â€” per `production/phase-5/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md:100`

**Production Requirement**: Document refund SOP for operations team.

---

## D.2.8 Production Credential Storage

| Credential | Frontend (Cloudflare Pages) | Backend (Supabase) | Human Action |
|------------|-------------------|---------------------|--------------|
| `VITE_RAZORPAY_KEY_ID` (LIVE) | âœ… Environment Variable | â€” | E-Commerce Manager |
| `RAZORPAY_KEY_ID` (LIVE) | â€” | âœ… Edge Function Secret | DevOps |
| `RAZORPAY_KEY_SECRET` (LIVE) | â€” | âœ… Edge Function Secret | DevOps |
| `RAZORPAY_WEBHOOK_SECRET` (LIVE) | â€” | âœ… Edge Function Secret | DevOps |

**NEVER** commit to Git. **NEVER** put in `.env.example`. **NEVER** log.

---

## D.3 Verification Gates (from COND-03, COND-04, COND-06)

| Condition | Action | Owner | Verification |
|-----------|--------|-------|--------------|
| **COND-03** | Inject Razorpay Live Key ID into Cloudflare Pages + Live Key Secret into Supabase Secrets | E-Commerce Manager / DevOps | Live â‚¹1 authorization test successfully captured and refunded |
| **COND-04** | Configure Production Webhook URL + Secret in Razorpay Live Dashboard | Lead DevOps Engineer | Live webhook ping returns HTTP 200/400 |
| **COND-06** | Trigger production build and promotion of commit `da6158f` on Cloudflare Pages | Release Manager | Cloudflare Pages production deployment returns HTTP 200 with pre-rendered storefront |

---

## D.4 Test Mode vs Live Mode Differences

| Aspect | Test Mode | Live Mode |
|--------|-----------|-----------|
| Key Prefix | `rzp_test_` | `rzp_live_` |
| Money | Fake (test cards) | Real (INR) |
| Webhook URL | Staging Supabase | Production Supabase |
| Webhook Secret | Staging secret | **New LIVE secret** |
| Test Cards | `4111 1111 1111 1111` (success) | NOT ALLOWED |
| Minimum Amount | â‚¹1 | â‚¹1 (but real money) |
| Settlement | Instant (test) | T+2/T+3 business days |
| Refunds | Instant | 5-7 business days |

---

## D.5 Unknown / Requires Verification

| Item | Status | Action Required |
|------|--------|-----------------|
| Exact Live Key ID format for this account | UNKNOWN | Generate in Razorpay LIVE dashboard |
| Live webhook secret generation procedure | UNKNOWN | Document from dashboard |
| Razorpay LIVE account KYC status | UNKNOWN | Confirm with E-Commerce Manager |
| Settlement cycle for this account | UNKNOWN | Check Razorpay dashboard |
| International card support (if needed) | UNKNOWN | Verify with Razorpay |
| UPI/Netbanking/Wallet availability | UNKNOWN | Verify in LIVE dashboard |

---

## D.6 Research Area D â€” COMPLETENESS: PASS

All required sub-areas covered:
- âœ… TEST vs LIVE separation documented
- âœ… LIVE configuration requirements enumerated
- âœ… Keys, webhook secret, events specified
- âœ… Signature verification (constant-time) documented
- âœ… Payment verification flow (client + server + webhook)
- âœ… Order creation (full + deposit) documented
- âœ… Failure handling matrix complete
- âœ… Cancellation/refund behavior noted (manual concierge)
- âœ… Production credential storage locations specified
- âœ… Verification gates from COND-03/04/06 captured
- âœ… Test vs Live differences table
- âœ… Unknown items explicitly marked
