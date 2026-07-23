# House of Padmavati — Master Execution Plan

**Version:** 1.0  
**Status:** 🟡 Active  
**Last Updated:** 2026-07-18  
**Owner:** Staff Engineer  

---

## How to Use This Document

This is the **operating system** of the House of Padmavati project. It is not documentation. It is not a progress report. It is the definitive execution handbook.

**Every development session — human or AI — MUST begin by reading this file completely before doing anything else.**

This file encodes every architectural decision, every engineering rule, every quality standard, every incomplete task, and every blocker. Any engineer who reads this file understands the full state of the project without needing previous chat history.

**This file must always represent the current truth of the project.** After every completed task, update the relevant sections. Never leave the file stale.

---

## 01 — PROJECT IDENTITY

### What House of Padmavati Is

House of Padmavati is a direct-to-consumer e-commerce platform selling handloom sarees. It is a React single-page application backed by Supabase (PostgreSQL + Edge Functions + Auth) with Razorpay payment processing.

### Business Goals

- Enable customers to browse collections, view products, and complete purchases
- Provide a Studio (admin) interface for order management, product management, and inventory tracking
- Support guest checkout with Razorpay payment gateway
- Maintain an audit trail for all inventory movements and payment events

### Technical Goals

- Zero customer authentication — all orders are guest checkout
- All payment-sensitive operations go through Edge Functions (service_role)
- Studio admin access via Supabase Auth with `app_metadata.role === "admin"`
- Full idempotency on payment verification and webhook processing
- Server-side pricing only — client never computes order totals

### Long-Term Vision

- Achieve complete reconciliation between local migration history and remote database
- Eliminate all direct anon-key database access from the frontend
- Move every database write behind an Edge Function
- Achieve production-readiness where "deploy" means running `supabase db push` and `supabase functions deploy` with zero manual steps

### What Production-Ready Means

1. All 4 Edge Functions return 200 on success, 4xx on client error, 5xx only on infrastructure failure
2. Payment lifecycle completes end-to-end: checkout → Razorpay → verification → order confirmation
3. Studio displays correct order and payment status after every transaction
4. Inventory deduction is atomic and idempotent
5. No sensitive data (PII, payment IDs, internal IDs) is exposed to the anon role
6. Migration history is linear, clean, and fully applied
7. All tests pass (P0, P1, P2, P3)
8. The codebase is self-consistent — types match schema, functions match DB, frontend matches API

### Expected Quality Level

- Zero assumptions about the remote database state
- Every migration is idempotent and forward-only
- Every Edge Function validates input before processing
- Every error returns a clear, structured response
- Every RLS policy has a documented rationale
- Every architectural decision is recorded in the Decision Log

---

## 02 — PROJECT PHILOSOPHY

### Never Patch — Always Reconcile

When the code and database disagree, determine which is correct based on the live schema. Update code to match the database, or create a forward migration to add missing objects. Never apply band-aid fixes that assume a future migration will fix things.

**Why:** Patching creates technical debt. Reconciliation creates a clean foundation.

### Never Duplicate Logic

Business logic lives in exactly one place. Edge Functions are the single source of truth for payment processing. The database (via RPCs) is the single source of truth for inventory deduction. The frontend is the single source of truth for the UI state machine.

**Why:** Duplicated logic diverges over time. When one copy changes, the other becomes a bug.

### Prefer Architecture Over Shortcuts

Replacing direct database access with an Edge Function is architecture. Adding an anon RLS policy is a shortcut. Always choose the architectural solution, even if it takes longer.

**Why:** Shortcuts accumulate until the system is unmaintainable. Architecture scales.

### Prefer Maintainability Over Speed

Write code that the next engineer can understand without asking you. Use clear interfaces. Document why, not what. Follow existing conventions exactly.

**Why:** Speed today creates slow tomorrows. Maintainable code is fast to change.

### Prefer Correctness Over Assumptions

Never assume what the database looks like. Inspect it. Never assume a migration was applied. Check `supabase_migrations.schema_migrations`. Never assume a column exists. Read the schema.

**Why:** Assumptions are the primary source of production bugs in this project.

### Never Weaken Security

RLS is default-deny for a reason. Anon role never touches commerce tables. Payment data flows through service_role only. Endpoint validation is not optional.

**Why:** E-commerce platforms handle real money and real customer data. A breach is existential.

### Never Break Existing Functionality

Every change must be verified against the existing payment flow. If a working Edge Function exists, don't change it unless the change is backward-compatible. If a frontend route works, don't break it.

**Why:** Broken payments lose revenue. Broken UX loses customers.

---

## 03 — PROJECT STATUS

