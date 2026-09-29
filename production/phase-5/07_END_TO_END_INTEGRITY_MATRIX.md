> **⚠️ HISTORICAL DOCUMENT — SUPERSEDED ARCHITECTURE**
> 
> This document was created during the Phase 5 audit (2026-08-17) when Vercel was the assumed production hosting platform.
> **As of 2026-09-26, the authoritative production architecture decision is Cloudflare Pages** (per docs/CLOUDFLARE_DEPLOYMENT_DECISION.md).
> 
> All Vercel references in this document reflect the architecture at the time of audit and are preserved for historical/evidence purposes only.
> For current production execution procedures, see productionTODO.md and production/14_FINAL_PRE_DEPLOYMENT_GO_NO_GO.md.
>
> ---
>
# Phase 5 â€” Critical End-to-End Path Verification Matrix

**Document ID**: HOP-PROD-PH5-007  
**Audit Phase**: Phase 5 â€” Independent Reconciliation & Go/No-Go (Part 1 Path Integrity)  
**Execution Timestamp**: 2026-08-17T14:22:00+05:30  
**Auditor**: Independent Final Audit Authority  
**Authoritative Status**: **PATH INTEGRITY TRACED â€” STOPPED AT PART 1 GATE**  

---

## 1. Executive Summary & Verification Methodology

In accordance with Phase 5 Step 7, the three primary operational lifecycles of House of Padmavati (HOP) were subjected to non-destructive, forensic boundary verification:
- **PATH A**: Customer Identity & Profile Lifecycle
- **PATH B**: Commerce, Payment & Inventory Lifecycle
- **PATH C**: Deployment, SSG & SEO Delivery Lifecycle

All boundary contracts, data structures, state machines, and trust assumptions were evaluated against the live repository source code, Supabase PostgreSQL schema, Edge Function implementations, and staging runtime evidence.

---

## 2. PATH A â€” Customer Identity & Account Lifecycle
`Identity â†’ Profile â†’ Checkout â†’ Order â†’ Order History`

| Segment ID | Start Point | Boundary | Data / State Transferred | Authoritative Component | Validating Evidence | Expected State | Actual Verified State | Potential Failure Mode | Status |
|---|---|---|---|---|---|---|---|---|---|
| **A-1** | Auth Modal / Signup | Browser â†” Supabase Auth | Email (`user@example.com`), Password, Session JWT | Supabase Auth (`auth.users`) | `src/contexts/AuthContext.tsx` | Valid JWT issued with user email claim in payload. | JWT contains verified email and `auth.uid()`. | Invalid credentials or unconfirmed email rejected. | **VERIFIED** |
| **A-2** | Post-Auth Profile Link | Auth â†” `customers` Table | `auth.uid()`, `email`, `full_name` | `upsert_customer_profile` RPC | `20260816000000_...sql` | Links `auth.uid()` to customer row by `email` without PK conflict. | Atomic RPC matches email and links auth UID cleanly. | Unique email constraint collision on guest signup. Prevented by RPC. | **VERIFIED** |
| **A-3** | Address Management | Profile â†” `shipping_addresses` | Address payload, `customer_id` | PostgreSQL RLS (`shipping_addresses_customer_...`) | `20260718000000_...sql` | User can only CRUD addresses linked to their customer ID. | RLS policy restricts queries to matching customer email. | Cross-customer address tampering. Blocked by RLS. | **VERIFIED** |
| **A-4** | Checkout User Link | Client â†” `create-razorpay-order` | Session token, customer email | Edge Function Auth Guard | `create-razorpay-order/index.ts` | Authenticated user email matches checkout order customer. | Edge Function extracts JWT email and verifies order ownership. | IDOR on order retry. Prevented by caller verification. | **VERIFIED** |
| **A-5** | Order Query History | Customer Account UI â†” Database | Query: `SELECT * FROM orders` | PostgreSQL RLS (`orders_customer_select`) | `src/services/customerOrderService.ts` | Customer only receives their own historical orders. | RLS joins `customers` on `email = auth.email()`. | Cross-tenant order history leak. Prevented by RLS. | **VERIFIED** |

