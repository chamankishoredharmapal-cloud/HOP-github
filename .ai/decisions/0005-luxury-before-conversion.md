# ADR-0005: Luxury Before Conversion

**Status**: Accepted  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
Standard e-commerce practices prioritize conversion rate optimization (CRO): urgency timers, exit-intent popups, limited-time offers, social proof notifications, aggressive CTAs. These tactics conflict with the luxury brand positioning of House of Padmavati.

## Decision
Brand experience and luxury positioning take precedence over conversion optimization. The following tactics are explicitly prohibited:
- Countdown timers ("Sale ends in 2 hours")
- Exit-intent popups ("Wait! 10% off before you leave")
- Fake social proof ("23 people are viewing this")
- Aggressive upsells on checkout ("Customers also bought")
- Notification permission requests
- Cookie consent that blocks content
- Auto-playing videos with sound
- Chatbots (use concierge-style contact instead)
- Urgency messaging ("Only 3 left — order now")

## Consequences
### Positive
- Stronger brand trust and positioning
- Higher average order value (attracts quality-over-price shoppers)
- Lower bounce rate from discerning customers
- Differentiation from mass-market competitors

### Negative
- Lower conversion rate than aggressively optimized sites
- Slower growth in active user metrics
- Requires stronger organic marketing to drive traffic
- Sales/clearance events must be handled with editorial grace

## Compliance
- No urgency or scarcity tactics in UI
- Cart abandonment: handled via email (future), not popups
- Checkout: clean, focused, no distractions
- Admin: no conversion-rate dashboards (focus on brand health metrics)
- Sales: positioned as "Curated Selection" not "SALE"
