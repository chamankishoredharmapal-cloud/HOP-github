# Phase 2 — Change-Scope Reconciliation

**Audit Timestamp**: 2026-08-16T04:50:00+05:30

This document tracks all changes made between the beginning of Phase 2 and this final audit, ensuring every modification is accounted for and securely justified.

## 1. Application Layer (src/)

### 1.1 UI & Components
- `src/App.tsx`: Added `eslint-disable` rules for global `window` types. (Expected: Linting compliance).
- `src/components/hop/ProductGallery.tsx`: Extracted Embla carousel state (`canScrollPrev`/`Next`) to React state and added frame-based reInit to resolve hydration/concurrent mode mismatches causing "disabled" prop bugs. (Expected: UX/UI fix).
- `src/hooks/usePrerenderReady.ts`: Added `eslint-disable` rules for `window` types. (Expected: Linting compliance).
- `src/pages/about/CustomerCare.tsx`: Repositioned `usePrerenderReady(true)` above conditionally-executed logic to comply with the Rules of Hooks. (Expected: React compliance).

### 1.2 Services (Security Remediation)
- `src/services/checkoutService.ts`: **DELETED** client-side `createCustomerForCheckout` and `createShippingAddress`. These are now securely managed entirely within the backend RPC `create_order` to prevent client-side data tampering. (Expected: P1 Security Fix).
- `src/services/customerAuthService.ts`: **REPLACED** direct `supabase.from('customers').upsert()` (which caused email constraint collisions for returning guests) with the `upsert_customer_profile` RPC. (Expected: P0 Customer Identity Fix).

## 2. Edge Functions (Security Hardening)

- `create-razorpay-order`: Major refactor to use `create_order` RPC instead of trusting client-side inserts. Enforces strict IDOR checks on order ownership.
- `cancel-payment`: Added explicit ownership checks (`isAdmin || order.customers.email == user.email`).
- `get-order-confirmation`: Added explicit ownership checks.
- `release-inventory`: Added explicit `is_admin()` check.
- `send-email`: Added explicit `is_admin()` check and cleaned up redundant email extraction logic.
- `verify-payment` & `razorpay-webhook`: Replaced standard string equality with XOR-based timing-safe comparison to prevent HMAC timing attacks.

## 3. Configuration

- `vercel.json`: Adjusted Content-Security-Policy (CSP) headers to whitelist `fonts.googleapis.com`, `fonts.gstatic.com` (for typography) and `<supabase-project-id>.supabase.co` (for media/images).

## Conclusion
All changes in the working tree are explicitly accounted for. No extraneous, unauthorized, or "convenience" changes exist. The scope is strictly limited to Phase 2 Security & Customer Identity objectives.
