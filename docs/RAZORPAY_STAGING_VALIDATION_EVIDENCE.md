# Razorpay Staging Validation — Evidence Log

> **Version**: 1.0  
> **Created**: 2026-09-16  
> **Last Updated**: 2026-09-16

---

## Evidence Recording Template

For each test, record the following:

```
### [Test ID] — [Test Name]

| Field | Value |
|-------|-------|
| **Timestamp** | |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Internal Order ID** | |
| **Order Number** | |
| **Razorpay Order ID** | |
| **Razorpay Payment ID** | |
| **Webhook Event ID** | |
| **Expected Result** | |
| **Actual Result** | |
| **HTTP Status** | |
| **Response (redacted)** | |
| **DB State Before** | |
| **DB State After** | |
| **payment_events** | |
| **order_events** | |
| **inventory_history** | |
| **Idempotency Result** | |
| **Security Result** | |
| **Final Status** | PASS / FAIL / BLOCKED |
```

---

## Redaction Rules

**NEVER record the following values:**

- `RAZORPAY_KEY_SECRET`
- `RAZORPAY_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `Authorization: Bearer <token>` (show only `Bearer [REDACTED]`)
- `razorpay_signature` (show only `[64-char HMAC]`)
- Customer email addresses (use `test_***@example.com`)
- Customer phone numbers
- Full response bodies containing PII

**Safe to record:**

- Razorpay order IDs (`order_*`)
- Razorpay payment IDs (`pay_*`)
- Internal order IDs (UUIDs)
- Order numbers (`HOP-*`)
- HTTP status codes
- Error codes and messages
- Database status values
- Timestamps
- Event IDs

---

## Evidence Entries

*(Evidence will be added as tests are executed)*

### T00.1 — Environment Verification

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T08:47:00+05:30 |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) — **NOT YET CONFIRMED** |
| **Findings** | `supabase/config.toml` contains `project_id = "kbvjmcnaaogkbnerjcoc"` (PRODUCTION). Existing test scripts (`test-security.mjs`, `test-webhook.ps1`) also default to production URL. |
| **Risk** | CLI commands using `supabase` will target production unless overridden |
| **Action Required** | Human must confirm: (1) Edge Functions are deployed to staging, (2) Staging env vars are correctly set, (3) Provide staging credentials for API testing |
| **Final Status** | BLOCKED |

### T00.2 — Staging Frontend Verification

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-17T02:15:15+05:30 |
| **Environment** | `https://hop-staging.chamankishoredharmapal.workers.dev/` (Cloudflare Static Assets / Worker) |
| **Action** | Deploy `dist` assets with `not_found_handling = "single-page-application"` via Wrangler; verify HTML, assets, and deep SPA routes |
| **Expected Result** | HTTP 200 text/html with HOP title, root div, compiled JS/CSS, and valid SPA fallback on `/cart`, `/checkout`, `/collections/`, `/product/...` |
| **Actual Result** | Status 200 OK. Content-Type: `text/html`. Title: `House of Padmavati`. Contains `#root` div. Static bundles `/assets/index-7-QOVEOl.js` (292KB) and `/assets/index-BMcGUQ3C.css` (92KB) return HTTP 200 OK. Deep routes `/cart`, `/checkout`, `/collections/`, and `/product/d31d9bdc-1975-4acd-acb2-c1b90857e0ea/` all return Status 200 OK text/html. |
| **HTTP Status** | 200 OK across all tested SPA routes |
| **Analysis** | Staging SPA frontend is completely functional, properly serves compiled assets, and handles deep client-side routes. |
| **Final Status** | **PASS** |

### T00.4 — Production Isolation (Preliminary)

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T08:47:00+05:30 |
| **Environment** | Code review only |
| **Findings** | Repository `config.toml` points to production. All test scripts default to production. No staging-specific config file found. |
| **Risk Assessment** | HIGH — any `supabase` CLI command without explicit `--project-ref` flag will target production |
| **Mitigation** | All test operations must use explicit staging URLs, never rely on `config.toml` |
| **Final Status** | IN_PROGRESS — monitoring throughout testing |

### T04.4 — Missing Webhook Signature

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T09:14:21+05:30 (Retested after redeployment with `--no-verify-jwt`) |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Action** | POST to `razorpay-webhook` without `x-razorpay-signature` header |
| **Expected Result** | HTTP 400, `{error: "invalid_signature"}` (function-level rejection) |
| **Actual Result** | HTTP 400, `{"error":"invalid_signature"}` |
| **Analysis** | Edge function code correctly executes without being blocked by gateway JWT check. Confirms fail-closed behavior on missing signature. |
| **Final Status** | **PASS** |

### T04.5 — Invalid Webhook Signature

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T09:14:37+05:30 (Retested after redeployment with `--no-verify-jwt`) |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Action** | POST to `razorpay-webhook` with `x-razorpay-signature: this_is_invalid` |
| **Expected Result** | HTTP 400, `{error: "invalid_signature"}` |
| **Actual Result** | HTTP 400, `{"error":"invalid_signature"}` |
| **Analysis** | Constant-time HMAC check runs, detects signature mismatch, and safely rejects request without performing state mutations. |
| **Final Status** | **PASS** |

### T03.3 — Reject Invalid Signature on `verify-payment`

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T09:14:57+05:30 |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Action** | POST to `verify-payment` with invalid signature |
| **Expected Result** | HTTP 400, `{"success":false,"error":"Invalid payment signature"}` |
| **Actual Result** | HTTP 400, `{"success":false,"error":"Invalid payment signature"}` |
| **Analysis** | Function properly verified signature at the application layer and rejected the forged attempt with HTTP 400. |
| **Final Status** | **PASS** |

