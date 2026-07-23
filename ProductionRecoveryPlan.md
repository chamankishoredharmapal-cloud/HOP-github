# Production Recovery Plan

Target: raise House of Padmavati from current production readiness (~42%) to 95%+.

Scope: planning document only. No application code changes are included here.

## Current Status

- Phase 0 completed and verified.
- Phase 1 completed and verified.
- Phase 2, Phase 3, Phase 4 completed and verified.
- Phase 5 completed and verified.
- Phase 6 completed and verified.
- Phase 7 completed and verified.
- All 8 phases of the plan are **implemented and code-verified**.
- Latest Phase 5 verification: `npm run lint` passed with 0 errors and 9 existing Fast Refresh warnings; `npx tsc --noEmit` passed.
- Temporary storefront image diagnostics in `src/services/productService.ts` remain intentionally in place until the image issue is resolved.
- Payment Edge Functions are reserved for Phase 2 and are excluded from Phase 1.

## Execution Rules

- Production remains No-Go until Phase 0 through Phase 3 are complete and verified.
- Each phase must end with static checks, focused QA, and a rollback note.
- Payment and database changes must be verified against a clean Supabase environment before touching production.
- Do not deploy live Razorpay flow until server-side pricing, payment verification, webhook verification, and atomic inventory updates are complete.

## Phase 0 - Immediate Hotfix

### 0.1 Fix Release-Blocking Lint Errors

- Priority: P0
- Estimated effort: 0.5 day
- Dependencies: none
- Risk if delayed: CI/release gates remain red; preventable quality issues continue to hide real regressions.
- Files involved:
  - `src/components/ui/command.tsx`
  - `src/components/ui/textarea.tsx`
  - `src/contexts/CartContext.tsx`
  - `src/contexts/WishlistContext.tsx`
  - `src/studio/pages/CollectionWorkspace.tsx`
  - `tailwind.config.ts`
- Exact implementation order:
  1. Replace empty interfaces in `command.tsx` and `textarea.tsx` with type aliases.
  2. Replace empty `catch {}` blocks with explicit non-fatal handling or comments plus ignored variable handling.
  3. Convert `require("tailwindcss-animate")` to an ESM-compatible import.
  4. Run `npm run lint`.
  5. Run `npx tsc --noEmit`.

### 0.2 Remove Approved Debug Logging From Storefront

- Priority: P0
- Estimated effort: 0.5 day
- Dependencies: none
- Risk if delayed: customer/session/order data leaks into browser logs; noisy logs obscure production incidents.
- Files involved:
  - `src/services/collectionService.ts`
  - `src/components/hop/HeroSection.tsx`
  - `src/pages/Category.tsx`
  - `src/studio/services/orderService.ts`
- Exact implementation order:
  1. Remove approved browser console logs from collection, hero, category rendering, and studio order paths.
  2. Keep temporary storefront image diagnostics in `src/services/productService.ts` until the image issue is resolved.
  3. Run lint and TypeScript checks.

### 0.3 Fix Checkout Render Side Effect

- Priority: P0
- Estimated effort: 0.5 day
- Dependencies: none
- Risk if delayed: repeated navigation, repeated cache invalidation, inconsistent cart clearing after payment success.
- Files involved:
  - `src/pages/Checkout.tsx`
- Exact implementation order:
  1. Move payment success handling from render body into `useEffect`.
  2. Include `paymentState.status`, `orderNumber`, `clearCart`, `queryClient`, and `navigate` dependencies.
  3. Ensure the effect only runs once per successful payment.
  4. Test successful payment callback path with mocked `paymentState.status = "paid"`.

## Phase 1 - Critical Security

### 1.1 Replace Broad Authenticated Policies With Admin Authorization

- Priority: P0
- Estimated effort: 1-2 days
- Dependencies: admin role model decision
- Risk if delayed: any authenticated user can upload/delete storage objects and insert inventory history.
- Files involved:
  - `supabase/migrations/20260716000000_harden_studio_admin_policies.sql`
  - `src/studio/services/authService.ts`
  - `src/studio/components/AuthGuard.tsx`
