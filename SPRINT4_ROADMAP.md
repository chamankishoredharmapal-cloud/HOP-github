# SPRINT 4 ROADMAP — Launch Readiness

**Objective**: Close all P0 blockers, ship the remaining P1 items, and prepare House of Padmavati for production launch.

---

## Sprint 4.1 — Critical Infrastructure

### 1. Error Boundary (P0 — 1 day)
- Create `<ErrorBoundary>` component wrapping `<Routes>` in `App.tsx`
- Fallback UI matching HOP editorial style
- Log errors to console + optional external service

### 2. Robots.txt + Sitemap (P0 — 1 day)
- Add `public/robots.txt` blocking `/studio/`
- Add `vite-plugin-sitemap` or build-time script to generate `public/sitemap.xml`
- Include all collections, products, journal articles, static pages

### 3. Customer Care Form Backend (P0 — 2 days)
- Create Supabase Edge Function `send-contact-email`
- Wire `CustomerCare.tsx` form `onSubmit` to invoke the function
- Send notification to store email (Resend / SMTP)
- Add success/error toast feedback

### 4. Search Implementation (P0 — 3 days)
- Create search modal component triggered from header icon
- Edge Function or direct Supabase query with `fts` (full-text search) on products
- Display results as a dropdown with image, name, price
- Handle keyboard navigation, Escape to close

### 5. Gift Experience (P0 — 1 day)
- Option A: Build a proper `/gift` landing page with gift-wrapping info
- Option B (minimum): Update ModernHeirlooms CTA to link to `/checkout` with pre-filled gift note

---

## Sprint 4.2 — Admin Completion

### 6. Customers Module (P0 — 3 days)
- Customer list page: table with name, email, phone, order count, total spent, created date
- Customer detail page: info, order history, address history
- Search + filter
- Pull from `customers` + `orders` tables

### 7. Media Library (P0 — 2 days)
- Grid of all uploaded images/videos across products and collections
- Upload new assets independent of products
- Search by filename, related product
- Reuse across products

### 8. Settings Page (P0 — 2 days)
- Store name, tagline, contact email, phone
- Shipping defaults (countries, rates)
- Payment gateway configuration display
- Legal (privacy, terms last-updated dates)

---

## Sprint 4.3 — Customer Experience

### 9. Customer Auth & Account (P1 — 5 days)
- Registration page (`/signup`)
- Login page (`/login`)
- Account dashboard (`/account`) with:
  - Profile info (name, email, phone)
  - Address book (CRUD)
  - Order history table
- Supabase Auth integration with `customers` table
- Protected routes with `AuthGuard` equivalent for customers

### 10. Order History Page (P1 — 2 days)
- `/orders` route listing all orders for authenticated customer
- Order detail page with status, items, shipping info
- Edge Function to fetch customer orders by auth user ID

### 11. Analytics — Basic Dashboard (P1 — 3 days)
- Revenue over time (line chart — Recharts or similar)
- Top products by revenue/quantity
- Order status breakdown (pie chart)
- Period selectors (today, 7d, 30d, 90d, custom)
- Use Supabase aggregation queries or Edge Functions

---

## Sprint 4.4 — Polish & Hardening

### 12. Accessibility Pass (P1 — 2 days)
- Skip-to-content link at top of every page
- Focus trap on mobile menu
- Keyboard navigation for product gallery zoom
- Accessible name on footer newsletter submit button
- `htmlFor` on category sort label
- `alt_text` from database for product gallery images

### 13. SEO JSON-LD Expansion (P1 — 1 day)
- Add `CollectionPage` + `ItemList` schema to collection/category pages
- Add `Article` schema to journal detail pages
- Add `AboutPage` schema to about page

### 14. Performance Audit (P1 — 1 day)
- Run Lighthouse on all page types
- Fix any critical CLS, LCP, or accessibility issues
- Verify video preload strategy (currently `preload="metadata"`)
- Add font-display swap if not already configured

### 15. Image Error Handling (P2 — 1 day)
- Add `onError` handlers to product images showing placeholder
- Add placeholder SVG for missing images

### 16. Empty Directory Cleanup (P2 — 0.5 day)
- Remove `src/app/`, `src/features/`
- Remove empty `src/design-tokens.ts`

---

## Sprint 4.5 — Pre-Launch Verification

### 17. Payment Hardening (P0 — 3 days)
- Fix 4 failing CheckoutPricing tests (server-side price validation)
- Test full payment flow end-to-end (sandbox)
- Test payment failure scenarios
- Test order cancellation and refund flow
- Verify `confirm_paid_order` database function works correctly
- Add retry logic for Razorpay script load failure

### 18. Full E2E Test Suite (P1 — 3 days)
- Customer journey: Browse → PDP → Add to cart → Checkout → Pay → Confirm
- Admin: Login → Create product → Publish → View on storefront
- Admin: Process order through full status flow
- Admin: Inventory adjustment → verify stock reflects on storefront
- Search: Verify results are accurate

### 19. Production Environment Setup (P0 — 2 days)
- Verify all environment variables are set
- Verify Supabase project is on Pro plan (Edge Function requirements)
- Set up custom domain / SSL
- Verify CDN caching for storage assets
- Set up monitoring (error tracking, uptime)
- Configure automated database backups

---

## Effort Summary

| Phase | Tasks | Estimated Effort |
|---|---|---|
| 4.1 — Critical Infrastructure | 5 tasks (9 days) | 9 person-days |
| 4.2 — Admin Completion | 3 tasks (7 days) | 7 person-days |
| 4.3 — Customer Experience | 3 tasks (10 days) | 10 person-days |
| 4.4 — Polish & Hardening | 5 tasks (5.5 days) | 5.5 person-days |
| 4.5 — Pre-Launch Verification | 3 tasks (8 days) | 8 person-days |
| **Total** | **19 tasks** | **~40 person-days** |

**Critical path**: Customer Auth → Order History → E2E Tests must complete before launch.

**Can ship without (P2/P3)**: Address book improvements, duplicate product, product filters, image placeholders.
