# Database Hardening Audit — HOP

## Scope
Phase 1 — Database architecture, integrity & performance hardening (Supabase PostgreSQL, project `kbvjmcnaaogkbnerjcoc`).

## Inventory (public schema)
| Table | Purpose | Rows | PK | FKs | RLS | Indexes | Risk |
|---|---|---:|---|---|---|---|---|
| collections | Product collections | 5 | id (uuid) | — | Yes | 4 | Low |
| contact_messages | Contact form submissions | 2 | id (uuid) | — | Yes | 4 | Low |
| customer_wishlists | Customer wishlists | 0 | id (uuid) | customers, products | Yes | 3 | Low |
| customers | Customer profiles | 2 | id (uuid) | — | Yes | 2 | Low |
| inventory_history | Stock change log | 5 | id (uuid) | products (created_by nullable) | Yes | 3 | Low |
| journal_article_revisions | Journal revision history | 6 | id (uuid) | journal_articles (created_by nullable) | Yes | 3 | Low |
| journal_articles | Journal posts | 6 | id (uuid) | — | Yes | 6 | Low |
| media_assets | Media catalog | 25 | id (uuid) | uploaded_by nullable | Yes | 6 | Low |
| newsletter_subscriptions | Newsletter signups | 3 | id (uuid) | — | Yes | 4 | Low |
| order_events | Order event log | 0 | id (uuid) | orders | Yes | 2 | Low |
| order_items | Order line items | 3 | id (uuid) | orders | Yes | 2 | Low |
| orders | Orders | 3 | id (uuid) | customers, shipping_addresses | Yes | 9 | Low |
| payment_events | Payment idempotency log | 0 | id (uuid) | — | Yes | 4 | Low |
| payments | Payment transactions | 0 | id (uuid) | orders | Yes | 2 | Low |
| product_images | Product media | 5 | id (uuid) | products | Yes | 3 | Low |
| products | Product catalog | 3 | id (uuid) | collections (SET NULL) | Yes | 6 | Low |
| settings | Key/value settings | 2 | key (text) | — | Yes | 1 | Low |
| shipping_addresses | Customer addresses | 3 | id (uuid) | customers | Yes | 3 | Low |
| site_section_revisions | Site section revisions | 25 | id (uuid) | site_sections (published_by nullable) | Yes | 3 | Low |
| site_sections | CMS sections | 13 | key (text) | published_by/updated_by nullable | Yes | 4 | Low |
| studio_activities | Studio audit log | 46 | id (uuid) | — | Yes | 2 | Low |
| published_sections (view) | Published sections view | N/A | N/A | N/A | N/A | N/A | Low |

Row counts verified via `COUNT(*)` on 2026-11-10.

## Classification
- CORE PRODUCT DATA: collections, products, product_images
- USER DATA: customers, shipping_addresses, customer_wishlists
- ORDER DATA: orders, order_items, payments, payment_events, order_events, inventory_history
- CONTENT DATA: journal_articles, journal_article_revisions, media_assets, site_sections, site_section_revisions, published_sections
- ADMIN DATA: studio_activities
- SYSTEM DATA: settings, contact_messages, newsletter_subscriptions

## Primary keys
All public tables have a single-column surrogate PK (`uuid` default `gen_random_uuid()`, except `settings.key` and `site_sections.key` text PK). All PKs NOT NULL and unique. No composite PKs. No changes required.

## Foreign keys
- customer_wishlists → customers, products
- inventory_history → products (created_by nullable)
- journal_article_revisions → journal_articles (created_by nullable)
- order_events → orders
- order_items → orders (product_id is text, no FK to products — documented, not changed)
- orders → customers, shipping_addresses
- payments → orders
- product_images → products
- products → collections (ON DELETE SET NULL)
- shipping_addresses → customers
- site_section_revisions → site_sections (published_by nullable)
- site_sections → published_by/updated_by nullable (no FK to auth.users enforced in public schema)
- media_assets → uploaded_by nullable

All FK column types match referenced PK types except `order_items.product_id` (text vs products.id uuid) — documented, no change (snapshot semantics).