- Exact implementation order:
  1. Define an admin role source: custom claims or `admin_users` table.
  2. Add `is_admin(uuid)` helper function in a new migration.
  3. Replace broad catalog write policies on `collections`, `products`, and `product_images` with `is_admin(auth.uid())`.
  4. Replace broad storage write policies on `product-images` and `HOP-films` with `is_admin(auth.uid())`.
  5. Replace broad `inventory_history` read/insert policies with `is_admin(auth.uid())`.
  6. Update `AuthGuard` to require admin entitlement, not just any authenticated session.
  7. Verify anonymous storefront reads still work.
  8. Verify non-admin authenticated users cannot access studio reads or writes.

### 1.2 Harden Studio Route Authorization

- Priority: P1
- Estimated effort: 0.5-1 day
- Dependencies: Phase 1.1 admin role source
- Risk if delayed: any authenticated user can enter Studio UI if backend policies are later broadened incorrectly.
- Files involved:
  - `src/studio/services/authService.ts`
  - `src/studio/hooks/useAuth.ts`
  - `src/studio/components/AuthGuard.tsx`
  - `src/studio/pages/Login.tsx`
- Exact implementation order:
  1. Add an admin entitlement lookup that matches the Phase 1.1 backend policy source.
  2. Return auth state with both `user` and `isAdmin`.
  3. Update `AuthGuard` to deny non-admin users.
  4. Update login redirect/error behavior for authenticated non-admin users.
  5. Verify storefront routes remain unaffected.

## Phase 2 - Payment Integrity

### 2.1 Move Pricing Authority Server-Side

- Priority: P0
- Estimated effort: 2-4 days
- Dependencies: Phase 1.2 for server/admin trust model
- Risk if delayed: users can alter local cart prices/totals and create underpriced orders.
- Files involved:
  - `src/pages/Checkout.tsx`
  - `src/contexts/CartContext.tsx`
  - `src/services/orderService.ts`
  - `src/types/order.ts`
  - `supabase/migrations/20260708000000_create_orders_schema.sql`
- Exact implementation order:
  1. Change checkout request contract to send product ids and quantities only.
  2. Server-side, fetch products by id where status is published/active.
  3. Validate product existence, quantity, stock, and sale eligibility.
  4. Compute item price, subtotal, shipping, tax, discount, and total server-side.
  5. Store item price snapshots from database values.
  6. Return canonical `order_id`, `order_number`, and payable amount.
  7. Add tests for tampered price, missing product, unpublished product, and invalid quantity.

### 2.2 Fix Canonical Product Id Handling in Cart and Checkout

- Priority: P0
- Estimated effort: 0.5-1 day
- Dependencies: none, but should land before 2.1 QA
- Risk if delayed: order items may store `product-{uuid}` instead of UUIDs, breaking inventory and reporting.
- Files involved:
  - `src/pages/ProductDetail.tsx`
  - `src/pages/Category.tsx`
  - `src/pages/Checkout.tsx`
  - `src/contexts/CartContext.tsx`
  - `src/types/order.ts`
- Exact implementation order:
  1. Add separate cart fields for `lineId` and `productId`.
  2. Keep UI/wishlist ids separate from database ids.
  3. Update checkout to submit canonical `productId`.
  4. Migrate or discard incompatible existing localStorage cart entries.
  5. Test add-to-cart from product detail and category listing.

### 2.3 Make Razorpay Order Creation Load Amount From Database

- Priority: P0
- Estimated effort: 1 day
- Dependencies: 2.1
- Risk if delayed: payment amount remains client-controlled.
- Files involved:
  - `src/hooks/usePayment.ts`
  - `src/services/paymentService.ts`
  - `supabase/functions/create-razorpay-order/index.ts`
- Exact implementation order:
  1. Change function request to accept only `order_id`.
  2. Fetch order total/currency by `order_id`.
  3. Reject paid, cancelled, missing, or zero-total orders.
  4. Create Razorpay order using database total.
  5. Store payment row with database total.
  6. Return Razorpay order id and key id only.