---

## 3. PATH B â€” Commerce, Payment & Inventory Lifecycle
`Product â†’ Cart â†’ Checkout â†’ Payment â†’ Webhook â†’ Order â†’ Inventory`

| Segment ID | Start Point | Boundary | Data / State Transferred | Authoritative Component | Validating Evidence | Expected State | Actual Verified State | Potential Failure Mode | Status |
|---|---|---|---|---|---|---|---|---|---|
| **B-1** | Catalog Storefront | Database â†” Storefront UI | Product catalog (`status = 'published'`) | PostgreSQL RLS (`products_public_select`) | `src/services/productService.ts` | Published luxury products visible with price & stock. | Public SELECT permitted only for `status = 'published'`. | Draft / unpublished products exposed. Blocked by RLS. | **VERIFIED** |
| **B-2** | Client Cart | UI Action â†” LocalStorage | Product ID, Variant, Quantity, Price | Client `CartContext` | `src/contexts/CartContext.tsx` | Items added to client bag; total updated in state. | Ephemeral state maintained in localStorage. | Client price manipulation. Neutralized by server pricing. | **VERIFIED** |
| **B-3** | Order Creation | Client â†” `create_order` RPC | Line items `[{ product_id, quantity }]` | PostgreSQL RPC (`create_order`) | `CheckoutPricing.spec.ts` & SQL | Database recalculates subtotal from `products.selling_price`. | Client price ignored; DB computes true total and checks stock. | Insufficient stock or inactive product aborts checkout with 400. | **VERIFIED** |
| **B-4** | Gateway Order Init | Edge Function â†” Razorpay API | Total in paise, Receipt (`order_id`) | Razorpay Edge Function | `create-razorpay-order/index.ts` | Razorpay order created (`order_...`); DB payment recorded. | Gateway returns `razorpay_order_id`; inserted to `payments`. | Gateway API timeout or invalid credentials fails closed. | **VERIFIED** |
| **B-5** | Payment Gateway Modal | Storefront â†” Razorpay Modal | Amount, `razorpay_order_id`, Customer | Razorpay Hosted Checkout | `src/services/paymentService.ts` | Customer completes payment authorization (UPI/Card). | Razorpay triggers success handler with signature. | Payment declined or abandoned -> Order remains `pending_payment`. | **VERIFIED** |
| **B-6** | Webhook Dispatch | Razorpay â†” `razorpay-webhook` | `payment.captured`, HMAC signature | Supabase Edge Function | `PHASE_3_RUNTIME_WEBHOOK_EVIDENCE.md` | Webhook validates HMAC signature in constant-time. | Invalid signature returns 400; valid returns 200 `{"received": true}`. | Forged webhook injection. Blocked by HMAC validation. | **VERIFIED** |
| **B-7** | Order State Confirmation | Webhook â†” `confirm_paid_order` | `razorpay_payment_id`, `order_id` | PostgreSQL RPC (`confirm_paid_order`) | `PHASE_3_RUNTIME_WEBHOOK_EVIDENCE.md` (DB Inspection) | Order status: `pending_payment -> confirmed`; Payment: `pending -> paid`. | Atomic state transition verified on staging DB. | Unpaid order confirmed. Blocked by Razorpay event requirement. | **VERIFIED** |
| **B-8** | Inventory Deduction | `confirm_paid_order` â†” Products | `stock = stock - qty`, Audit note | PostgreSQL Transaction | `PHASE_3_RUNTIME_WEBHOOK_EVIDENCE.md` (DB Inspection) | Product stock decremented; `inventory_history` sale record logged. | Staging product stock decremented `10 -> 9`; 1 audit row created. | Double deduction on duplicate webhook. Prevented by idempotency. | **VERIFIED** |
| **B-9** | Idempotency Boundary | Replayed Webhook â†” Database | Duplicate `payment.captured` event | `payment_events` (`UNIQUE(event_id)`) | `PHASE_3_RUNTIME_WEBHOOK_EVIDENCE.md` (Test D) | Second delivery returns `already_processed: true`; 0 DB mutations. | Duplicate call returned 200 `already_processed: true`; 0 extra logs. | Replay attack causing double stock reduction. Defended. | **VERIFIED** |

