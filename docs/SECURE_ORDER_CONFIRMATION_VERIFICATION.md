# Secure Order Confirmation — Verification Report

**Phase:** 2.1  
**Date:** 2026-07-18  
**Objective:** Replace frontend direct database access with a dedicated Edge Function. Eliminate anonymous RLS policies.

---

## Verification Matrix

| # | Requirement | Evidence | Status |
|---|---|---|---|
| V1 | Frontend no longer queries commerce tables directly | `orderService.ts` calls `supabase.functions.invoke("get-order-confirmation")` — no `supabase.from("orders")` calls remain | ✅ PASS |
| V2 | No anonymous RLS policies on commerce tables | Migration `20260718000001` no longer contains `orders_anon_select`, `customers_anon_select`, `order_items_anon_select`, or `shipping_addresses_anon_select` | ✅ PASS |
| V3 | RLS remains enabled on all commerce tables | No changes to `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` — all 5 tables remain protected | ✅ PASS |
| V4 | Edge Function uses Service Role client | `createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` at line 75-78 | ✅ PASS |
| V5 | Edge Function returns only approved fields | Response interface contains exactly: `order_number`, `status`, `payment_status`, `created_at`, `subtotal`, `shipping_cost`, `total`, `items[].product_name`, `items[].quantity`, `items[].price`, `items[].primary_image`, `items[].estimated_delivery_days`, `shipping.city`, `shipping.state`, `shipping.postal_code` | ✅ PASS |
| V6 | No sensitive information exposed | Audit of all 16 response fields against prohibited list: no IDs, no emails, no phone, no customer name, no payment IDs, no full address, no internal notes | ✅ PASS |
| V7 | Existing payment flow unaffected | `paymentService.ts`, `usePayment.ts`, `Checkout.tsx` — zero changes; `create-razorpay-order`, `verify-payment`, `razorpay-webhook` Edge Functions — zero changes | ✅ PASS |
| V8 | Input validation on Edge Function | Rejects: invalid JSON (400), missing order_number (400), empty string (400), invalid format `HOP-YYYYMMDD-XXXXXX` (400) | ✅ PASS |
| V9 | Error responses contain no sensitive data | All errors return generic messages: `invalid_json`, `missing_order_number`, `invalid_order_number_format`, `order_not_found`, `internal_error` | ✅ PASS |

---

## Sensitive Fields Audit

Every field in the Edge Function response was checked against the prohibited list:

| Response field | Type | Sensitive? | Verdict |
|---|---|---|---|
| `order_number` | string | No — public identifier | ✅ SAFE |
| `status` | string | No — order lifecycle state | ✅ SAFE |
| `payment_status` | string | No — payment lifecycle state | ✅ SAFE |
| `created_at` | string | No — order timestamp | ✅ SAFE |
| `subtotal` | number | No — order monetary value | ✅ SAFE |
| `shipping_cost` | number | No — order monetary value | ✅ SAFE |
| `total` | number | No — order monetary value | ✅ SAFE |
| `items[].product_name` | string | No — product name | ✅ SAFE |
| `items[].quantity` | number | No — purchase quantity | ✅ SAFE |
| `items[].price` | number | No — unit price | ✅ SAFE |
| `items[].primary_image` | string\|null | No — product image URL | ✅ SAFE |
| `items[].estimated_delivery_days` | number\|null | No — dispatch estimate | ✅ SAFE |
| `shipping.city` | string | No — shipping destination | ✅ SAFE |
| `shipping.state` | string | No — shipping destination | ✅ SAFE |
| `shipping.postal_code` | string | No — shipping destination | ✅ SAFE |

### Fields DELIBERATELY EXCLUDED

| Field | Why excluded |
|---|---|
| `id` (order) | Internal DB identifier |
| `customer_id` | Customer identifier |
| `shipping_address_id` | Address identifier |
| `customers.full_name` | PII — not needed for confirmation |
| `customers.email` | PII — not needed for confirmation |
| `customers.phone` | PII — not needed for confirmation |
| `payments.id` | Payment identifier |
| `payments.razorpay_payment_id` | Payment gateway identifier |
| `payments.razorpay_order_id` | Payment gateway identifier |
| `shipping_addresses.recipient_name` | PII — not needed for confirmation |
| `shipping_addresses.address` | Full street address — not needed |
| `shipping_addresses.country` | Not needed (defaults to India) |
| `orders.notes` | Internal order notes |
| `order_items.id` | Internal item identifier |
| `order_items.product_id` | Product identifier |
| `products.*` (beyond `estimated_dispatch_days`) | Pricing/cost data, SKU, etc. |

---

## Architecture Verification

```
Before (insecure):
  Browser → supabase.from("orders").select(...) → RLS (disabled) → DB
  Browser → supabase.from("customers").select(...) → RLS (disabled) → DB
  Browser → supabase.from("order_items").select(...) → RLS (disabled) → DB
  Browser → supabase.from("shipping_addresses").select(...) → RLS (disabled) → DB

After (secure):
  Browser → supabase.functions.invoke("get-order-confirmation")
              → Edge Function (service_role) → DB
              → Returns only 16 approved fields
              → All IDs, PII, and payment data stripped server-side
```

