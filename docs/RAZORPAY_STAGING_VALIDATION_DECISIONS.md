# Razorpay Staging Validation — Decision Log

> **Version**: 1.0  
> **Created**: 2026-09-16  
> **Last Updated**: 2026-09-16

---

## Decision Recording Format

Each decision follows this template:

```
### D[NNN] — [Decision Title]

| Field | Value |
|-------|-------|
| **Date** | |
| **Context** | |
| **Decision** | |
| **Rationale** | |
| **Alternatives Considered** | |
| **Impact** | |
| **Status** | PROPOSED / APPROVED / REJECTED |
```

---

## Decisions

### D001 — Target Staging via Explicit URLs, Not config.toml

| Field | Value |
|-------|-------|
| **Date** | 2026-09-16 |
| **Context** | `supabase/config.toml` contains `project_id = "kbvjmcnaaogkbnerjcoc"` (production). Supabase CLI commands that read this file will target production by default. |
| **Decision** | All test operations will use explicit staging URLs (`https://dovnhgbisiturzbjgvei.supabase.co`) rather than relying on `config.toml`. No `supabase` CLI commands will be run without explicit `--project-ref` override. |
| **Rationale** | Modifying `config.toml` could affect production deployments. Using explicit URLs is safer. |
| **Alternatives Considered** | (1) Change `config.toml` to staging — rejected because it would break production deploys. (2) Create a staging-specific config — unnecessary if we use explicit URLs. |
| **Impact** | Test scripts must always specify the staging URL explicitly. |
| **Status** | APPROVED |

### D002 — Use Direct HTTP Calls for API Testing

| Field | Value |
|-------|-------|
| **Date** | 2026-09-16 |
| **Context** | Need to test Edge Functions directly. Options: (1) Use the frontend UI, (2) Use `curl`/PowerShell direct HTTP calls, (3) Write Playwright E2E tests. |
| **Decision** | Use direct HTTP calls (PowerShell `Invoke-WebRequest`) to the staging Edge Function URLs for API-level testing. Frontend UI testing is supplementary but not the primary validation method. |
| **Rationale** | Direct HTTP calls allow precise control over payloads, headers, and signatures. They provide cleaner evidence and are reproducible. |
| **Alternatives Considered** | (1) Frontend-only testing — insufficient for signature/webhook tests. (2) Playwright — good for UI but overkill for API validation. |
| **Impact** | Need staging auth tokens and API keys to make authenticated requests. |
| **Status** | APPROVED |

### D003 — Webhook Testing Without Dashboard Access

| Field | Value |
|-------|-------|
| **Date** | 2026-09-16 |
| **Context** | Some webhook tests require computing valid HMAC signatures. The `RAZORPAY_WEBHOOK_SECRET` is needed for this. Razorpay dashboard access is needed to verify webhook registration. |
| **Decision** | Tests T04.4 (missing signature) and T04.5 (invalid signature) can proceed without secrets — they test rejection only. Tests T04.2 and T04.6 (valid webhook processing) require the staging `RAZORPAY_WEBHOOK_SECRET`. Mark these BLOCKED until the secret is provided. |
| **Rationale** | Security tests that verify rejection don't need valid secrets. Only positive-path webhook tests need the actual secret. |
| **Alternatives Considered** | None — this is the only safe approach. |
| **Impact** | Partial webhook testing can proceed immediately. |
| **Status** | APPROVED |

### D004 — No config.toml Modification

| Field | Value |
|-------|-------|
| **Date** | 2026-09-16 |
| **Context** | `supabase/config.toml` points to production. Should we change it? |
| **Decision** | Do NOT modify `config.toml`. It is a shared configuration file and changing it could break production workflows. |
| **Rationale** | Production safety is paramount. |
| **Alternatives Considered** | Temporary change with rollback — too risky. |
| **Impact** | All Supabase CLI interactions must use explicit flags. |
| **Status** | APPROVED |

### D005a — Security Review: `razorpay-webhook` — `--no-verify-jwt` Decision

| Field | Value |
|-------|-------|
| **Date** | 2026-09-16 |
| **Function** | `supabase/functions/razorpay-webhook/index.ts` (249 lines) |

#### Current Gateway Behavior

Supabase Edge Functions default to JWT verification at the API gateway level. The gateway returns HTTP 401 before the function code executes if no valid Supabase JWT is present in the `Authorization` header. Razorpay sends webhook events from its own servers with **no Supabase JWT** — it authenticates via its own `x-razorpay-signature` HMAC header.

#### Function-Level Security Audit

