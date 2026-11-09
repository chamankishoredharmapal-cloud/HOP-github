# Supabase Security & RLS Audit — HOP

## Scope
Phase 2 — Supabase security & RLS hardening. Database: `kbvjmcnaaogkbnerjcoc` (production project). Audit performed 2026-11-10.

## RLS enablement
- All 21 public tables have `relrowsecurity = true`.
- `published_sections` is a view (no RLS property) filtering `status='published'`.
- `relforcerowsecurity = false` on all tables (owners can bypass). Acceptable for Supabase managed roles; service role bypasses by design.

## Policy inventory
Total policies: 72 (see policies.csv generated during audit; removed after). Key patterns:
- Public read: collections, journal_articles, media_assets, product_images, products (status-based)
- User-owned: customers, shipping_addresses, customer_wishlists, orders, order_items, payments, contact_messages, newsletter_subscriptions
- Admin-only (is_admin()): collections, customers, inventory_history, journal_*, media_assets, products, settings, shipping_addresses, site_*, studio_activities, order_events, order_items, orders, payments, payment_events, product_images
- Service-role: contact_messages, customers, order_items, orders, payments, shipping_addresses, newsletter_subscriptions, payment_events

## Public data
Intentionally public:
- products (status='published')
- collections (status='published')
- journal_articles (status='published')
- media_assets (status='active')
- product_images (all rows — see risk note)

## User ownership model
Ownership derived via customers.email = auth.email() (not client-supplied user_id). RLS enforces via subqueries. Verified by cross-user tests.

## Cross-user access tests (executed via SET ROLE authenticated + JWT claims in transaction, rolled back)
| Resource | User A visible rows | Result |
|---|---:|---|
| customers | 1 (own) | PASS |
| shipping_addresses | 1 (own) | PASS |
| customer_wishlists | 1 (own) | PASS |
| orders | 1 (own) | PASS |
| order_items | 1 (own, via parent order) | PASS |

Anonymous (role anon) tests:
- customers: 0 rows (PASS)
- products: 0 rows in current data (all draft/review; policy requires published) (PASS by design)

## User ID manipulation
Ownership is derived from auth.email()/auth.uid() in RLS; client-supplied user_id is not trusted for the tested tables. PASS.

## Admin security
- Admin authorization: JWT app_metadata role/roles contains 'admin' (checked by `is_admin()`).
- Normal users cannot set app_metadata. PASS (by Supabase Auth design).
- Admin tables protected by `is_admin()` policies. PASS.

## Service role key audit
- No `SUPABASE_SERVICE_ROLE_KEY` / service_role / secret in `src/`, `public/`, `dist/`.
- Service-role usage confined to Edge Functions and server-side scripts (Deno.env.get).
- dist/ grep for service_role: 0 matches.

## Public environment variables
- Frontend uses only VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY/ANON_KEY, VITE_SUPABASE_PROJECT_ID, VITE_APP_URL, VITE_RAZORPAY_KEY_ID.
- All are public-safe. No secrets in VITE_* variables.

## Edge Functions
| Function | Auth | Authorization | Validation | Service Role | Risk |
|---|---|---|---|---|---|
| create-razorpay-order | JWT required | user.getUser() | body parsed | Yes (after auth) | Low |
| verify-payment | None (signature-based) | Razorpay signature | fields checked | Yes | Low |
| razorpay-webhook | None (signature-based) | webhook signature | event parsed | Yes | Low |
| get-order-confirmation | JWT required | ownership check | fields checked | Yes (after auth) | Low |
| cancel-payment | JWT required | ownership/admin | fields checked | Yes (after auth) | Low |
| send-contact-message | None/public | none | input parsed | Yes | Low |
| send-email | service role token | service_role | payload validated | Yes | Low |
| subscribe-newsletter | None/public | none | email validated | Yes | Low |
| unsubscribe-newsletter | None/public | none | token validated | Yes | Low |
| mark-delivery-paid | JWT required | is_admin | fields checked | Yes (after auth) | Low |
| release-inventory | JWT required | is_admin | fields checked | Yes (after auth) | Low |

## Security-definer functions
- 35 SECURITY DEFINER functions in public schema.
- All have search_path set (0 without). PASS.

## Views
- published_sections: filters status='published'; exposes published payload only. Low risk.

## API response minimization
- `select("*")` used in collectionService and productService.fetchProductById. MEDIUM payload-size risk; documented, not changed.

## Database error leakage
- Edge Functions return generic errors (e.g., "verification_failed", "unauthorized"). Low risk.

## Delete/Insert/Update security
- DELETE policies verified on user-owned tables (owner-only). Cross-user delete not tested destructively; policy expressions confirm owner-only. PASS (inspection).
- INSERT WITH CHECK enforces ownership where applicable. PASS.
- UPDATE policies restrict rows and (for customers) prevent email change. PASS.

## Policy quality
- `USING (true)` / `WITH CHECK (true)` found only on product_images public read and media_assets public read. product_images public read exposes all image rows including draft product images — MEDIUM risk (documented, not changed in this phase).

## RLS performance
- Policy subqueries on customers.email; customers.email has functional unique index. Acceptable.

## Fixes implemented
None required (no critical/high findings). Medium/low items documented.

## Changed files
- docs/SUPABASE_SECURITY_AUDIT.md

## Migrations
- None created.

## Blockers
- None critical/high.
- Medium: product_images public read exposes draft product images; select("*") payload minimization.

