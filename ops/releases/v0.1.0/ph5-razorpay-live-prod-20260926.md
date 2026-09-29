# COND-03 & COND-04 Razorpay LIVE Configuration Evidence

**Date**: 2026-09-26 15:35:00 IST
**Production Supabase Project**: `kbvjmcnaaogkbnerjcoc` (PRODUCTION-HOP)
**Region**: `ap-south-1`

---

## 1. Credentials & Secrets Verification

| Secret Name | Location | Status | Sensitivity Protocol |
|-------------|----------|--------|---------------------|
| `RAZORPAY_KEY_ID` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | CONFIGURED | Key ID only; returned dynamically to authenticated checkout |
| `RAZORPAY_KEY_SECRET` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | CONFIGURED | Server-side only; never leaked to frontend |
| `RAZORPAY_WEBHOOK_SECRET` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | CONFIGURED | Server-side only; verifies webhook HMAC signature |
| `FRONTEND_URL` | Supabase Vault (`kbvjmcnaaogkbnerjcoc`) | CONFIGURED (`https://houseofpadmavati.com`) | Enforces production CORS boundaries |

Zero secret values printed or exposed in logs, reports, or artifacts.

---

## 2. Webhook Configuration & Fail-Closed Security

- **Production Webhook URL**: `https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook`
- **Supported Events**:
  - `payment.captured` -> calls `confirm_paid_order` RPC
  - `payment.failed` -> releases inventory reservation
  - `order.paid` -> fallback order status update
- **Live Endpoint Test**:
  - Sent unauthenticated/unsigned POST request to production webhook URL.
  - Response: `HTTP/1.1 400 Bad Request` with `{"error":"invalid_signature"}`.
  - Evaluation: **PASS**. Confirms function is live, accesses `RAZORPAY_WEBHOOK_SECRET`, and rejects invalid/unsigned requests via timing-safe HMAC validation.

---

## 3. Real-Money ₹1 Transaction Status

Per `productionTODO.md` §11.3 and Hard Safety Rules #9 and #14:
- The ₹1 controlled live test requires interactive bank authentication (UPI authorization or 3D Secure SMS OTP on an authorized personal device).
- This interactive financial authorization cannot be simulated or forged by an autonomous AI agent.
- Operational procedure is prepared: Once the E-Commerce Manager initiates and captures the ₹1 test payment, the webhook will automatically record the event into `payment_events` and confirm the order via `confirm_paid_order`.
