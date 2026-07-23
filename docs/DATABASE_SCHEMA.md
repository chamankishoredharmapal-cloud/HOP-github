# Database Schema

## Entity Relationship

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : places
    CUSTOMERS ||--o{ SHIPPING_ADDRESSES : has
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDERS ||--o{ PAYMENTS : has
    ORDERS ||--|| SHIPPING_ADDRESSES : ships_to

    CUSTOMERS {
        uuid id PK
        text email UK
        text full_name
        text phone
        timestamptz created_at
    }

    SHIPPING_ADDRESSES {
        uuid id PK
        uuid customer_id FK
        text recipient_name
        text phone
        text address
        text city
        text state
        text postal_code
        text country
        text landmark
        timestamptz created_at
    }

    ORDERS {
        uuid id PK
        uuid customer_id FK
        uuid shipping_address_id FK
        text order_number UK
        enum status
        enum payment_status
        int subtotal
        int shipping_cost
        int total
        text notes
        timestamptz created_at
        timestamptz updated_at
    }

    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        text product_id
        text product_name
        int product_price
        int quantity
        text image_url
        timestamptz created_at
    }

    PAYMENTS {
        uuid id PK
        uuid order_id FK
        text razorpay_payment_id
        text razorpay_order_id
        int amount
        text currency
        enum status
        timestamptz created_at
    }
```

## Enums

### order_status
```
pending_payment | confirmed | processing | shipped | delivered | cancelled | returned
```

### payment_status
```
pending | paid | failed | refunded | partially_refunded
```

### payment_transaction_status
```
pending | paid | failed | refunded
```

## Products & Collections Schema

```mermaid
erDiagram
    COLLECTIONS ||--o{ PRODUCTS : contains
    PRODUCTS ||--|{ PRODUCT_IMAGES : has

    COLLECTIONS {
        uuid id PK
        text name
        text slug UK
        text description
        text hero_image_url
        text hero_video_url
        text editorial_story
        text tagline
        boolean featured_on_homepage
        text status
        int display_order
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCTS {
        uuid id PK
        text sku UK
        text name
        text slug UK
        text story
        int selling_price
        int mrp
        int cost_price
        int stock
        int low_stock_alert
        text fabric
        text weave
        text colour
        text occasion
        text length
        text weight
        text care_instructions
        text country_of_origin
        int estimated_dispatch_days
        uuid collection_id FK
        boolean featured
        enum status
        text meta_title
        text meta_description
        text og_image_url
        timestamptz created_at
        timestamptz updated_at
    }

    PRODUCT_IMAGES {
        uuid id PK
        uuid product_id FK
        text url
        text alt_text
        int sort_order
        boolean is_primary
        timestamptz created_at
    }

    INVENTORY_HISTORY ||--o| PRODUCTS : tracks
    INVENTORY_HISTORY {
        uuid id PK
        uuid product_id FK
        int change
        int previous_stock
        int new_stock
        text reason
        text notes
        uuid created_by FK
        timestamptz created_at
    }
```

## Detailed per‑table references

| Table | Doc |
|-------|-----|
| `customers` | `docs/database/customers.md` |
| `shipping_addresses` | `docs/database/customers.md` |
| `orders` | `docs/database/orders.md` |
| `order_items` | `docs/database/orders.md` |
| `payments` | `docs/database/payments.md` |
| `collections` | `docs/database/collections.md` |
| `products` | `docs/database/products.md` |
| `product_images` | `docs/database/products.md` |
| `inventory_history` | `docs/database/inventory.md` |

## Indexes

| Table | Index |
|-------|-------|
| `customers` | `idx_customers_email` on `LOWER(email)` |
| `shipping_addresses` | `idx_shipping_addresses_customer_id` on `customer_id` |
| `orders` | `idx_orders_order_number` unique on `order_number` |
| `orders` | `idx_orders_customer_id` on `customer_id` |
| `orders` | `idx_orders_status` on `status` |
| `orders` | `idx_orders_payment_status` on `payment_status` |
| `order_items` | `idx_order_items_order_id` on `order_id` |
| `payments` | `idx_payments_order_id` on `order_id` |
| `products` | `products_sku_idx` unique on `sku` |
| `products` | `products_slug_idx` unique on `slug` |
| `products` | `products_collection_idx` on `collection_id` |
| `products` | `products_status_idx` on `status` where `status = 'active'` |
| `products` | `products_featured_idx` on `featured` where `featured = true` |
| `product_images` | `idx_product_images_product_id` on `(product_id, sort_order)` |
| `collections` | `collections_slug_idx` unique on `slug` |
| `collections` | `collections_active_idx` on `is_active` |
| `collections` | `idx_collections_featured` on `(featured_on_homepage, display_order)` where `featured_on_homepage = true AND status = 'published'` |
| `inventory_history` | `idx_inventory_history_product_id` on `product_id` |
| `inventory_history` | `idx_inventory_history_created_at` on `created_at DESC` |

## Functions (RPCs)

### `create_order()`
Transactional RPC that creates customer (find-or-create by email), shipping address, order, and order items in one atomic operation. Security definer — runs with superuser privileges.

### `generate_order_number()`
Generates `HOP-YYYYMMDD-XXXXXX` format order numbers using a sequence.

### `update_updated_at_column()`
Trigger function that sets `NEW.updated_at = NOW()`.