### 2.4 Make Payment Verification and Inventory Deduction Atomic

- Priority: P0
- Estimated effort: 2-3 days
- Dependencies: 2.1, 2.3, Phase 3 schema cleanup
- Risk if delayed: partial paid orders, duplicate stock mutations, overselling.
- Files involved:
  - `supabase/functions/verify-payment/index.ts`
  - `supabase/functions/razorpay-webhook/index.ts`
  - `supabase/migrations/20260713000000_create_inventory_history.sql`
  - `supabase/migrations/20260708000000_create_orders_schema.sql`
- Exact implementation order:
  1. Create DB RPC `confirm_paid_order` with transaction semantics.
  2. Lock payment and order rows.
  3. Verify payment is pending before mutation.
  4. Update payment status, payment id, and paid timestamp.
  5. Update order payment/status.
  6. Deduct inventory with guarded SQL update.
  7. Insert inventory history in the same transaction.
  8. Make repeated calls idempotent.
  9. Call the RPC from both verification and webhook paths.

### 2.5 Implement Payment Event Idempotency

- Priority: P1
- Estimated effort: 1 day
- Dependencies: 2.4
- Risk if delayed: repeated Razorpay retries can cause duplicate processing or inconsistent state.
- Files involved:
  - `supabase/functions/razorpay-webhook/index.ts`
  - `supabase/functions/verify-payment/index.ts`
  - new payment events migration
- Exact implementation order:
  1. Add `payment_events` table with unique Razorpay event/payment ids.
  2. Insert event id before processing.
  3. Treat duplicate insert as already processed.
  4. Add webhook tests for duplicate events.

### 2.6 Make Razorpay Webhook Verification Fail Closed

- Priority: P0
- Estimated effort: 0.5 day
- Dependencies: payment Edge Function work starts in Phase 2
- Risk if delayed: unauthenticated requests can mutate payment status if `RAZORPAY_WEBHOOK_SECRET` is missing.
- Files involved:
  - `supabase/functions/razorpay-webhook/index.ts`
- Exact implementation order:
  1. Read `RAZORPAY_WEBHOOK_SECRET`.
  2. If missing, return a 500 configuration error and do not parse/process the payload.
  3. Verify `x-razorpay-signature` before any business logic.
  4. Add tests or scripted requests for missing, invalid, and valid signatures.

### 2.7 Stop Returning Internal Payment Errors and Stack Traces to Clients

- Priority: P1
- Estimated effort: 0.5 day
- Dependencies: payment Edge Function work starts in Phase 2
- Risk if delayed: internal implementation details leak to attackers and customers.
- Files involved:
  - `supabase/functions/create-razorpay-order/index.ts`
  - `supabase/functions/verify-payment/index.ts`
  - `supabase/functions/razorpay-webhook/index.ts`
- Exact implementation order:
  1. Replace client responses containing `error.message` and `error.stack` with stable public error codes.
  2. Log redacted details server-side only.
  3. Confirm failure responses are useful to frontend without leaking internals.

## Phase 3 - Database Integrity

### 3.1 Reconcile Conflicting Order and Payment Migrations

- Priority: P0
- Estimated effort: 1-2 days
- Dependencies: none
- Risk if delayed: clean deployments may create a different schema than the one used by the app.
- Files involved:
  - `supabase/migrations/20260706000001_create_order_system.sql`
  - `supabase/migrations/20260708000000_create_orders_schema.sql`
  - `src/integrations/supabase/types.ts`
- Exact implementation order:
  1. Choose the canonical schema for customers, addresses, orders, order items, and payments.
  2. Remove or supersede incompatible enum/table definitions in future migrations.
  3. Confirm payment column names: `razorpay_order_id`/`razorpay_payment_id` or `gateway_order_id`/`gateway_payment_id`, not both.
  4. Apply migrations to a fresh database.
  5. Regenerate Supabase types.
  6. Run TypeScript against regenerated types.

### 3.2 Enforce Order Item Product Relationships

