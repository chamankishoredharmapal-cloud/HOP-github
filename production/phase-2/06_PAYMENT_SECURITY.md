# Phase 2 — Payment Security & State Integrity

**Audit Timestamp**: 2026-08-16T04:54:00+05:30

## 1. Webhook Signature Verification

### Vulnerability Context
Standard string equality (`===`) in V8/Node.js short-circuits on the first mismatched character. This allows attackers to iteratively guess an HMAC signature by measuring the response time (timing attack).

### Remediation
The `razorpay-webhook` and `verify-payment` Edge Functions were updated to include a custom constant-time string comparison utility:

```typescript
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
```

This ensures that the time taken to verify a signature is independent of the number of correct characters, fully mitigating the timing attack vector.

## 2. State Machine Integrity

### Order Flow
Orders transition through a strict state machine: `pending` -> `paid` -> `processing` -> `shipped` -> `delivered`.
- Edge functions enforce idempotency by ignoring requests for orders that are already `paid` or `cancelled`.
- Inventory is reserved during `create_order` (status `reserved`).
- If an order is cancelled or times out, `release-inventory` returns items to `available`.

### Payment Flow
- `payment_events` table acts as an append-only ledger for all Razorpay interactions.
- `process_payment_verification` RPC is utilized to atomically update the `payments` and `orders` tables upon successful verification, ensuring that partial failures do not leave the database in an inconsistent state.

## Conclusion
The payment infrastructure is secure, resistant to signature forgery via timing attacks, and maintains robust state consistency under concurrent or duplicate webhook deliveries.
