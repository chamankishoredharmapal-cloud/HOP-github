# Specification: Checkout

## Purpose
Collect customer information and process payment to complete the purchase.

## Functional Requirements
- Multi-step form: Shipping → Payment → Review → Confirmation
- Progress indicator (step 1 of 3, etc.)
- Cart summary sidebar (always visible on desktop)
- Shipping form: name, email, phone, address, city, state, pincode
- Payment section: Razorpay checkout integration
- Order review: items, quantities, prices, totals
- Order confirmation: order number, items, shipping address, estimated delivery
- Form validation via Zod (inline errors, not toasts)
- Loading states during submission and payment processing

## User Journey
1. User clicks "Proceed to Checkout" from cart
2. Sees shipping form with progress indicator
3. Fills in shipping details, clicks "Continue to Payment"
4. Razorpay checkout modal opens
5. User completes payment (UPI, card, net banking, wallet)
6. On success → order review → confirmation page
7. On failure → error message with retry option

## Edge Cases
- Invalid form fields → inline error messages, focus first error
- Payment failure → clear error, retry button, cart preserved
- Network timeout during payment → check order status, retry
- Browser close during checkout → cart preserved for next visit
- Out-of-stock during checkout → notification, item removed
- Razorpay SDK fails to load → retry button, fallback message
- Duplicate submission (double click) → prevent with loading state

## Acceptance Criteria
- Form validation: all fields validated on blur and submit
- Progress indicator: shows current step, visited steps clickable
- Cart summary: updates in real-time, shows all items
- Payment: Razorpay modal opens with correct amount
- Success: order confirmation page with order number
- Failure: error message, retry preserves form data
- Form data persists on back/forward navigation

## Analytics Events
- `checkout_start` { item_count, total_value }
- `checkout_step_completed` { step_number, step_name }
- `checkout_payment_attempt` { payment_method }
- `checkout_payment_success` { order_id, total_value }
- `checkout_payment_failure` { error_code, error_message }
- `checkout_abandoned` { step_number, time_on_page }

## Accessibility Requirements
- Form fields: labels, error messages with aria-live
- Step navigation: keyboard accessible, announces current step
- Progress indicator: aria-label="Checkout progress"
- Payment modal: focus trap, accessible
- Confirmation: order number in h1, clear visual hierarchy

## Performance Targets
- Form loads < 1s (minimal JS for checkout page)
- Payment modal opens < 2s
- LCP < 2s (text-heavy page, no hero images)
- Cart summary sidebar: sticky on desktop

## Future Expansion
- Saved addresses for returning customers
- Multiple shipping options (standard, express)
- Gift wrapping option
- Order notes / special instructions
- Split payment (gift card + card)
- One-click checkout (saved payment method)
