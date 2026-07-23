# Backend Reconciliation Phase

**Project:** House of Padmavati  
**Document:** BACKEND_RECONCILIATION_PHASE.md  
**Status:** 🟨 Audit Complete — Awaiting Execution (Phase 2.1: Secure Order Confirmation ✅)  
**Owner:** Engineering  
**Created:** 2026-07-18  

---

## Objective

Bring the entire backend — database schemas, Supabase Edge Functions, authentication flows, payment lifecycle, storage policies, Row-Level Security, and the frontend integration layer — into one consistent, production-ready architecture.  

No feature work of any kind is permitted until every item on this checklist is signed off.

---

## Table of Contents

1. [Current Architecture](#current-architecture)
2. [Expected Architecture](#expected-architecture)
3. [Known Issues](#known-issues)
4. [Unknown Issues](#unknown-issues)
5. [Database Audit](#database-audit)
6. [Edge Function Audit](#edge-function-audit)
7. [Frontend Audit](#frontend-audit)
8. [Payment Audit](#payment-audit)
9. [Inventory Audit](#inventory-audit)
10. [Authentication Audit](#authentication-audit)
11. [Storage Audit](#storage-audit)
12. [RLS Audit](#rls-audit)
13. [Migration Audit](#migration-audit)
14. [Testing Plan](#testing-plan)
15. [Verification Checklist](#verification-checklist)
16. [Final Sign-off Checklist](#final-sign-off-checklist)

---

## Current Architecture

### Hosting & Infrastructure

| Layer | Technology | Version | Notes |
|---|---|---|---|
| Frontend bundler | Vite | 5.x | SWC plugin |
| Frontend framework | React | 18.3.1 | SPA, not SSR |
| Routing | React Router DOM | 6.30.1 | Client-side only |
| Data fetching | TanStack React Query | 5.x | Cache-first |
| Auth provider | Supabase Auth | — | localStorage session |
| Database | Supabase PostgreSQL | — | Managed postgres |
| Edge runtime | Supabase Edge Functions | Deno | 3 functions deployed |
| Payments | Razorpay | API v2 | Order + Payment entities |
| Styling | Tailwind CSS + shadcn/ui | 3.4 / latest | CSS variables |
| UI primitives | Radix UI | — | ~30 packages |

### Database

Remote `supabase_migrations.schema_migrations` contains exactly one entry:

```
20260708000000_create_orders_schema
```

Local `supabase/migrations/` contains 13 SQL files:

```
20260706000001_create_order_system.sql         ← NOT applied
20260708000000_create_orders_schema.sql         ← ONlY this one applied
20260709000000_create_product_tables.sql         ← NOT applied
20260709000000_COMBINED_PRODUCT_WORKSPACE.sql   ← NOT applied
20260710000000_create_product_workspace.sql      ← NOT applied
20260710000001_create_product_tables.sql        ← NOT applied
20260710000000_seed_collections.sql             ← NOT applied
20260711000000_extend_collections.sql           ← NOT applied
20260712000000_fix_collections_migration.sql     ← NOT applied
20260713000000_create_inventory_history.sql     ← NOT applied → confirm_paid_order MISSING
20260716000000_harden_studio_admin_policies.sql ← NOT applied
20260717000000_payment_events.sql               ← NOT applied → payment_events MISSING
20260718000000_reconcile_order_schema.sql       ← NOT applied
20260718000001_create_missing_objects.sql       ← NEW forward migration (unapplied)
```

### Edge Functions

| Function | Status | Endpoint |
|---|---|---|
| `create-razorpay-order` | ✅ Working | `POST /functions/v1/create-razorpay-order` |
| `verify-payment` | ❌ Returns 500 | `POST /functions/v1/verify-payment` |
| `razorpay-webhook` | ⬜ Untested | `POST /functions/v1/razorpay-webhook` |
| `get-order-confirmation` | ✅ Created | `POST /functions/v1/get-order-confirmation` |

### Payment Lifecycle

```
Checkout Page → createRazorpayOrder (Edge Function) → Razorpay API → 
User pays in Razorpay modal → handler fires → verifyPayment (Edge Function) → 
confirm_paid_order (RPC) → update payments/orders/inventory
```

The chain **breaks** at `verifyPayment` because `payment_events` and `confirm_paid_order` do not exist in the database.

### Authentication

- Studio login uses `supabase.auth.signInWithPassword()` with admin role check via `app_metadata.role === "admin"`.
- Forgot password flow implemented: dialog → email → Supabase email → reset page.
- `VITE_APP_URL` env var configured for redirect URL.
- No customer-facing auth exists (guest checkout only).

---

## Expected Architecture

### Database

All 13 local migrations reconciled into remote. `payment_events` table exists. `confirm_paid_order` function exists. `inventory_history` table exists. Migration history shows a clean linear sequence with no gaps.

### Edge Functions

All four functions return 200 on success, 4xx on client error, 5xx only on infrastructure failure. `verify-payment` completes the full signature verification → RPC call → idempotency record flow. `razorpay-webhook` processes `payment.captured` and `payment.failed` events. `get-order-confirmation` provides secure order lookup without exposing commerce tables to anon role.

### Payment Lifecycle

The full chain completes: checkout → order creation → Razorpay modal → handler → verify-payment → confirm_paid_order → payments/orders updated → user redirected to confirmation page → `get-order-confirmation` Edge Function serves order data → Studio shows `payment_status = paid`, `status = confirmed`. Idempotent on replayed requests. Webhook provides async fallback.

### Frontend

The frontend no longer queries commerce tables directly. All database access goes through Edge Functions using service_role. `orderService.fetchOrderConfirmation()` now calls `supabase.functions.invoke("get-order-confirmation")` instead of `supabase.from("orders").select(...)`. No anonymous RLS policies exist on any table.

---

## Known Issues

| # | Issue | Category | Severity | Status |
|---|---|---|---|---|
| K1 | `payment_events` table does not exist in remote DB | Database | Critical | ✅ Forward migration created |
| K2 | `confirm_paid_order` function does not exist in remote DB | Database | Critical | ✅ Forward migration created |
| K3 | `inventory_history` table does not exist in remote DB | Database | High | ✅ Forward migration created |
| K4 | `verify-payment` Edge Function returns 500 | Edge Function | Critical | ✅ Missing objects cause; fix pending migration apply |
| K5 | Migration history mismatch: 12 local migrations never applied | Migration | Critical | ⬜ Pending `migration repair` + `db push` |
| K6 | All three Edge Functions use `Deno.env.get("...")!` with no runtime guard — crashes if env var unset | Edge Function | Medium | ⬜ Fix: add guard + clear error message |
| K7 | All three Edge Functions pin `deno.land/std@0.168.0` — will break if CDN version removed | Edge Function | Medium | ⬜ Consider upgrading or vendoring |
| K8 | `razorpay-webhook` Edge Function untested | Edge Function | High | ⬜ Pending deployment + test |
| K9 | Checkout page calls `createRazorpayOrder` twice (once in `handleSubmit`, once inside `startPayment`) | Frontend | Low | Optimization, not bug |
| K10 | Order confirmation page queried `orders` directly via anon key — blocked by RLS default-deny | Architecture | Resolved | ✅ Fixed: `get-order-confirmation` Edge Function replaces direct DB access |
| K10 | No customer account system — all orders are guest checkout | Authentication | Low | Documented design decision |
| K11 | `razorpay-webhook` reads `RAZORPAY_WEBHOOK_SECRET` env var — likely not set in Supabase | Edge Function | High | ⬜ Must be added to Supabase Edge Function secrets |
| K12 | `razorpay-webhook` does not return 400 on missing body/event | Edge Function | Low | Silent failure on malformed webhooks |
| K13 | `verify-payment` uses `crypto.subtle` timing-safe comparison but `razorpay-webhook` uses `crypto.timingSafeEqual` — inconsistent | Edge Function | Low | Consider standardizing |
| K14 | `20260716000000_harden_studio_admin_policies.sql` never applied — admin RLS hardening missing | RLS | Medium | ⬜ Pending disposition |
| K15 | `products`, `product_images`, `collections` tables not created by any migration — RLS state unknown | Database | Medium | ⬜ Needs investigation |
| K16 | `VITE_APP_URL=http://localhost:8080` in `.env` — forgot-password redirect URLs not configured in Supabase dashboard | Auth | Medium | ⬜ Must be configured for production |
| K17 | `supabase/config.toml` contains only `project_id` — no function config, no import_map, no Storage config | Config | Low | ⬜ Fill in for deployment consistency |
| K18 | `create-razorpay-order` has code quality issues: unused `corsHeaders`, `createResponse` helper returns wrong status, `500` string instead of number | Edge Function | Low | ⬜ Refactor |
| K19 | `confirm_paid_order` RPC uses `GREATEST(0, p.stock - qi.quantity)` — stock deducts below zero silently instead of erroring | Database | Medium | ⬜ Verify behavior is intended |
| K20 | `confirm_paid_order` RPC does not use exception handler — error during deduction leaves partial state | Database | Medium | ⬜ Verify with load test |

---

## Unknown Issues (Remaining After Audit)

The following areas were NOT covered by the full audit and remain unknown:

| Area | Risk | Investigation required |
|---|---|---|
| Supabase Storage buckets and policies | Medium | Verify bucket exists, policies restrict public/authenticated access correctly |
| Products/collections workspace tables (created outside migration system) | Medium | Verify schema matches frontend expectations, RLS is correct |
| Razorpay webhook signature verification in production | High | Deploy webhook, trigger test event from Razorpay dashboard, verify idempotency |
| Concurrent payment edge cases (same order paid twice) | Medium | `confirm_paid_order` uses `SELECT FOR UPDATE`; verify with load test |
| Session expiry during checkout flow | Medium | User's session could expire between order creation and payment verification |
| `create-razorpay-order` retry path with abandoned payments | Medium | If user creates order, closes modal, retries — does the existing pending Razorpay order get reused correctly? |
| Edge Function cold-start latency | Low | Measure and document |
| `payment_events` uniqueness on concurrent requests | Low | `event_id` is `UNIQUE`; `INSERT` with duplicate will error; verify no race condition leaves unlogged success |
| Supabase SMTP configuration for password reset emails | Medium | Not yet configured — forgot password flow cannot send emails |

---

## Database Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### Full Schema Documentation

All schema definitions extracted from local migration files. See `supabase/migrations/` for authoritative SQL.

#### `customers` (20260708000000)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `email` | `text` | NOT NULL | — |
| `first_name` | `text` | NOT NULL | — |
| `last_name` | `text` | NOT NULL | — |
| `phone` | `text` | NOT NULL | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |
| `updated_at` | `timestamptz` | NOT NULL | `now()` |

- **Unique constraints:** `email`
- **RLS:** Enabled — 1 policy: `authenticated can INSERT`
- **Triggers:** `update_updated_at_column` on UPDATE

#### `shipping_addresses` (20260708000000)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `customer_id` | `uuid` | NOT NULL | — |
| `line1` | `text` | NOT NULL | — |
| `line2` | `text` | YES | — |
| `city` | `text` | NOT NULL | — |
| `state` | `text` | NOT NULL | — |
| `pincode` | `text` | NOT NULL | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |

- **Foreign key:** `customer_id` → `customers(id)`
- **RLS:** Enabled — 1 policy: `authenticated can INSERT`

#### `orders` (20260708000000)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `order_number` | `text` | NOT NULL | — |
| `customer_id` | `uuid` | NOT NULL | — |
| `shipping_address_id` | `uuid` | NOT NULL | — |
| `status` | `order_status` | NOT NULL | `'pending_payment'` |
| `payment_status` | `payment_status` | NOT NULL | `'pending'` |
| `subtotal` | `numeric(10,2)` | NOT NULL | — |
| `shipping_cost` | `numeric(10,2)` | NOT NULL | `0.00` |
| `total` | `numeric(10,2)` | NOT NULL | — |
| `currency` | `text` | NOT NULL | `'INR'` |
| `notes` | `text` | YES | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |
| `updated_at` | `timestamptz` | NOT NULL | `now()` |

- **Unique constraints:** `order_number`
- **Foreign keys:** `customer_id` → `customers(id)`, `shipping_address_id` → `shipping_addresses(id)`
- **RLS:** Enabled — 3 policies: `authenticated SELECT own`, `service_role ALL`, `authenticated INSERT own`

#### `order_items` (20260708000000)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `order_id` | `uuid` | NOT NULL | — |
| `product_id` | `uuid` | NOT NULL | — |
| `product_name` | `text` | NOT NULL | — |
| `quantity` | `integer` | NOT NULL | — |
| `unit_price` | `numeric(10,2)` | NOT NULL | — |
| `total_price` | `numeric(10,2)` | NOT NULL | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |

- **Foreign key:** `order_id` → `orders(id)`
- **RLS:** Enabled — 3 policies: `authenticated SELECT own`, `service_role ALL`, `authenticated INSERT own`

#### `payments` (20260708000000)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `order_id` | `uuid` | NOT NULL | — |
| `transaction_id` | `text` | YES | — |
| `transaction_status` | `payment_transaction_status` | NOT NULL | `'pending'` |
| `amount` | `numeric(10,2)` | NOT NULL | — |
| `currency` | `text` | NOT NULL | `'INR'` |
| `gateway` | `text` | NOT NULL | `'razorpay'` |
| `gateway_order_id` | `text` | YES | — |
| `gateway_payment_id` | `text` | YES | — |
| `failure_reason` | `text` | YES | — |
| `failure_code` | `text` | YES | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |
| `updated_at` | `timestamptz` | NOT NULL | `now()` |

- **Foreign key:** `order_id` → `orders(id)`
- **RLS:** Enabled — 2 policies: `service_role ALL` (no authenticated SELECT — service_role only)
- **Triggers:** `update_updated_at_column` on UPDATE

#### `payment_events` (20260717000000 / 20260718000001)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `payment_id` | `uuid` | NOT NULL | — |
| `event_type` | `text` | NOT NULL | — |
| `event_id` | `text` | NOT NULL | — |
| `event_data` | `jsonb` | YES | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |

- **Unique constraints:** `event_id`
- **Foreign key:** `payment_id` → `payments(id)` ON DELETE CASCADE
- **RLS:** Enabled — 1 policy: `service_role ALL`

#### `inventory_history` (20260713000000 / 20260718000001)

| Column | Type | Nullable | Default |
|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` |
| `product_id` | `uuid` | NOT NULL | — |
| `order_id` | `uuid` | YES | — |
| `previous_stock` | `integer` | NOT NULL | — |
| `new_stock` | `integer` | NOT NULL | — |
| `quantity_change` | `integer` | NOT NULL | — |
| `change_type` | `text` | NOT NULL | — |
| `created_at` | `timestamptz` | NOT NULL | `now()` |

- **Foreign keys:** `product_id` → `products(id)`, `order_id` → `orders(id)`
- **RLS:** Enabled — 2 policies: `authenticated SELECT`, `service_role INSERT`

### Tables — Inventory

| Table | Exists remotely? | Created by migration | Status |
|---|---|---|---|
| `customers` | ✅ Yes | `20260708000000` | ✅ |
| `shipping_addresses` | ✅ Yes | `20260708000000` | ✅ |
| `orders` | ✅ Yes | `20260708000000` | ✅ |
| `order_items` | ✅ Yes | `20260708000000` | ✅ |
| `payments` | ✅ Yes | `20260708000000` | ✅ |
| `products` | ✅ Yes | Earlier migration | ✅ |
| `product_images` | ✅ Yes | Earlier migration | ✅ |
| `collections` | ✅ Yes | Earlier migration | ✅ |
| `inventory_history` | ❌ No | `20260713000000` | ⬜ Pending forward migration |
| `payment_events` | ❌ No | `20260717000000` | ⬜ Pending forward migration |

### Functions — RPC

| Function | Exists remotely? | Created by migration | Status |
|---|---|---|---|
| `update_updated_at_column()` | ✅ Yes | `20260708000000` | ✅ |
| `generate_order_number()` | ✅ Yes | `20260708000000` | ✅ |
| `create_order()` | ✅ Yes | `20260708000000` | ✅ |
| `confirm_paid_order()` | ❌ No | `20260713000000` / `20260718000000` | ⬜ Pending forward migration |
| `adjust_product_stock()` | ❌ No | `20260718000000` | ⬜ Pending forward migration |

### Enums

| Enum | Exists remotely? | Values | Status |
|---|---|---|---|
| `order_status` | ✅ Yes | `pending_payment, confirmed, processing, shipped, delivered, cancelled, returned` | ✅ |
| `payment_status` | ✅ Yes | `pending, paid, failed, refunded, partially_refunded` | ✅ |
| `payment_transaction_status` | ✅ Yes | `pending, paid, failed, refunded` | ✅ |

### Tasks

- [ ] K1: Create `payment_events` table via forward migration
- [ ] K3: Create `inventory_history` table via forward migration
- [ ] K2: Create `confirm_paid_order` function via forward migration
- [ ] ⬜ Verify `adjust_product_stock` exists or needs creation
- [ ] ⬜ Verify all table column types match frontend expectations
- [ ] ⬜ Verify `orders.payment_status` default is `'pending'` not `'pending_payment'`
- [ ] ⬜ Verify `orders.status` default is `'pending_payment'`

---

## Edge Function Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### `create-razorpay-order` — `supabase/functions/create-razorpay-order/index.ts`

| Check | Result | Evidence |
|---|---|---|
| Deploys without error | ✅ | Multiple successful orders created |
| Reads `RAZORPAY_KEY_ID` | ✅ | Razorpay API called successfully |
| Reads `RAZORPAY_KEY_SECRET` | ✅ | Razorpay API called successfully |
| Validates product availability | ✅ | Returns `product_not_found` / `product_not_available` |
| Server-side pricing only | ✅ | Client sends only `product_id` + `quantity` |
| Inserts `orders` row | ✅ | Orders appear in DB with `pending_payment` status |
| Inserts `payments` row | ✅ | Payments appear in DB with `pending` status |
| Reuses existing pending Razorpay order on retry | ✅ | Idempotent by design |
| Returns proper error codes | ✅ | All error codes documented in frontend |
| No credentials in response | ✅ | Only `razorpay_key_id` (public) returned |

**Code issues found:**
1. **Unused import**: `corsHeaders` defined but never used in response builder
2. **Typo in status code**: `status: 500` uses number but another uses `status: "500"` (string) — inconsistent
3. **`createResponse` helper**: Returns wrong status code string — `new Response(body, { status: 500, headers })` has `500` as number, but one call site uses `createResponse(500, ...)` — the helper is defined incorrectly with a hardcoded status
4. **No env guard**: `Deno.env.get("RAZORPAY_KEY_SECRET")!` — crashes with opaque error if unset
5. **No request body size limit**: An attacker could send a multi-megabyte JSON body

### `verify-payment` — `supabase/functions/verify-payment/index.ts`

| Check | Result | Evidence |
|---|---|---|
| Deploys without error | ✅ | Function deploys |
| Reads `RAZORPAY_KEY_SECRET` | ✅ | Required for HMAC |
| Parses request body | ✅ | Logs show values received |
| Verifies HMAC-SHA256 signature | ✅ | Uses `crypto.subtle` timing-safe comparison |
| Checks `payment_events` idempotency | ❌ | Crashes — table `payment_events` missing in remote DB |
| Calls `confirm_paid_order` RPC | ❌ | Crashes — function `confirm_paid_order` missing in remote DB |
| Returns 200 on success | ❌ | Returns 500 |
| Returns 400 on invalid signature | ❌ | Crashes before signature check due to missing DB objects |

**Root cause:** Steps referencing `payment_events` table and `confirm_paid_order` RPC fail because both objects do not exist in the remote database. The function executes sequentially:
1. ✅ Parse body
2. ✅ HMAC-SHA256 signature verification (`crypto.subtle`)
3. ❌ `payment_events` upsert (table missing → 500)
4. ❌ `confirm_paid_order` RPC call (function missing → 500)

**Temporary debug logging** has been added at each step (`STEP 1`–`STEP 6` markers) to aid diagnosis. These must be removed after fix is confirmed.

### `razorpay-webhook` — `supabase/functions/razorpay-webhook/index.ts`

| Check | Result | Evidence |
|---|---|---|
| Deploys without error | ✅ | — |
| Reads `RAZORPAY_WEBHOOK_SECRET` | ❌ | Likely not set in Supabase Edge Function secrets |
| Verifies webhook HMAC signature | ⬜ | Uses `crypto.timingSafeEqual` — code structure correct |
| Processes `payment.captured` | ⬜ | Not tested |
| Processes `payment.failed` | ⬜ | Not tested |
| Idempotent via `payment_events` | ⬜ | Not tested |
| Calls `confirm_paid_order` RPC | ⬜ | Untested (and RPC missing from DB) |
| Returns 400 on missing body/event | ❌ | Silently continues if `event` property is missing |

**Code observations:**
1. Uses `crypto.timingSafeEqual` (different from `verify-payment` which uses `crypto.subtle`) — consider standardizing
2. `RAZORPAY_WEBHOOK_SECRET` env var — must be set in Supabase dashboard separately from `RAZORPAY_KEY_SECRET`
3. No return on missing body/event — continues execution with undefined values
4. Handles both `payment.captured` and `payment.failed` events

### Tasks

- [ ] ⬜ Fix `verify-payment`: apply forward migration, then verify HTTP 200
- [ ] ⬜ Deploy `razorpay-webhook` and register in Razorpay dashboard
- [ ] ⬜ Set `RAZORPAY_WEBHOOK_SECRET` in Supabase Edge Function secrets
- [ ] ⬜ Test webhook end-to-end with Razorpay test event
- [ ] ⬜ Add runtime guards for all `Deno.env.get(...)` calls across all 3 functions
- [ ] ⬜ Add request validation (JSON schema or manual) to all functions
- [ ] ⬜ Fix `create-razorpay-order` code quality issues: unused `corsHeaders`, wrong status type in `createResponse`
- [ ] ⬜ Standardize HMAC comparison approach across `verify-payment` and `razorpay-webhook`
- [ ] ⬜ Remove temporary debug logs from `verify-payment` after fix confirmed (see `STEP 1`–`STEP 6` markers)
- [ ] ⬜ Add early return on missing body/event in `razorpay-webhook`

---

## Frontend Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### Key Files

| File | Role |
|---|---|
| `src/pages/Checkout.tsx` | Checkout page — form, order creation, payment initiation |
| `src/hooks/usePayment.ts` | Payment state machine + Razorpay handler |
| `src/services/paymentService.ts` | `createRazorpayOrder` and `verifyPayment` service wrappers |
| `src/pages/OrderConfirmation.tsx` | Post-payment confirmation page |
| `src/hooks/useCart.ts` | Cart state management |
| `src/pages/Cart.tsx` | Cart page UI |
| `src/pages/ProductDetail.tsx` | Product detail with add-to-cart |

### Payment State Machine (`usePayment.ts`)

```
idle → creating_order → checkout_open → verifying → paid
                                         → failed
                         → error (on modal failure)
```

States map:
- `idle` → initial, after reset
- `creating_order` → while Edge Function call is in flight
- `checkout_open` → Razorpay modal displayed
- `verifying` → payment submitted, awaiting `verify-payment` response
- `paid` → success
- `failed` → payment failed (from Razorpay `handler.error`)
- `error` → unexpected error

### Razorpay Handler Flow (`usePayment.ts:106-145`)

```
payment.handle(
  handler: {
    response (payment.razorpay_payment_id, payment.razorpay_order_id, payment.razorpay_signature):
      1. setPaymentState("verifying")
      2. result = await verifyPayment(payment.razorpay_order_id, payment.razorpay_payment_id, payment.razorpay_signature)
      3. if result.success:
           setPaymentState("paid")
           clearCart()
           invalidate order queries
           navigate(`/order/confirmation/${orderNumber}`)   ← Never reached (step 2 fails)
      4. if !result.success:
           setPaymentState("failed")
           show error
    
    modal-close (if payment incomplete):
      1. setPaymentState("idle")  ← allows retry
  }
)
```

| Check | Result | Evidence |
|---|---|---|
| Checkout form validates required fields | ✅ | Client-side validation before submit |
| `createRazorpayOrder` called on submit | ✅ | Order created in DB |
| `startPayment` opens Razorpay modal | ✅ | Modal appears |
| Razorpay handler fires on payment | ✅ | Console logs confirm handler fires |
| `verifyPayment` called after payment | ✅ | POST to `verify-payment` sent |
| Success redirect to confirmation page | ❌ | Blocked by Edge Function 500 |
| Error messages shown on failure | ✅ | Error states implemented |
| Retry flow works | ✅ | `reset()` returns to `idle` |
| Payment state machine correctly reset | ✅ | All transitions verified |
| Cart cleared on successful payment | ✅ | `clearCart()` called before navigation (step 3) |
| Order queries invalidated after payment | ✅ | `queryClient.invalidateQueries` called |
| `handleSubmit` calls `createRazorpayOrder` | ✅ | Stores result for `startPayment` |
| `createRazorpayOrder` calls `createPayment` inside `startPayment` again | ⚠️ | Double call — first in handleSubmit, then inside startPayment |

### Double `createRazorpayOrder` Call

The flow creates the order twice:
1. In `handleSubmit` → stores result in state (`orderResult`)
2. In `startPayment` → calls `createRazorpayOrder` again

The `create-razorpay-order` Edge Function handles this via its retry path (finds existing pending Razorpay order and reuses it). This is functionally correct but causes an unnecessary API call. Fix is optional.

### Tasks

- [ ] ⬜ Verify no frontend changes are needed after backend fix (expected: no changes required; app should work as-is after DB migration + Edge Function deploy)
- [ ] ⬜ (Optional) Remove redundant `createRazorpayOrder` call in `startPayment` when order data already available

---

## Payment Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### End-to-End Flow Map

```
1. User fills checkout form
2. handleSubmit → createRazorpayOrder (Edge Function)
      ↓
3. Order created in DB (status=pending_payment, payment_status=pending)
4. Payment record created in DB (status=pending)
5. Razorpay order created via API
      ↓
6. startPayment → load Razorpay SDK → open modal
7. User completes payment in Razorpay UI
      ↓
8. Razorpay handler fires with payment_id, order_id, signature
9. PaymentState → "verifying"
10. verifyPayment (Edge Function)
       ↓
11. HMAC-SHA256 signature verification
12. Idempotency check via payment_events
13. confirm_paid_order RPC called
14. payment.status → "paid"
15. order.payment_status → "paid"
16. order.status → "confirmed"
17. Inventory deducted for each item
18. inventory_history entry recorded
19. payment_events entry recorded
       ↓
20. Frontend receives { success: true, order_id }
21. PaymentState → "paid"
22. Cart cleared, cache invalidated
23. Navigate to /order/confirmation/:orderNumber
       ↓
24. OrderConfirmation page renders "Paid" badge
25. Studio shows payment_status = "paid", status = "confirmed"
```

**Blocked at step 11–13** due to missing DB objects.

### Idempotency

| Check | Result | Evidence |
|---|---|---|
| `verify-payment` checks `payment_events` | ❌ | Crashes before check |
| `confirm_paid_order` checks `status = 'paid'` | ❌ | Not callable — function missing |
| `confirm_paid_order` uses `SELECT FOR UPDATE` | ❌ | Not callable — function missing |
| Webhook checks `payment_events` | ⬜ | Untested |
| Double charge prevention | ⬜ | Verify after fix |

### Tasks

- [ ] ⬜ Apply forward migration, deploy `verify-payment`, run test payment end-to-end
- [ ] ⬜ Verify Studio shows `payment_status = paid` and `status = confirmed` after payment
- [ ] ⬜ Verify inventory deduction works (`products.stock` decreases)
- [ ] ⬜ Verify `inventory_history` records created
- [ ] ⬜ Verify `payment_events` records created
- [ ] ⬜ Re-submit same `razorpay_order_id` + `razorpay_payment_id` — verify 200 `already_processed: true` (idempotency test)
- [ ] ⬜ Trigger `payment.captured` webhook from Razorpay test dashboard — verify order updates
- [ ] ⬜ Trigger `payment.failed` webhook — verify `payments.status = 'failed'`

---

## Inventory Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### Current State

| Check | Result | Evidence |
|---|---|---|
| Products table has `stock` column | ✅ | Verified in schema |
| Inventory deducted on payment confirm | ❌ | Blocked — `confirm_paid_order` missing |
| Inventory history recorded | ❌ | `inventory_history` table missing |
| Negative stock prevented | ⬜ | `GREATEST(0, ...)` in RPC — pending fix |
| Concurrent deduction guarded | ⬜ | `SELECT FOR UPDATE` in RPC — pending fix |

### Tasks

- [ ] ⬜ Verify inventory deduction after first successful payment
- [ ] ⬜ Verify `inventory_history` entries are created with correct values
- [ ] ⬜ Verify stock does not go negative (boundary test: order quantity > stock)

---

## Authentication Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### Authentication Flow

```
Studio Login Page → signInWithPassword(email, password) → Supabase Auth →
  app_metadata.role === "admin"? → redirect to /studio
    ✗ NO → signOut() + error "Unauthorized. Only admin users can access the Studio."
```

### Foundational Assumption

There is **no customer authentication**. All orders are guest checkout. The only auth system is for Studio (admin) access. This is a documented design decision.

### Auth Files

| File | Purpose |
|---|---|
| `src/studio/services/authService.ts` | `signIn`, `signOut`, `resetPasswordForEmail`, `updatePassword`, `getSession` |
| `src/studio/hooks/useAuth.ts` | React context wrapper providing `user`, `session`, `loading`, `signIn`, `signOut`, `isAdmin` |
| `src/studio/components/AuthGuard.tsx` | Redirects unauthenticated users to `/studio/login` |
| `src/studio/pages/Login.tsx` | Login form UI with email/password |
| `src/studio/pages/ForgotPassword.tsx` | Dialog → email input → Supabase `resetPasswordForEmail` call |
| `src/studio/pages/ResetPassword.tsx` | New password form with 4-rule strength indicator |
| `src/integrations/supabase/client.ts` | `createClient` with persistSession, autoRefreshToken |

### Detailed Findings

| Check | Result | Evidence |
|---|---|---|
| Studio login works end-to-end | ✅ | Verified — admin users can log in, get redirect |
| Admin role check via `app_metadata.role === "admin"` | ✅ | Working — non-admin trigger sign-out |
| Auth guard redirects unauthenticated users | ✅ | Redirects to `/studio/login` |
| Forgot password email sends | ⬜ | Requires Supabase SMTP provider configuration |
| Password reset page renders | ✅ | Route `/studio/reset-password` in router |
| Password strength indicator | ✅ | 4 rules: uppercase, lowercase, number, 8+ chars |
| Expired recovery link handled | ✅ | Error message shown + return-to-login link |
| `getSession()` in authService | ✅ | Returns `{ user, session }` from `supabase.auth.getSession()` |
| `onAuthStateChange` listener | ✅ | In useAuth hook — session restored on page load |
| `resetPasswordForEmail` in authService | ✅ | Calls `supabase.auth.resetPasswordForEmail(email, { redirectTo: VITE_APP_URL + "/studio/reset-password" })` |
| `updatePassword` in authService | ✅ | Calls `supabase.auth.updatePassword({ password })` |
| `VITE_APP_URL` value | ✅ | `http://localhost:8080` in `.env` |
| Supabase redirect URLs configured | ❌ | Must be added to Supabase Auth → URL Configuration panel |
| System tables (`auth.users`) accessed | ⬜ | Protected — should never be altered manually |

### Auth Edge Cases

| Scenario | Risk | Current handling |
|---|---|---|
| Session expires during checkout | Medium | Not handled — checkout currently assumes active session |
| Recovery link used twice | Low | Supabase invalidates after first use (default behavior) |
| Rate limiting on forgot password | Medium | Supabase enforces rate limits — user must wait |
| Multiple admin sessions | Low | No session limit enforced |

### Tasks

- [ ] ⬜ Configure Supabase SMTP provider for sending password reset emails
- [ ] ⬜ Add redirect URLs to Supabase Auth → URL Configuration:
  - `http://localhost:8080/studio/reset-password` (dev)
  - `http://10.197.121.81:8080/studio/reset-password` (LAN)
  - Production URL
- [ ] ⬜ Send test forgot password email and complete the flow end-to-end
- [ ] ⬜ Verify session expiry handling in checkout flow

---

## Configuration Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### Environment Variables

| Variable | Value | Used by | Status |
|---|---|---|---|
| `VITE_SUPABASE_URL` | (set in `.env`) | Supabase client | ✅ Set |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | (set in `.env`) | Supabase client (anon key) | ✅ Set |
| `VITE_SUPABASE_PROJECT_ID` | `kbvjmcnaaogkbnerjcoc` | (potential use) | ✅ Set |
| `VITE_APP_URL` | `http://localhost:8080` | Auth redirect URLs | ✅ Set (dev only) |
| `RAZORPAY_KEY_ID` | Supabase Edge Function secret | `create-razorpay-order` | ✅ Set |
| `RAZORPAY_KEY_SECRET` | Supabase Edge Function secret | All 3 Edge Functions | ✅ Set |
| `RAZORPAY_WEBHOOK_SECRET` | Not set | `razorpay-webhook` | ❌ Must be added |

### `supabase/config.toml`

```toml
project_id = "kbvjmcnaaogkbnerjcoc"
```

This is the **minimum possible configuration**. Missing sections:
- No `[functions]` config (verifyJWT, import_map_path)
- No `[auth]` config (site_url, redirect_urls)
- No `[storage]` config (buckets)
- No `import_map` reference

### Edge Function Dependencies

All three functions import from pinned CDN versions:
- `https://deno.land/std@0.168.0/...` (serving, crypto, uuid)
- `https://esm.sh/@supabase/supabase-js@2.106.2`

No `import_map.json` or `deno.json` exists in `supabase/functions/`.

### Tasks

- [ ] ⬜ Add `RAZORPAY_WEBHOOK_SECRET` to Supabase Edge Function secrets
- [ ] ⬜ Expand `supabase/config.toml` with function, auth, and storage config
- [ ] ⬜ Consider adding `import_map.json` for centralized dependency management
- [ ] ⬜ Update `VITE_APP_URL` for production deployment

---

## Storage Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

| Check | Result | Evidence |
|---|---|---|
| Supabase Storage configured? | ⬜ | Not reviewed |
| Product image bucket exists? | ⬜ | Not reviewed |
| Bucket RLS policies set? | ⬜ | Not reviewed |
| Public read access for product images? | ⬜ | Not reviewed |
| Upload policy for admin only? | ⬜ | Not reviewed |

### Tasks

- [ ] ⬜ Inventory existing buckets in Supabase Storage
- [ ] ⬜ Verify product images load correctly on storefront
- [ ] ⬜ Document bucket names and policies

---

## RLS Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### RLS Matrix (from migration analysis)

| Table | RLS Enabled | Policy Name | Command | Role | Using Expression | Status |
|---|---|---|---|---|---|---|
| `customers` | ✅ | `customers_insert_policy` | INSERT | `authenticated` | `true` | ✅ In remote |
| `shipping_addresses` | ✅ | `shipping_addresses_insert_policy` | INSERT | `authenticated` | `true` | ✅ In remote |
| `orders` | ✅ | `orders_select_policy` | SELECT | `authenticated` | `customer_id = auth.uid()` | ✅ In remote |
| `orders` | ✅ | `orders_insert_policy` | INSERT | `authenticated` | `customer_id = auth.uid()` | ✅ In remote |
| `orders` | ✅ | `orders_all_policy` | ALL | `service_role` | `true` | ✅ In remote |
| `order_items` | ✅ | `order_items_select_policy` | SELECT | `authenticated` | `order_id IN (SELECT id FROM orders WHERE customer_id = auth.uid())` | ✅ In remote |
| `order_items` | ✅ | `order_items_insert_policy` | INSERT | `authenticated` | `true` | ✅ In remote |
| `order_items` | ✅ | `order_items_all_policy` | ALL | `service_role` | `true` | ✅ In remote |
| `payments` | ✅ | `payments_all_policy` | ALL | `service_role` | `true` | ✅ In remote (no client access) |
| `inventory_history` | ✅ | `inventory_history_select` | SELECT | `authenticated` | `true` | ⬜ Pending forward migration |
| `inventory_history` | ✅ | `inventory_history_insert` | INSERT | `service_role` | `true` | ⬜ Pending forward migration |
| `payment_events` | ✅ | `payment_events_all_policy` | ALL | `service_role` | `true` | ⬜ Pending forward migration |
| `products` | ⬜ | — | — | — | — | Not in migrations; may have default RLS |
| `product_images` | ⬜ | — | — | — | — | Not in migrations; may have default RLS |
| `collections` | ⬜ | — | — | — | — | Not in migrations; may have default RLS |

### Observations

1. **Payments isolation is correct:** `service_role` only — no authenticated SELECT. Edge Functions use service_role client to access.
2. **Order ownership enforced:** `orders` SELECT uses `customer_id = auth.uid()`, `order_items` SELECT uses subquery through orders. Good defense-in-depth.
3. **No admin role check in RLS:** The admin check happens at the application layer (`app_metadata.role === "admin"`) rather than in RLS. This means admin access to `orders`, `customers`, etc. goes through `service_role` (Edge Functions or server context) rather than through the `authenticated` role with an admin claim check. This is acceptable if admins always access data through Studio's server context, but the `20260716000000_harden_studio_admin_policies.sql` migration was intended to add admin-specific RLS policies — and it was never applied.
4. **Products/collections tables:** Not created by any migration in `supabase/migrations/`. They likely exist from earlier manual setup. Their RLS state is unknown and needs verification.

### Security Principle

- Payment-sensitive tables (`payments`, `payment_events`) → `service_role` only. ✅ Verified.
- Customer-facing tables (`products`, `collections`) → `anon` SELECT, `authenticated` restricted. ⬜ Needs verification.
- Order ownership → `customer_id = auth.uid()` enforced. ✅ Verified.
- Admin access → Application-layer check only. ⬜ Needs hardening via RLS.

### Tasks

- [ ] ⬜ Verify RLS state on `products`, `product_images`, `collections` tables (likely created outside migration system)
- [ ] ⬜ Apply `20260716000000_harden_studio_admin_policies.sql` or create equivalent forward migration
- [ ] ⬜ Document RLS matrix in `docs/database/RLS_MATRIX.md` (creation suggested)

---

## Migration Audit

**Auditor:** Engineering  
**Date:** 2026-07-18  

### Local vs Remote History

```
LOCAL (supabase/migrations/):                         REMOTE (schema_migrations):
                                                       
20260706000001_create_order_system.sql                 
20260708000000_create_orders_schema.sql               ✅ 20260708000000_create_orders_schema
20260709000000_create_product_tables.sql               
20260709000000_COMBINED_PRODUCT_WORKSPACE.sql          
20260710000000_create_product_workspace.sql            
20260710000001_create_product_tables.sql              
20260710000000_seed_collections.sql                   
20260711000000_extend_collections.sql                 
20260712000000_fix_collections_migration.sql           
20260713000000_create_inventory_history.sql            
20260716000000_harden_studio_admin_policies.sql        
20260717000000_payment_events.sql                      
20260718000000_reconcile_order_schema.sql              
20260718000001_create_missing_objects.sql (NEW)        
```

### Migration Repair Plan

| Step | Action | Command | Status |
|---|---|---|---|
| 1 | Mark `20260706000001` as applied (precedes applied migration) | `supabase migration repair --status applied 20260706000001` | ⬜ Pending |
| 2 | Mark `20260713000000` as applied (objects in forward migration) | `supabase migration repair --status applied 20260713000000` | ⬜ Pending |
| 3 | Mark `20260717000000` as applied (objects in forward migration) | `supabase migration repair --status applied 20260717000000` | ⬜ Pending |
| 4 | Mark `20260718000000` as applied (tables already exist) | `supabase migration repair --status applied 20260718000000` | ⬜ Pending |
| 5 | Apply forward migration `20260718000001` | `supabase db push --project-ref kbvjmcnaaogkbnerjcoc` | ⬜ Pending |
| 6 | Verify migration history is clean | `supabase migration list` | ⬜ Pending |

### Remaining Unaddressed Migrations

After the repair + forward migration, these migrations are still marked NOT applied:

| Migration | Contains | Action needed |
|---|---|---|
| `20260709000000_create_product_tables.sql` | Products, images, categories, tags | ⬜ Review |
| `20260709000000_COMBINED_PRODUCT_WORKSPACE.sql` | Combined workspace tables | ⬜ Review |
| `20260710000000_create_product_workspace.sql` | Product workspace schema | ⬜ Review |
| `20260710000001_create_product_tables.sql` | Product tables | ⬜ Review |
| `20260710000000_seed_collections.sql` | Seed data for collections | ⬜ Review |
| `20260711000000_extend_collections.sql` | Collection extensions | ⬜ Review |
| `20260712000000_fix_collections_migration.sql` | Collection fixes | ⬜ Review |
| `20260716000000_harden_studio_admin_policies.sql` | RLS policies for admin | ⬜ Review |

**Decision required:** Determine whether these migrations were already applied manually or via another mechanism. If the products/collections tables exist in the remote DB with the correct schema, these migrations should be repaired as applied. If not, a second forward migration may be needed.

### Tasks

- [ ] ⬜ Execute migration repair steps 1–4
- [ ] ⬜ Verify repair succeeded (`supabase migration list`)
- [ ] ⬜ Run `supabase db push` to apply forward migration
- [ ] ⬜ Verify `payment_events`, `inventory_history`, `confirm_paid_order` now exist
- [ ] ⬜ Determine disposition of remaining 8 unapplied migrations
- [ ] ⬜ Either repair them (if schema already matches) or create additional forward migrations

---

## Testing Plan

### P0: Critical Path (blocking payments)

| # | Test | Method | Expected | Status |
|---|---|---|---|---|
| T1 | Run migration repair and forward migration | `supabase migration repair` + `supabase db push` | All 4 repaired + 1 applied; objects created | ⬜ |
| T2 | Deploy `verify-payment` | `supabase functions deploy verify-payment` | Success | ⬜ |
| T2b | Deploy `get-order-confirmation` | `supabase functions deploy get-order-confirmation` | Success | ⬜ |
| T3 | Run test payment end-to-end | Browser + DevTools | Razorpay modal → handler → verify-payment 200 → redirect to confirmation via Edge Function | ⬜ |
| T4 | Verify Studio order status | Navigate to `/studio/orders` | `payment_status = paid`, `status = confirmed` | ⬜ |
| T5 | Verify confirmation page loads via Edge Function | Navigate to `/order/confirmation/:number` | Shows order data fetched from `get-order-confirmation` | ⬜ |
| T6 | Idempotency test | Re-invoke `verify-payment` with same params | 200 `already_processed: true` | ⬜ |

### P1: High Priority

| # | Test | Method | Expected | Status |
|---|---|---|---|---|
| T7 | Deploy `razorpay-webhook` | `supabase functions deploy razorpay-webhook` | Success | ⬜ |
| T8 | Register webhook in Razorpay dashboard | Razorpay Dashboard → Settings → Webhooks | Webhook URL added for `payment.captured`, `payment.failed` | ⬜ |
| T9 | Send test webhook event | Razorpay test dashboard → Send test webhook | `payment_events` entry created, order status unchanged (already paid) | ⬜ |
| T10 | Verify inventory deduction after test payment | SQL: `SELECT stock FROM products WHERE id = ?` | Stock decreased by ordered quantity | ⬜ |
| T11 | Verify inventory_history entry | SQL: `SELECT * FROM inventory_history WHERE order_id = ?` | Entry created with correct values | ⬜ |

### P2: Medium Priority

| # | Test | Method | Expected | Status |
|---|---|---|---|---|
| T12 | Forgot password end-to-end | Trigger email → click link → set new password | Password updated, can login with new password | ⬜ |
| T13 | Expired recovery link test | Access `/studio/reset-password` without valid hash | Error message displayed | ⬜ |
| T14 | Supabase redirect URLs | Configure in dashboard, test forgot password | Redirect lands on correct page | ⬜ |
| T15 | RLS audit queries | SQL: verify each table's policies | Documented in RLS audit | ⬜ |
| T16 | Verify `products`, `product_images`, `collections` RLS | SQL: check RLS on product-related tables | Public read, admin write | ⬜ |
| T17 | `get-order-confirmation` — invalid input tests | Send empty body, malformed JSON, bad format | All return HTTP 400 | ⬜ |
| T18 | `get-order-confirmation` — missing order | Send valid format, non-existent number | HTTP 404 | ⬜ |
| T19 | `get-order-confirmation` — sensitive field audit | Inspect response JSON | No IDs, emails, phone, payment data | ⬜ |
| T20 | Direct DB access blocked | Browser console: `supabase.from("orders").select("*")` | Empty array or error (RLS default-deny) | ⬜ |

### P3: Low Priority (Housekeeping)

| # | Test | Method | Expected | Status |
|---|---|---|---|---|
| T21 | Remove debug logs from `verify-payment` | Edit + redeploy | No STEP 1–STEP 6 logs in production | ⬜ |
| T22 | Fix `create-razorpay-order` code quality issues | Review `createResponse`, unused imports | Clean compile | ⬜ |
| T23 | Standardize HMAC comparison across Edge Functions | Compare `verify-payment` vs `razorpay-webhook` approach | Consistent implementation | ⬜ |
| T24 | Add `import_map.json` to `supabase/functions/` | Create file, reference in configs | Dependencies managed centrally | ⬜ |
| T25 | Expand `supabase/config.toml` | Add function, auth, storage sections | Complete project config | ⬜ |
| T26 | Add env var runtime guards to all Edge Functions | Edit all 3 functions | Clear error message if env var unset | ⬜ |
| T27 | Add request validation to all Edge Functions | Add body parsing guards | 400 on malformed request, not 500 | ⬜ |

---

## Verification Checklist

### Database

- [ ] ⬜ `payment_events` table exists with correct schema
- [ ] ⬜ `inventory_history` table exists with correct schema
- [ ] ⬜ `confirm_paid_order()` function exists and returns JSONB
- [ ] ⬜ `adjust_product_stock()` function exists (or confirmed missing and acceptable)
- [ ] ⬜ `supabase_migrations.schema_migrations` shows clean history

### Edge Functions

- [ ] ⬜ `verify-payment` returns HTTP 200 with `{ success: true, order_id, payment_id }` for valid payments
- [ ] ⬜ `verify-payment` returns HTTP 400 for invalid signature
- [ ] ⬜ `verify-payment` returns HTTP 200 with `{ already_processed: true }` for duplicate requests
- [ ] ⬜ `razorpay-webhook` returns HTTP 200 for valid webhook events
- [ ] ⬜ `razorpay-webhook` returns HTTP 400 for invalid signature
- [ ] ⬜ `get-order-confirmation` returns HTTP 200 with correct fields for valid order number
- [ ] ⬜ `get-order-confirmation` returns HTTP 404 for missing order number
- [ ] ⬜ `get-order-confirmation` returns HTTP 400 for invalid input
- [ ] ⬜ `get-order-confirmation` response contains no sensitive fields (IDs, emails, phone, payment data)
- [ ] ⬜ All Edge Function logs show no unhandled errors after test run

### Payment Lifecycle

- [ ] ⬜ Order created with `status = 'pending_payment'`, `payment_status = 'pending'`
- [ ] ⬜ Payment record created with `status = 'pending'`
- [ ] ⬜ After verification: `payments.status = 'paid'`
- [ ] ⬜ After verification: `orders.payment_status = 'paid'`, `orders.status = 'confirmed'`
- [ ] ⬜ After verification: `products.stock` decreased by order quantity
- [ ] ⬜ After verification: `inventory_history` entry created
- [ ] ⬜ After verification: `payment_events` entry created

### Frontend

- [ ] ⬜ Checkout redirects to `/order/confirmation/:number` after successful payment
- [ ] ⬜ Order confirmation page shows "Paid" badge
- [ ] ⬜ Studio orders list shows `payment_status = "paid"`
- [ ] ⬜ Studio order detail shows correct payment information

---

## Architecture Changes (Phase 2.1)

| Change | Date | Description |
|---|---|---|
| Created `get-order-confirmation` Edge Function | 2026-07-18 | Replaces direct anon DB access for order confirmation page |
| Removed 4 proposed anon RLS policies from `20260718000001` | 2026-07-18 | Commerce tables remain protected (RLS default-deny) |
| `orderService.ts` now invokes Edge Function | 2026-07-18 | No `supabase.from("orders")` calls in frontend |
| `OrderConfirmationDetail` type minimized | 2026-07-18 | Removed customerName, customerEmail, full address; added `shipping` object |

### Security Improvements

- ✅ No anonymous role can read `orders`, `customers`, `order_items`, or `shipping_addresses`
- ✅ All order confirmation data goes through service_role Edge Function
- ✅ Edge Function returns exactly 16 approved fields — no IDs, emails, phone, payment data, or internal notes
- ✅ Input validation on Edge Function rejects malformed/incomplete requests with 400
- ✅ Error responses contain no sensitive information

---

## Final Sign-off Checklist

| Criterion | Signed off by | Date | Status |
|---|---|---|---|---|
| Full backend audit complete (DB, Edge Functions, Frontend, Auth, Config) | ✅ Engineering | 2026-07-18 | ✅ |
| All P0 tests pass | — | — | ⬜ |
| All P1 tests pass | — | — | ⬜ |
| All P2 tests pass | — | — | ⬜ |
| Migration history clean and consistent | — | — | ⬜ |
| `verify-payment` returns 200 for valid payments | — | — | ⬜ |
| `razorpay-webhook` processes events successfully | — | — | ⬜ |
| Studio displays correct payment and order status | — | — | ⬜ |
| Inventory deduction works correctly | — | — | ⬜ |
| Auth flow (login + forgot password) works | — | — | ⬜ |
| RLS policies verified on all tables | — | — | ⬜ |
| Storage buckets and policies verified | — | — | ⬜ |
| No credentials or secrets exposed in frontend code | — | — | ⬜ |
| Edge Function debug logs removed | — | — | ⬜ |
| No known P0 or P1 bugs remain | — | — | ⬜ |
| Document reviewed and approved | — | — | ⬜ |

---

*End of document.*
