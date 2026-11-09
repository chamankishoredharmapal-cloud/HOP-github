# Database Query Audit — HOP

## Critical queries analyzed
| Query | Tables | Filters | Sort | Pagination | Index support | Status |
|---|---|---|---|---|---|---|
| fetchProductById | products, product_images, collections | id / status | sort_order | single | PK, product_images_product_id | OK |
| fetchFeaturedProduct | products, product_images, collections | status=published | featured, created_at | 1 | products_status partial | OK |
| fetchRelatedProducts | products, product_images | collection_id, status, id<> | created_at | 4 | products_collection_idx | OK |
| fetchProductsByCollection | products, product_images, collections | status, collection slug | created_at | none (MEDIUM) | products_collection_idx | OK (small data) |
| fetchCollections | collections | status=published | display_order | none | (status not indexed) | OK (5 rows) |
| searchProducts | products, product_images | status + ILIKE across 7 fields | created_at | 12 | seq scan (appropriate) | OK |
| searchCollections | collections | status + ILIKE | display_order | 6 | seq scan (appropriate) | OK |
| customer orders | orders | customer_id | created_at | (client) | idx_orders_customer_id | OK |
| order items | order_items | order_id | — | none | idx_order_items_order_id | OK |

## EXPLAIN ANALYZE
- Product listing (published): Seq Scan on products (3 rows), execution 0.118 ms — appropriate for table size.
- Product search (ILIKE): Seq Scan on products (3 rows), execution 0.137 ms — appropriate; trigram index only justified at scale.

## N+1 queries
- fetchCollectionBySlugWithLegacyFallback: sequential per-legacy-slug calls (max 2) — low impact.
- fetchProductById / fetchFeaturedProduct: separate product_images query after product fetch (2 round trips) — acceptable, could be joined but not required.
- No N+1 loops over unbounded result sets identified.

## Unbounded queries
- fetchProductsByCollection: no LIMIT — MEDIUM risk if collections grow large; documented, not changed (UI expects all products in a collection).

## Filtering/sorting
- Filtering and sorting performed in DB for products, collections, search, orders.
- `SELECT *` used in collectionService and productService.fetchProductById — payload optimization opportunity (MEDIUM).

## Migrations
- None created in this phase.