**1. HMAC Signature Validation — ✅ IMPLEMENTED CORRECTLY**

- **Lines 49–76**: `verifyWebhookSignature(body, signature, secret)` computes HMAC-SHA256 of the raw request body using the server-side `RAZORPAY_WEBHOOK_SECRET`.
- **Line 103**: Raw body read via `req.text()` — correct. Using `req.json()` would re-serialize and potentially break the signature. The raw body is used for HMAC, then parsed as JSON only AFTER signature passes (line 118).
- **Lines 67–75**: Constant-time comparison using XOR accumulation prevents timing attacks.
- **Line 68**: Length check before byte comparison — prevents out-of-bounds on mismatched lengths.

**2. Fail-Closed on Missing Secret — ✅ CORRECT**

- **Lines 91–101**: If `RAZORPAY_WEBHOOK_SECRET` is not set, the function returns HTTP 500 immediately. No business logic executes. This is the correct fail-closed pattern.

**3. Signature Checked Before Business Logic — ✅ CORRECT**

- **Lines 107–116**: Signature verification happens at line 108, immediately after reading the body. If invalid, returns HTTP 400 at line 112. The Supabase client is NOT created until line 121, after the signature check passes.

**4. Idempotency — ✅ CORRECT**

- **Lines 126–145**: Unique `eventId` is built as `{event.event}_{paymentId || orderId || "unknown"}`. Checked against `payment_events` table before processing. Duplicates return `{already_processed: true}`.
- **Line 200**: In `payment.failed` path, unique constraint violation (23505) is caught explicitly as a second idempotency guard.

**5. Cannot Update Arbitrary Orders — ✅ SAFE**

- **Line 158**: `confirm_paid_order` RPC takes `p_razorpay_order_id` from the signed payload. It does `SELECT ... FROM payments WHERE razorpay_order_id = p_razorpay_order_id FOR UPDATE`. An attacker would need to:
  - Know a valid `razorpay_order_id` (Razorpay-generated, not guessable)
  - Forge a valid HMAC signature (requires the `RAZORPAY_WEBHOOK_SECRET`)
- Both are infeasible without the secret.

**6. RPC Uses `SECURITY DEFINER` + Service Role — ✅ CORRECT**

- The Supabase client is created with `SUPABASE_SERVICE_ROLE_KEY` (line 123), which bypasses RLS. This is correct because the webhook handler is a trusted server-to-server integration.

**7. No Sensitive Information Exposed — ✅ CORRECT**

- Error responses contain only generic error codes (`invalid_signature`, `internal_error`, `method_not_allowed`). No secrets, IDs, or stack traces are leaked to the caller.
- Console.log statements log boolean checks (`!!webhookSecret`, `!!signature`) and safe identifiers (payment ID, order ID), never secret values.

**8. CORS Headers — ⚠️ MINOR CONCERN**

- **Lines 42–47**: CORS allows the `FRONTEND_URL` origin. For a webhook endpoint, CORS is irrelevant (Razorpay makes server-to-server calls, not browser requests). The wildcard fallback `"*"` is harmless because webhook responses contain no user-specific data.

#### Decision: `--no-verify-jwt` is SAFE for `razorpay-webhook`

| Check | Result |
|-------|--------|
| HMAC signature validation | ✅ Correct (constant-time, fail-closed) |
| Raw body used for signature | ✅ Correct (`req.text()` before `JSON.parse()`) |
| Secret loaded from server env | ✅ `RAZORPAY_WEBHOOK_SECRET` from `Deno.env.get()` |
| Invalid signatures rejected | ✅ HTTP 400, no business logic |
| Missing secret → 500 | ✅ Fail-closed |
| Duplicate events idempotent | ✅ Via `payment_events` table |
| Cannot update arbitrary orders | ✅ Requires valid HMAC + known Razorpay order ID |
| No secrets exposed | ✅ Only boolean checks and IDs logged |

**Final Decision**: **APPROVED — Deploy with `--no-verify-jwt`**

The function has robust, defense-in-depth security:
1. HMAC-SHA256 signature verification (the industry-standard authentication for webhooks)
2. Fail-closed when secret is missing
3. Idempotency via unique event tracking
4. Atomic RPC with `FOR UPDATE` locking

JWT verification at the gateway is **counterproductive** because Razorpay cannot send Supabase JWTs. The function's own HMAC verification is the correct security boundary.

**Required compensating controls**: None additional needed. Existing HMAC verification is sufficient. Ensure `RAZORPAY_WEBHOOK_SECRET` is set in staging environment variables.

---

