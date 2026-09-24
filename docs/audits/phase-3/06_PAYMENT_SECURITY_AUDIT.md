# Phase 3 — Payment Security & Verification Audit

**Audit Timestamp**: 2026-08-16T05:27:00+05:30  

---

## 1. Razorpay Order Creation & Authority

- **Server-Side Price Authority**:
  - The client is never trusted for order amounts.
  - In `create_order` RPC, the backend recalculates `selling_price * quantity` by querying the `products` table directly and adding shipping costs.
  - The amount passed to Razorpay is strictly `orderTotal` (in paise).
- **IDOR Protection on Retry Path**:
  - `create-razorpay-order` verifies that if an `order_id` is supplied for retry, the authenticated user matches `order.customers.email` (or is an admin via `is_admin`).
  - Rejects attempts to retry orders belonging to another customer with HTTP 403 Forbidden.

---

## 2. Cryptographic Signature Verification

### Constant-Time Comparison (`verify-payment` & `razorpay-webhook`)
```typescript
async function verifySignature(orderId: string, paymentId: string, signature: string, secret: string): Promise<boolean> {
  const text = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  const expected = Array.from(new Uint8Array(sigBytes)).map((b) => b.toString(16).padStart(2, "0")).join("");

  if (expected.length !== signature.length) return false;
  const a = encoder.encode(expected);
  const b = encoder.encode(signature);
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}
```
- Eliminates timing side-channel attacks by comparing every byte in constant time regardless of early mismatch.

---

## 3. Idempotency & Dual-Path Resilience

- **Dual Path (Client verify-payment vs. Razorpay Webhook)**:
  - Both paths invoke `confirm_paid_order`.
  - The first path to execute sets `payments.status = 'paid'`, `orders.status = 'confirmed'`, deducts stock, and records `payment_events`.
  - The second path to arrive detects `payments.status = 'paid'` or finds the key in `payment_events` and immediately returns `{ success: true, already_processed: true }`.
  - Zero double deductions, zero state corruption.