- Priority: P1
- Estimated effort: 1 day
- Dependencies: 2.2, 3.1
- Risk if delayed: order items can reference invalid products and inventory cannot be trusted.
- Files involved:
  - `supabase/migrations/20260708000000_create_orders_schema.sql`
  - `src/types/order.ts`
  - `src/services/orderService.ts`
- Exact implementation order:
  1. Change `order_items.product_id` to UUID if canonical schema permits.
  2. Add foreign key to `products(id)`.
  3. Decide `ON DELETE SET NULL` vs `RESTRICT`.
  4. Backfill or clean invalid existing product ids.
  5. Add indexes for product/order reporting.

### 3.3 Add Inventory Concurrency Controls

- Priority: P1
- Estimated effort: 1-2 days
- Dependencies: 2.4
- Risk if delayed: simultaneous purchases/admin adjustments can corrupt stock.
- Files involved:
  - `src/studio/services/inventoryService.ts`
  - `supabase/functions/verify-payment/index.ts`
  - `supabase/migrations/20260713000000_create_inventory_history.sql`
- Exact implementation order:
  1. Replace read-then-write stock updates with transactional RPCs.
  2. Use guarded updates and row locks.
  3. Reject stock changes that would go below zero unless explicitly allowed by admin policy.
  4. Write inventory history atomically.

### 3.4 Regenerate and Enforce Supabase Types

- Priority: P1
- Estimated effort: 0.5 day
- Dependencies: 3.1
- Risk if delayed: TypeScript gives false confidence against stale database contracts.
- Files involved:
  - `src/integrations/supabase/types.ts`
  - all Supabase service files
- Exact implementation order:
  1. Regenerate types from the clean database.
  2. Remove broad `Record<string, unknown>` casts where generated types are available.
  3. Run `npx tsc --noEmit`.

## Phase 4 - Performance

### 4.1 Remove N+1 Product Image Queries

- Priority: P1
- Estimated effort: 1 day
- Dependencies: 3.4 preferred
- Risk if delayed: collection pages slow down as catalog grows.
- Files involved:
  - `src/services/productService.ts`
  - `src/pages/Category.tsx`
  - `src/pages/ProductDetail.tsx`
- Exact implementation order:
  1. Fetch product images via embedded relation or a single `in(product_id, ids)` query.
  2. Group images by product id.
  3. Select primary image deterministically.
  4. Add a test or fixture for products with no images and multiple images.

### 4.2 Add Route-Level Code Splitting

- Priority: P2
- Estimated effort: 1 day
- Dependencies: Phase 0 checks green
- Risk if delayed: storefront users download studio/admin code unnecessarily.
- Files involved:
  - `src/App.tsx`
- Exact implementation order:
  1. Lazy-load studio routes.
  2. Lazy-load heavy storefront secondary pages.
  3. Add route Suspense fallback.
  4. Build and inspect bundle output.

### 4.3 Optimize Hero and Collection Videos

- Priority: P2
- Estimated effort: 1-2 days
- Dependencies: none
- Risk if delayed: poor LCP, high bandwidth, weak mobile performance.
- Files involved:
  - `src/components/hop/HeroSection.tsx`
  - `src/components/hop/Film.tsx`
  - `src/pages/Category.tsx`
  - `src/data/collectionVideos.ts`
- Exact implementation order:
  1. Change non-essential video preload from `auto` to `metadata` or lazy behavior.
  2. Add poster fallback for every video.
  3. Verify mobile behavior and reduced bandwidth mode.
  4. Add CDN/cache guidance for Supabase Storage assets.

### 4.4 Scope Query Invalidations

- Priority: P2
- Estimated effort: 0.5 day
- Dependencies: none
- Risk if delayed: unnecessary refetches after checkout/payment success.
- Files involved:
  - `src/pages/Checkout.tsx`
  - studio hooks under `src/studio/hooks`
- Exact implementation order:
  1. Replace broad `queryClient.invalidateQueries()` with exact keys.
  2. Add reasonable `staleTime` for public collections/products.
  3. Verify checkout success does not refetch unrelated studio data.