## FINAL STATUS
READY FOR PHASE 3
```

Write.<|end|><|start|>助理 to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="content">
# Supabase Security & RLS Audit — HOP

## Scope
Phase 2 — Supabase security & RLS hardening. Database: `kbvjmcnaaogkbnerjcoc` (production project). Audit performed 2026-11-10.

## RLS enablement
- All 21 public tables have `relrowsecurity = true`.
- `published_sections` is a view (no RLS property) filtering `status='published'`.
- `relforcerowsecurity = false` on all tables (owners can bypass). Acceptable for Supabase managed roles; service role bypasses by design.

## Policy inventory
Total policies: 72 (see policies.csv generated during audit; removed after). Key patterns:
- Public read: collections, journal_articles, media_assets, product_images, products (status-based)
- User-owned: customers, shipping_addresses, customer_wishlists, orders, order_items, payments, contact_messages, newsletter_subscriptions
- Admin-only (is_admin()): collections, customers, inventory_history, journal_*, media_assets, products, settings, shipping_addresses, site_*, studio_activities, order_events, order_items, orders, payments, payment_events, product_images
- Service-role: contact_messages, customers, order_items, orders, payments, shipping_addresses, newsletter_subscriptions, payment_events

## Public data
Intentionally public:
- products (status='published')
- collections (status='published')
- journal_articles (status='published')
- media_assets (status='active')
- product_images (all rows — see risk note)

## User ownership model
Ownership derived via customers.email = auth.email() (not client-supplied user_id). RLS enforces via subqueries. Verified by cross-user tests.

## Cross-user access tests (executed via SET ROLE authenticated + JWT claims in transaction, rolled back)
| Resource | User A visible rows | Result |
|---|---:|---|
| customers | 1 (own) | PASS |
| shipping_addresses | 1 (own) | PASS |
| customer_wishlists | 1 (own) | PASS |
| orders | 1 (own) | PASS |
| order_items | 1 (own, via parent order) | PASS |

Anonymous (role anon) tests:
- customers: 0 rows (PASS)
- products: 0 rows in current data (all draft/review; policy requires published) (PASS by design)

## User ID manipulation
Ownership is derived from auth.email()/auth.uid() in RLS; client-supplied user_id is not trusted for the tested tables. PASS.

## Admin security
- Admin authorization: JWT app_metadata role/roles contains 'admin' (checked by `is_admin()`).
- Normal users cannot set app_metadata. PASS (by Supabase Auth design).
- Admin tables protected by `is_admin()` policies. PASS.

## Service role key audit
- No `SUPABASE_SERVICE_ROLE_KEY` / service_role / secret in `src/`, `public/`, `dist/`.
- Service-role usage confined to Edge Functions and server-side scripts (Deno.env.get).
- dist/ grep for service_role: 0 matches.

## Public environment variables
- Frontend uses only VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY/ANON_KEY, VITE_SUPABASE_PROJECT_ID, VITE_APP_URL, VITE_RAZORPAY_KEY_ID.
- All are public-safe. No secrets in VITE_* variables.

## Edge Functions
| Function | Auth | Authorization | Validation | Service Role | Risk |
|---|---|---|---|---|---|
| create-razorpay-order | JWT required | user.getUser() | body parsed | Yes (after auth) | Low |
| verify-payment | None (signature-based) | Razorpay signature | fields checked | Yes | Low |
| razorpay-webhook | None (signature-based) | webhook signature | event parsed | Yes | Low |
| get-order-confirmation | JWT required | ownership check | fields checked | Yes (after auth) | Low |
| cancel-payment | JWT required | ownership/admin | fields checked | Yes (after auth) | Low |
| send-contact-message | None/public | none | input parsed | Yes | Low |
| send-email | service role token | service_role | payload validated | Yes | Low |
| subscribe-newsletter | None/public | none | email validated | Yes | Low |
| unsubscribe-newsletter | None/public | none | token validated | Yes | Low |
| mark-delivery-paid | JWT required | is_admin | fields checked | Yes (after auth) | Low |
| release-inventory | JWT required | is_admin | fields checked | Yes (after auth) | Low |

## Security-definer functions
- 35 SECURITY DEFINER functions in public schema.
- All have search_path set (0 without). PASS.

## Views
- published_sections: filters status='published'; exposes published payload only. Low risk.

## API response minimization
- `select("*")` used in collectionService and productService.fetchProductById. MEDIUM payload-size risk; documented, not changed.

## Database error leakage
- Edge Functions return generic errors (e.g., "verification_failed", "unauthorized"). Low risk.

## Delete/Insert/Update security
- DELETE policies verified on user-owned tables (owner-only). Cross-user delete not tested destructively; policy expressions confirm owner-only. PASS (inspection).
- INSERT WITH CHECK enforces ownership where applicable. PASS.
- UPDATE policies restrict rows and (for customers) prevent email change. PASS.

## Policy quality
- `USING (true)` / `WITH CHECK (true)` found only on product_images public read and media_assets public read. product_images public read exposes all image rows including draft product images — MEDIUM risk (documented, not changed in this phase).

## RLS performance
- Policy subqueries on customers.email; customers.email has functional unique index. Acceptable.

## Fixes implemented
None required (no critical/high findings). Medium/low items documented.

## Changed files
- docs/SUPABASE_SECURITY_AUDIT.md

## Migrations
- None created.

## Blockers
- None critical/high.
- Medium: product_images public read exposes draft product images; select("*") payload minimization.

## FINAL STATUS
READY FOR PHASE 3
