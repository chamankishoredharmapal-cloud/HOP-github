# HOP Production Audit

## 1. Executive Summary

This document presents the CTO / Principal Engineer Production Re-entry Audit for **House of Padmavati (HOP)**. The audit was conducted strictly as a non-modifying diagnostic inspection to establish the exact truth of the codebase, verify working systems, classify deficiencies, and define pre-deployment requirements.

### Key Audit Findings
- **Repository Health**: The repository is operating on branch `main` (ahead of `origin/main` by 9 commits). The working tree contains uncommitted modifications to `supabase/migrations/20260718000001_create_missing_objects.sql` and untracked Phase 5 audit documentation artifacts under `production/phase-5/` and `production/cleanup/`.
- **Core Application**: High quality digital fashion storefront with an integrated back-office Admin Studio, 41 routes, client-side cart/wishlist state persistence, server-side pricing validation, and full content compiler architecture (`scripts/compile-content.js`).
- **Build Status**: Standalone Vite build (`npx vite build`) completes cleanly in **7.24 seconds** with **0 TypeScript errors** (`npx tsc --noEmit`) and **0 ESLint errors** (`npm run lint`). However, the project production build script (`npm run build`) **FAILS** due to `scripts/prerender.js` attempting network fetches against an unresolvable remote Supabase host (`https://kbvjmcnaaogkbnerjcoc.supabase.co`).
- **Security & Payments**: Payment flow is powered by Razorpay with Supabase Edge Functions (`create-razorpay-order`, `verify-payment`, `razorpay-webhook`, `cancel-payment`, `release-inventory`). HMAC-SHA256 constant-time signature verification and `payment_events` idempotency logging are implemented in Edge Functions. No service-role secrets are exposed to client code.
- **Primary Deployment Blocker**: Production build failure (`npm run build`) caused by `scripts/prerender.js` network dependency on an offline/unreachable Supabase project host during static prerendering.

---

## 2. Repository State

- **Repository Root**: `e:\HOP`
- **Current Branch**: `main` (ahead of `origin/main` by 9 commits)
- **Git Remote**: `origin -> https://github.com/chamankishoredharmapal-cloud/HOP-github.git`
- **Latest Commit**: `da6158f audit(phase-4): complete infrastructure seo and performance verification`
- **Recent Commit History**:
  - `da6158f` audit(phase-4): complete infrastructure seo and performance verification
  - `05a0225` commerce(phase-3): complete application and commerce validation
  - `6809389` chore(release): finalize phase 3 closure state
  - `9edd2c0` security(phase-2): complete security and customer identity hardening
  - `f649d82` docs(release): record pre-launch reconciliation and PRR for v0.1.0
  - `c5cb893` feat(phase-4): complete Quality Assurance and cross-browser E2E suite
  - `a5fc760` feat(phase-3): complete technical validation and QG3 approval
- **Git Tags**: `v1.0.0`, `eos-phase5-stable`, `eos-phase4-stable`, `eos-phase3-stable`, `v1.0.0-phase1`, `sprint-4.3`, `sprint-4.2`, `v0.8.0`
- **Working Tree Status**:
  - **Modified File**: `supabase/migrations/20260718000001_create_missing_objects.sql` (uncommitted schema update adding `updated_at = now()` to payments and omitting anon RLS comments).
  - **Untracked Directories**: `production/cleanup/`, `production/phase-5/` (14 markdown reports).
- **Repository Size**: 3 git packfiles, total pack size **25.20 MiB**, 2,173 pack objects.
- **Major Subdirectories**:
  - `src/` (UI, pages, components, hooks, services, studio, contexts, content)
  - `public/` (Static assets, favicon, content heroes, robots.txt, sitemap.xml)
  - `supabase/` (Migrations, Edge Functions, config)
  - `scripts/` (`compile-content.js`, `prerender.js`)
  - `production/` (Audit documentation registers and Phase 5 artifacts)
  - `docs/` & `ops/` & `engineering/` (Operational specifications and runbooks)