| Domain | Status | Progress | Owner | Last Updated | Blockers |
|---|---|---|---|---|---|
| Frontend — Storefront | ✅ Stable | 100% | Engineering | 2026-07-18 | None |
| Frontend — Studio | ✅ Stable | 100% | Engineering | 2026-07-18 | None |
| Frontend — Checkout | ✅ Implemented (untested end-to-end) | 90% | Engineering | 2026-07-18 | Payment flow blocked by DB |
| Backend — Edge Functions (create-razorpay-order) | ✅ Working | 100% | Engineering | 2026-07-18 | None |
| Backend — Edge Functions (verify-payment) | ❌ Blocked | 80% | Engineering | 2026-07-18 | Missing DB objects |
| Backend — Edge Functions (razorpay-webhook) | ❌ Blocked | 70% | Engineering | 2026-07-18 | Missing DB objects + missing secret |
| Backend — Edge Functions (get-order-confirmation) | ✅ Implemented (undeployed) | 100% | Engineering | 2026-07-18 | Pending migration + deploy |
| Database — Schema | ⚠ Partial | 60% | Engineering | 2026-07-18 | 13/14 migrations unapplied |
| Database — RLS | ⚠ Default-deny only | 40% | Engineering | 2026-07-18 | Products/collections RLS unknown |
| Authentication — Studio | ✅ Working | 100% | Engineering | 2026-07-18 | SMTP + redirect URLs not configured |
| Authentication — Customer | ⬜ Not implemented | 0% | Engineering | 2026-07-18 | By design (guest checkout) |
| Payments — Integration | ⚠ Partial | 70% | Engineering | 2026-07-18 | verify-payment broken + webhook pending |
| Payments — Razorpay | ✅ Configured | 100% | Engineering | 2026-07-18 | None |
| Orders — Creation | ✅ Working | 100% | Engineering | 2026-07-18 | None |
| Orders — Confirmation | ⚜ Migrated to Edge Function | 100% | Engineering | 2026-07-18 | Pending deploy |
| Inventory — Tracking | ❌ Not connected | 20% | Engineering | 2026-07-18 | Missing inventory_history table + RPC |
| Storage — Product Images | ⬜ Unknown | 0% | Engineering | 2026-07-18 | Not audited |
| Studio — Dashboard | ✅ Working | 100% | Engineering | 2026-07-18 | None |
| Studio — Orders | ✅ Working | 100% | Engineering | 2026-07-18 | None |
| Studio — Products | ✅ Working | 100% | Engineering | 2026-07-18 | None |
| Studio — Collections | ✅ Working | 100% | Engineering | 2026-07-18 | None |
| Studio — Inventory | ❌ Not working | 0% | Engineering | 2026-07-18 | No inventory table wired |
| Deployment — Edge Functions | ⚠ Partial | 60% | Engineering | 2026-07-18 | 2 functions not deployed |
| Deployment — Migrations | ❌ Blocked | 0% | Engineering | 2026-07-18 | Requires migration repair first |
| Testing — P0 | ❌ Not executed | 0% | Engineering | 2026-07-18 | Blocked on migration execution |
| Testing — P1 | ❌ Not executed | 0% | Engineering | 2026-07-18 | Blocked on P0 |
| Testing — P2 | ❌ Not executed | 0% | Engineering | 2026-07-18 | Blocked on P0 |
| Testing — P3 | ❌ Not executed | 0% | Engineering | 2026-07-18 | Blocked on P0 |

---

## 04 — CURRENT EXECUTION PHASE

### Phase: Backend Reconciliation

This is the ONLY active phase. No feature work is permitted until this phase is signed off.

**Why this phase exists:**

The project has 14 local migration files, but only 1 (`20260708000000_create_orders_schema.sql`) was ever applied to the Supabase project. The remaining 13 migrations were written locally but never pushed. This has created a chasm between what the code expects and what the database actually has:

- Edge Functions reference tables (`payment_events`, `inventory_history`) that do not exist
- Edge Functions reference RPCs (`confirm_paid_order`) that do not exist
- The forward migration (`20260718000001`) initially referenced columns (`payments.updated_at`) that do not exist in the live schema
- The frontend queried commerce tables directly with the anon key, blocked by RLS default-deny
- Migration history cannot be cleanly linearized without `supabase migration repair`

Every issue discovered during this phase is catalogued and resolved before the next phase begins.

**When this phase ends:**

When all four Edge Functions are deployable and return correct responses against the live database. When the migration history is clean. When the frontend no longer accesses commerce tables directly. When P0 tests pass.

---

## 05 — CURRENT OBJECTIVE

### Objective: Execute Migration Repair + Forward Migration

**Purpose:** Bring the remote database schema into alignment with the codebase by:
1. Marking blocking migrations as applied (migration repair)
2. Applying the corrected forward migration (`20260718000001`) which creates `payment_events`, `inventory_history`, and `confirm_paid_order`
3. Deploying `verify-payment`, `razorpay-webhook`, and `get-order-confirmation` Edge Functions
4. Running P0 tests to verify the payment lifecycle end-to-end

**Expected outcome:**
- `payment_events` table exists in remote DB
- `inventory_history` table exists in remote DB
- `confirm_paid_order()` RPC exists and is callable
- `verify-payment` returns HTTP 200 for valid payments
- Razorpay modal → handler → verify-payment → order confirmation completes end-to-end
- Order confirmation page renders data from the Edge Function

**Dependencies:**
- Sign-off on the reconciliation audit (complete)
- Sign-off on the code-schema reconciliation (complete)
- Sign-off on the secure order confirmation architecture (complete)
- Execution of `supabase migration repair` commands (pending)
- Execution of `supabase db push` (pending)
- Deployment of Edge Functions (pending)

**Completion criteria:**
- P0 tests T1–T6 all pass
- P1 tests T7–T11 all pass
- No new issues discovered
- All existing checks in Verification Checklist are green

---

## 06 — ENGINEERING RULES

These rules are law. Every engineer working on this project must follow them.

### Rule 1: Never Weaken RLS
RLS is default-deny on all commerce tables. No anon role select policies on `orders`, `customers`, `order_items`, `shipping_addresses`, `payments`, or `payment_events`. All data access goes through Edge Functions using service_role.

**Why:** E-commerce data is sensitive. Exposing order or customer data to the anon role creates a data leakage vulnerability. The frontend should never need direct table access.

### Rule 2: Never Expose Sensitive Data
Edge Functions must never return internal IDs, customer PII (email, phone, full name), payment gateway IDs, or internal notes unless required by the UI and approved in the security model.

**Why:** Every field returned by an Edge Function is a potential data leak. Default to returning nothing; add fields only when the UI explicitly needs them.

### Rule 3: Never Bypass Edge Functions
Frontend code must never use `supabase.from()` to read or write commerce tables (`orders`, `payments`, `customers`, `shipping_addresses`, `order_items`, `payment_events`, `inventory_history`). All commerce operations go through Edge Functions.

**Why:** Edge Functions enforce server-side validation, use service_role, and prevent anon-role data access. Direct frontend access bypasses all of this.

### Rule 4: Never Rewrite Migration History
Migrations are immutable once created. Never delete, edit, or reorder existing migration files. Use `supabase migration repair` to mark migrations as applied when the schema already matches. Use new forward migrations to add missing objects.

**Why:** Migration history must be linear and traceable. Editing past migrations makes it impossible to reproduce the database state from scratch.

### Rule 5: Always Inspect the Live Schema
Before writing any code that touches the database, verify the actual schema in the Supabase project. Use `supabase db pull` or query `information_schema.columns`. Never assume a column exists because a migration file says so.

**Why:** The remote database may not match local migration history. This project is proof — 13 of 14 migrations were never applied. Assumptions create production bugs.

### Rule 6: Always Reconcile Code with Database
When code and schema disagree, determine the correct fix:
- If the code assumes a column that doesn't exist in live DB → remove the reference (code matches reality)
- If the DB is missing an entire table/RPC → create a forward migration (DB catches up to code)

