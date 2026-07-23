# Database: Payments

## `payments`

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` PK | `gen_random_uuid()` |
| `order_id` | `uuid` FK → `orders(id)` ON DELETE CASCADE |
| `razorpay_payment_id` | `text` | Razorpay payment identifier |
| `razorpay_order_id` | `text` | Razorpay order identifier |
| `amount` | `int` | In paise |
| `currency` | `text` | Default `INR` |
| `status` | `payment_transaction_status` | Enum: `pending`, `paid`, `failed`, `refunded` |
| `created_at` | `timestamptz` | `now()` |

## RLS

Default-deny (same as orders). No read/write policies for `authenticated`.

## Indexes

- `idx_payments_order_id` on `order_id`
