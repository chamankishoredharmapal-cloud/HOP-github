# Database: Customers & Shipping Addresses

## `customers`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` PK | Default `gen_random_uuid()` |
| `email` | `text` UK | Lowercase — indexed `LOWER(email)` |
| `full_name` | `text` | |
| `phone` | `text` | |
| `created_at` | `timestamptz` | Default `now()` |

**RLS**: Table has no explicit policies. `authenticated` users currently cannot query due to default-deny on the schema.

## `shipping_addresses`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` PK | |
| `customer_id` | `uuid` FK → `customers(id)` |
| `recipient_name` | `text` | |
| `phone` | `text` | |
| `address` | `text` | |
| `city` | `text` | |
| `state` | `text` | |
| `postal_code` | `text` | |
| `country` | `text` | Default `India` |
| `landmark` | `text` | Optional |
| `created_at` | `timestamptz` | |

**RLS**: Same as customers — default-deny for `authenticated`.

## Indexes

- `idx_customers_email` on `LOWER(email)`
- `idx_shipping_addresses_customer_id` on `customer_id`
