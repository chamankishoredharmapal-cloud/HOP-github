# Database: Products & Product Images

## `products`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `uuid` PK | `gen_random_uuid()` | |
| `sku` | `text` UK | | Stock keeping unit |
| `name` | `text` | | Display name |
| `slug` | `text` UK | | Auto-generated from name |
| `story` | `text` | | Editorial narrative |
| `short_description` | `text` | | Listing summary |
| `customer_description` | `text` | | Customer-facing details |
| `selling_price` | `int` | | In paise |
| `mrp` | `int` | | Maximum retail price (paise) |
| `cost_price` | `int` | `0` | Internal cost |
| `stock` | `int` | `0` | Current inventory |
| `low_stock_alert` | `int` | `5` | Threshold for low stock warning |
| `fabric` | `text` | | |
| `weave` | `text` | | |
| `colour` | `text` | | |
| `occasion` | `text` | | |
| `length` | `text` | | |
| `weight` | `text` | | |
| `care_instructions` | `text` | | |
| `country_of_origin` | `text` | `India` | |
| `estimated_dispatch_days` | `int` | `7` | |
| `collection_id` | `uuid` FK → `collections(id)` | | |
| `featured` | `boolean` | `false` | Featured flag |
| `status` | `text` | `draft` | `active`, `draft`, `archived` |
| `meta_title` | `text` | | SEO title |
| `meta_description` | `text` | | SEO description |
| `og_image_url` | `text` | | Social share image |
| `created_at` | `timestamptz` | `now()` | |
| `updated_at` | `timestamptz` | `now()` | Auto-updated by trigger |

### RLS

| Role | Policy |
|------|--------|
| `anon` | `SELECT` for `status = 'active'` products |
| `authenticated` | Full CRUD |

### `product_images`

| Column | Type | Default | Description |
|--------|------|---------|-------------|
| `id` | `uuid` PK | `gen_random_uuid()` | |
| `product_id` | `uuid` FK → `products(id)` ON DELETE CASCADE | |
| `url` | `text` | | Public Storage URL |
| `alt_text` | `text` | | |
| `sort_order` | `int` | `0` | Display order |
| `is_primary` | `boolean` | `false` | Hero image flag |
| `created_at` | `timestamptz` | `now()` | |

### RLS

Same as products.

## Indexes

- `products_sku_idx` unique on `sku`
- `products_slug_idx` unique on `slug`
- `products_collection_idx` on `collection_id`
- `products_status_idx` on `status` where `status = 'active'`
- `products_featured_idx` on `featured` where `featured = true`
- `idx_product_images_product_id` on `(product_id, sort_order)`
