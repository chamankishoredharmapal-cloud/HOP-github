# Emails Engineering Checklist

## (Future Feature — Placeholder)

## Email Types
- [ ] Order confirmation
- [ ] Order status update
- [ ] Shipping confirmation with tracking
- [ ] Delivery confirmation
- [ ] Password reset
- [ ] Welcome email (if accounts are implemented)
- [ ] Abandoned cart reminder (future)
- [ ] Newsletter (future)

## Requirements

### Order Confirmation
- [ ] Triggered immediately after successful payment
- [ ] Contains order number, items, total, shipping address
- [ ] Includes estimated delivery date
- [ ] Includes customer support contact
- [ ] Branded template (House of Padmavati design)
- [ ] Responsive design (mobile-friendly)
- [ ] Plain text version

### Order Status Updates
- [ ] Triggered on status change in admin
- [ ] Contains current status and next steps
- [ ] Tracking link (if shipped)
- [ ] Estimated delivery updates

### Password Reset
- [ ] Triggered from forgot password flow
- [ ] Secure reset link with expiration
- [ ] Clear instructions

## Technical Implementation

### Email Service
- [ ] Choose provider: Resend, SendGrid, Postmark, or AWS SES
- [ ] Template management (templates in code or provider)
- [ ] Edge Function or Supabase Database Webhook for sending
- [ ] Rate limiting (avoid spam flags)
- [ ] Bounce handling
- [ ] Unsubscribe link (marketing emails)

### Templates
- [ ] Branded header and footer
- [ ] Responsive HTML
- [ ] Plain text fallback
- [ ] Dynamic content (order details, customer name)
- [ ] Consistent with brand design (jasmine, teal, cormorant garamond)

## Testing
- [ ] Test emails sent to test addresses
- [ ] Check rendering in major email clients (Gmail, Outlook, Apple Mail)
- [ ] Verify links work
- [ ] Check spam score
- [ ] Test delivery timing
