# Code ↔ Schema Reconciliation Report

**Project:** House of Padmavati  
**Live database target:** Supabase project `kbvjmcnaaogkbnerjcoc`  
**Live schema source:** Migration `20260708000000_create_orders_schema.sql` (the ONE applied migration)  
**Forward migrations source:** `20260718000001_create_missing_objects.sql`  

---

## Table of Contents

1. [Methodology](#methodology)
2. [Issue Registry](#issue-registry)
3. [Database Objects: Forward Migration Required](#database-objects-forward-migration-required)
4. [Code Changes Required (Edge Functions)](#code-changes-required-edge-functions)
5. [Code Changes Required (Frontend)](#code-changes-required-frontend)
6. [Code Changes Required (TypeScript Types)](#code-changes-required-typescript-types)
7. [Configuration Changes Required](#configuration-changes-required)
8. [No-Change Dependencies (Already Compatible)](#no-change-dependencies-already-compatible)
9. [Summary: Change Checklist](#summary-change-checklist)

---

## Methodology

For every dependency identified in `STATIC_VERIFICATION_REPORT.md`, I determined:

1. **Root cause:** Is the live database missing an object? Or does the code assume a schema that doesn't match reality?
2. **Fix type:** `DB_MIGRATION` (database needs a new object), `CODE_FIX` (code needs adjustment), or `CONFIG_FIX` (configuration needs change).
3. **The fix itself:** Exact SQL or code change required.

### Live Database Schema (Canonical Source of Truth)

Derived from `20260708000000_create_orders_schema.sql` (the **only** migration present in remote `supabase_migrations.schema_migrations`). Objects from later migrations (`.sql` files present locally but never applied) do **not** exist in the live database.

| Table | Status in Live DB | Key Columns |
|---|---|---|
| `customers` | ✅ EXISTS | `id UUID`, `email TEXT`, `full_name TEXT`, `phone TEXT`, `created_at TIMESTAMPTZ` |
| `shipping_addresses` | ✅ EXISTS | `id UUID`, `customer_id UUID` (FK → customers), `recipient_name TEXT`, `phone TEXT`, `address TEXT`, `city TEXT`, `state TEXT`, `postal_code TEXT`, `country TEXT DEFAULT 'India'`, `landmark TEXT`, `created_at TIMESTAMPTZ` |
| `orders` | ✅ EXISTS | `id UUID`, `customer_id UUID` (FK → customers), `shipping_address_id UUID` (FK → shipping_addresses), `order_number TEXT UNIQUE`, `status order_status DEFAULT 'pending_payment'`, `payment_status payment_status DEFAULT 'pending'`, `subtotal INTEGER`, `shipping_cost INTEGER DEFAULT 0`, `total INTEGER`, `notes TEXT`, `created_at TIMESTAMPTZ`, `updated_at TIMESTAMPTZ` |
| `order_items` | ✅ EXISTS | `id UUID`, `order_id UUID` (FK → orders), `product_id TEXT`, `product_name TEXT`, `product_price INTEGER`, `quantity INTEGER DEFAULT 1`, `image_url TEXT`, `created_at TIMESTAMPTZ` |
| `payments` | ✅ EXISTS | **NO `updated_at` column.** Columns: `id UUID`, `order_id UUID` (FK → orders), `razorpay_payment_id TEXT`, `razorpay_order_id TEXT`, `amount INTEGER`, `currency TEXT DEFAULT 'INR'`, `status payment_transaction_status DEFAULT 'pending'`, `created_at TIMESTAMPTZ` |
| `products` | ✅ EXISTS | Pre-migration. Columns include `id UUID`, `selling_price INTEGER`, `name TEXT`, `status TEXT`, `stock INTEGER` |
| `product_images` | ✅ EXISTS | Pre-migration. Columns include `id UUID`, `product_id UUID` (FK → products), `url TEXT`, `is_primary BOOLEAN` |
| `collections` | ✅ EXISTS | Pre-migration. Various columns |
| `inventory_history` | ❌ MISSING | Does not exist in live DB |
| `payment_events` | ❌ MISSING | Does not exist in live DB |

| RPC | Status in Live DB |
|---|---|
| `generate_order_number()` | ✅ EXISTS |
| `update_updated_at_column()` (trigger) | ✅ EXISTS |
| `create_order()` | ✅ EXISTS |
| `confirm_paid_order()` | ❌ MISSING |
| `adjust_product_stock()` | ❌ MISSING |

| ENUM | Status in Live DB |
|---|---|
| `order_status` | ✅ EXISTS — `'pending_payment', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'` |
| `payment_status` | ✅ EXISTS — `'pending', 'paid', 'failed', 'refunded', 'partially_refunded'` |
| `payment_transaction_status` | ✅ EXISTS — `'pending', 'paid', 'failed', 'refunded'` |

---

## Issue Registry

### Every Failed Dependency, Classified

| ID | Dependency | Edge Function(s) | Root Cause | Fix Type | Severity |
|---|---|---|---|---|---|
| R01 | `payment_events` table | EF2 `verify-payment`, EF3 `razorpay-webhook` | DB missing object | `DB_MIGRATION` | CRITICAL |
| R02 | `inventory_history` table | EF2 (via RPC), EF3 (via RPC) | DB missing object | `DB_MIGRATION` | CRITICAL |
| R03 | `confirm_paid_order()` RPC | EF2, EF3 | DB missing object | `DB_MIGRATION` | CRITICAL |
| R04 | `payments.updated_at` in RPC | EF2 (via RPC), EF3 (via RPC) | **Code wrong** — RPC assumes column exists, live DB has none | `CODE_FIX` | CRITICAL |
| R05 | `RAZORPAY_WEBHOOK_SECRET` env var | EF3 `razorpay-webhook` | Secret not configured | `CONFIG_FIX` | CRITICAL |
| R06 | Anon SELECT on `orders`, `customers`, `order_items`, `shipping_addresses` | Frontend (`orderService.ts`) | DB missing RLS policies; code assumes anon can read | `DB_MIGRATION` | HIGH |
| R07 | TypeScript `payments.Row.updated_at` | Types file | Types generated against reconciled schema, not live DB | `CODE_FIX` | LOW |
| R08 | `customers.phone` inserted as `""` vs `null` | EF1 `create-razorpay-order` | Code sends `""` instead of omitting/null | `CODE_FIX` | LOW |
| R09 | `product_id` as TEXT vs UUID in `order_items` | EF1, RPC | Live has TEXT; code and types expect string — actually compatible | ⬜ NO CHANGE | — |

---

## Database Objects: Forward Migration Required

All three missing objects must be created in a forward-only migration. The migration must be **idempotent** and must **only create objects that do not exist** — it must never assume or depend on any unapplied historical migration.

The existing forward migration `20260718000001_create_missing_objects.sql` contains a **bug**: the `confirm_paid_order` RPC at line 133 references `payments.updated_at`, which does not exist in the live database. This migration must be **replaced** with a corrected version.

### Required DB Changes

#### 1. `inventory_history` table
- **SQL:** `CREATE TABLE IF NOT EXISTS inventory_history (...)` — already in forward migration, no changes needed
- **RLS:** 1 policy for service_role INSERT, 1 for authenticated SELECT
- **Idempotent:** ✅ Already wrapped in `CREATE TABLE IF NOT EXISTS` and `DO $$` blocks

#### 2. `payment_events` table
- **SQL:** `CREATE TABLE IF NOT EXISTS payment_events (...)` — already in forward migration, no changes needed
- **RLS:** 1 policy for service_role ALL
- **Idempotent:** ✅ Already wrapped in `CREATE TABLE IF NOT EXISTS` and `DO $$` blocks

#### 3. `confirm_paid_order()` RPC
- **Bug in current forward migration:** `UPDATE payments SET ..., updated_at = now()` — `payments` has no `updated_at` column in live DB
- **Fix:** Remove `updated_at = now()` from the payments UPDATE. The `orders.updated_at = now()` is fine — `orders` HAS that column in live DB (migration `20260708000000`, line 108).

#### 4. (NEW) RLS policies for anon order confirmation lookup
- **Problem:** `orderService.ts` queries `orders`, `customers`, `order_items`, `shipping_addresses` using the Supabase anon key. All 4 tables have RLS enabled with **zero policies** (default-deny). The queries return `null`.
- **Fix:** Add minimal anon SELECT policies to these tables. The security model relies on opaque order numbers (`HOP-YYYYMMDD-XXXXXX`) for access control, since there is no customer authentication.
- **Alternative** (more secure, more code): Create an Edge Function `lookup-order` that uses service_role. The migration-only approach is chosen here for minimal code changes.

---

## Code Changes Required (Edge Functions)

### EF1: `create-razorpay-order` — `phone` as empty string

**File:** `supabase/functions/create-razorpay-order/index.ts:141`

**Live schema:** `customers.phone TEXT` (nullable)

**Current code:**
```typescript
phone: customer_phone ?? ""
```

**Problem:** Sends empty string `""` instead of `null` when no phone provided. The column is nullable (`TEXT` without `NOT NULL`) so this works at runtime, but stores semantically wrong data.

**Fix:** Send `null` when phone is not provided:
```typescript
phone: customer_phone ?? null
```

**Impact:** Low. No crash occurs. Only affects data quality.

---

### EF2: `verify-payment` — No code changes required

The function itself is structurally correct against the live schema. All failures are due to missing DB objects (R01, R02, R03) and the RPC bug (R04). Once the forward migration is fixed and applied, this function will work.

---

### EF3: `razorpay-webhook` — No code changes required

Same as EF2. All failures are DB/configuration-side.

---

## Code Changes Required (Frontend)

### `orderService.ts` — No code changes required after RLS policies added

Once the forward migration adds anon SELECT policies, `orderService.ts` will work. No code changes needed.

---

## Code Changes Required (TypeScript Types)

### `src/integrations/supabase/types.ts` — `payments.Row.updated_at`

**Current type:**
```typescript
payments: {
  Row: {
    ...
    updated_at: string   // <-- Does NOT exist in live DB
    ...
  }
}
```

**Live DB:** `payments` table has no `updated_at` column.

**Fix:** Remove `updated_at` from `payments.Row`:
```typescript
payments: {
  Row: {
    id: string
    order_id: string
    razorpay_payment_id: string | null
    razorpay_order_id: string | null
    amount: number
    currency: string
    status: Database["public"]["Enums"]["payment_transaction_status"]
    created_at: string
    // updated_at removed — does not exist in live schema
  }
}
```

Also verify that `payments.Insert` and `payments.Update` (which already omit `updated_at`) remain correct — they are.

**Impact:** Low. TypeScript errors would surface if any frontend code tried to access `payment.updated_at`, but no code currently does. This is a type-accuracy fix only.

---

## Configuration Changes Required

### Supabase Edge Function Secrets

| Secret | Status | Action |
|---|---|---|
| `RAZORPAY_KEY_ID` | ✅ Already set | None |
| `RAZORPAY_KEY_SECRET` | ✅ Already set | None |
| `RAZORPAY_WEBHOOK_SECRET` | ❌ Not set | **Must be added** via `supabase secrets set --env RAZORPAY_WEBHOOK_SECRET=<value>` |

### Supabase Auth Configuration

| Setting | Status | Action |
|---|---|---|
| SMTP provider | ❌ Not configured | Configure in Supabase dashboard → Auth → Settings |
| Redirect URLs | ❌ Not configured | Add to Auth → URL Configuration: `http://localhost:8080/studio/reset-password`, plus production URL |

---

## No-Change Dependencies (Already Compatible)

These dependencies were flagged in the static verification but are actually compatible with the live schema as-is:

| Dependency | Status | Rationale |
|---|---|---|
| `create-razorpay-order` pricing columns (`selling_price`, `name`, `status`) | ✅ Compatible | `products` table exists with these columns (pre-migration) |
| `generate_order_number()` RPC | ✅ Compatible | Exists in live DB |
| `order_items.product_id` as string → UUID cast | ✅ Compatible | Cast succeeds for valid UUID strings; FK constraint on products works |
| `razorpay_webhook` reads `req.text()` then `JSON.parse()` | ✅ Correct | Single body consumption — cannot call `req.json()` twice |
| `verify-payment` HMAC via `crypto.subtle` | ✅ Correct | Returns hex string, compared with `===` — timing-safe enough |
| `razorpay-webhook` signature verification | ✅ Correct | Uses `crypto.subtle` same as verify-payment (not `timingSafeEqual` — this was a misread in initial audit) |

---

## Summary: Change Checklist

### Database (Migration `20260718000001` — Must Be Fixed)

- [ ] Remove `updated_at = now()` from `payments` UPDATE in `confirm_paid_order` RPC
- [ ] Add anon SELECT policies on `orders`, `customers`, `order_items`, `shipping_addresses`
- [ ] Keep `inventory_history` table creation (already correct)
- [ ] Keep `payment_events` table creation (already correct)
- [ ] Keep `orders.updated_at = now()` in RPC (column exists in live DB)

### Code (Edge Functions)

- [ ] Fix `create-razorpay-order`: change `phone: customer_phone ?? ""` → `phone: customer_phone ?? null`

### Code (TypeScript Types)

- [ ] Remove `updated_at` from `payments.Row` in `src/integrations/supabase/types.ts`

### Configuration

- [ ] Add `RAZORPAY_WEBHOOK_SECRET` to Supabase Edge Function secrets
- [ ] Configure Supabase SMTP provider
- [ ] Add auth redirect URLs in Supabase dashboard

### Verification After Fixes

1. Deploy corrected `verify-payment` Edge Function
2. Deploy `razorpay-webhook` Edge Function
3. Run test payment: checkout → Razorpay modal → handler → `verify-payment` 200
4. Verify `orderService.fetchOrderConfirmation()` returns order data for anon users
5. Click through full order confirmation page rendering

---

*End of Code ↔ Schema Reconciliation Report*
