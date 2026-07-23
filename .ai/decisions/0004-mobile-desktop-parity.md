# ADR-0004: Mobile-Desktop Feature Parity

**Status**: Accepted  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
Many e-commerce platforms offer a degraded experience on mobile (fewer features, hidden navigation, simplified checkout). Luxury shoppers increasingly use mobile devices for discovery and purchase. A degraded mobile experience would alienate a significant portion of the audience.

## Decision
All features available on desktop must be available on mobile. The mobile experience is not a "lite" version — it is a responsive adaptation of the full experience.
- Navigation: hamburger menu replaces horizontal nav (same items)
- Product gallery: swipe replaces click (same functionality)
- Cart/checkout: full flow on mobile (no "open on desktop" messages)
- Admin studio: sidebar collapses but all sections remain accessible
- Image gallery: full zoom available on mobile (pinch-to-zoom)

## Consequences
### Positive
- Consistent brand experience across devices
- Higher mobile conversion rates
- Better SEO (Google mobile-first indexing)
- Higher customer satisfaction

### Negative
- Higher development and testing effort (double the QA surface)
- Performance optimization more challenging on mobile
- Touch interaction design requires more thought

## Compliance
- All E2E tests run on mobile viewport (375px) in addition to desktop
- No feature hidden behind `hidden md:block` without accessible alternative
- Touch targets >= 44x44px on all interactive elements
- Mobile navigation includes all items from desktop navigation
- Checkout flow is identical (steps, fields, validation)