## Phase 5 - Architecture

### 5.1 Separate Storefront, Studio, and Shared Domains

- Priority: P2
- Estimated effort: 2-4 days
- Dependencies: Phase 0 through Phase 3 stable
- Risk if delayed: feature growth increases coupling and bundle size.
- Files involved:
  - `src/App.tsx`
  - `src/services/*`
  - `src/studio/services/*`
  - `src/types/*`
  - `src/studio/types/*`
- Exact implementation order:
  1. Define domain boundaries: storefront, studio, payments, orders, catalog.
  2. Move shared types to a single domain package/folder.
  3. Keep studio-only services out of storefront imports.
  4. Add route-level lazy imports.

### 5.2 Remove Empty Stub Modules

- Priority: P3
- Estimated effort: 0.5 day
- Dependencies: none
- Risk if delayed: misleading architecture and dead code accumulation.
- Files involved:
  - `src/components/hop/ProductCard.tsx`
  - `src/components/hop/FeaturedProducts.tsx`
  - `src/components/hop/AssemblyHub.tsx`
  - `src/components/hop/AssemblyHubHeader.tsx`
  - `src/components/hop/AssemblyHubFooter.tsx`
  - `src/components/hop/BrandStory.tsx`
  - `src/components/hop/index.tsx`
  - `src/pages/about/Sustainability.tsx`
  - `src/pages/about/StoreLocator.tsx`
  - `src/pages/about/SizeGuide.tsx`
- Exact implementation order:
  1. Confirm each file is unused.
  2. Delete unused files or implement real routes/components.
  3. Run import search.
  4. Run TypeScript and lint.

### 5.3 Replace Unsafe Mapping Casts With Typed Mappers

- Priority: P2
- Estimated effort: 1-2 days
- Dependencies: 3.4
- Risk if delayed: runtime null/shape bugs remain hidden by casts.
- Files involved:
  - `src/services/productService.ts`
  - `src/services/collectionService.ts`
  - `src/studio/services/productService.ts`
  - `src/studio/services/orderService.ts`
  - `src/studio/services/inventoryService.ts`
- Exact implementation order:
  1. Use generated Supabase row types.
  2. Add explicit null handling.
  3. Remove broad `Record<string, unknown>` casts where possible.
  4. Add mapper tests for missing optional fields.

## Phase 6 - SEO

### 6.1 Add Route-Specific Metadata

- Priority: P2
- Estimated effort: 1 day
- Dependencies: none
- Risk if delayed: weak organic search and generic social previews.
- Files involved:
  - `index.html`
  - `src/pages/Index.tsx`
  - `src/pages/Collections.tsx`
  - `src/pages/Category.tsx`
  - `src/pages/ProductDetail.tsx`
  - `src/pages/Journal.tsx`
  - `src/pages/about/OurStory.tsx`
- Exact implementation order:
  1. Add a metadata management utility.
  2. Set title and description per route.
  3. Add product/collection OG title, description, and image.
  4. Verify browser title and social tags per route.

### 6.2 Add Canonical URLs, Sitemap, and Robots Sitemap Reference

- Priority: P2
- Estimated effort: 0.5-1 day
- Dependencies: public domain/base URL decision
- Risk if delayed: duplicate indexing and weaker crawlability.
- Files involved:
  - `index.html`
  - `public/robots.txt`
  - new `public/sitemap.xml` or generated sitemap script
- Exact implementation order:
  1. Decide canonical production domain.
  2. Add canonical tag strategy.
  3. Generate sitemap for static routes, collections, products, and journal entries.
  4. Add `Sitemap:` line to `robots.txt`.

### 6.3 Add Structured Data

- Priority: P3
- Estimated effort: 1 day
- Dependencies: 6.1
- Risk if delayed: product rich results and brand entity signals remain weak.
- Files involved:
  - `src/pages/ProductDetail.tsx`
  - `src/pages/Index.tsx`
  - `src/pages/about/OurStory.tsx`