**Why:** This prevents the "works on my machine" problem. The code must work against the actual production database.

### Rule 7: Always Write Forward Migrations
Every database change must be a new migration file. Never modify existing migration files (see Rule 4). Every migration must be idempotent (`CREATE TABLE IF NOT EXISTS`, `DO $$` blocks for policies).

**Why:** Forward migrations can be applied safely at any time. They don't depend on the order of previous migrations.

### Rule 8: Always Update Documentation After Every Task
After completing any task, update the relevant sections of `01_MASTER_EXECUTION_PLAN.md`. Update the decision log if any architectural decisions were made. Update the changelog.

**Why:** This file is the project operating system. Stale documentation causes downstream work to be based on incorrect assumptions.

### Rule 9: Always Verify Before Continuing
Every task has a definition of done. Every definition of done includes verification steps. Never mark a task complete without running verification. Never start the next task before the current one passes verification.

**Why:** Unverified work is untrusted work. Stacking unverified tasks creates a pile of unknown quality that must eventually be untangled.

### Rule 10: Never Leave the Project in an Inconsistent State
If a task cannot be completed, the project must be left in a state where another engineer can pick it up. Update the status, document what was attempted, explain why it failed, and suggest next steps.

**Why:** Half-finished work is worse than no work. It creates confusion and blocks other engineers.

---

## 07 — SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Browser (SPA)                          │
│  React 18 + Vite + TanStack Query + React Router            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pages                                               │   │
│  │  Index, Category, ProductDetail, Cart, Checkout,     │   │
│  │  OrderConfirmation, Collections, Journal, About      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Studio (Admin)                                      │   │
│  │  Login, Dashboard, Orders, Products, Collections,    │   │
│  │  Inventory, Customers, Journal, Media, Settings      │   │
│  │  AuthGuard wraps all routes — requires admin role    │   │
│  └─────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
          ▼                         ▼
┌──────────────────┐    ┌──────────────────────────┐
│ Supabase Client  │    │  supabase.functions      │
│ (anon key)       │    │  .invoke()               │
│                  │    │                          │
│ Read-only:       │    │  Edge Functions:         │
│  products        │    │  create-razorpay-order   │
│  product_images  │    │  verify-payment          │
│  collections     │    │  razorpay-webhook        │
│                  │    │  get-order-confirmation  │
│ NEVER:           │    │                          │
│  orders          │    │  All use service_role    │
│  payments        │    │  All validate input      │
│  customers       │    │  All return safe fields  │
│  order_items     │    └──────────────────────────┘
│  payment_events  │
│  inventory_history│
└──────────────────┘
```

### Responsibilities

| Layer | Responsibility |
|---|---|
| **Browser** | UI rendering, client-side validation, TanStack Query cache, Razorpay SDK loading |
| **Supabase Client (anon)** | Read product/category data for storefront. Studio admin auth. Invoke Edge Functions. |
| **Edge Functions** | All payment operations. All order reads for customers. All sensitive operations. Run in Deno. Use service_role. |
| **Database** | Data persistence, RLS enforcement, RPCs for atomic operations, enum validation, audit triggers |
| **Storage** | Product images, collection hero images, HOP-films video content. Public read, admin write. |
| **Razorpay** | Payment order creation, payment capture, webhook events |

### Why Each Layer Exists

- **Edge Functions** exist because payment operations must run in a trusted server context (service_role) that bypasses RLS. The browser's anon key should never touch `payments` or `orders` tables.
- **RLS default-deny** exists because without customer auth, there is no way to identify the browser user. The safest default is to deny everything.
- **RPCs (confirm_paid_order)** exist because inventory deduction requires atomicity. The RPC locks the payment row (`SELECT FOR UPDATE`), updates order status, and deducts inventory in a single transaction.
- **Supabase Auth (admin only)** exists because the Studio is an internal tool. Customer auth was deliberately excluded to simplify the checkout flow.

### Data Flow: Payment Lifecycle

```
Checkout Page
  │
  ├─ handleSubmit → Edge Function: create-razorpay-order
  │     │
  │     ├─ Validate products, compute pricing (server-side)
  │     ├─ Upsert customer by email
  │     ├─ Create shipping address
  │     ├─ Generate order number (HOP-YYYYMMDD-XXXXXX)
  │     ├─ Insert order (status=pending_payment, payment_status=pending)
  │     ├─ Insert order items (snapshot product name, price, image)
  │     └─ Create Razorpay Order via API → Return razorpay_order_id
  │
  ├─ Load Razorpay SDK → Open checkout modal
  │
  ├─ User completes payment in Razorpay UI
  │
  ├─ Razorpay handler fires → Edge Function: verify-payment
  │     │
  │     ├─ HMAC-SHA256 signature verification
  │     ├─ Idempotency check via payment_events table
  │     ├─ Call confirm_paid_order RPC
  │     │     ├─ LOCK payments row FOR UPDATE
  │     │     ├─ Mark payment as paid
  │     │     ├─ Mark order as confirmed
  │     │     ├─ Deduct inventory per item (GREATEST(0, ...))
  │     │     └─ Record in inventory_history
  │     └─ Record payment_events entry
  │
  ├─ Navigate to /order/confirmation/:orderNumber
  │
  └─ OrderConfirmation → Edge Function: get-order-confirmation
        │
        ├─ Validate order_number format
        ├─ Fetch order (service_role)
        ├─ Fetch shipping_address (city, state, postal_code)
        ├─ Fetch order_items with product estimated_dispatch_days
        └─ Return 16 safe fields (no IDs, no PII, no payment data)
