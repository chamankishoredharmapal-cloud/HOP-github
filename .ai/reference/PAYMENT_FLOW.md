# Payment Flow — House of Padmavati

> From: old `security/PAYMENT_SECURITY.md`

## Architecture

```
Client → Edge Function (create-razorpay-order) → Razorpay API → order_id
Client → Razorpay Checkout (PCI DSS iframe, handles card data)
Client → Edge Function (verify-payment) → HMAC verification → Order in DB
Razorpay → Edge Function (razorpay-webhook) → HMAC verification → Status update
```

## Security

- **Never** handle card data on our servers — Razorpay Checkout is PCI DSS Level 1.
- Payment verification is server-side only (HMAC SHA256). Never trust the client.
- Webhook signature verified with `crypto.timingSafeEqual`.
- All payment events logged for audit trail.

## Edge Functions

### create-razorpay-order
- Input: `{ amount (paise), currency ("INR"), receipt }`
- Calls Razorpay Orders API with `RAZORPAY_KEY_SECRET`
- Returns: `{ order_id, amount }`

### verify-payment
- Input: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature }`
- Validates: HMAC SHA256 of `order_id + "|" + payment_id` against signature
- On success: creates order in `orders` table via service_role client
- Returns: `{ success: true, order }`

### razorpay-webhook
- Validates: `x-razorpay-signature` header with webhook secret
- Handles events: `payment.captured`, `order.paid`
- Updates order status in database

## PCI Compliance

HOP never stores, processes, or transmits card data. Razorpay Checkout handles all card entry via iframe (PCI DSS Level 1). We store only: order_id, payment_id, amount, status, customer email.

## Monitoring

- Payment success rate, failure rate (> 5% alert), webhook delivery rate
- All failures logged for audit trail