- Exact implementation order:
  1. Add Organization schema.
  2. Add Product schema with price, currency, availability, image, and description.
  3. Add BreadcrumbList schema for product/collection pages.
  4. Validate with schema testing tooling.

## Phase 7 - Luxury Experience

### 7.1 Replace Fake Journal Detail Behavior

- Priority: P2
- Estimated effort: 1-2 days
- Dependencies: content source decision
- Risk if delayed: editorial experience feels like a template and breaks trust.
- Files involved:
  - `src/App.tsx`
  - `src/pages/Journal.tsx`
  - new journal detail page/data source
- Exact implementation order:
  1. Define article slugs instead of `/journal/1`.
  2. Add real journal detail route.
  3. Render article-specific content and metadata.
  4. Add empty/not-found state for invalid slugs.

### 7.2 Make Order Confirmation Trustworthy and Brand-Appropriate

- Priority: P1
- Estimated effort: 1 day
- Dependencies: Phase 2 payment integrity
- Risk if delayed: post-purchase experience lacks confirmation detail and support confidence.
- Files involved:
  - `src/pages/OrderConfirmation.tsx`
  - order lookup service/RPC
- Exact implementation order:
  1. Fetch confirmation details by signed/order token or authenticated access.
  2. Show order number, item summary, delivery address summary, and payment status.
  3. Add graceful pending-payment and failed-payment states.
  4. Keep copy refined and minimal.

### 7.3 Complete or Remove Empty About/Luxury Support Pages

- Priority: P3
- Estimated effort: 1-2 days
- Dependencies: brand/content approval
- Risk if delayed: navigation and customer trust suffer if users hit blank pages.
- Files involved:
  - `src/pages/about/Sustainability.tsx`
  - `src/pages/about/StoreLocator.tsx`
  - `src/pages/about/SizeGuide.tsx`
  - `src/components/hop/HopFooter.tsx`
  - `src/components/hop/HopHeader.tsx`
- Exact implementation order:
  1. Decide which pages are launch-required.
  2. Implement content-rich pages or remove links.
  3. Add route entries if implemented.
  4. Verify all header/footer links resolve.

### 7.4 Polish Checkout Error, Empty, and Loading States

- Priority: P2
- Estimated effort: 1 day
- Dependencies: Phase 2
- Risk if delayed: payment problems feel generic and harm luxury perception.
- Files involved:
  - `src/pages/Checkout.tsx`
  - `src/hooks/usePayment.ts`
  - `src/services/paymentService.ts`
- Exact implementation order:
  1. Map backend error codes to calm, useful user-facing copy.
  2. Add retry state for payment creation vs verification separately.
  3. Prevent duplicate submission after order creation.
  4. Verify cancelled, failed, pending, and successful payment paths.

## Final Verification Checklist

1. `npm run lint` passes with zero errors.
2. `npx tsc --noEmit` passes.
3. Clean Supabase migration replay succeeds.
4. Supabase types are regenerated from the clean schema.
5. Checkout cannot be underpriced by modifying localStorage.
6. Razorpay order amount always equals database order total.
7. Payment verification is idempotent.
8. Webhook verification fails closed.
9. Inventory cannot go negative under concurrent purchase tests.
10. Studio access requires admin authorization.
11. Product and collection pages avoid N+1 image fetches.
12. Route-level metadata, canonical, sitemap, and product schema are present.
13. Empty/stub launch pages are removed or completed.
14. Journal detail and order confirmation are real, not placeholder flows.
15. Full checkout QA passes: success, cancel, failure, retry, duplicate callback, duplicate webhook.

## Go-Live Gate

Production Ready 95%+ requires:

- All P0 and P1 items complete.
- No known payment integrity gaps.
- No known admin authorization gaps.
- Clean database migration replay.
- Lint and TypeScript checks passing.
- Successful manual QA across homepage, collections, product detail, cart, checkout, payment, confirmation, journal, about, and studio.

Final launch decision remains No-Go until Phase 0 through Phase 3 are complete and verified.
