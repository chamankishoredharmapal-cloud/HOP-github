# Specification: Payment

## Purpose
Process payments securely via Razorpay, handle the full order lifecycle from creation to verification.

## Functional Requirements
- Create Razorpay order via Edge Function (server-side)
- Open Razorpay Checkout modal (PCI DSS Level 1, handles card data)
- Verify payment signature via Edge Function (HMAC SHA256)
- Create order in database on successful verification
- Handle Razorpay webhooks (payment.captured, order.paid)
- Update order status based on webhook events
- Loading, success, error states for all payment operations
- Idempotency: prevent duplicate order creation

## User Journey
1. User submits checkout form → loading state
2. Razorpay order created → modal opens with amount
3. User completes payment (UPI, card, net banking, wallet)
4. Payment verified server-side → order created → confirmation page
5. Webhook confirms → order status updated asynchronously

## Edge Cases
- Payment failure → clear error, retry preserves cart
- Network timeout → check payment status, show appropriate message
- Razorpay SDK load failure → retry button, contact support
- Duplicate webhook → idempotency check (by payment_id)
- Webhook signature invalid → reject with 400
- Order creation fails after payment → manual reconciliation via Razorpay dashboard

## Acceptance Criteria
- Order creation: Edge Function calls Razorpay API, returns order_id
- Payment verification: HMAC SHA256 signature validated server-side
- Order creation: database insert after successful verification
- Webhook handling: signature validation, event processing, status update
- Error handling: user-friendly messages for all failure modes
- Loading states: button shows spinner, modal shows processing

## Analytics Events
- `payment_order_creation` { amount, receipt }
- `payment_order_created` { razorpay_order_id }
- `payment_modal_opened` { razorpay_order_id }
- `payment_success` { razorpay_payment_id, order_id }
- `payment_failure` { error_code, error_message }
- `payment_webhook_received` { event_type, razorpay_order_id }

## Accessibility Requirements
- Payment modal: focus trap, keyboard operable, Escape to close
- Loading states: announced via aria-live
- Error messages: clear, actionable
- Confirmation: order number clearly visible

## Performance Targets
- Order creation API: < 2s
- Payment verification API: < 2s
- Webhook processing: < 1s (respond 200 immediately)

## Future Expansion
- Saved payment methods (Razorpay tokens)
- EMI options display
- Multi-currency support
- Partial refunds via admin panel
- Payment analytics dashboard
