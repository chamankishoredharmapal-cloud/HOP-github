# COND-02 Production Supabase Edge Functions Evidence

**Date**: 2026-09-26 14:55:00
**Production Project**: `kbvjmcnaaogkbnerjcoc` (PRODUCTION-HOP)
**Region**: `ap-south-1`
**PostgreSQL Version**: 17.6.1.155

---

## 1. Function Deployment Status (8/8 ACTIVE)

| Function Slug | Status | Version | JWT Verification | SHA256 Fingerprint |
|---------------|--------|---------|------------------|-------------------|
| `create-razorpay-order` | ACTIVE | 21 | False (internal auth) | `d3e01381295882ff9b7f8c59aa32255766f4373b7b9093055c59778fb3ab84dc` |
| `verify-payment` | ACTIVE | 22 | False (timing-safe HMAC) | `a874c8ce23dafff07f36e1f63a8be590f4685cba17921bfd21d04c55f58a37db` |
| `razorpay-webhook` | ACTIVE | 20 | False (gateway bypass for RZP webhook caller) | `0880efebd350d5c0db5f808d039dcf617a62dd26d8f1b1fafe63e0d5f0b60f4e` |
| `get-order-confirmation` | ACTIVE | 4 | True | `80e0d88e5f300b254ef60ebd5da8a68d57b93ed12e1f24934c42fb265e1242e0` |
| `cancel-payment` | ACTIVE | 1 | True | `16f97296f43cad326908af00b94d3e4ed5022e46b6f2d9b5e5466d11ddd2092a` |
| `mark-delivery-paid` | ACTIVE | 1 | True | `aad2c54292832d09fb8316614c49f32caab7a9654a4c613a9a70fb6f015099ec` |
| `release-inventory` | ACTIVE | 1 | True | `cedb75e9847a227d4832060d900a9a9aa979ad51eb5ad0533b51caaba8d1c562` |
| `send-email` | ACTIVE | 1 | True | `b99ec623baa84bcba542310708e6d1c98cc5beeb9543ece2d8b2793138f4d5df` |

---

## 2. Secrets Verification (kbvjmcnaaogkbnerjcoc)

All required production secrets exist in production vault:
- `FRONTEND_URL`: CONFIGURED (`https://houseofpadmavati.com`)
- `RAZORPAY_KEY_ID`: CONFIGURED
- `RAZORPAY_KEY_SECRET`: CONFIGURED
- `RAZORPAY_WEBHOOK_SECRET`: CONFIGURED
- `SUPABASE_ANON_KEY`: CONFIGURED
- `SUPABASE_DB_URL`: CONFIGURED
- `SUPABASE_JWKS`: CONFIGURED
- `SUPABASE_PUBLISHABLE_KEYS`: CONFIGURED
- `SUPABASE_SECRET_KEYS`: CONFIGURED
- `SUPABASE_SERVICE_ROLE_KEY`: CONFIGURED
- `SUPABASE_URL`: CONFIGURED

---

## 3. Post-Deployment Endpoint Verifications

### 3.1 Webhook Endpoint Live Test
- **Command**: `curl -i -X POST https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/razorpay-webhook -H "Content-Type: application/json" -d "{}"`
- **Response**: `HTTP/1.1 400 Bad Request`
- **Body**: `{"error":"invalid_signature"}`
- **Evaluation**: PASS. Webhook endpoint is alive, reaches Edge Runtime without 500 error, and correctly executes fail-closed constant-time signature validation.

### 3.2 CORS Headers Test
- **Command**: `curl -i -X OPTIONS https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/create-razorpay-order`
- **Response**: `HTTP/1.1 200 OK`
- **Headers**: `Access-Control-Allow-Origin: https://houseofpadmavati.com`, `access-control-allow-methods: POST, OPTIONS`
- **Evaluation**: PASS. Correct production origin is served.

### 3.3 Confirmation Endpoint CORS Test
- **Command**: `curl -i -X OPTIONS https://kbvjmcnaaogkbnerjcoc.supabase.co/functions/v1/get-order-confirmation`
- **Response**: `HTTP/1.1 200 OK`
- **Headers**: `Access-Control-Allow-Origin: https://houseofpadmavati.com`
- **Evaluation**: PASS.

---

## 4. Verification Verdict
COND-02 COMPLETE. All 8 Edge Functions deployed to production project `kbvjmcnaaogkbnerjcoc` and verified active.
