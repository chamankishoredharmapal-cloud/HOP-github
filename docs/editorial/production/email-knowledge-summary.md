# Knowledge Summary: Email Templates

## Source Documents Consulted
- `docs/editorial/production/PHASE_7_CONTENT_PRODUCTION_MANUAL.md` — Section 4.11 Email Templates specification.
- `src/services/emailService.ts` — Existing transaction emails.
- `docs/research/brand-strategy/target-audience.md` — Core persona expectations.

## Email Types Required
1. **Welcome Email:** For new newsletter/account signups.
2. **Order Confirmation:** Post-purchase validation.
3. **Payment Success/Failed:** Transactional notifications.
4. **Shipment / Delivered:** Logistics with a high-touch feel.
5. **Nurture / Journal Notification:** Content-led emails (not just sales).
6. **Password Reset:** Operational necessity.

## Knowledge Gaps
- None. The technical payload structures are defined in `emailService.ts`.

## Editorial Constraints
- **Primary Emotion:** Anticipation (Welcome/Shipping), Confidence (Orders).
- **Secondary Emotion:** Trust.
- **Arc:** Short-form revelation.
- **No forbidden words:** Luxury, Premium, Exquisite, Perfect, Magic, Authentic.
- **Tone:** A quiet letter from a custodian, not an automated e-commerce blast.
