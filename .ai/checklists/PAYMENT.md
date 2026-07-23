# Payment Engineering Checklist

## Razorpay Integration
- [ ] Razorpay SDK loaded dynamically
- [ ] Razorpay key from environment variable
- [ ] Order creation Edge Function
- [ ] Payment verification Edge Function
- [ ] Webhook handler Edge Function

## Create Razorpay Order (Edge Function)
- [ ] Receives amount, currency, receipt
- [ ] Creates order via Razorpay API
- [ ] Returns order_id and amount
- [ ] Error handling (invalid params, API failure)
- [ ] CORS headers
- [ ] Input validation

## Verify Payment (Edge Function)
- [ ] Receives payment_id, order_id, signature
- [ ] Validates HMAC SHA256 signature
- [ ] Creates order in database
- [ ] Returns success/error
- [ ] Idempotency (prevent double processing)
- [ ] Error handling

## Webhook (Edge Function)
- [ ] Signature validation
- [ ] Event type handling (payment.captured, order.paid)
- [ ] Order status update
- [ ] Error handling
- [ ] Logging for audit

## Client Integration
- [ ] usePayment hook (state machine: idle → creating → processing → success/failure)
- [ ] Payment modal opens correctly
- [ ] Payment success: shows confirmation
- [ ] Payment failure: shows error with retry
- [ ] Loading states throughout
- [ ] Order confirmation page renders

## Security
- [ ] No card data on client
- [ ] Server-side verification (never trust client)
- [ ] Webhook secret validation
- [ ] Rate limiting on order creation
- [ ] CORS restricted to production domain

## Testing
- [ ] E2E: payment modal opens
- [ ] E2E: payment success flow (mock)
- [ ] E2E: payment failure with retry
- [ ] E2E: order confirmation displays
- [ ] E2E: edge function error handling
- [ ] Webhook signature validation test
- [ ] Idempotency test

## Monitoring
- [ ] Payment success rate monitored
- [ ] Payment failure rate alerted (> 5%)
- [ ] Webhook delivery success rate
- [ ] Order creation error rate
- [ ] Average payment processing time