---

## 4. PATH C â€” Deployment, Rendering & SEO Lifecycle
`Source â†’ Build â†’ SSG â†’ Deployment â†’ HTTP â†’ Browser â†’ SEO`

| Segment ID | Start Point | Boundary | Data / State Transferred | Authoritative Component | Validating Evidence | Expected State | Actual Verified State | Potential Failure Mode | Status |
|---|---|---|---|---|---|---|---|---|---|
| **C-1** | Source Tree | Git Repository â†” Typecheck | TypeScript AST, Module graph | TypeScript 5.5.3 Compiler | `npx tsc --noEmit` | Clean compilation with zero strict-mode type errors. | Exited 0 with 0 errors. | Type incompatibility or missing null checks. Clean. | **VERIFIED** |
| **C-2** | Code Quality | Source Tree â†” Linter | Source files, ESLint rules | ESLint Engine | `npm run lint` | Zero lint errors and zero unused directives/warnings. | Exited 0 with 0 errors and 0 warnings. | Syntax smell or undeclared variable. Clean. | **VERIFIED** |
| **C-3** | Client Bundling | Source â†” Vite Bundler | TSX, CSS, SVG, Font assets | Vite 5.4.21 Rollup Bundler | `npm run build` | Optimized code-split JS and CSS bundles in `dist/`. | 46 assets generated in 7.35s; Main JS = 71.92 kB gzip. | Excessive bundle chunk size (> 500 kB). Clean. | **VERIFIED** |
| **C-4** | SSG Pre-rendering | `dist/` â†” Headless Chromium | Dynamic routes from Supabase REST | `scripts/prerender.js` | `npm run build` output | 20 public HTML routes pre-rendered with dehydrated state. | All 20 routes prerendered with `__REACT_QUERY_STATE__`. | Missing route or crawler timeout. Handled cleanly. | **VERIFIED** |
| **C-5** | Edge Hosting | `dist/` â†” Vercel Platform | Static HTML, CSS, JS, `vercel.json` | Vercel Edge Network | `vercel.json` | Static assets served with caching; dynamic SPA rewrite. | Verified `vercel.json` configuration and headers. | Insecure transport or missing headers. Enforced via CSP/HSTS. | **VERIFIED** |
| **C-6** | HTTP Delivery | Edge â†” Client Browser | HTTP 200/404, CSP, HSTS headers | Vercel Global Edge CDN | `phase-4/04_INFRASTRUCTURE...` | Correct MIME types, strict security headers, gzip/brotli. | Strict CSP, HSTS, X-Frame-Options: DENY, nosniff verified. | Clickjacking or MIME sniffing. Defended. | **VERIFIED** |
| **C-7** | SEO Bot Ingestion | Delivered HTML â†” Search Bot | Semantic DOM, Meta, Schema.org | Prerendered Static HTML | `phase-4/06_RENDERING_SEO...` | Pure HTML contains canonical tag, meta title, and JSON-LD. | Inspected `dist/` static files: Full schema and canonicals present. | Unindexable dynamic client content. Defended by SSG. | **VERIFIED** |

---

## 5. End-to-End Matrix Summary

- **Total Path Segments Traced**: 21 critical lifecycle boundaries.
- **Verification Status**:
  - **VERIFIED**: 21 segments (100%).
  - **NOT VERIFIED / FAILED**: 0 segments.
- **Structural Integrity Conclusion**: All data crossing architectural boundaries conforms to strict zero-trust contracts. Server-side price authority, database transactional locking, cryptographic HMAC validation, customer data RLS isolation, and SSG rendering are fully operational.

**Path Integrity Status**: **TRACED & VERIFIED**.