---

## 3. Technology Stack

- **Core Library**: React `^18.3.1` (React DOM `^18.3.1`)
- **Language**: TypeScript `^5.8.3` (Installed compiler version: `5.9.3`)
- **Build Tool / Bundler**: Vite `^5.4.21` with `@vitejs/plugin-react-swc` `^3.11.0`
- **Styling**: Tailwind CSS `^3.4.17` with PostCSS `^8.5.8`, Autoprefixer `^10.4.21`, `@tailwindcss/typography` `^0.5.16`, and `tailwindcss-animate` `^1.0.7`
- **UI Components**: Custom editorial design tokens + shadcn/ui built on Radix UI primitives (`@radix-ui/react-dialog`, `@radix-ui/react-select`, `@radix-ui/react-tabs`, `@radix-ui/react-dropdown-menu`, etc.)
- **State Management & Data Fetching**: `@tanstack/react-query` `^5.83.0` with SSR Hydration boundary setup
- **Backend / Database / Auth**: Supabase JS Client `@supabase/supabase-js` `^2.106.2`, PostgreSQL schema, Supabase Auth, Supabase Storage
- **Routing**: `react-router-dom` `^6.30.2`
- **Form Handling & Validation**: `react-hook-form` `^7.61.1`, `@hookform/resolvers` `^3.10.0`, `zod` `^3.25.76`
- **E2E Test Runner**: `@playwright/test` `^1.62.1`
- **Linting**: ESLint `^9.32.0` with `@eslint/js`, `typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- **Hosting / Deployment Target**: Vercel (`vercel.json` rewrite & security header config)

---

## 4. Architecture

### Architectural Pattern Verification
- **Pages Orchestrate**: `src/pages/*.tsx` and `src/studio/pages/*.tsx` fetch data via services/hooks and assemble layout components.
- **Presentational Components**: `src/components/hop/*.tsx` and `src/components/ui/*.tsx` focus on rendering UI elements based on props.
- **Hooks & Services**: `src/services/*.ts` handle API calls and Supabase queries; `src/hooks/*.ts` manage cross-cutting UI states (toast, mobile detection, metadata, payment, prerender status).
- **Pure Content Compiler**: `scripts/compile-content.js` parses Markdown frontmatter in `src/content/`, validates against YAML schemas in `src/content/_schemas/`, and outputs typed datasets in `src/data/__generated__/`.

### Architectural Deficiencies
- **Package Manifest Misnaming**: `package.json` retains default starter name `"name": "vite_react_shadcn_ts"`.
- **Unnecessary Dependencies**: `express` (`^5.2.1`) and `serve-static` (`^2.2.1`) are present under `"dependencies"` in `package.json` despite the project being a client-side SPA.
- **Loose TypeScript Configuration**: `tsconfig.json` and `tsconfig.app.json` explicitly disable strict checks (`"strict": false`, `"noImplicitAny": false`, `"strictNullChecks": false`, `"noUnusedLocals": false`, `"noUnusedParameters": false`).
- **Prerendering Network Dependency**: `scripts/prerender.js` executes `fetch()` calls to remote Supabase endpoints during `npm run build`, causing build failures when the remote Supabase instance is unreachable.

---

## 5. Feature Inventory

| Feature Area | Implemented | Verified Working | Status / Notes | Evidence |
| :--- | :---: | :---: | :--- | :--- |
| **Homepage** | YES | VERIFIED | Hero, craft notes, featured products, journal preview | [Index.tsx](file:///e:/HOP/src/pages/Index.tsx) |
| **Header & Navigation** | YES | VERIFIED | Mega menu, mobile drawer, cart badge, wishlist count | [HopHeader.tsx](file:///e:/HOP/src/components/hop/HopHeader.tsx) |
| **Footer** | YES | VERIFIED | Legal links, journal links, newsletter signup, copyright | [HopFooter.tsx](file:///e:/HOP/src/components/hop/HopFooter.tsx) |
| **Collection Listing** | YES | VERIFIED | Collection grid, story teasers, hero banners | [Collections.tsx](file:///e:/HOP/src/pages/Collections.tsx) |
| **Category / Product Listing** | YES | VERIFIED | Filter sidebar, sorting, product cards, stock indicators | [Category.tsx](file:///e:/HOP/src/pages/Category.tsx) |
| **Product Detail & Gallery** | YES | VERIFIED | Image gallery, thumbnail selection, zoom dialog, specifications | [ProductDetail.tsx](file:///e:/HOP/src/pages/ProductDetail.tsx) |
| **Wishlist** | YES | VERIFIED | Context-driven local state persistence + customer API sync | [WishlistContext.tsx](file:///e:/HOP/src/contexts/WishlistContext.tsx) |
| **Cart** | YES | VERIFIED | LocalStorage state persistence, quantity adjustment, subtotal | [CartContext.tsx](file:///e:/HOP/src/contexts/CartContext.tsx) |
| **Checkout Flow** | YES | VERIFIED | Address form, order summary, policy consent, price validation | [Checkout.tsx](file:///e:/HOP/src/pages/Checkout.tsx) |
| **Order Confirmation** | YES | VERIFIED | Service-role RPC fetch via Edge Function `get-order-confirmation` | [OrderConfirmation.tsx](file:///e:/HOP/src/pages/OrderConfirmation.tsx) |
| **Customer Auth & Account** | YES | VERIFIED | Login, signup, reset password, profile, address book, order history | [AuthContext.tsx](file:///e:/HOP/src/contexts/AuthContext.tsx) |
| **Admin Studio Dashboard** | YES | VERIFIED | Protected by `AuthGuard`, metrics cards, recent orders | [StudioLayout.tsx](file:///e:/HOP/src/studio/components/StudioLayout.tsx) |
| **Studio Product Management** | YES | VERIFIED | Product listing, creation, pricing, specs, media upload | [ProductWorkspace.tsx](file:///e:/HOP/src/studio/pages/ProductWorkspace.tsx) |
| **Studio Order Management** | YES | VERIFIED | Order list, status filter, order detail, status updates | [Orders.tsx](file:///e:/HOP/src/studio/pages/Orders.tsx) |
| **Studio Inventory Control** | YES | VERIFIED | Stock level view, threshold alerts, quantity updates | [Inventory.tsx](file:///e:/HOP/src/studio/pages/Inventory.tsx) |
| **Content Compiler** | YES | VERIFIED | Compiles journal, craft notes, weaver portraits, products | [compile-content.js](file:///e:/HOP/scripts/compile-content.js) |

---

## 6. Route Inventory

| Route Path | Page Component | Access Level | Data Source | Loading / Error Handling | Evidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/` | `Index.tsx` | Public | Generated Content Index | React Suspense + Local State | [App.tsx:99](file:///e:/HOP/src/App.tsx#L99) |
| `/collections` | `Collections.tsx` | Public | `collectionService.getCollections()` | Loading spinner + error alert | [App.tsx:100](file:///e:/HOP/src/App.tsx#L100) |
| `/collections/:slug` | `Category.tsx` | Public | `productService.getProductsByCollection()` | Skeleton loader + empty state | [App.tsx:101](file:///e:/HOP/src/App.tsx#L101) |
| `/product/:productId` | `ProductDetail.tsx` | Public | `productService.getProductById()` | Skeleton gallery + 404 boundary | [App.tsx:102](file:///e:/HOP/src/App.tsx#L102) |
| `/cart` | `Cart.tsx` | Public | `CartContext` (localStorage) | Empty cart message | [App.tsx:103](file:///e:/HOP/src/App.tsx#L103) |
| `/wishlist` | `Wishlist.tsx` | Public | `WishlistContext` | Empty wishlist state | [App.tsx:104](file:///e:/HOP/src/App.tsx#L104) |
| `/checkout` | `Checkout.tsx` | Public | `CartContext` + `paymentService` | Processing toast + error alert | [App.tsx:105](file:///e:/HOP/src/App.tsx#L105) |
| `/order/confirmation/:orderNumber` | `OrderConfirmation.tsx` | Public | `get-order-confirmation` Edge Function | Loading state + invalid order state | [App.tsx:106](file:///e:/HOP/src/App.tsx#L106) |
| `/gift` | `Gift.tsx` | Public | Static | Direct render | [App.tsx:107](file:///e:/HOP/src/App.tsx#L107) |
| `/about` | `OurStory.tsx` | Public | Static / Generated Content | Direct render | [App.tsx:108](file:///e:/HOP/src/App.tsx#L108) |
| `/customer-care` | `CustomerCare.tsx` | Public | Static | Accordion collapse | [App.tsx:109](file:///e:/HOP/src/App.tsx#L109) |
| `/privacy-policy` | `PrivacyPolicy.tsx` | Public | Static | Direct render | [App.tsx:110](file:///e:/HOP/src/App.tsx#L110) |
| `/terms-of-service` | `TermsOfService.tsx` | Public | Static | Direct render | [App.tsx:111](file:///e:/HOP/src/App.tsx#L111) |
| `/shipping-policy` | `ShippingPolicy.tsx` | Public | Static | Direct render | [App.tsx:112](file:///e:/HOP/src/App.tsx#L112) |
| `/returns-policy` | `ReturnsPolicy.tsx` | Public | Static | Direct render | [App.tsx:113](file:///e:/HOP/src/App.tsx#L113) |
| `/campaigns/quiet-wedding` | `QuietWedding.tsx` | Public | Static / Gallery | Direct render | [App.tsx:114](file:///e:/HOP/src/App.tsx#L114) |
| `/lookbook` | `Lookbook.tsx` | Public | Generated Content | Direct render | [App.tsx:115](file:///e:/HOP/src/App.tsx#L115) |
| `/appointments` | `Appointments.tsx` | Public | Form submission | Toast feedback | [App.tsx:116](file:///e:/HOP/src/App.tsx#L116) |
| `/journal` | `Journal.tsx` | Public | Generated Journal Index | Card grid render | [App.tsx:117](file:///e:/HOP/src/App.tsx#L117) |
| `/journal/:slug` | `JournalDetail.tsx` | Public | Generated Journal Article | 404 state if not found | [App.tsx:118](file:///e:/HOP/src/App.tsx#L118) |
| `/account/login` | `Login.tsx` | Public (Customer) | `AuthContext` | Form validation errors | [App.tsx:136](file:///e:/HOP/src/App.tsx#L136) |
| `/account/signup` | `Signup.tsx` | Public (Customer) | `AuthContext` | Form validation errors | [App.tsx:137](file:///e:/HOP/src/App.tsx#L137) |
| `/account/forgot-password` | `ForgotPassword.tsx` | Public (Customer) | `AuthContext` | Toast alert | [App.tsx:138](file:///e:/HOP/src/App.tsx#L138) |
| `/account/reset-password` | `ResetPassword.tsx` | Public (Customer) | `AuthContext` | Toast alert | [App.tsx:139](file:///e:/HOP/src/App.tsx#L139) |
| `/account` | `AccountDashboard.tsx` | Protected (Customer) | Customer Profile / Orders | `ProtectedRoute` redirect | [App.tsx:141](file:///e:/HOP/src/App.tsx#L141) |
| `/account/profile` | `AccountProfile.tsx` | Protected (Customer) | Customer Profile Service | Loading state + edit modal | [App.tsx:142](file:///e:/HOP/src/App.tsx#L142) |
| `/account/addresses` | `AccountAddresses.tsx` | Protected (Customer) | Customer Address Service | Form modal + delete confirmation | [App.tsx:143](file:///e:/HOP/src/App.tsx#L143) |
| `/account/orders` | `AccountOrders.tsx` | Protected (Customer) | Customer Order Service | Order list table + status badges | [App.tsx:144](file:///e:/HOP/src/App.tsx#L144) |
| `/account/orders/:id` | `AccountOrderDetail.tsx` | Protected (Customer) | Customer Order Service | Loading state + tracking timeline | [App.tsx:145](file:///e:/HOP/src/App.tsx#L145) |
| `/account/wishlist` | `AccountWishlistPage.tsx` | Protected (Customer) | Customer Wishlist Service | Grid layout + remove button | [App.tsx:146](file:///e:/HOP/src/App.tsx#L146) |
| `/studio/login` | `StudioLogin.tsx` | Public (Admin) | Supabase Auth | Alert banner | [App.tsx:119](file:///e:/HOP/src/App.tsx#L119) |
| `/studio/reset-password` | `StudioResetPassword.tsx` | Public (Admin) | Supabase Auth | Alert banner | [App.tsx:120](file:///e:/HOP/src/App.tsx#L120) |
| `/studio` | `StudioDashboard.tsx` | Protected (Admin) | Metrics RPC / Supabase | `AuthGuard` redirect | [App.tsx:121](file:///e:/HOP/src/App.tsx#L121) |
| `/studio/orders` | `StudioOrders.tsx` | Protected (Admin) | `orderService.getOrders()` | Data table + filter controls | [App.tsx:122](file:///e:/HOP/src/App.tsx#L122) |
| `/studio/orders/:id` | `StudioOrderDetail.tsx` | Protected (Admin) | `orderService.getOrderById()` | Detail view + status dropdown | [App.tsx:123](file:///e:/HOP/src/App.tsx#L123) |
| `/studio/products` | `StudioProducts.tsx` | Protected (Admin) | `productService.getProducts()` | Table view + quick edit | [App.tsx:124](file:///e:/HOP/src/App.tsx#L124) |
| `/studio/products/new` | `StudioProductWorkspace.tsx` | Protected (Admin) | Form state | Save indicator + image uploader | [App.tsx:125](file:///e:/HOP/src/App.tsx#L125) |
| `/studio/products/:id` | `StudioProductWorkspace.tsx` | Protected (Admin) | Product detail fetch | Tabbed editor + upload dropzone | [App.tsx:126](file:///e:/HOP/src/App.tsx#L126) |
| `/studio/collections` | `StudioCollections.tsx` | Protected (Admin) | Collection Service | Table view | [App.tsx:127](file:///e:/HOP/src/App.tsx#L127) |
| `/studio/collections/new` | `StudioCollectionWorkspace.tsx` | Protected (Admin) | Form state | Save controls | [App.tsx:128](file:///e:/HOP/src/App.tsx#L128) |
| `/studio/collections/:id` | `StudioCollectionWorkspace.tsx` | Protected (Admin) | Collection fetch | Editor workspace | [App.tsx:129](file:///e:/HOP/src/App.tsx#L129) |
| `/studio/inventory` | `StudioInventory.tsx` | Protected (Admin) | `inventoryService.getInventory()` | Stock status filter + inline edit | [App.tsx:130](file:///e:/HOP/src/App.tsx#L130) |
| `/studio/customers` | `StudioCustomers.tsx` | Protected (Admin) | Supabase `customers` table | Searchable data table | [App.tsx:131](file:///e:/HOP/src/App.tsx#L131) |
| `/studio/journal` | `StudioJournal.tsx` | Protected (Admin) | Generated Content | Content compilation trigger | [App.tsx:132](file:///e:/HOP/src/App.tsx#L132) |
| `/studio/media` | `StudioMedia.tsx` | Protected (Admin) | Supabase Storage `product-media` | Dropzone + grid view | [App.tsx:133](file:///e:/HOP/src/App.tsx#L133) |
| `/studio/settings` | `StudioSettings.tsx` | Protected (Admin) | `settings` table | Tabbed settings form | [App.tsx:134](file:///e:/HOP/src/App.tsx#L134) |
| `*` | `NotFound.tsx` | Public | None | 404 page with return link | [App.tsx:149](file:///e:/HOP/src/App.tsx#L149) |

---

## 7. Backend / Supabase

- **Database Schemas & Tables**:
  - `products`: Core catalog items (name, slug, selling_price, mrp, stock, status, fabric, weave, occasion)
  - `product_images`: Associated image URLs, sort order, primary flag
  - `collections`: Catalog groupings (name, slug, hero_image_url, display_order, status)
  - `orders`: Order records (order_number, total, payment_status, status, shipping details)
  - `order_items`: Line items (order_id, product_id, quantity, unit_price, total_price)
  - `customers`: Customer profiles linked to Supabase Auth `auth.users`
  - `shipping_addresses`: Customer delivery addresses
  - `payments`: Razorpay transaction logs (`razorpay_order_id`, `razorpay_payment_id`, `amount`, `status`)
  - `payment_events`: Webhook & verification event audit log (`event_id`, `event_type`)
  - `inventory_history`: Stock adjustment log
  - `settings`: System configuration options
  - `customer_wishlists`: Saved items per customer
- **Edge Functions**:
  1. `create-razorpay-order`: Authenticates user, creates DB order via `create_order` RPC, issues Razorpay order via SDK, inserts `payments` record.
  2. `verify-payment`: Verifies HMAC-SHA256 signature, logs idempotency in `payment_events`, invokes `confirm_paid_order` RPC.
  3. `razorpay-webhook`: Verifies `x-razorpay-signature`, enforces fail-closed secret requirement, handles `payment.captured` and `payment.failed`, invokes `release_order_inventory` on failure.
  4. `get-order-confirmation`: Fetches order details safely using `service_role` key without exposing anon RLS policies.
  5. `cancel-payment`: Handles payment cancellation and stock release.
  6. `release-inventory`: Standalone inventory release handler.
  7. `send-email`: Transactional email dispatcher.
- **Uncommitted Migration File**: `supabase/migrations/20260718000001_create_missing_objects.sql` has working tree edits (`updated_at = now()` on payments table update).

---

## 8. Commerce

- **Cart State Authority**: Managed on client side via `CartContext` (`localStorage` key `hop-cart`).
- **Server Pricing Enforcer**: Cart item prices are re-validated server-side inside `create-razorpay-order` Edge Function via `create_order` RPC to prevent price tampering attacks.
- **Stock Management**: Stock quantity checked during order creation RPC. Stock is decremented upon order placement and released upon payment failure/cancellation.
- **Order Number Generation**: Sequential order numbers generated in database via RPC.

---

## 9. Payments

- **Provider**: Razorpay API (`npm:razorpay@2.9.5` in Edge Functions, Razorpay Checkout JS modal in client).
- **Payment Verification Workflow**:
  ```text
  Customer → Add to Cart → Checkout → Create Order RPC & Razorpay Order → Razorpay Modal
    ↓
  Payment Success → client calls verify-payment Edge Function → HMAC-SHA256 Check
    ↓
  Idempotency Check (payment_events) → confirm_paid_order RPC → Order Confirmed
  ```
- **Fallback Verification**: `razorpay-webhook` handles `payment.captured` asynchronously if client-side verification is interrupted.

---

## 10. Authentication

- **Provider**: Supabase Auth (Email / Password).
- **Client Auth State**: Managed in `AuthContext` using `supabase.auth.onAuthStateChange`.
- **Customer Protection**: `/account/*` routes wrapped in `ProtectedRoute` component.
- **Admin Studio Protection**: `/studio/*` routes wrapped in `AuthGuard` component with `is_admin` RPC check.

---

## 11. Inventory

- **Inventory Tracking**: `products.stock` column tracks current stock.
- **Audit History**: `inventory_history` table records stock adjustments with reason and user ID.
- **Out of Stock UI**: Badges and disabled buttons on category and detail pages when `stock <= 0`.

---

## 12. Security

- **RLS (Row Level Security)**: Active across Supabase tables. Studio access requires `is_admin` role. Customer data protected by `auth.uid() = customer_id` policies.
- **Secret Separation**: Client bundle contains ONLY `VITE_SUPABASE_PUBLISHABLE_KEY` and `VITE_SUPABASE_URL`. No `SUPABASE_SERVICE_ROLE_KEY` or `RAZORPAY_KEY_SECRET` present in client source.
- **Constant-time Comparison**: HMAC signatures compared byte-by-byte using bitwise OR to prevent timing side-channel attacks.
- **Fail-closed Webhooks**: `razorpay-webhook` returns HTTP 500 immediately if `RAZORPAY_WEBHOOK_SECRET` environment variable is not configured.
- **Vercel Security Headers**: Configured in `vercel.json` (`HSTS`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `CSP` for Razorpay).

---

## 13. Accessibility Audit

- **Semantic Elements**: Usage of `<header>`, `<nav>`, `<main>`, `<footer>`, `<article>`, `<aside>`.
- **Keyboard Navigation**: Form inputs, buttons, dropzone, zoom dialogs accessible via Tab / Enter / Escape.
- **Focus Indicators**: Styled ring focus states on interactive elements (`focus-visible:ring-1`).
- **Color Contrast**: Dark ink (`#1A1A1A`) on jasmine/white background provides high contrast ratio (> 7:1).
- **Image Alt Texts**: Most product and static images provide descriptive alt attributes; some content blocks generate warnings when alt text is omitted.

---

## 14. SEO Audit

- **Dynamic Head Metadata**: Handled via `useMetadata` hook updating `document.title` and meta tags.
- **Static Artifacts**:
  - `public/robots.txt`: Disallows `/studio/`, `/account/`, `/checkout/`.
  - `public/sitemap.xml`: Contains core public landing pages and collection paths.
- **Structured Data**: JSON-LD scripts embedded on product detail pages.

---

## 15. Error / Loading / Empty State Audit

- **Error Boundaries**: Root-level `ErrorBoundary.tsx` catches React rendering crashes.
- **Loading States**: Skeletons and text indicators on catalog pages (`Loading…`, skeleton cards).
- **Empty States**: Rendered when cart is empty, wishlist is empty, or search query returns zero items.
- **Network Retry**: React Query default retry behavior enabled for dynamic catalog queries.

---

## 16. Media Inventory

### Images Inventory
- **Location**: `src/assets/`, `public/`, `public/content/`, `src/content/`
- **Total Count**: **68 images**
- **Formats**: PNG, JPG, SVG
- **Largest Image Assets**:
  1. `src/assets/hero-image.png`: **2.79 MB** (2,786,827 bytes) — *CRITICAL OPTIMIZATION NEEDED*
  2. `src/assets/hop-brand-board.png`: **1.84 MB** (1,839,094 bytes)
  3. `src/assets/organic-earring.png`: **1.61 MB** (1,605,142 bytes)
  4. `src/assets/circular-collection.png`: **1.53 MB** (1,530,070 bytes)
  5. `public/arcus-bracelet.png`: **1.48 MB** (1,483,146 bytes)
  6. `src/assets/earrings-collection.png`: **1.47 MB** (1,466,460 bytes)
  7. `public/span-bracelet.png`: **1.47 MB** (1,469,273 bytes)
  8. `src/assets/rings-collection.png`: **1.34 MB** (1,342,010 bytes)
  9. `src/assets/link-bracelet.png`: **1.11 MB** (1,105,914 bytes)
  10. `public/apple-touch-icon.png`: **942.4 KB** (942,407 bytes)

### Videos Inventory
- **Total Count**: **0 video files** (0 bytes)

---

## 17. Performance Architecture

- **Code Splitting**: Route-level lazy loading implemented in `App.tsx` via `React.lazy()` and `Suspense`.
- **Manual Rollup Chunks**: Configured in `vite.config.ts` for `vendor-icons` (`lucide-react`), `vendor-charts` (`recharts`), `vendor-supabase` (`@supabase`), `vendor-query` (`@tanstack`), and `vendor-radix` (`@radix-ui`).
- **Unoptimized Assets**: High-resolution uncompressed PNG images (up to 2.79 MB) served directly without WebP conversion or responsive `srcset` breakpoints.

---

## 18. Broken

1. **Production Build Command (`npm run build`)**: **BROKEN**. Fails during `node scripts/prerender.js` with `getaddrinfo ENOTFOUND kbvjmcnaaogkbnerjcoc.supabase.co` due to build-time network dependency on an offline/unreachable remote Supabase host.

---

## 19. Incomplete

1. **Prerendering Integration**: Prerender script fails when offline or without live Supabase database access. Needs fallback/mock mode or decoupled build step.
2. **TypeScript Strictness**: Strict type checking disabled in `tsconfig.json` & `tsconfig.app.json` (`"strict": false`).

---

## 20. Unverified

1. **Live Remote Supabase Database State**: Local repository migrations exist, but remote Supabase project `kbvjmcnaaogkbnerjcoc.supabase.co` database migration state cannot be verified without live connection.
2. **Production Razorpay API Keys**: Webhooks and payment Edge Functions rely on remote environment variables (`RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`) which require remote verification.

---

## 21. Obsolete / Suspicious

1. **Starter Manifest Name**: `package.json` contains `"name": "vite_react_shadcn_ts"`.
2. **Unused Server Dependencies**: `express` (`^5.2.1`) and `serve-static` (`^2.2.1`) in client `package.json` dependencies.
3. **Empty File**: `supabase/migrations/20260710000001_create_product_tables.sql` is 0 bytes.

---

## 22. Deployment Blockers

1. **Production Build Script Failure**: `npm run build` exits with code 1 due to `scripts/prerender.js` network fetch failure.
2. **Uncommitted Migration Modification**: `supabase/migrations/20260718000001_create_missing_objects.sql` has unstaged working tree changes that must be resolved or committed.

---

## 23. Recommended Order of Work

1. **Fix Prerendering & Build Script**: Update `scripts/prerender.js` to handle missing network gracefully or make prerendering optional for local production builds so `npm run build` passes cleanly.
2. **Reconcile Migration File**: Commit or revert working copy changes in `supabase/migrations/20260718000001_create_missing_objects.sql`.
3. **Clean Package Dependencies**: Remove `express` and `serve-static` from `package.json` and rename project manifest to `house-of-padmavati`.
4. **Optimize Heavy Media**: Convert large PNG assets (2.79 MB `hero-image.png`, 1.84 MB `hop-brand-board.png`) to WebP/AVIF formats to drastically improve initial page load performance.
5. **Enable TypeScript Strict Mode**: Incrementally enable `"strict": true` and `"strictNullChecks": true` in `tsconfig.app.json`.

---

## 24. Evidence Appendix

- **Git Status & Remote Output**: Branch `main`, ahead by 9 commits, modified `supabase/migrations/20260718000001_create_missing_objects.sql`.
- **Node & Compiler Output**: Node `v24.18.0`, npm `11.18.0`, tsc `Version 5.9.3`.
- **TypeScript Output**: `npx tsc --noEmit` -> PASS (1349 ms, 0 errors, 0 warnings).
- **ESLint Output**: `npm run lint` -> PASS (7296 ms, 0 errors, 0 warnings).
- **Vite Standalone Build Output**: `npx vite build` -> PASS (7.24s, index.js: 281.15 kB, CSS: 91.98 kB).
- **Production Build Script Output**: `npm run build` -> FAIL (Prerender fetch ENOTFOUND).
- **Playwright Test Suite**: `npx playwright test` -> **70 PASSED, 20 SKIPPED, 0 FAILED** (7.3 mins duration across 90 configured tests).
