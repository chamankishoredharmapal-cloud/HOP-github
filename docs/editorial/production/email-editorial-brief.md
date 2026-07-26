# Editorial Brief: Email Templates

## Strategic Mandate
- **Purpose:** Ensure every touchpoint, from an order receipt to a shipping notification, feels like a deliberate, carefully penned letter from the atelier.
- **Business Goal:** High open rates, low unsubscribe rates, and increased customer lifetime value.
- **Brand Goal:** Make transactional emails a brand-building moment.

## Emotional Targeting
- **Primary Emotion:** Calm anticipation.
- **Secondary Emotion:** Trust.
- **Customer Journey Stage:** Belonging.

## Reader
- **Primary Persona:** The Woman Who Chooses Well.
- **Reader Intent:** Checking order status or engaging with new cultural content.
- **Trust Requirement:** Emails must not yell "SALE." They must whisper.

## Content Priorities
1. **Pacing:** Short sentences. Plenty of white space.
2. **Subject Lines:** Descriptive and quiet. E.g., "Your order is confirmed" instead of "CONGRATS! YOUR ORDER IS IN!"
3. **Sign-off:** Always human, rooted in the atelier (e.g., "From the atelier," or "House of Padmavati").

## Production Scope
1. Update `src/services/emailService.ts`.
2. Add new `EmailType` values for `welcome` and `nurture`.
3. Rewrite existing templates (Order Confirmed, Payment, Shipment, Delivered, Password Reset) with editorial depth.
4. Add builder functions for Welcome and Nurture emails.

## Version
- **Brief Version:** 1.0
- **Status:** Approved
- **Approved By:** Editorial Lead
