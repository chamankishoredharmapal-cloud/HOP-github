# LAUNCH BLOCKERS

## P0 — Launch Blocker (Cannot ship without)

| # | Area | Issue | Why it blocks | Fix |
|---|---|---|---|---|
| 1 | **Customer Care** | Contact form has no `onSubmit` handler. Submissions disappear into the void. | Customers who reach out receive no response — erodes trust, loses orders. | Add form handler → Supabase Edge Function → email. |
| 2 | **Search** | Header search icon has no onClick handler. | Users cannot search products. Critical discovery feature missing. | Implement search modal or /search page with Supabase full-text search. |
| 3 | **Gift Experience** | `/gift` route redirects to `/collections`. "Begin a gift" CTA leads to nowhere. | ModernHeirlooms section promises a gift flow that doesn't exist. Editorial contradiction. | Build gift flow (or update copy to remove the CTA). |
| 4 | **Customers (Admin)** | Placeholder page only. | Cannot view, search, or manage customers. Operational blocker for order support and marketing. | Build customer list + detail view. |
| 5 | **Media Library (Admin)** | Placeholder page only. | Cannot browse all uploaded images/videos. Media operations require Supabase dashboard. | Build media gallery with search, filter, reuse across products. |
| 6 | **Settings (Admin)** | Placeholder page only. | Cannot configure store, shipping, email, payment from the app. Hardcoded values everywhere. | Build settings page for store config. |
| 7 | **No sitemap.xml** | Not generated. | Search engines cannot discover all product/collection/journal pages. Direct impact on organic traffic. | Generate sitemap at build time (or dynamically). |
| 8 | **No robots.txt** | Not present. | Crawlers allowed on all paths including /studio. | Add robots.txt blocking /studio. |
| 9 | **No Error Boundary** | No React Error Boundary. | A single runtime error crashes entire app. Catastrophic UX failure. | Wrap app in Error Boundary with fallback UI. |

## P1 — Required Before Launch

| # | Area | Issue | Impact | Fix |
|---|---|---|---|---|
| 1 | **Customer Account** | No registration, login, or profile page. | Customers cannot track orders, save addresses, or have persistent identity. | Build customer auth flow (Supabase Auth + account pages). |
| 2 | **Order History** | No customer-facing order history. | After checkout, customers have no way to view past orders. | Build /orders page fetching from Edge Function. |
| 3 | **Contact Form Real Handler** | Form UI exists but no backend. | Customer service inquiries go unreceived. | Connect to email service (Resend, SendGrid, or Supabase Edge Function → SMTP). |
| 4 | **Sitemap** | Missing. | SEO discovery limited for new products. Considered P0 for SEO-sensitive launch. | Add `vite-plugin-sitemap` or Edge Function. |
| 5 | **Analytics** | No dashboard charts or reporting. | Cannot measure store performance, trends, or customer behaviour. | Add basic charts (revenue over time, top products, conversion). |
| 6 | **CheckoutPricing Tests (Server-Side)** | 4 failing tests — server-side pricing validation. | Pricing integrity not validated in CI. Already documented as known issue. | Resolve during Payment Hardening Sprint. |
| 7 | **Accessibility — Skip Links** | No skip-to-content links. | Keyboard users must tab through entire header on every page. | Add skip link as first focusable element. |
| 8 | **Collection Pages JSON-LD** | Only product pages have product schema. | Limited structured data for collection/lister pages. | Add JSON-LD (CollectionPage, ItemList) to category pages. |

## P2 — Nice to Have

| # | Area | Issue | Notes |
|---|---|---|---|
| 1 | **Address Book** | No saved addresses. | Customers retype address on every order. |
| 2 | **Product Filters** | Only sort on category page. | Add fabric, weave, colour, price-range filter sidebar. |
| 3 | **Bulk Admin Operations** | Cannot bulk archive, status-change, or delete. | Improves admin efficiency. |
| 4 | **Order Notes in Checkout** | Customer cannot add delivery notes. | Minor convenience. |
| 5 | **Ability to Edit Cart Item Size** | Size shown but not changeable in cart. | Must remove and re-add. |
| 6 | **Duplicate Product** | No "duplicate" in admin. | Useful for similar products. |
| 7 | **Image Placeholder on Load Error** | No `onError` fallback for images. | Visual improvement. |
| 8 | **Keyboard Trap on Mobile Menu** | Menu doesn't trap focus. | Accessibility improvement. |
| 9 | **Product Gallery Image alt text** | Currently uses generic "Product view 1" instead of actual alt_text from database. | Minor SEO + accessibility improvement. |
| 10 | **Clean up empty dirs** | `src/app/`, `src/features/`, `src/design-tokens.ts` empty. | Housekeeping. |

## P3 — Future Version

| # | Area | Issue |
|---|---|---|
| 1 | Multi-language support | i18n for international markets |
| 2 | Size / fit recommendation | AI-based saree size suggestion |
| 3 | AR try-on | Virtual drape preview |
| 4 | Wishlist sharing | Share wishlist links |
| 5 | Back-in-stock notifications | Email when OOS product restocked |
| 6 | Abandoned cart recovery | Email/SMS reminders |
| 7 | Customer reviews / testimonials | Social proof on product pages |
| 8 | Blog CMS from Admin | Full journal editor |
| 9 | Discount / coupon engine | Promo code management |
| 10 | Multi-currency | International pricing |