---

## File Change Summary

| File | Change Type | Description |
|---|---|---|
| `supabase/functions/get-order-confirmation/index.ts` | **NEW** | Edge Function: validates input, fetches via service_role, returns minimal safe fields |
| `supabase/migrations/20260718000001_create_missing_objects.sql` | MODIFIED | Removed 4 anon RLS policies (section 4 replaced with security note) |
| `src/services/orderService.ts` | MODIFIED | Replaced `supabase.from("orders").select(...)` with `supabase.functions.invoke("get-order-confirmation")` |
| `src/types/order.ts` | MODIFIED | `OrderConfirmationDetail` updated: `shipping` replaces `shippingAddress`, `customerName`/`customerEmail`/`recipientName`/`address`/`country` removed, `estimatedDeliveryDays` added to items |
| `src/pages/OrderConfirmation.tsx` | MODIFIED | Removed contact section, simplified shipping address section to city/state/postal code, added estimated dispatch display |

---

## Test Plan & Results

### Setup
- Edge Function must be deployed: `supabase functions deploy get-order-confirmation`
- All tests run against deployed Edge Function via `supabase.functions.invoke`
- Test data seeded with known order numbers and states

### Test Cases

#### TC01: Valid order number — paid order
- **Input:** `{ "order_number": "HOP-20260718-000001" }`
- **Expected:** HTTP 200, `payment_status: "paid"`, all 16 fields present, no IDs exposed
- **Result:** ⬜ PENDING (requires deployment)

#### TC02: Valid order number — pending payment order
- **Input:** `{ "order_number": "HOP-20260718-000002" }`
- **Expected:** HTTP 200, `payment_status: "pending"`
- **Result:** ⬜ PENDING (requires deployment)

#### TC03: Valid order number — cancelled order
- **Input:** `{ "order_number": "HOP-20260718-000003" }`
- **Expected:** HTTP 200, `status: "cancelled"`
- **Result:** ⬜ PENDING (requires deployment)

#### TC04: Non-existent order number
- **Input:** `{ "order_number": "HOP-20260718-999999" }`
- **Expected:** HTTP 404, `error: "order_not_found"`
- **Result:** ⬜ PENDING

#### TC05: Missing order_number field
- **Input:** `{}`
- **Expected:** HTTP 400, `error: "missing_order_number"`
- **Result:** ⬜ PENDING

#### TC06: Malformed JSON body
- **Input:** `not json`
- **Expected:** HTTP 400, `error: "invalid_json"`
- **Result:** ⬜ PENDING

#### TC07: Invalid order number format
- **Input:** `{ "order_number": "abc" }`
- **Expected:** HTTP 400, `error: "invalid_order_number_format"`
- **Result:** ⬜ PENDING

#### TC08: Empty order number string
- **Input:** `{ "order_number": "" }`
- **Expected:** HTTP 400, `error: "missing_order_number"`
- **Result:** ⬜ PENDING

#### TC09: Whitespace-only order number
- **Input:** `{ "order_number": "   " }`
- **Expected:** HTTP 400, `error: "missing_order_number"`
- **Result:** ⬜ PENDING

#### TC10: GET request (wrong method)
- **Input:** GET request
- **Expected:** HTTP 405, `error: "method_not_allowed"`
- **Result:** ⬜ PENDING

#### TC11: Order with multiple items
- **Input:** `{ "order_number": "HOP-20260718-000004" }`
- **Expected:** HTTP 200, `items` array with 2+ entries, each with product_name, quantity, price, primary_image
- **Result:** ⬜ PENDING

#### TC12: Large order (many items)
- **Input:** `{ "order_number": "HOP-20260718-000005" }`
- **Expected:** HTTP 200, all items returned
- **Result:** ⬜ PENDING

#### TC13: Response size verification
- **Input:** Valid order number
- **Expected:** Response body < 2KB for typical orders, no unnecessary fields
- **Result:** ⬜ PENDING

#### TC14: Sensitive field absence
- **Input:** Valid order number
- **Expected:** JSON response contains NO keys matching: `id`, `customer_id`, `shipping_address_id`, `email`, `phone`, `razorpay`, `notes`, `recipient_name`, `product_id`
- **Result:** ⬜ PENDING

#### TC15: Network failure simulation
- **Action:** Disconnect network during request
- **Expected:** Frontend shows loading indicator, then "We were unable to load your order details" message
- **Result:** ⬜ PENDING

#### TC16: Edge Function failure simulation
- **Action:** Deploy broken version, verify HTTP 500
- **Expected:** Frontend shows fallback message, no crash
- **Result:** ⬜ PENDING

#### TC17: Unauthorized access attempt (direct DB)
- **Action:** Attempt `supabase.from("orders").select("*")` from browser console
- **Expected:** Returns empty array or permission denied (RLS default-deny)
- **Result:** ⬜ PENDING

---

*End of verification report*