### D005b — Security Review: `verify-payment` — `--no-verify-jwt` Decision

| Field | Value |
|-------|-------|
| **Date** | 2026-09-16 |
| **Function** | `supabase/functions/verify-payment/index.ts` (227 lines) |

#### Current Gateway Behavior

Same as `razorpay-webhook` — Supabase returns 401 before function code runs.

#### How `verify-payment` Is Called

The frontend calls this via `supabase.functions.invoke("verify-payment", {...})` in [paymentService.ts](file:///e:/HOP/src/services/paymentService.ts#L67-L85). The Supabase JS client automatically includes:
- `apikey: <anon_key>` header (always)
- `Authorization: Bearer <session_jwt>` header (if user has a session)

The Checkout page ([Checkout.tsx](file:///e:/HOP/src/pages/Checkout.tsx)) does NOT enforce authentication — it's a guest-friendly checkout. If a guest user (no session) completes Razorpay checkout, `supabase.functions.invoke` will send the `apikey` header but no valid JWT. With JWT verification enabled at the gateway, **guest checkouts will fail at the verification step**.

#### Function-Level Security Audit

**1. Razorpay Payment Signature Validation — ✅ IMPLEMENTED CORRECTLY**

- **Lines 17–46**: `verifySignature(orderId, paymentId, signature, secret)` computes HMAC-SHA256 of `{orderId}|{paymentId}` using `RAZORPAY_KEY_SECRET`.
- This matches Razorpay's documented verification method: `HMAC_SHA256(razorpay_order_id + "|" + razorpay_payment_id, key_secret)`.
- **Lines 37–45**: Constant-time comparison with XOR accumulation — correct.

**2. Razorpay Order ID and Payment ID Cross-Checked — ✅ CORRECT**

- The signature is computed over `orderId|paymentId`, so both must be correct for the signature to validate. Neither can be independently tampered with.
- **Line 172–178**: `confirm_paid_order` RPC is called with the Razorpay order ID from the request. The RPC does `SELECT ... FROM payments WHERE razorpay_order_id = p_razorpay_order_id FOR UPDATE` — this resolves the internal order via the Razorpay order ID that was stored when the order was created.

**3. Internal Order Resolved Securely — ✅ CORRECT**

- The function does NOT accept an internal `order_id` from the client. It accepts only Razorpay identifiers. The internal order is resolved by the RPC via the `payments.razorpay_order_id` foreign lookup. An attacker cannot directly specify which internal order to mark as paid.

**4. Amount and Currency Validation — ⚠️ NOT EXPLICITLY VALIDATED IN FUNCTION**

- The function does NOT separately validate amount/currency against the database. However:
  - The Razorpay signature proves that Razorpay itself generated the `razorpay_order_id` and `razorpay_payment_id`.
  - Razorpay's auto-capture mode (`payment_capture: 1`, set in `create-razorpay-order` line 293) ensures the payment is only captured for the exact amount of the Razorpay order.
  - The `create-razorpay-order` function sets the Razorpay order amount to match the database order total (or deposit amount).
  - **Risk**: An attacker would need to create a Razorpay order for a different amount AND forge a valid signature. The signature depends on `RAZORPAY_KEY_SECRET`, making this infeasible.
  - **Recommendation**: While not exploitable, adding an amount cross-check would be a defense-in-depth improvement for a future hardening pass.

**5. Caller Cannot Mark Another User's Order as Paid — ✅ SAFE**

- The function does NOT check user identity — it verifies the **Razorpay signature** instead. This is the correct pattern because:
  - The Razorpay Checkout SDK provides the signature only to the user who completed the payment.
  - The signature is computed with `RAZORPAY_KEY_SECRET` (server-side), so it cannot be forged.
  - Even if an attacker replays a valid signature, the idempotency check (step 4) returns `already_processed`.
  - Even if the payment was already processed by the webhook, `confirm_paid_order` is idempotent (checks `payment.status = 'paid'`).

**6. Invalid/Replayed Requests Handled — ✅ CORRECT**

- **Invalid signature** (lines 116–143): Payment marked as `failed`, inventory released. Returns HTTP 400.
- **Replayed valid request** (lines 146–166): `payment_events` check returns `{already_processed: true}` with HTTP 200.
- **RPC-level idempotency** (RPC lines 286–288): If `payment.status = 'paid'`, returns `{already_processed: true}`.

**7. No Client-Controlled Field Bypasses Verification — ✅ SAFE**

- The only client-controlled fields are `razorpay_order_id`, `razorpay_payment_id`, and `razorpay_signature`.
- All three are cross-validated via HMAC. Changing any one invalidates the signature.
- The function does NOT accept `order_id`, `amount`, `status`, or any other field that could bypass verification.

**8. No Sensitive Information Exposed — ✅ CORRECT**

- Error responses are generic: `"Missing verification fields"`, `"Invalid payment signature"`, `"verification_failed"`.
- Console logs show only `razorpay_order_id`, `razorpay_payment_id`, and boolean `has_signature` — never the actual signature or secret.

**9. Secret Availability Check — ⚠️ COULD BE HARDENED**

- **Line 70**: `Deno.env.get("RAZORPAY_KEY_SECRET")!` — uses non-null assertion. If the secret is not configured, this would throw at line 70, caught by the outer catch (line 219), returning HTTP 500. This is de-facto fail-closed but not as explicit as the webhook's dedicated check.
- **Recommendation**: Add an explicit null check for `RAZORPAY_KEY_SECRET` similar to the webhook's fail-closed pattern. Not a security vulnerability, but a robustness improvement.

#### Decision: `--no-verify-jwt` is SAFE for `verify-payment`

| Check | Result |
|-------|--------|
| Razorpay signature validation | ✅ Correct (HMAC-SHA256, constant-time) |
| Order ID + Payment ID cross-checked | ✅ Via combined HMAC input |
| Internal order resolved via DB lookup | ✅ Via `payments.razorpay_order_id` |
| Amount/currency validation | ⚠️ Indirect (via Razorpay auto-capture) — recommend adding explicit check |
| Cannot mark another user's order paid | ✅ Requires valid signature with server secret |
| Replay/idempotency | ✅ Via `payment_events` + RPC-level check |
| No client-controlled bypass | ✅ Only signature-verified Razorpay fields accepted |
| No secrets exposed | ✅ Generic error messages |

**Final Decision**: **APPROVED — Deploy with `--no-verify-jwt`**

The function's security model is based on **Razorpay signature verification**, not Supabase JWT. This is the standard Razorpay integration pattern. Adding Supabase JWT verification would:
1. Break guest checkout (the current design allows guest users to buy without creating an account)
2. Be redundant — the Razorpay signature already proves the payment is genuine
3. Add no meaningful security since the signature verification is the correct trust boundary

**Required compensating controls**: None for deployment. Two future hardening recommendations documented:
1. Add explicit `RAZORPAY_KEY_SECRET` null check (fail-closed)
2. Add amount/currency cross-validation after signature verification

---

### D006 — Platform Correction: Cloudflare Pages Staging Architecture

| Field | Value |
|-------|-------|
| **Date** | 2026-09-17 |
| **Context** | Previous testing erroneously assumed Vercel hosting (`hop-staging.vercel.app`), which returned `DEPLOYMENT_NOT_FOUND`. The actual HOP frontend is deployed via Cloudflare Pages. |
| **Decision** | Remove all references to Vercel and `hop-staging.vercel.app`. Adopt the Cloudflare Pages staging architecture with staging endpoint `https://hop-staging.chamankishoredharmapal.workers.dev/` and `https://hop.pages.dev/`. All frontend build assets are produced with Vite and distributed via Cloudflare Pages. |
| **Rationale** | Architectural accuracy. Vercel is not used. Cloudflare Pages natively supports Single Page Application (SPA) routing using `public/_redirects` and edge security headers via `public/_headers`. |
| **Impact** | Previous Vercel blocker is marked OBSOLETE and removed from active blockers list. Testing targets Cloudflare Pages staging. |
| **Status** | APPROVED |

---

### D007 — Staging CORS Alignment: `FRONTEND_URL` Secret Update

| Field | Value |
|-------|-------|
| **Date** | 2026-09-17 |
| **Context** | Browser checkout requests to Edge Functions failed CORS preflight OPTIONS check with error `Failed to send a request to the Edge Function`. The Edge Function returned `Access-Control-Allow-Origin: https://hop-staging.vercel.app` because `FRONTEND_URL` in Supabase staging secrets was configured to the obsolete Vercel domain. |
| **Decision** | Update Supabase staging secret `FRONTEND_URL` to `https://hop-staging.chamankishoredharmapal.workers.dev` via `supabase secrets set`. |
| **Rationale** | Aligns backend CORS policy with the actual Cloudflare staging origin, allowing browser preflight requests to succeed while preserving CORS protection against unauthorized domains. |
| **Impact** | Browser-level checkout successfully communicates with Supabase Edge Functions. |
| **Status** | **APPROVED & APPLIED** |

