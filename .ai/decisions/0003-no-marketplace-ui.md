# ADR-0003: No Marketplace UI

**Status**: Accepted  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
House of Padmavati sells its own curated products. Third-party sellers, vendor dashboards, multi-seller checkout, and commission tracking are explicitly out of scope. The platform is a direct-to-consumer brand storefront, not a marketplace.

## Decision
All UI and backend patterns assume a single-seller model:
- One inventory pool (no vendor mapping)
- One checkout flow (no split payments)
- One product catalog (curated, not aggregated)
- Admin studio manages all aspects of the business (no vendor onboarding)
- No marketplace-specific features: vendor registration, commission reports, seller ratings, multi-vendor cart

## Consequences
### Positive
- Dramatically simpler architecture (no vendor ID on products/orders, no split payments, no vendor-specific RLS)
- Faster development of core e-commerce features
- Cleaner admin experience (single view of all operations)
- Easier to maintain and reason about

### Negative
- Cannot easily pivot to marketplace model without significant refactoring
- Not suitable if business model changes to include third-party sellers

## Compliance
- No `vendor_id` or `seller_id` columns in schema
- No vendor-specific Edge Functions
- Admin studio is single-tenant
- Product management assumes one catalog owner
- Order fulfillment is centralized