```

**Fallback path:** Razorpay webhook (`razorpay-webhook` Edge Function) processes `payment.captured` events if the frontend verification fails. Idempotency ensures no double-processing.

---

## 08 — SOURCE OF TRUTH

| Domain | Source of Truth | Location | Notes |
|---|---|---|---|
| **Architecture decisions** | This file (`01_MASTER_EXECUTION_PLAN.md`) | `docs/` | Every decision recorded in Decision Log |
| **Business logic** | Edge Functions | `supabase/functions/*/index.ts` | Payment logic, order creation, confirmation |
| **Database schema** | Migration files | `supabase/migrations/` | Each migration is the authoritative DDL for its objects |
| **Live database state** | `information_schema` + `supabase_migrations.schema_migrations` | Remote Supabase project | Always verify against this, not local migration files |
| **TypeScript types** | `src/integrations/supabase/types.ts` | Generated by `supabase gen types` | Must match the LIVE schema, not local migrations |
| **Environment variables** | `.env` (local) + Supabase dashboard (prod) | Root + Dashboard | `.env.example` should be created for onboarding |
| **Supabase configuration** | `supabase/config.toml` | `supabase/` | Currently minimal — needs expansion |
| **Frontend service layer** | `src/services/*.ts` | `src/services/` | Wraps Edge Function calls and Supabase queries |
| **Payment state machine** | `src/hooks/usePayment.ts` | `src/hooks/` | React hook managing payment flow states |
| **Cart state** | `src/contexts/CartContext.tsx` | `src/contexts/` | Reducer + localStorage persistence |
| **Studio auth** | `src/studio/services/authService.ts` | `src/studio/` | Wraps Supabase Auth for admin login |

### Competing Sources of Truth — Resolved

| Conflict | Resolution |
|---|---|
| `payments.updated_at` in types vs no column in live DB | ✅ Removed from types. Code must match live schema. |
| Anonymous RLS policies vs default-deny | ✅ Policies rejected. Edge Function architecture adopted. |
| 14 migrations vs 1 applied | 🔄 Forward migration + migration repair in progress. |

---

## 09 — CURRENT KNOWN ISSUES

### Critical

| ID | Description | Severity | Root Cause | Files | Resolution | Status |
|---|---|---|---|---|---|---|
| C001 | `payment_events` table does not exist in remote DB | CRITICAL | Migration `20260717000000` never applied | `verify-payment/index.ts`, `razorpay-webhook/index.ts`, `20260718000001_create_missing_objects.sql` | Forward migration `20260718000001` creates this table | 🔄 Fix created |
| C002 | `confirm_paid_order` RPC does not exist in remote DB | CRITICAL | Migration `20260718000000` never applied | `verify-payment/index.ts`, `razorpay-webhook/index.ts`, `20260718000001_create_missing_objects.sql` | Forward migration `20260718000001` creates this RPC | 🔄 Fix created |
| C003 | `inventory_history` table does not exist in remote DB | CRITICAL | Migration `20260713000000` never applied | `20260718000001_create_missing_objects.sql`, `confirm_paid_order` RPC | Forward migration `20260718000001` creates this table | 🔄 Fix created |
| C004 | `verify-payment` returns 500 | CRITICAL | Depends on C001, C002, C003 — missing objects cause crash | `verify-payment/index.ts` | Apply forward migration, then deploy | 🔄 Blocked |
| C005 | `razorpay-webhook` cannot function | CRITICAL | Depends on C001, C002, C003 + missing `RAZORPAY_WEBHOOK_SECRET` env var | `razorpay-webhook/index.ts` | Apply forward migration + set secret | 🔄 Blocked |
| C006 | `confirm_paid_order` RPC references `payments.updated_at` which doesn't exist in live DB | CRITICAL | RPC was copied from `20260718000000` which assumes a column from `20260708000000` that was never created on `payments` | `20260718000001_create_missing_objects.sql` | ✅ Removed `updated_at = now()` from payments UPDATE. `orders.updated_at` is fine (column exists). | ✅ FIXED |

### High

| ID | Description | Severity | Root Cause | Files | Resolution | Status |
|---|---|---|---|---|---|---|
| H001 | Migration history mismatch — 13/14 migrations unapplied | HIGH | Local dev vs production drift | `supabase/migrations/` | `supabase migration repair` + `db push` | 🔄 Pending execution |
| H002 | `RAZORPAY_WEBHOOK_SECRET` not configured | HIGH | Never set up | Supabase Dashboard | Add via `supabase secrets set` | 🔄 Pending |
| H003 | Supabase redirect URLs not configured | HIGH | Never set up | Supabase Dashboard → Auth → URL Configuration | Add URLs for password reset flow | 🔄 Pending |
| H004 | Supabase SMTP not configured | HIGH | Never set up | Supabase Dashboard → Auth → Settings | Configure SMTP provider | 🔄 Pending |
| H005 | `VITE_APP_URL` hardcoded to localhost | HIGH | Dev-only value in `.env` | `.env` | Must be updated per deployment environment | 🔄 Pending |

### Medium

| ID | Description | Severity | Root Cause | Files | Resolution | Status |
|---|---|---|---|---|---|---|
| M001 | `20260716000000_harden_studio_admin_policies.sql` never applied | MEDIUM | Migration not pushed | `20260716000000_harden_studio_admin_policies.sql` | Determine if schema matches; repair or forward migrate | 🔄 Pending review |
| M002 | Products/collections workspace tables not in migration history | MEDIUM | Created outside migration system | N/A | Verify schema; document in RLS audit; repair missing migrations | 🔄 Pending review |
| M003 | `products`, `product_images`, `collections` RLS state unknown | MEDIUM | Tables pre-date migration system | N/A | Run RLS audit query on remote DB | ⬜ Not started |
| M004 | Storage buckets not documented | MEDIUM | Never audited | N/A | Inventory buckets, verify policies | ⬜ Not started |
| M005 | `supabase/config.toml` minimal | MEDIUM | Never expanded | `supabase/config.toml` | Add function, auth, storage sections | ⬜ Not started |

### Low

| ID | Description | Severity | Root Cause | Files | Resolution | Status |
|---|---|---|---|---|---|---|
| L001 | `create-razorpay-order` has code quality issues | LOW | Accumulated during development | `create-razorpay-order/index.ts` | Remove unused imports, fix status types | ⬜ Not started |
| L002 | Temporary debug logs in `verify-payment` | LOW | Added for diagnosis | `verify-payment/index.ts` | Remove STEP 1–STEP 6 markers after fix | ⬜ Not started |
| L003 | No `import_map.json` for Edge Functions | LOW | Never set up | `supabase/functions/` | Create centralized config | ⬜ Not started |
| L004 | No `.env.example` | LOW | Never created | Root | Create for onboarding | ⬜ Not started |

---

## 10 — CURRENT TASK

### Task ID: T-EXECUTE-MIGRATIONS

**Goal:** Execute migration repair and forward migration to align remote database with codebase expectations. Then deploy Edge Functions and verify the payment lifecycle.

**Files involved:**
- `supabase/migrations/20260718000001_create_missing_objects.sql` — forward migration (corrected)
- `supabase/functions/verify-payment/index.ts` — deploy after migration (has debug logs)
- `supabase/functions/razorpay-webhook/index.ts` — deploy after migration
- `supabase/functions/get-order-confirmation/index.ts` — deploy after migration

**Expected output:**
1. `payment_events` table exists in remote
2. `inventory_history` table exists in remote
3. `confirm_paid_order()` RPC exists and is callable
4. All 4 Edge Functions deployed and responding
5. P0 tests T1–T6 pass

**Dependencies:**
- [ ] Sign-off on reconciliation audit (✅ Complete)
- [ ] Sign-off on code-schema reconciliation (✅ Complete)
- [ ] Sign-off on secure order confirmation architecture (✅ Complete)
- [ ] `supabase migration repair --status applied 20260706000001`
- [ ] `supabase migration repair --status applied 20260713000000`
- [ ] `supabase migration repair --status applied 20260717000000`
- [ ] `supabase migration repair --status applied 20260718000000`
- [ ] `supabase db push --project-ref kbvjmcnaaogkbnerjcoc`
- [ ] `supabase functions deploy verify-payment`
- [ ] `supabase functions deploy razorpay-webhook`
- [ ] `supabase functions deploy get-order-confirmation`
- [ ] `supabase secrets set RAZORPAY_WEBHOOK_SECRET=<value>`

**Definition of Done:**
- [ ] `supabase migration list` shows clean linear history
- [ ] `verify-payment` returns HTTP 200 for valid test payment
- [ ] Browser test: checkout → Razorpay modal → payment → redirect to confirmation page
- [ ] Order confirmation page renders with data from Edge Function
- [ ] Studio shows `payment_status = paid`, `status = confirmed`
- [ ] Idempotency test: duplicate `verify-payment` returns `already_processed: true`
- [ ] `get-order-confirmation` returns HTTP 404 for non-existent order
- [ ] `get-order-confirmation` returns HTTP 400 for invalid input
- [ ] Response from `get-order-confirmation` contains no sensitive fields

---

## 11 — NEXT TASK QUEUE

| Priority | Task ID | Description | Depends On | Estimated Effort |
|---|---|---|---|---|
| 1 | T-DEPLOY-WEBHOOK | Deploy `razorpay-webhook`, register in Razorpay dashboard, send test event | T-EXECUTE-MIGRATIONS | 2 hours |
| 2 | T-VERIFY-INVENTORY | Verify inventory deduction after successful payment. Check `inventory_history` entries | T-EXECUTE-MIGRATIONS | 1 hour |
| 3 | T-CONFIGURE-AUTH | Configure Supabase SMTP + redirect URLs. Test forgot password flow | None | 1 hour |
| 4 | T-AUDIT-STORAGE | Inventory storage buckets. Verify product images load. Document policies | None | 1 hour |
| 5 | T-AUDIT-RLS | Query RLS on all tables. Document in RLS matrix. Forward migrate hardening policies if needed | T-EXECUTE-MIGRATIONS | 2 hours |
| 6 | T-EXPAND-CONFIG | Expand `supabase/config.toml` with function, auth, storage sections | None | 1 hour |
| 7 | T-CLEANUP-LOGS | Remove temporary debug logs from `verify-payment` | T-EXECUTE-MIGRATIONS | 30 min |
| 8 | T-CLEANUP-CODE | Fix `create-razorpay-order` code quality issues | None | 30 min |
| 9 | T-ADD-ENV-GUARDS | Add runtime checks for `Deno.env.get()` across all Edge Functions | None | 1 hour |
| 10 | T-CREATE-ENV-EXAMPLE | Create `.env.example` with documented variables | None | 15 min |

---

## 12 — DEVELOPMENT WORKFLOW

Every task follows this exact workflow:

```
  1. READ MASTER PLAN
     │
     │  Read 01_MASTER_EXECUTION_PLAN.md from start to finish.
     │  Understand the current phase, current task, and all blockers.
     │
     ▼
  2. UNDERSTAND CURRENT TASK
     │
     │  Read the CURRENT TASK section.
     │  Read the CURRENT OBJECTIVE section.
     │  Understand what success looks like.
     │  Understand what "done" means.
     │
     ▼
  3. ANALYZE
     │
     │  Read all relevant files.
     │  Read the live database schema if DB work is involved.
     │  Identify all dependencies.
     │  Identify all risks.
     │  Identify all edge cases.
     │  Do NOT write code yet.
     │
     ▼
  4. DESIGN
     │
     │  Plan the implementation in detail.
     │  Document the approach in the task.
     │  Verify the approach against all Engineering Rules.
     │  Verify the approach against all architectural decisions.
     │
     ▼
  5. IMPLEMENT
     │
     │  Write code.
     │  Follow existing conventions exactly.
     │  Match the live schema, not local assumptions.
     │  Never weaken security.
     │  Never duplicate logic.
     │
     ▼
  6. VERIFY
     │
     │  Static analysis: TypeScript compiles without errors.
     │  Code review: Does the code follow all Engineering Rules?
     │  Schema check: Does the code match the live database schema?
     │  Security check: Does this change expose any data?
     │  Architecture check: Does this change follow the documented architecture?
     │
     ▼
  7. TEST
     │
     │  Run P0 tests if applicable.
     │  Run P1 tests if applicable.
     │  Run unit tests if applicable.
     │  Every test must return PASS or FAIL.
     │  Record results.
     │
     ▼
  8. UPDATE DOCUMENTATION
     │
     │  Update 01_MASTER_EXECUTION_PLAN.md:
     │    - Update PROJECT STATUS table
     │    - Update CURRENT TASK to next task
     │    - Update CURRENT KNOWN ISSUES (resolve or add)
     │    - Add to CHANGE LOG
     │    - Add to DECISION LOG if any decisions were made
     │
     ▼
  9. MARK COMPLETE
     │
     │  Mark the task as complete in the task queue.
     │  Move NEXT TASK to CURRENT TASK.
     │
     ▼
  10. START NEXT TASK
      │
      │  Return to step 1.
      ▼
```

### Workflow Rules

- **Never skip steps.** Every task goes through all 10 steps. Skipping ANALYZE leads to incorrect implementations. Skipping VERIFY leads to undetected bugs.
- **Never start a task without a completed DESIGN.** Writing code without a plan leads to rework. The design can be a few paragraphs, but it must exist.
- **Never mark a task complete without testing.** If tests cannot run (e.g., blocked on deployment), document why and what tests are needed. Do not mark it done.
- **If blocked, document the blocker.** Update the project status. Update the current task. Explain what's needed to unblock.

---

## 13 — TESTING FRAMEWORK

### Test Priority Levels

| Level | When Required | Who Runs |
|---|---|---|
| **P0 — Critical** | Before any deployment. Blocking payments. | Every change to payment flow |
| **P1 — High** | Before feature completion. | Every change to order/inventory system |
| **P2 — Medium** | Before release. | Auth, config, RLS changes |
| **P3 — Low** | Housekeeping. | Code quality, documentation, config expansion |

### P0 Tests

| ID | Test | Method | Expected |
|---|---|---|---|
| T1 | Migration repair + forward migration | `supabase migration repair` + `supabase db push` | Clean history, objects created |
| T2 | Deploy `verify-payment` | `supabase functions deploy verify-payment` | Success |
| T2b | Deploy `get-order-confirmation` | `supabase functions deploy get-order-confirmation` | Success |
| T3 | End-to-end test payment | Browser + DevTools | Razorpay modal → handler → 200 → redirect to confirmation |
| T4 | Verify Studio order status | `/studio/orders` | `payment_status = paid`, `status = confirmed` |
| T5 | Verify confirmation page | `/order/confirmation/:number` | Renders via Edge Function data |
| T6 | Idempotency test | Re-invoke `verify-payment` with same params | `already_processed: true` |

### P1 Tests

| ID | Test | Method | Expected |
|---|---|---|---|
| T7 | Deploy `razorpay-webhook` | `supabase functions deploy razorpay-webhook` | Success |
| T8 | Register webhook in Razorpay dashboard | Dashboard → Settings → Webhooks | Events added |
| T9 | Send test webhook event | Razorpay test dashboard | `payment_events` entry created |
| T10 | Verify inventory deduction | SQL: `SELECT stock FROM products` | Stock decreased |
| T11 | Verify inventory_history | SQL: `SELECT * FROM inventory_history` | Entry created |

### P2 Tests

| ID | Test | Method | Expected |
|---|---|---|---|
| T12 | Forgot password end-to-end | Trigger email → reset | Password updated |
| T13 | Expired recovery link | Access without valid hash | Error message |
| T14 | Redirect URLs | Configure + test | Lands on correct page |
| T15 | RLS audit | SQL on each table | Policies documented |
| T16 | Products/collections RLS | SQL | Public read, admin write |
| T17 | get-order-confirmation invalid input | Send empty/malformed body | HTTP 400 |
| T18 | get-order-confirmation missing order | Non-existent order number | HTTP 404 |
| T19 | get-order-confirmation sensitive field audit | Inspect JSON response | No IDs/emails/phone/payment data |
| T20 | Direct DB access blocked | Browser console | RLS prevents anon reads |

### P3 Tests

| ID | Test | Method | Expected |
|---|---|---|---|
| T21 | Remove debug logs | Edit + redeploy verify-payment | Clean logs |
| T22 | Fix code quality | Lint create-razorpay-order | Clean |
| T23 | Standardize HMAC | Verify both functions match | Consistent |
| T24 | Add import_map.json | Create file | Dependencies centralized |
| T25 | Expand config.toml | Add sections | Complete |
| T26 | Add env var guards | All Edge Functions | Clear error on missing var |
| T27 | Add request validation | All Edge Functions | 400 on malformed input |

---

## 14 — SECURITY MODEL

### Layer 1: Supabase Auth

| Component | Role | Access |
|---|---|---|
| Supabase client (browser) | `anon` | Read products, collections, product_images. Invoke Edge Functions. |
| Supabase client (Studio) | `authenticated` + admin check | Studio routes after login. RLS enforced. |
| Edge Functions | `service_role` | Bypasses RLS. Full database access. |

### Layer 2: Row-Level Security

| Table | RLS | Anon | Authenticated | Service Role |
|---|---|---|---|---|
| `orders` | ✅ ENABLED | DENY | DENY | BYPASS |
| `customers` | ✅ ENABLED | DENY | DENY | BYPASS |
| `order_items` | ✅ ENABLED | DENY | DENY | BYPASS |
| `shipping_addresses` | ✅ ENABLED | DENY | DENY | BYPASS |
| `payments` | ✅ ENABLED | DENY | DENY | BYPASS |
| `products` | ⬜ Unknown | Unknown | Unknown | BYPASS |
| `product_images` | ⬜ Unknown | Unknown | Unknown | BYPASS |
| `collections` | ⬜ Unknown | Unknown | Unknown | BYPASS |
| `payment_events` | ✅ ENABLED (pending) | DENY | DENY | BYPASS |
| `inventory_history` | ✅ ENABLED (pending) | DENY | DENY | BYPASS |

### Layer 3: Edge Functions

Every Edge Function:
- Uses `service_role` client (bypasses RLS)
- Validates input before processing
- Returns safe fields only (no IDs, PII, payment data to anon)
- Has CORS headers for browser access

### Layer 4: Secrets Management

| Secret | Location | Scope |
|---|---|---|
| `SUPABASE_URL` | Supabase runtime | All Edge Functions |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase runtime | All Edge Functions |
| `RAZORPAY_KEY_ID` | Supabase secrets | `create-razorpay-order` |
| `RAZORPAY_KEY_SECRET` | Supabase secrets | `create-razorpay-order`, `verify-payment` |
| `RAZORPAY_WEBHOOK_SECRET` | Supabase secrets | `razorpay-webhook` (❌ NOT SET) |
| `VITE_SUPABASE_URL` | `.env` / Vite | Frontend |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `.env` / Vite | Frontend (anon key — safe to expose) |
| `VITE_APP_URL` | `.env` / Vite | Frontend (for auth redirect URLs) |

### Security Principles

1. **Service role is a privilege, not a default.** Edge Functions that don't need service_role should use the anon key.
2. **Fail closed.** If a secret is missing, the function returns 500, not a partial response.
3. **Never return IDs that can be enumerated.** Order numbers are opaque (`HOP-YYYYMMDD-XXXXXX`) but sequential. This is acceptable for guest checkout but should be replaced with UUIDs if enumeration becomes a concern.
4. **Input validation is not optional.** Every Edge Function validates every user-supplied field before using it.

---

## 15 — PRODUCTION READINESS CHECKLIST

### Database

- [ ] `payment_events` table exists with correct schema
- [ ] `inventory_history` table exists with correct schema
- [ ] `confirm_paid_order()` RPC exists and returns JSONB
- [ ] `supabase_migrations.schema_migrations` shows clean linear history
- [ ] No anonymous RLS policies on commerce tables
- [ ] All table RLS policies documented and verified

### Edge Functions

- [ ] `verify-payment` returns HTTP 200, 400, 200 (already_processed)
- [ ] `razorpay-webhook` returns HTTP 200 for valid events, 400 for invalid signature
- [ ] `get-order-confirmation` returns HTTP 200 (valid), 404 (missing), 400 (invalid)
- [ ] `create-razorpay-order` has no known bugs
- [ ] All functions have input validation
- [ ] All functions have env var guards
- [ ] All temporary debug logs removed

### Payments

- [ ] Razorpay order created → payment verified → order confirmed (end-to-end)
- [ ] Studio displays `payment_status = paid` and `status = confirmed`
- [ ] Order confirmation page renders via Edge Function
- [ ] Idempotent on duplicate verify-payment calls
- [ ] Webhook processes `payment.captured` events
- [ ] Webhook processes `payment.failed` events

### Inventory

- [ ] Stock deducted on payment confirmation
- [ ] `inventory_history` entries created for every sale
- [ ] Negative stock prevented or handled gracefully

### Authentication

- [ ] Studio login works for admin users
- [ ] Non-admin users blocked
- [ ] Forgot password flow works end-to-end
- [ ] SMTP configured for sending emails
- [ ] Redirect URLs configured in Supabase dashboard

### Storage

- [ ] Product images load on storefront
- [ ] Bucket policies restrict write to admin role
- [ ] Public read works for storefront

### Testing

- [ ] All P0 tests pass
- [ ] All P1 tests pass
- [ ] All P2 tests pass

### Deployment

- [ ] `supabase config.toml` has all required sections
- [ ] All Edge Functions deployed
- [ ] Webhook registered in Razorpay dashboard
- [ ] Secrets set in Supabase dashboard

### Security

- [ ] No anon role access to commerce tables
- [ ] No sensitive data in Edge Function responses
- [ ] No credentials in frontend code
- [ ] RLS enabled on all tables
- [ ] `RAZORPAY_WEBHOOK_SECRET` configured

---

## 16 — DECISION LOG

Every architectural decision is recorded here permanently.

| ID | Decision | Reason | Date | Impact | Approved By |
|---|---|---|---|---|---|
| D001 | Guest checkout only. No customer auth. | Simplify checkout flow. Customers pay via Razorpay without account. | 2026-07-18 | No customer session. RLS cannot use `auth.uid()` for commerce tables. Order confirmation uses Edge Function. | Engineering |
| D002 | Default-deny RLS on all commerce tables | Without customer auth, there is no way to identify the browser user. Deny is the safest default. | 2026-07-18 | All frontend commerce data access must go through Edge Functions with service_role. | Engineering |
| D003 | Edge Functions use service_role for all payment operations | Payment data is sensitive. Service role bypasses RLS. Anon key should never touch payment tables. | 2026-07-18 | Every payment-related DB operation goes through an Edge Function. | Engineering |
| D004 | Forward migrations must be idempotent | Remote DB state is unknown. `CREATE TABLE IF NOT EXISTS` and policy guard blocks prevent errors. | 2026-07-18 | All new migrations use `IF NOT EXISTS` and `DO $$` blocks. | Engineering |
| D005 | Reject anonymous RLS policies on commerce tables | Policies were proposed but rejected in favor of Edge Function architecture for order confirmation. | 2026-07-18 | `get-order-confirmation` Edge Function created. 4 proposed RLS policies removed from migration. | Engineering |
| D006 | Code must match live schema, not local migrations | 13 of 14 migrations were never applied. Local assumptions are wrong. Live DB is the truth. | 2026-07-18 | Removed `payments.updated_at` from RPC. Removed from TypeScript types. | Engineering |
| D007 | `phone` inserted as `null` not `""` when empty | Column is nullable `TEXT`. Empty string is semantically different from null (no phone provided). | 2026-07-18 | Changed `customer_phone ?? ""` to `customer_phone ?? null` in create-razorpay-order. | Engineering |
| D008 | Order number format: `HOP-YYYYMMDD-XXXXXX` | Branded prefix + date + sequential. Human-readable. Acts as access token for guest order lookup. | 2026-07-18 | Edge Function validates this format. Sequential numbering is acceptable for guest checkout. | Engineering |

---

## 17 — CHANGE LOG

| Date | Task | Description | Files Changed | Verified |
|---|---|---|---|---|
| 2026-07-18 | Static Verification Audit | Audited all Edge Functions, Database, Frontend, Auth, Configuration | `docs/STATIC_VERIFICATION_REPORT.md` | ✅ |
| 2026-07-18 | Code-Schema Reconciliation | Classified every failed dependency. Determined root cause (code vs DB vs config). Produced reconciliation report. | `docs/CODE_SCHEMA_RECONCILIATION.md` | ✅ |
| 2026-07-18 | Fix `confirm_paid_order` RPC — remove `payments.updated_at` | The live `payments` table has no `updated_at` column. Removed the reference from the RPC. | `supabase/migrations/20260718000001_create_missing_objects.sql` | ✅ |
| 2026-07-18 | Fix `create-razorpay-order` — phone as null | Changed `customer_phone ?? ""` to `customer_phone ?? null` to match nullable column. | `supabase/functions/create-razorpay-order/index.ts` | ✅ |
| 2026-07-18 | Fix TypeScript types — remove `payments.updated_at` | Removed `updated_at` from `payments.Row`, `Insert`, `Update` in types file. | `src/integrations/supabase/types.ts` | ✅ |
| 2026-07-18 | Phase 2.1 — Secure Order Confirmation | Created `get-order-confirmation` Edge Function. Removed 4 anon RLS policies. Updated frontend to use Edge Function. | `supabase/functions/get-order-confirmation/index.ts`, `src/services/orderService.ts`, `src/types/order.ts`, `src/pages/OrderConfirmation.tsx`, `docs/SECURE_ORDER_CONFIRMATION_VERIFICATION.md` | ✅ |
| 2026-07-18 | Master Execution Plan created | Definitive project operating document created with all 20 sections. | `docs/01_MASTER_EXECUTION_PLAN.md` | ✅ |

---

## 18 — SESSION START PROTOCOL

Every development session — human or AI — MUST follow this protocol:

### Step 1: Read This File Completely
Read `docs/01_MASTER_EXECUTION_PLAN.md` from start to finish. Do not skip sections. The file may have been updated since your last session.

### Step 2: Understand the Current Phase
Read section 04 (CURRENT EXECUTION PHASE). Understand why this phase exists and what its exit criteria are.

### Step 3: Understand the Current Task
Read section 10 (CURRENT TASK). Understand the goal, expected output, dependencies, and definition of done.

### Step 4: Understand All Blockers
Read section 09 (CURRENT KNOWN ISSUES). Check if any blockers affect the current task. If so, resolve or escalate before starting.

### Step 5: Never Ask Questions Answered Here
This file encodes every known decision, issue, and rule. Do not ask questions that are answered in this file. Do not ask for clarification on settled decisions.

### Step 6: Never Repeat Completed Work
Check section 17 (CHANGE LOG) and section 09 (CURRENT KNOWN ISSUES) before starting any work. Do not redo tasks that are already complete.

### Step 7: Never Redo Finished Analysis
If a task's analysis is already documented in the design files (`docs/CODE_SCHEMA_RECONCILIATION.md`, `docs/STATIC_VERIFICATION_REPORT.md`, `docs/SECURE_ORDER_CONFIRMATION_VERIFICATION.md`), use that analysis. Do not re-analyze.

### Step 8: Never Assume Anything
When in doubt, read the actual file. When in doubt about the database, query `information_schema`. When in doubt about the architecture, check section 07.

### Step 9: Update This File After Every Completed Task
Update PROJECT STATUS, CURRENT TASK, CURRENT KNOWN ISSUES, CHANGE LOG, and DECISION LOG as needed. The next session depends on this file being current.

---

## 19 — SESSION END PROTOCOL

Before ending any session:

### Step 1: Verify All Work
- Does the code compile? (TypeScript check)
- Do the tests pass? (Run applicable tests)
- Does the code follow all Engineering Rules? (Section 06)
- Does the code match the architecture? (Section 07)

### Step 2: Run Required Tests
- Run P0 tests if payment flow was changed
- Run P1 tests if order/inventory was changed
- Run P2 tests if auth/config was changed
- Record results in the test plan

### Step 3: Update Project Status
- Update the PROJECT STATUS table (Section 03)
- Resolve or update CURRENT KNOWN ISSUES (Section 09)

### Step 4: Update Current Task
- Mark the CURRENT TASK as complete (if done)
- Move the NEXT TASK to CURRENT TASK
- Update dependencies and definition of done

### Step 5: Update Changelog
- Add an entry to the CHANGE LOG (Section 17)
- Include: date, task description, files changed, verification status

### Step 6: Update Decision Log
- If any architectural decisions were made, add to DECISION LOG (Section 16)

### Step 7: Save the Project State
- Ensure `01_MASTER_EXECUTION_PLAN.md` is saved and reflects the current state
- The file must be in a state where another engineer can read it and start working immediately

---

## 20 — AI EXECUTION CONTRACT

This is the most important section. Every AI working on this repository MUST obey these rules.

### Rule 1: Read This File First
Never skip reading `docs/01_MASTER_EXECUTION_PLAN.md` at the start of a session. If you do not read this file, you do not know the state of the project.

### Rule 2: Never Create Duplicate Systems
If a system already exists (Edge Function, RPC, service, hook), do not create another one that does the same thing. Extend the existing system or explain why it must be replaced.

### Rule 3: Never Ignore Architecture
The architecture in Section 07 is the architecture of the project. Every change must fit within it. If a change requires a new architectural layer, first update the architecture, then implement.

### Rule 4: Never Create Undocumented Changes
Every change must be recorded. At minimum, update the CHANGE LOG. If the change affects architecture, update the architecture and decision log. If the change affects security, update the security model.

### Rule 5: Never Move to the Next Task Without Verification
The definition of done exists for every task. Do not mark a task complete without satisfying every item in the definition of done. Do not start the next task until the current one is verified.

### Rule 6: Never Leave the Project in an Inconsistent State
If you cannot complete a task, document:
- What was attempted
- What worked
- What failed
- Why it failed
- What is needed to unblock

Leave the project in a state where another engineer can continue without redoing your work.

### Rule 7: Always Think Like the Lead Software Architect
You are responsible for production release. Every decision should be made with production in mind. Every shortcut should be evaluated against the cost of a production incident. Every assumption should be verified.

### Rule 8: Never Guess
If you don't know the answer, read the code. If the code doesn't tell you, read the database schema. If the database doesn't tell you, ask a human. Never guess.

### Rule 9: This File is the Law
If there is a conflict between this file and any other source (including the AI's training data), this file wins. The decisions recorded here were made by the project's architect for this specific codebase.

### Rule 10: Update This File When You Find a Gap
If you discover something that should be in this file but isn't, add it. This file must grow more comprehensive over time. Every session should leave it more complete than it was found.

---

## Document Maintenance

**How to update this file:**

1. Never overwrite from scratch. Preserve history.
2. Add new entries to changelog (Section 17).
3. Add new decisions to decision log (Section 16).
4. Update project status (Section 03) — mark completed items, add new blockers.
5. Update current task (Section 10) — mark dependency as complete, advance state.
6. Update known issues (Section 09) — resolve or add as needed.
7. Keep the session start protocol in mind — the next engineer will read this file cold.

**How to verify this file is current:**

1. Read each section. Does it reflect what actually exists?
2. Check the changelog. Does it include all completed work?
3. Check the decision log. Does it include all architectural decisions?
4. Check the current task. Is it actually what's being worked on?
5. Check the project status. Is each domain's status accurate?

---

*End of Master Execution Plan — Version 1.0*
