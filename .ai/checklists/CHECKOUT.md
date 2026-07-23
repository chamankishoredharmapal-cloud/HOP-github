# Checkout Engineering Checklist

## Layout
- [ ] Multi-step checkout (Shipping → Payment → Review)
- [ ] Progress indicator
- [ ] Cart summary (always visible)
- [ ] Shipping information form
- [ ] Contact information form
- [ ] Payment section (Razorpay integration)
- [ ] Order review before submission
- [ ] Order confirmation page

## Components
- [ ] CheckoutForm (multi-step)
- [ ] ShippingForm (name, address, phone, email)
- [ ] PaymentSection (Razorpay button/iframe)
- [ ] OrderReview (items, totals)
- [ ] OrderConfirmation (order number, details)
- [ ] ProgressStepper (step indicator)

## Form Validation (Zod)
- [ ] Email: valid format
- [ ] Name: required, min 2 chars
- [ ] Phone: valid Indian phone format
- [ ] Address: required, min 10 chars
- [ ] City: required
- [ ] State: required
- [ ] Pincode: valid Indian pincode (6 digits)
- [ ] Validation on blur
- [ ] Validation on submit
- [ ] Inline error messages

## Payment Integration
- [ ] Razorpay order creation (Edge Function)
- [ ] Razorpay checkout modal opens
- [ ] Payment success handler
- [ ] Payment failure handler
- [ ] Payment verification (Edge Function)
- [ ] Loading state during payment
- [ ] Error state with retry

## Security
- [ ] No card data handled on client
- [ ] Razorpay checkout (PCI DSS Level 1)
- [ ] Server-side payment verification
- [ ] No sensitive data in URL
- [ ] HTTPS enforced

## Accessibility
- [ ] Form fields: labels, error messages with aria-live
- [ ] Step navigation: keyboard accessible
- [ ] Progress indicator: announces current step
- [ ] Payment: clear expectations
- [ ] Confirmation: order number clearly visible

## Responsive
- [ ] Mobile: single column, full-width
- [ ] Desktop: form left, summary right (sticky)

## Testing
- [ ] E2E: form validation works (all fields)
- [ ] E2E: shipping form submission
- [ ] E2E: payment modal opens
- [ ] E2E: payment success flow
- [ ] E2E: payment failure with retry
- [ ] E2E: order confirmation displays
- [ ] E2E: empty cart redirected to cart page
- [ ] E2E: cart cleared after successful order