## Unique constraints
- customers email (lowercased functional unique index)
- collections slug
- products sku, slug
- journal_articles slug
- newsletter_subscriptions email
- orders order_number
- payment_events event_id
- media_assets public_url
- customer_wishlists (customer_id, product_id)
- journal/site revisions (article/section + revision_number)
- shipping_addresses one default per customer (partial unique)

## NOT NULL
No columns requiring NOT NULL conversion identified with existing NULL data. All required columns already NOT NULL.

## Defaults
Timestamps default `now()`; booleans/quantities have sensible defaults; status defaults present. No changes required.

## Data integrity
- Orphaned records: 0 across all checked relationships
- Duplicate records: 0 for sku, slug, email, order_number, event_id
- Negative stock: 0
- NULL in required business fields: 0

## Migrations
- No migrations created in this phase (no confirmed critical/high schema issue requiring change)
- All existing schema verified against live database

## Indexing
See `docs/DATABASE_INDEX_AUDIT.md`.

## Query performance
See `docs/DATABASE_QUERY_AUDIT.md`. Key queries are sub-millisecond on current data; sequential scans are appropriate for table sizes. EXPLAIN ANALYZE captured for product listing and search.

## Pagination
- `fetchProductsByCollection`: no LIMIT (returns all collection products) — MEDIUM risk at scale; documented, not changed (UI expects full collection)
- `searchProducts`: LIMIT 12
- `searchCollections`: LIMIT 6
- `fetchRelatedProducts`: LIMIT 4
- Most other queries bounded or single-row

## Product catalogue
- No full-catalogue in-memory filtering found beyond collection listing (bounded by collection size)
- Filtering/sorting performed in DB for search and listings
- `SELECT *` used in some services (collectionService, productService.fetchProductById) — MEDIUM payload-size optimization opportunity; documented

## Final status
READY FOR PHASE 2
```

Write.<|end|><|start|>助理 to=write<|channel|>analysis <|constrain|>xml<|message|><rfl:parameter name="content">
# Database Index Audit — HOP

## Index inventory
Total indexes in public schema: 74 (including PK/unique). Full list in `indexes.csv` (generated during audit).

## Indexes reviewed
Key indexes:
- collections: active, slug (unique), featured partial
- products: collection, featured partial, sku (unique), slug (unique), status partial
- product_images: product_id, (product_id, sort_order)
- orders: customer_id, (customer_id, payment_status, status), order_number (unique), payment_status, shipping_address_snapshot (GIN), status
- order_items: order_id
- payments: order_id
- inventory_history: product_id, created_at
- customer_wishlists: customer_id, (customer_id, product_id) unique
- journal_articles: status, slug, published_at, (sort_order, published_at)
- media_assets: status, type, category, created_at, public_url unique
- site_sections: page, status, type, key PK
- site_section_revisions: (section_key, revision_number desc), (section_key, revision_number) unique
- shipping_addresses: customer_id, one-default partial unique
- customers: email (functional unique lower)

## Indexes added
None (no confirmed missing index justified by current query patterns and data volume).

## Indexes removed
None.

## Indexes retained
All existing indexes retained; no duplicates requiring removal identified except redundant `products_stock_check` / `products_stock_non_negative` (both CHECK, not indexes) — documented as low-priority cleanup candidate.

## Potential future indexes (NOT IMPLEMENTED)
- order_items.product_id (text) — if product-level sales analytics queries are added
- media_assets.uploaded_by — if admin filtering by uploader is added
- orders.shipping_address_id — if address-based lookups are added
- pg_trgm GIN index on products (name, sku, colour, weave, fabric, occasion, short_description) — if search scales beyond small catalog
- Cursor-pagination supporting index on (status, created_at DESC, id) for products if offset pagination is replaced

## Foreign-key indexing
All high-frequency FK columns (product_id, order_id, customer_id, collection_id) already indexed. No new FK index required.

## RLS-related indexes
RLS predicates use is_admin(), email, status, role. Supporting indexes exist on status and email. No changes required.

## Sorting indexes
Common sorts: created_at DESC, display_order ASC, sort_order. Indexes exist for these. No changes required.

## Duplicate/useless indexes
None identified that are clearly unused. `pg_stat_user_indexes` not reviewed (NOT VERIFIED — REQUIRES MANUAL CHECK for usage stats).
