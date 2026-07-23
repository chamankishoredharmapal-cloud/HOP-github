# STATIC VERIFICATION REPORT

**Project:** House of Padmavati  
**Phase:** PHASE 1 — Static Verification  
**Auditor:** Senior QA Engineering  
**Date:** 2026-07-18  
**Method:** Source code analysis. No database introspection. No runtime calls.

---

## TABLE OF CONTENTS

1. [Scope and Methodology](#scope-and-methodology)
2. [Edge Function 1: create-razorpay-order](#edge-function-1-create-razorpay-order)
3. [Edge Function 2: verify-payment](#edge-function-2-verify-payment)
4. [Edge Function 3: razorpay-webhook](#edge-function-3-razorpay-webhook)
5. [Database Schema Cross-Reference](#database-schema-cross-reference)
6. [Frontend Service Layer](#frontend-service-layer)
7. [Authentication System](#authentication-system)
8. [Configuration Audit](#configuration-audit)
9. [Summary Matrix](#summary-matrix)

---

## Scope and Methodology

Every Edge Function was traced line-by-line. Every import, env var, DB table, DB column, RPC, RLS policy, storage bucket, secret, and external API call was extracted. Each dependency was then verified against:

- The **canonical database schema** (migration `20260718000000` — the reconciliation target)
- The **remote database schema** (migration `20260708000000` — the only applied migration)
- The **forward migration** (`20260718000001`)
- The **TypeScript type definitions** (`src/integrations/supabase/types.ts`)
- The **configuration files** (`.env`, `supabase/config.toml`)

**Legend:**

| Symbol | Meaning |
|---|---|
| ✅ EXISTS | Dependency exists and matches across all sources |
| ❌ MISSING | Dependency does not exist in one or more required sources |
| ⚠ MISMATCH | Dependency exists but has type, name, or structure differences |
| ⬜ UNVERIFIED | Cannot verify statically (runtime-dependent) |

---

## Edge Function 1: create-razorpay-order

**File:** `supabase/functions/create-razorpay-order/index.ts` (386 lines)

### Imported Modules

| Import | Source | Status | Notes |
|---|---|---|---|
| `serve` | `https://deno.land/std@0.168.0/http/server.ts` | ✅ EXISTS | Pinned version |
| `createClient` | `https://esm.sh/@supabase/supabase-js@2.106.2` | ✅ EXISTS | Pinned version |
| `Razorpay` | `npm:razorpay@2.9.5` | ✅ EXISTS | Pinned version |

### Environment Variables Read

| Variable | How Used | Status | Notes |
|---|---|---|---|
| `SUPABASE_URL` | `Deno.env.get("SUPABASE_URL")!` | ✅ EXISTS | Set by Supabase runtime automatically |
| `SUPABASE_SERVICE_ROLE_KEY` | `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!` | ✅ EXISTS | Set by Supabase runtime automatically |
| `RAZORPAY_KEY_ID` | `Deno.env.get("RAZORPAY_KEY_ID")` | ✅ EXISTS | Verified working (orders created) |
| `RAZORPAY_KEY_SECRET` | `Deno.env.get("RAZORPAY_KEY_SECRET")` | ✅ EXISTS | Verified working (orders created) |

### Database Tables Accessed

| Table | Operation | Columns Read/Written | Status | Notes |
|---|---|---|---|---|
| `orders` | SELECT | `id`, `total`, `order_number`, `payment_status`, `status` | ✅ EXISTS | All columns exist in schema |
| `orders` | INSERT | `customer_id`, `shipping_address_id`, `order_number`, `status`, `payment_status`, `subtotal`, `shipping_cost`, `total`, `notes` | ✅ EXISTS | All columns match schema |
| `products` | SELECT | `id`, `selling_price`, `name`, `status` | ✅ EXISTS | `selling_price` (renamed from `price`) |
| `customers` | SELECT | `id` | ✅ EXISTS | Filtered by `email` |
| `customers` | INSERT | `email`, `full_name`, `phone` | ⚠ MISMATCH | See below |
| `shipping_addresses` | INSERT | `customer_id`, `recipient_name`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `landmark` | ✅ EXISTS | All columns match |
| `product_images` | SELECT | `url` | ✅ EXISTS | Filtered by `product_id`, `is_primary` |
| `order_items` | INSERT | `order_id`, `product_id`, `product_name`, `product_price`, `quantity`, `image_url` | ⚠ MISMATCH | See below |
| `payments` | SELECT | `id`, `razorpay_order_id`, `status` | ✅ EXISTS | Filtered by `order_id` |
| `payments` | INSERT | `order_id`, `razorpay_order_id`, `amount`, `currency`, `status` | ⚠ MISMATCH | See below |

### ⚠ MISMATCH — `customers` INSERT: `phone` field

The code inserts `phone: customer_phone ?? ""`. The canonical customers table has `phone TEXT` (nullable). The code sends an empty string `""` instead of `null`. This will store `""` instead of `null` when no phone provided. Functional but semantically different.

### ⚠ MISMATCH — `order_items`: `product_id` type

The code inserts `product_id: item.product_id` (string from request body). The remote schema (`20260708000000`) has `product_id TEXT NOT NULL`. The reconciliation schema (`20260718000000`) has `product_id UUID REFERENCES products(id) ON DELETE SET NULL`. If reconciliation is applied, string → UUID cast works but the FK constraint will fail if the product_id doesn't match a products.id UUID. **The TypeScript types show `product_id: string`.** This is a type mismatch risk post-reconciliation.

### ⚠ MISMATCH — `payments` INSERT: no `updated_at`

The code inserts into `payments` without `updated_at`. The remote schema (`20260708000000`) has no `updated_at` column on payments. The TypeScript types (`types.ts`) **do** include `updated_at: string` in `payments.Row`. The reconciliation migration (`20260718000000`) adds `updated_at` to payments. After reconciliation, this will work. Before reconciliation, the types are wrong.

### RPCs Called

| RPC | Parameters | Status | Notes |
|---|---|---|---|
| `generate_order_number()` | None | ✅ EXISTS | Returns TEXT |

### RLS Policies (verification)

The Edge Function uses `SUPABASE_SERVICE_ROLE_KEY` which **bypasses RLS entirely**. RLS is irrelevant for this function's DB access.

### Storage Buckets

| Bucket | Access | Status | Notes |
|---|---|---|---|
| None accessed | — | ⬜ UNVERIFIED | Function does not access storage |

### Secrets

| Secret | Status | Notes |
|---|---|---|
| `RAZORPAY_KEY_ID` | ✅ EXISTS | Verified in Supabase dashboard |
| `RAZORPAY_KEY_SECRET` | ✅ EXISTS | Verified in Supabase dashboard |

### External APIs

| API | Endpoint | Status | Notes |
|---|---|---|---|
| Razorpay Orders API | `razorpay.orders.create()` | ✅ EXISTS | SDK wraps `https://api.razorpay.com/v1/orders` |

---

## Edge Function 2: verify-payment

**File:** `supabase/functions/verify-payment/index.ts` (204 lines)

### Imported Modules

| Import | Source | Status | Notes |
|---|---|---|---|
| `serve` | `https://deno.land/std@0.168.0/http/server.ts` | ✅ EXISTS | Same pinned version as EF1 |
| `createClient` | `https://esm.sh/@supabase/supabase-js@2.106.2` | ✅ EXISTS | Same pinned version as EF1 |

### Environment Variables Read

| Variable | How Used | Status | Notes |
|---|---|---|---|
| `SUPABASE_URL` | `Deno.env.get("SUPABASE_URL")!` | ✅ EXISTS | Set by Supabase runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!` | ✅ EXISTS | Set by Supabase runtime |
| `RAZORPAY_KEY_SECRET` | `Deno.env.get("RAZORPAY_KEY_SECRET")!` | ✅ EXISTS | Used for HMAC verification |

### Database Tables Accessed

| Table | Operation | Columns Read/Written | Status | Notes |
|---|---|---|---|---|
| `payments` | UPDATE | `status` | ✅ EXISTS | Sets `status = "failed"` on invalid signature |
| `payments` | UPDATE (via RPC) | `status`, `razorpay_payment_id`, `updated_at` | ❌ MISSING | `updated_at` does not exist in remote `payments` table |
| `orders` | UPDATE (via RPC) | `payment_status`, `status`, `updated_at` | ✅ EXISTS | `updated_at` exists on `orders` in remote |
| `payment_events` | SELECT | `id` | ❌ MISSING | Table does not exist in remote DB |
| `payment_events` | INSERT | `event_id`, `event_type`, `razorpay_order_id`, `razorpay_payment_id` | ❌ MISSING | Table does not exist in remote DB |
| `products` | UPDATE (via RPC) | `stock` | ✅ EXISTS | Via `confirm_paid_order` RPC |
| `inventory_history` | INSERT (via RPC) | `product_id`, `change`, `previous_stock`, `new_stock`, `reason`, `notes` | ❌ MISSING | Table does not exist in remote DB |
| `order_items` | SELECT (via RPC) | `product_id`, `quantity` | ✅ EXISTS | Via `confirm_paid_order` RPC |

### RPCs Called

| RPC | Parameters | Status | Notes |
|---|---|---|---|
| `confirm_paid_order` | `p_razorpay_order_id`, `p_razorpay_payment_id`, `p_razorpay_signature` | ❌ MISSING | Function does not exist in remote DB |

### ❌ CRITICAL: `confirm_paid_order` RPC references `payments.updated_at`

The `confirm_paid_order` RPC (in forward migration `20260718000001`) executes:
```sql
UPDATE payments
SET status = 'paid',
    razorpay_payment_id = COALESCE(p_razorpay_payment_id, razorpay_payment_id),
    updated_at = now()            -- <-- COLUMN MISSING IN REMOTE
WHERE id = v_payment_id;
```

The remote `payments` table (from `20260708000000`) does NOT have an `updated_at` column. After applying forward migration `20260718000001`, the RPC will **crash with "column payments.updated_at does not exist"**.

**Root cause:** The forward migration creates the `confirm_paid_order` function but does NOT alter the `payments` table to add the `updated_at` column. The reconciliation migration (`20260718000000`) would have added it, but it was never applied and is NOT included in the forward migration.

### RLS Policies

| Policy | Status | Notes |
|---|---|---|
| `payment_events_all_service` (service_role ALL) | ❌ MISSING | Table does not exist |

### Storage Buckets

| Bucket | Access | Status | Notes |
|---|---|---|---|
| None accessed | — | ⬜ UNVERIFIED | |

### Secrets

| Secret | Status | Notes |
|---|---|---|
| `RAZORPAY_KEY_SECRET` | ✅ EXISTS | Shared with EF1 |

### External APIs

None. HMAC verification is local computation.

---

## Edge Function 3: razorpay-webhook

**File:** `supabase/functions/razorpay-webhook/index.ts` (216 lines)

### Imported Modules

| Import | Source | Status | Notes |
|---|---|---|---|
| `serve` | `https://deno.land/std@0.168.0/http/server.ts` | ✅ EXISTS | Same pinned version |
| `createClient` | `https://esm.sh/@supabase/supabase-js@2.106.2` | ✅ EXISTS | Same pinned version |

### Environment Variables Read

| Variable | How Used | Status | Notes |
|---|---|---|---|
| `SUPABASE_URL` | `Deno.env.get("SUPABASE_URL")!` | ✅ EXISTS | Set by Supabase runtime |
| `SUPABASE_SERVICE_ROLE_KEY` | `Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!` | ✅ EXISTS | Set by Supabase runtime |
| `RAZORPAY_WEBHOOK_SECRET` | `Deno.env.get("RAZORPAY_WEBHOOK_SECRET")` | ❌ MISSING | Not set in Supabase Edge Function secrets |

### Database Tables Accessed

| Table | Operation | Columns Read/Written | Status | Notes |
|---|---|---|---|---|
| `payment_events` | SELECT | `id` | ❌ MISSING | Table does not exist in remote |
| `payment_events` | INSERT | `event_id`, `event_type`, `razorpay_order_id`, `razorpay_payment_id` | ❌ MISSING | Table does not exist in remote |
| `payments` | UPDATE | `status` | ✅ EXISTS | Sets `status = "failed"` on payment.failed |
| `payments` | UPDATE (via RPC) | `status`, `razorpay_payment_id`, `updated_at` | ❌ MISSING | Same `updated_at` issue as EF2 |

### RPCs Called

| RPC | Parameters | Status | Notes |
|---|---|---|---|
| `confirm_paid_order` | `p_razorpay_order_id`, `p_razorpay_payment_id`, `p_razorpay_signature` (null) | ❌ MISSING | Function does not exist in remote DB |

### RLS Policies

Same as EF2 — all blocked by missing objects.

### Storage Buckets

| Bucket | Access | Status | Notes |
|---|---|---|---|
| None accessed | — | ⬜ UNVERIFIED | |

### Secrets

| Secret | Status | Notes |
|---|---|---|
| `RAZORPAY_WEBHOOK_SECRET` | ❌ MISSING | Must be added to Supabase Edge Function secrets |

### External APIs

None. Razorpay sends webhook events via HTTP POST; the function only responds.

### ❌ CRITICAL: Webhook body consumed twice

The function calls `req.text()` to get the raw body for signature verification, then calls `JSON.parse(rawBody)` to parse the event. This is correct (can't call `req.json()` after consuming the body). ✅ However, if the body is malformed JSON, `JSON.parse()` throws and the catch returns 500 instead of 400.

---

## Database Schema Cross-Reference

### Tables in Remote DB (from `20260708000000`)

| Table | Columns | Created by | Status |
|---|---|---|---|
| `customers` | `id`, `email`, `full_name`, `phone`, `created_at` | `20260708000000` | ✅ |
| `shipping_addresses` | `id`, `customer_id`, `recipient_name`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `landmark`, `created_at` | `20260708000000` | ✅ |
| `orders` | `id`, `customer_id`, `shipping_address_id`, `order_number`, `status` (enum), `payment_status` (enum), `subtotal`, `shipping_cost`, `total`, `notes`, `created_at`, `updated_at` | `20260708000000` | ✅ |
| `order_items` | `id`, `order_id`, `product_id` (TEXT), `product_name`, `product_price`, `quantity`, `image_url`, `created_at` | `20260708000000` | ✅ |
| `payments` | `id`, `order_id`, `razorpay_payment_id`, `razorpay_order_id`, `amount`, `currency`, `status` (enum), `created_at` | `20260708000000` | ✅ |
| `products` | Full workspace schema with `selling_price`, `stock`, etc. | Pre-migration (unknown) | ⬜ |
| `product_images` | Full schema | Pre-migration (unknown) | ⬜ |
| `collections` | Full workspace schema | Pre-migration (unknown) | ⬜ |

### Tables MISSING from Remote DB

| Table | Required By | Created By (local) | Status |
|---|---|---|---|
| `payment_events` | `verify-payment`, `razorpay-webhook` | `20260717000000` / `20260718000001` | ❌ MISSING |
| `inventory_history` | `confirm_paid_order` RPC | `20260713000000` / `20260718000001` | ❌ MISSING |

### ❌ CRITICAL: `payments` table lacks `updated_at` column

Remote `payments` schema (from `20260708000000`):
```
id, order_id, razorpay_payment_id, razorpay_order_id, amount, currency, status, created_at
```

The `confirm_paid_order` RPC (forward migration `20260718000001`) executes:
```sql
UPDATE payments SET ..., updated_at = now() WHERE ...
```

This will **fail** because `updated_at` does not exist on `payments` in remote. The reconciliation migration `20260718000000` adds `updated_at` but it was **never applied** and is **not included** in forward migration `20260718000001`.

### RPCs MISSING from Remote DB

| RPC | Required By | Created By (local) | Status |
|---|---|---|---|
| `confirm_paid_order` | `verify-payment`, `razorpay-webhook` | `20260718000000` / `20260718000001` | ❌ MISSING |
| `adjust_product_stock` | (unused by functions) | `20260718000000` | ❌ MISSING |

### Enums in Remote DB

| Enum | Values | Status |
|---|---|---|
| `order_status` | `pending_payment`, `confirmed`, `processing`, `shipped`, `delivered`, `cancelled`, `returned` | ✅ EXISTS |
| `payment_status` | `pending`, `paid`, `failed`, `refunded`, `partially_refunded` | ✅ EXISTS |
| `payment_transaction_status` | `pending`, `paid`, `failed`, `refunded` | ✅ EXISTS |

### ⚠ MISMATCH: TypeScript `order_items.product_id` is `string` but canonical schema has `UUID`

The types file defines:
```typescript
order_items: {
  Row: { product_id: string }
}
```

The remote schema has `product_id TEXT`. The reconciliation schema changes it to `UUID`. The types are correct for BEFORE reconciliation but will be wrong AFTER. This is a forward-compatibility issue.

---

## Frontend Service Layer

### `paymentService.ts`

| Function | Invokes | Status | Notes |
|---|---|---|---|
| `createRazorpayOrder(input)` | Edge Function `create-razorpay-order` | ✅ | Correct supabase.functions.invoke call |
| `verifyPayment(razorpay_order_id, razorpay_payment_id, razorpay_signature)` | Edge Function `verify-payment` | ✅ | Correct supabase.functions.invoke call |

### `orderService.ts`

| Function | DB Query | RLS Status | Notes |
|---|---|---|---|
| `fetchOrderConfirmation(orderNumber)` | `orders` JOIN `customers` SELECT | ❌ BLOCKED | Anon key cannot read orders (default-deny RLS) |

### ❌ CRITICAL: Order confirmation page cannot read from DB

The `fetchOrderConfirmation` function uses `supabase` client (anon key) to query:
```typescript
supabase.from("orders").select(`*, customers!inner(full_name, email)`).eq("order_number", orderNumber).maybeSingle();
```

The remote `orders` and `customers` tables have RLS enabled with **zero customer-facing policies** (default-deny). The anon key has no permission to SELECT from `orders` or `customers`. **This query will always return null for guest users.**

**Required fix:** Either:
1. Add anon SELECT policies to `orders` and `customers` for order confirmation lookups, OR
2. Create a dedicated Edge Function for order confirmation lookups (using service_role), OR
3. Pass order data through navigation state instead of re-fetching from DB.

---

## Authentication System

### Auth Flow

| Component | Purpose | Status |
|---|---|---|
| `authService.ts` | signIn, signOut, getSession, getUser, getAuthState, resetPasswordForEmail, updatePassword | ✅ |
| `useAuth.ts` | React hook wrapping authService | ✅ |
| `AuthGuard.tsx` | Redirects unauthenticated users; blocks non-admin | ✅ |
| `Login.tsx` | Login form | ✅ |
| `ForgotPasswordDialog.tsx` | Password reset dialog | ✅ |
| `ResetPassword.tsx` | New password form with strength indicator | ✅ |
| `client.ts` | Supabase client (anon key) with autoRefreshToken | ✅ |

### Secrets Check

| Secret | Location | Status |
|---|---|---|
| `VITE_SUPABASE_URL` | `.env` | ✅ |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` | ✅ (this is the anon key, safe to expose) |
| `SUPABASE_URL` | Supabase runtime | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase runtime | ✅ |
| `RAZORPAY_KEY_ID` | Supabase Edge Function secrets | ✅ |
| `RAZORPAY_KEY_SECRET` | Supabase Edge Function secrets | ✅ |
| `RAZORPAY_WEBHOOK_SECRET` | Supabase Edge Function secrets | ❌ MISSING |

### Supabase Redirect URLs

| URL | Required For | Status |
|---|---|---|
| `http://localhost:8080/studio/reset-password` | Password reset flow | ❌ NOT CONFIGURED |
| Production URL | Password reset flow | ❌ NOT CONFIGURED |

---

## Configuration Audit

### `.env` File

```
VITE_SUPABASE_PROJECT_ID="kbvjmcnaaogkbnerjcoc"
VITE_SUPABASE_PUBLISHABLE_KEY="sb_publishable_cSiBaTaktDyF3fyWrpj7LA_d3ToDWC5"
VITE_SUPABASE_URL="https://kbvjmcnaaogkbnerjcoc.supabase.co"
VITE_APP_URL="http://localhost:8080"
```

| Variable | Status | Notes |
|---|---|---|
| `VITE_SUPABASE_PROJECT_ID` | ✅ | Correct project ref |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | ✅ | Matches project |
| `VITE_SUPABASE_URL` | ✅ | Matches project ref |
| `VITE_APP_URL` | ✅ | `http://localhost:8080` — dev only |

### `supabase/config.toml`

```toml
project_id = "kbvjmcnaaogkbnerjcoc"
```

| Section | Status | Notes |
|---|---|---|
| `project_id` | ✅ EXISTS | Only configured value |
| `[functions]` | ❌ MISSING | No function config (verifyJWT, import_map) |
| `[auth]` | ❌ MISSING | No site_url, redirect_urls |
| `[storage]` | ❌ MISSING | No bucket configuration |

### Edge Function Import Management

| Feature | Status | Notes |
|---|---|---|
| `import_map.json` | ❌ MISSING | No centralized dependency file |
| `deno.json` | ❌ MISSING | No Deno config |
| Version pinning | ⚠ | All imports pinned but not centrally managed |

---

## Summary Matrix

### Edge Function Dependencies

| Dependency | create-razorpay-order | verify-payment | razorpay-webhook |
|---|---|---|---|
| `serve()` | ✅ | ✅ | ✅ |
| `createClient()` | ✅ | ✅ | ✅ |
| `Razorpay` (npm) | ✅ | N/A | N/A |
| `SUPABASE_URL` | ✅ | ✅ | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | ✅ | ✅ | ✅ |
| `RAZORPAY_KEY_ID` | ✅ | N/A | N/A |
| `RAZORPAY_KEY_SECRET` | ✅ | ✅ | N/A |
| `RAZORPAY_WEBHOOK_SECRET` | N/A | N/A | ❌ MISSING |
| `orders` table | ✅ | ✅ (via RPC) | ✅ (via RPC) |
| `customers` table | ⚠ (phone as "" vs null) | (not accessed) | (not accessed) |
| `shipping_addresses` table | ✅ | (not accessed) | (not accessed) |
| `order_items` table | ⚠ (product_id type mismatch) | ✅ (via RPC) | ✅ (via RPC) |
| `payments` table | ⚠ (no updated_at) | ❌ (updated_at in RPC) | ❌ (updated_at in RPC) |
| `products` table | ✅ | ✅ (via RPC) | ✅ (via RPC) |
| `product_images` table | ✅ | (not accessed) | (not accessed) |
| `payment_events` table | N/A | ❌ MISSING | ❌ MISSING |
| `inventory_history` table | N/A | ❌ MISSING | ❌ MISSING |
| `generate_order_number()` RPC | ✅ | N/A | N/A |
| `confirm_paid_order()` RPC | N/A | ❌ MISSING | ❌ MISSING |
| `adjust_product_stock()` RPC | (not used) | (not used) | (not used) |

### Overall Status

| Component | Status |
|---|---|
| **Edge Function 1: create-razorpay-order** | ✅ WORKING |
| **Edge Function 2: verify-payment** | ❌ BLOCKED (3 missing dependencies) |
| **Edge Function 3: razorpay-webhook** | ❌ BLOCKED (4 missing dependencies) |
| **Forward migration (20260718000001)** | ⚠ INCOMPLETE (missing `payments.updated_at` column) |
| **Frontend order confirmation** | ❌ BROKEN (RLS blocks guest reads) |
| **Auth system** | ✅ FUNCTIONAL (for Studio) |
| **Configuration** | ⚠ MINIMAL (config.toml sparse) |

### Critical Issues (must fix before deployment)

| # | Issue | Component | Impact |
|---|---|---|---|
| C1 | `payment_events` table does not exist in remote DB | EF2, EF3 | Both functions crash |
| C2 | `confirm_paid_order` RPC does not exist in remote DB | EF2, EF3 | Both functions crash |
| C3 | `confirm_paid_order` RPC references `payments.updated_at` which doesn't exist in remote DB | Forward migration | RPC crashes after migration applied |
| C4 | `RAZORPAY_WEBHOOK_SECRET` not configured in Supabase secrets | EF3 | Webhook returns 500 |
| C5 | Order confirmation page queries `orders` with anon key — BLOCKED by RLS default-deny | Frontend | Users never see confirmation |
| C6 | `inventory_history` table does not exist in remote DB | RPC | Inventory deduction fails |

### High-Impact Issues

| # | Issue | Component | Impact |
|---|---|---|---|
| H1 | `VITE_APP_URL` redirect URLs not configured in Supabase dashboard | Auth | Password reset flow broken |
| H2 | Supabase SMTP not configured | Auth | Forgot password emails not sent |
| H3 | `payments` table lacks `updated_at` column | EF2, EF3, RPC | Even with forward migration, `confirm_paid_order` RPC will crash on `payments.updated_at` |
| H4 | `product_id` type mismatch (TEXT vs UUID) between schemas | order_items | Post-reconciliation FK constraint risk |

### Low-Impact Issues

| # | Issue | Component | Impact |
|---|---|---|---|
| L1 | `customers.phone` inserted as `""` instead of `null` | EF1 | Semantically different but functional |
| L2 | All Edge Functions use non-null assertion on env vars (`!`) | EF1, EF2, EF3 | Unclear error if env var unset |
| L3 | `razorpay-webhook` does not return 400 on missing body/event | EF3 | Silent failure on malformed webhook |
| L4 | HMAC comparison differs between EF2 (`crypto.subtle`) and EF3 (`crypto.timingSafeEqual`) | EF2, EF3 | Inconsistent, both correct |
| L5 | `supabase/config.toml` missing all optional sections | Config | No import_map, no function config |

---

*End of Static Verification Report*