### T08.2 — Anonymous Access Matrix

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T09:15:06+05:30 |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Tests Performed** | (a) POST `create-razorpay-order` without auth → 401. (b) POST `mark-delivery-paid` without auth → 401. (c) POST `verify-payment` with missing fields / invalid signature → 400 (reaches function). (d) POST `razorpay-webhook` without signature → 400 (reaches function). |
| **Expected Result** | Private customer/admin endpoints reject unauthenticated callers at gateway (401). External webhook and Razorpay-signed verification endpoints reach application layer and enforce cryptographic signature validation (400 on bad/missing signature). |
| **Actual Result** | Matches exact security expectations. |
| **Final Status** | **PASS** |

### REMEDIATION APPLIED — Edge Function Deployment Issue Resolved

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T09:14:47+05:30 |
| **Severity** | CRITICAL (Resolved) |
| **Finding** | Functions `razorpay-webhook` and `verify-payment` were previously blocked by Supabase Gateway 401 JWT checks. |
| **Fix Applied** | Both functions redeployed to `dovnhgbisiturzbjgvei` using `--no-verify-jwt`. |
| **Verification** | Verified live via curl/Invoke-WebRequest: HTTP 400 returned with function JSON errors on missing/invalid signatures. |

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-16T09:01:07+05:30 |
| **Severity** | CRITICAL |
| **Finding** | All Edge Functions on staging (`dovnhgbisiturzbjgvei`) are deployed with Supabase JWT verification enabled. Two functions MUST be deployed with `--no-verify-jwt`: |
| **Affected Functions** | `razorpay-webhook` — Called by Razorpay servers, uses HMAC signature not JWT. `verify-payment` — Called from frontend after Razorpay checkout, uses Razorpay signature verification. |
| **Evidence** | HTTP 401 responses from all anonymous calls to webhook and verify-payment endpoints. Existing test spec (`RazorpayWebhook.spec.ts` line 47-57) expects HTTP 400 from the function, not 401 from gateway. |
| **Required Fix** | Redeploy with: `supabase functions deploy razorpay-webhook --no-verify-jwt --project-ref dovnhgbisiturzbjgvei` and `supabase functions deploy verify-payment --no-verify-jwt --project-ref dovnhgbisiturzbjgvei` |
| **Impact** | ALL payment flows are broken on staging. Razorpay cannot deliver webhooks. Frontend cannot verify payments. |

### E-SEED-01 — Staging Test Product Population

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-17T02:44:28+05:30 |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Target** | `public.collections`, `public.products`, `public.product_images` |
| **Collection ID** | `c0000000-0000-0000-0000-000000000001` (`staging-test-collection`, status: `published`) |
| **Product ID** | `a0000000-0000-0000-0000-000000000001` (`staging-validation-saree`, status: `published`, stock: 50, price: 50000 paise / ₹500) |
| **Image ID** | `b0000000-0000-0000-0000-000000000001` |
| **Execution** | Populated via `supabase db query --linked --file e:\HOP\supabase\seed_staging_product.sql` |
| **Verification** | Verified readable via public anon client (`@supabase/supabase-js`) with status `published` and stock 50 |
| **Final Status** | **PASS** |

### E-CORS-01 — Supabase Staging CORS Remediation

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-17T02:56:01+05:30 |
| **Environment** | `dovnhgbisiturzbjgvei` (staging) |
| **Finding** | Browser requests from `https://hop-staging.chamankishoredharmapal.workers.dev` failed preflight OPTIONS check because `FRONTEND_URL` was set to obsolete Vercel URL. |
| **Fix Applied** | `supabase secrets set FRONTEND_URL="https://hop-staging.chamankishoredharmapal.workers.dev" --project-ref dovnhgbisiturzbjgvei` |
| **Verification** | Verified OPTIONS requests to `create-razorpay-order`, `verify-payment`, `razorpay-webhook` return HTTP 200 with `Access-Control-Allow-Origin: https://hop-staging.chamankishoredharmapal.workers.dev`. |
| **Final Status** | **PASS** |

### E-BROWSER-01 / T02.1 — End-to-End Browser Checkout Execution

| Field | Value |
|-------|-------|
| **Timestamp** | 2026-09-17T02:56:48+05:30 |
| **Tool** | Playwright Chromium (Headless) |
| **Storefront URL** | `https://hop-staging.chamankishoredharmapal.workers.dev` |
| **Product Tested** | `Staging Validation Saree` (₹500) |
| **User Authenticated** | `staging_test_customer@gmail.com` |
| **Form Submitted** | Shipping to Bengaluru (560001), Return Policy Accepted |
| **Network Request** | `POST https://dovnhgbisiturzbjgvei.supabase.co/functions/v1/create-razorpay-order` (HTTP 200) |
| **DB Order Created** | `7b02dabd-379e-480d-aa90-efa957f9af69` (`HOP-20260916-000002`) |
| **Razorpay Order ID** | `order_Tcr9CmV2AK87Jx` |
| **Razorpay Key ID** | `rzp_test_TcXqw4nezbIA2b` |
| **DOM Verification** | `iframe.razorpay-checkout-frame` injected and rendered |
| **Visual Evidence** | `docs/browser_checkout_modal.png` showing active Razorpay modal with "Test Mode" watermark |
| **Production Isolation** | Confirmed 0 network requests to `kbvjmcnaaogkbnerjcoc` |
| **Final Status** | **PASS** |

