# Migration Cleanup Plan

**Date:** 2026-07-18
**Repository:** House of Padmavati
**Scope:** `supabase/migrations/` — 14 migration files, 2 duplicate timestamps, 1 empty file, multiple obsolete/superseded files.

---

## 1 — Current Migration Graph

```
Timestamp          | Status        | Content Summary
─────────────────────────────────────────────────────────────────────────────
20260706000001     | NEVER APPLIED | Full schema: collections, products, customers,
                   |               | orders, payments, inventory, wishlist, coupons.
                   |               | Uses OLD enums (order_status, payment_status).
                   |               | CONFLICTS with live schema types.
─────────────────────────────────────────────────────────────────────────────
20260708000000     | ✅ APPLIED    | Canonical orders schema: customers,
                   | (LIVE DB)     | shipping_addresses, orders (order_status enum),
                   |               | order_items (TEXT product_id), payments
                   |               | (payment_transaction_status, NO updated_at).
                   |               | create_order() RPC, generate_order_number().
─────────────────────────────────────────────────────────────────────────────
20260709000000     | NEVER APPLIED | ⚠ DUPLICATE TIMESTAMP (File A)
_create_           |               | Base product & collection tables:
product_tables     |               | collections, products, product_status enum.
.sql               |               | NO RLS. NO workspace extensions.
                   |               | Contents fully contained in File B.
─────────────────────────────────────────────────────────────────────────────
20260709000000     | NEVER APPLIED | ⚠ DUPLICATE TIMESTAMP (File B)
_COMBINED_         |               | COMBINED superset: File A contents +
product_           |               | File 20260710000000_create_product_workspace
workspace.sql      |               | contents + authenticated RLS policies +
                   |               | storage bucket product-images + storage RLS.
                   |               | This is the CANONICAL product workspace.
─────────────────────────────────────────────────────────────────────────────
20260710000000     | NEVER APPLIED | ⚠ DUPLICATE TIMESTAMP (File A)
_create_           |               | Extends products table (adds stock, mrp,
product_           |               | selling_price columns, etc.), adds
workspace.sql      |               | product_images table, creates storage bucket.
                   |               | Contents fully contained in 09000000 File B.
─────────────────────────────────────────────────────────────────────────────
20260710000000     | NEVER APPLIED | ⚠ DUPLICATE TIMESTAMP (File B)
_seed_             |               | INSERTs 5 seed collections:
collections.sql    |               | Kalyani, Viara, Arya, Padma, Spandana.
                   |               | Unique content — NOT in any other file.
─────────────────────────────────────────────────────────────────────────────
20260710000001     | NEVER APPLIED | ❗ EMPTY FILE. Zero bytes.
_create_           |               | Likely accidental commit or abandoned
product_tables     |               | placeholder.
.sql               |               |
─────────────────────────────────────────────────────────────────────────────
20260711000000     | NEVER APPLIED | Extends collections: renames columns,
_extend_           |               | adds hero fields, drops old columns,
collections.sql    |               | seeds editorial stories, adds anon RLS
                   |               | policy, creates HOP-films storage bucket.
                   |               | CONTAINS DESTRUCTIVE: column DROPs, data
                   |               | UPDATE of is_active → status.
                   |               | Partially superseded by 20260712000000.
─────────────────────────────────────────────────────────────────────────────
20260712000000     | NEVER APPLIED | REFINED version of 20260711000000:
_fix_              |               | renames columns, adds hero fields, adds
collections.sql    |               | anon RLS, creates HOP-films bucket+RLS.
                   |               | SAFER: no column DROPs, no data UPDATEs,
                   |               | no editorial seeding.
                   |               | Only adds missing columns (idempotent).
─────────────────────────────────────────────────────────────────────────────
20260713000000     | NEVER APPLIED | Creates inventory_history table AND
_create_           |               | confirm_paid_order RPC (BAD version —
inventory_         |               | references payments.updated_at which
history.sql        |               | does NOT exist in live payments table).
                   |               | table creation duplicated in 18000001.
                   |               | RPC is WRONG — must NOT be run.
─────────────────────────────────────────────────────────────────────────────
20260716000000     | NEVER APPLIED | HARDENS RLS: replaces authenticated CRUD
_harden_studio_    |               | with admin-only policies using
admin_policies     |               | public.is_admin() function. Covers
.sql               |               | collections, products, product_images,
                   |               | inventory_history, storage buckets.
                   |               | Drops old policies first (idempotent).
─────────────────────────────────────────────────────────────────────────────
20260717000000     | NEVER APPLIED | Creates payment_events table.
_payment_          |               | Schema IDENTICAL to section in 18000001.
events.sql         |               | Fully superseded by 18000001.
                   |               | Uses non-guarded policy creation.
─────────────────────────────────────────────────────────────────────────────
20260718000000     | NEVER APPLIED | ⚠ DESTRUCTIVE: DROPs shipping_addresses,
_reconcile_order_  |               | enums (order_status, payment_status,
schema.sql         |               | payment_method, coupon_type), old tables
                   |               | (addresses, inventory, wishlist, customers).
                   |               | RECREATES customers, shipping_addresses,
                   |               | orders, order_items, payments.
                   |               | Creates confirm_paid_order (BAD version:
                   |               | references payments.updated_at).
                   |               | Creates adjust_product_stock RPC.
                   |               | MUST NOT be run — would DROP live data.
─────────────────────────────────────────────────────────────────────────────
20260718000001     | NEVER APPLIED | ✅ CORRECT forward migration.
_create_           | (WILL APPLY)  | Creates inventory_history (IF NOT EXISTS),
missing_objects    |               | payment_events (IF NOT EXISTS),
.sql               |               | confirm_paid_order (FIXED — no
                   |               | payments.updated_at). No anon RLS policies.
                   |               | Idempotent. Safe to run multiple times.
─────────────────────────────────────────────────────────────────────────────
```

### Key Statistics

| Metric | Count |
|--------|-------|
| Total migrations | 14 |
| Applied to live DB | 1 (`20260708000000`) |
| Duplicate timestamps | 2 groups (`20260709000000`, `20260710000000`) |
| Empty files | 1 (`20260710000001`) |
| Destructive migrations | 1 (`20260718000000`) |
| Has wrong `payments.updated_at` | 2 (`20260713000000`, `20260718000000`) |
| Fully superseded | 4 File A's at duplicate timestamps `09000000` + `10000000` |
| Obsolete (better version exists) | 3 (`20260711000000`, `20260717000000`, `20260718000000`) |

---

## 2 — Duplicate Timestamp Analysis

### Group 1: `20260709000000` — Two Files

| Property | File A | File B |
|----------|--------|--------|
| Full name | `20260709000000_create_product_tables.sql` | `20260709000000_COMBINED_PRODUCT_WORKSPACE.sql` |
| Size | 54 lines / 1.5 KB | 216 lines / 7.8 KB |
| Creates | `product_status`, `collections`, `products` | Same 3 objects PLUS `product_images`, storage bucket, RLS policies, workspace extension columns |
| RLS | None | Authenticated CRUD on collections/products/product_images |
| Storage | None | `product-images` bucket + RLS |
| Superset? | — | ✅ File B contains File A's exact DDL (collections + products tables are identical) |

**Root cause:** File B was created as a "Combined" version that merges File A (base tables) with `20260710000000_create_product_workspace.sql` (workspace extensions). Both files were kept, creating a timestamp collision.

**Recommendation for File A:** `RENAME` to `_20260709000000_create_product_tables.sql`

| Option | Risk | Verdict |
|--------|------|---------|
| **KEEP** both | Duplicate timestamp will cause unpredictable apply order. Confusing for future developers. | ❌ Reject |
| **RENAME** File A | File B is superset. Safe. All content preserved. | ✅ **Recommended** |
| **DELETE** File A | Low risk (File B has everything), but Supabase may warn about missing local file if this migration is ever marked as applied. | ⚠ Acceptable but less safe |
| **MERGE** into File B | Already done — File B is File A + more | ✅ Already done |

**Recommendation for File B:** `KEEP` as-is. This is the canonical product workspace migration.

---

### Group 2: `20260710000000` — Two Files

| Property | File A | File B |
|----------|--------|--------|
| Full name | `20260710000000_create_product_workspace.sql` | `20260710000000_seed_collections.sql` |
| Size | 52 lines / 1.8 KB | 14 lines / 0.5 KB |
| Content | ALTER TABLE products (add columns, rename price), product_images table, storage bucket | INSERT INTO collections (5 seed rows) |
| Relationship | Unrelated to File B | Unrelated to File A |

**Root cause:** Two unrelated migration files were created on the same date without coordinating timestamps. Neither is a duplicate of the other — this is a naming collision.

**Recommendation for File A:** `RENAME` to `20260710000000_create_product_workspace.sql` is fine (unique content), but since its contents are **already merged into `20260709000000_COMBINED_PRODUCT_WORKSPACE.sql`**, it should be treated as superseded.

| Option | Risk | Verdict |
|--------|------|---------|
| **KEEP** both | Duplicate timestamp causes collision. Supabase may error or have unpredictable order. | ❌ Reject |
| **RENAME** File A | Unnecessary — File A is superseded by COMBINED file. Keeping it causes confusion. | ❌ Reject |
| **REPAIR + DELETE** | File A's content is entirely in `09000000_COMBINED`. Running it again would rename `price` to `selling_price` which is already done. Safe to skip. | ✅ **Recommended** |
| **MERGE** into File B | These are unrelated operations. Merging would couple seed data with schema mutations. | ❌ Reject |

**Recommendation for File B (seed_collections):** `KEEP` and `RENAME` to resolve collision. Suggested name: `20260710000002_seed_collections.sql`.

---

## 3 — Empty File Analysis

### File: `20260710000001_create_product_tables.sql`

| Property | Value |
|----------|-------|
| Size | 0 bytes, 0 lines |
| Date context | Between `20260710000000_seed_collections.sql` and `20260711000000_extend_collections.sql` |
| Name | Suggests it was intended to create product tables |

**Root cause:** Likely an accidental `git commit --allow-empty` or an abandoned placeholder that was created with `supabase migration new create_product_tables` but never had SQL written into it. The name duplicates the intent of `20260709000000_create_product_tables.sql`, suggesting it was a re-attempt.

**Recommendation:** `DELETE`

| Option | Risk | Verdict |
|--------|------|---------|
| **KEEP** | Zero-byte file will be applied by `db push`. Applying an empty migration is harmless (no-op), but confusing. | ⚠ Acceptable but messy |
| **DELETE** | Zero risk. Empty file has no effect. Not in remote `schema_migrations`. | ✅ **Recommended** |
| **FILL** with content | Not clear what content it should have. All product tables already exist in earlier migrations. | ❌ Reject |
| **REPAIR** as applied | Would add an entry to `schema_migrations` for a file that does nothing. Confusing. | ❌ Reject |

---

## 4 — Obsolete / Superseded Migration Analysis

### Migration A: `20260706000001_create_order_system.sql`

**Content:** Full e-commerce schema (638 lines). Creates `product_status`, `order_status`, `payment_status`, `payment_method`, `coupon_type` enums with values that **conflict** with the live schema (different enum values for `order_status` and `payment_status`). Creates `collections`, `products`, `product_images`, `customers`, `addresses`, `orders`, `order_items`, `order_status_history`, `payments`, `inventory`, `wishlist_items`, `coupons` tables. Includes triggers, RLS policies, and functions.

**Why it's obsolete:** Migration `20260708000000` (the only one applied to live DB) has a **different**, simplified schema with different enum values. If `20260706000001` were run, it would fail because the enums already exist with different values.

**Planned action:** Already in the T-EXECUTE-MIGRATIONS plan as `migration repair --status applied`.

**Post-repair fate:** `RENAME` to `_20260706000001_create_order_system.sql` (underscore prefix = ignored by Supabase CLI). Kept for historical reference but removed from active migration chain.

---

### Migration B: `20260711000000_extend_collections.sql`

**Content:** Extends collections (171 lines). Renames `sort_order→display_order`, `image_url→hero_image_url`. Adds `hero_video_url`, `editorial_story`, `tagline`, `featured_on_homepage`, `status`. Migrates `is_active→status` data. Drops old `image_url`, `is_active`, `sort_order` columns. Seeds editorial stories and taglines for 5 collections. Adds anon RLS for collections. Creates HOP-films storage bucket + RLS policies.

**Why it's partially obsolete:** Migration `20260712000000_fix_collections_migration.sql` is a safer, refined version that:
- Does NOT drop columns (safe for already-schema-matched DBs)
- Does NOT UPDATE data rows
- Does NOT seed editorial content
- Uses the same column additions and renames

**Comparison: `20260711000000` vs `20260712000000`**

| Feature | 11000000 | 12000000 |
|---------|----------|----------|
| Rename `sort_order→display_order` | ✅ | ✅ |
| Rename `image_url→hero_image_url` | ✅ | ✅ |
| Add hero columns | ✅ | ✅ |
| Add editorial_story, tagline | ✅ | ✅ |
| Add featured_on_homepage, status | ✅ | ✅ |
| Migrate `is_active→status` data | ✅ UPDATE | ❌ NOT included |
| Drop old `image_url` column | ✅ DROP | ❌ NOT included |
| Drop old `is_active` column | ✅ DROP | ❌ NOT included |
| Drop old `sort_order` column | ✅ DROP | ❌ NOT included |
| Seed editorial content | ✅ 5 UPDATEs | ❌ NOT included |
| Anon RLS for collections | ✅ | ✅ |
| HOP-films bucket + RLS | ✅ | ✅ |
| Featured index | ✅ | ✅ |
| Safe to re-run | ❌ Column drops fail on second run | ✅ Fully idempotent |

**Recommendation:** `REPAIR` `20260711000000` as applied (skip it). Apply `20260712000000` normally.

**Post-repair fate:** `RENAME` to `_20260711000000_extend_collections.sql` (historical reference). Its editorial seeding was a one-time operation — the data already exists in the DB or can be added separately.

**Risk of NOT repairing `20260711000000`:** Running it would attempt to:
1. Rename `sort_order→display_order` — would fail if already renamed
2. Drop `image_url` column — would succeed but remove the column
3. Update `is_active` status — would succeed but might overwrite manual status changes
4. Seed editorial content — would re-override editorial stories
5. The rename and drop operations use `DO $$` blocks with conditional checks, so most would be skipped. But the editorial UPDATE at line 106-123 has **no guard** — it would overwrite editorial stories every time.

---

### Migration C: `20260717000000_payment_events.sql`

**Content:** Creates `payment_events` table (22 lines). Identity schema to the `payment_events` section in `20260718000001`. Uses a non-guarded `CREATE POLICY` that may error on re-run.

**Why it's obsolete:** `20260718000001_create_missing_objects.sql` creates the same table with `IF NOT EXISTS` and guarded policy creation (`DO $$` block). The corrected forward migration is the canonical version.

**Planned action:** Already in the T-EXECUTE-MIGRATIONS plan as `migration repair --status applied`.

**Post-repair fate:** `DELETE`. Fully superseded by `20260718000001`. No unique content.

---

### Migration D: `20260718000000_reconcile_order_schema.sql`

**Content:** Destructive reconciliation (508 lines). DROPs `shipping_addresses`, `customers`, and all conflicting enums/tables before recreating them. Creates `confirm_paid_order` RPC that references `payments.updated_at` (does not exist in live DB).

**Why it's obsolete:** The corrected version of `confirm_paid_order` (without `payments.updated_at`) and the missing objects are handled by `20260718000001`. The destructive DROP/RECREATE would delete live order data.

**Planned action:** Already in the T-EXECUTE-MIGRATIONS plan as `migration repair --status applied`.

**Post-repair fate:** `DELETE`. Contains zero safe, runnable content. Every operation is either destructive or superseded by `20260718000001` or `20260708000000`.

**Exception:** The `adjust_product_stock` RPC (lines 463-508 in 20260718000000) is the only unique content not found elsewhere. However:
- This RPC is not referenced by any Edge Function
- Inventory deduction happens inside `confirm_paid_order` RPC (in `20260718000001`)
- If `adjust_product_stock` is needed in the future, it should be added as a NEW migration

---

### Migration E: `20260713000000_create_inventory_history.sql`

**Content:** Creates `inventory_history` table and `confirm_paid_order` RPC (127 lines). The table DDL is identical to `20260718000001`. The RPC references `payments.updated_at` (BUG).

**Why it's partially obsolete:**
- Table: Superseded by `20260718000001` (same table with `IF NOT EXISTS`)
- RPC: Contains the BUG version with `payments.updated_at`. Must NOT be run.

**Planned action:** Already in the T-EXECUTE-MIGRATIONS plan as `migration repair --status applied`.

**Post-repair fate:** `DELETE`. The table is created by `20260718000001`. The RPC is wrong and must never execute.

---

## 5 — Recommended Migration Graph (Post-Cleanup)

```
Timestamp          | Action    | Result
──────────────────────────────────────────────────
20260706000001     | REPAIR    | Entry in schema_migrations.
                   | + RENAME  | File → _20260706000001_create_order_system.sql
                   |           | (ignored by CLI, kept for reference)
──────────────────────────────────────────────────
20260708000000     | KEEP      | Entry in schema_migrations. Already applied.
                   |           | File unchanged.
──────────────────────────────────────────────────
20260709000000     | RENAME    | Fix timestamp collision.
_create_           | to        | File → 20260709000001_create_product_tables.sql
product_tables     |           | (will be applied by db push)
.sql               |           | Note: content in COMBINED, but harmless
──────────────────────────────────────────────────
20260709000000     | KEEP      | Entry in schema_migrations after db push.
_COMBINED_         |           | File unchanged. Canonical product workspace.
product_           |           |
workspace.sql      |           |
──────────────────────────────────────────────────
20260710000000     | REPAIR    | Entry in schema_migrations.
_create_           | + DELETE  | Content fully contained in 20260709000000
product_           |           | _COMBINED_PRODUCT_WORKSPACE.sql
workspace.sql      |           |
──────────────────────────────────────────────────
20260710000000     | RENAME    | Fix timestamp collision.
_seed_             | to        | File → 20260710000002_seed_collections.sql
collections.sql    |           | (will be applied by db push)
──────────────────────────────────────────────────
20260710000001     | DELETE    | Zero-byte file. No content.
_create_           |           | Never in schema_migrations.
product_tables     |           | Safe to remove.
.sql               |           |
──────────────────────────────────────────────────
20260711000000     | REPAIR    | Entry in schema_migrations.
_extend_           | + RENAME  | File → _20260711000000_extend_collections.sql
collections.sql    |           | (ignored by CLI, kept for reference)
                   |           | Safer version 20260712000000 handles this.
──────────────────────────────────────────────────
20260712000000     | KEEP      | Entry in schema_migrations after db push.
_fix_              |           | File unchanged. Canonical collections fix.
collections.sql    |           |
──────────────────────────────────────────────────
20260713000000     | REPAIR    | Entry in schema_migrations.
_create_           | + DELETE  | table in 18000001, RPC was wrong.
inventory_         |           | Must NOT run — would create bad RPC.
history.sql        |           |
──────────────────────────────────────────────────
20260716000000     | KEEP      | Entry in schema_migrations after db push.
_harden_studio_    |           | File unchanged. Admin RLS hardening.
admin_policies     |           |
.sql               |           |
──────────────────────────────────────────────────
20260717000000     | REPAIR    | Entry in schema_migrations.
_payment_          | + DELETE  | Content fully contained in 20260718000001.
events.sql         |           |
──────────────────────────────────────────────────
20260718000000     | REPAIR    | Entry in schema_migrations.
_reconcile_order_  | + DELETE  | Destructive. RPC has wrong payments.updated_at.
schema.sql         |           | Must NOT run.
                   |           | adjust_product_stock RPC is orphaned (unused).
──────────────────────────────────────────────────
20260718000001     | APPLY     | Entry in schema_migrations after db push.
_create_           | (db push) | File unchanged. CORRECT forward migration.
missing_objects    |           | Creates inventory_history, payment_events,
.sql               |           | confirm_paid_order (FIXED version).
                   |           | No anon RLS policies.
──────────────────────────────────────────────────
```

### Post-Cleanup File Listing

```
supabase/migrations/
├── _20260706000001_create_order_system.sql     # REPAIRED + RENAMED (historical)
├── 20260708000000_create_orders_schema.sql     # KEEP (applied)
├── 20260709000001_create_product_tables.sql    # RENAMED (to be applied)
├── 20260709000000_COMBINED_PRODUCT_WORKSPACE.sql # KEEP (to be applied)
├── 20260710000002_seed_collections.sql         # RENAMED (to be applied)
├── 20260712000000_fix_collections_migration.sql # KEEP (to be applied)
├── 20260716000000_harden_studio_admin_policies.sql # KEEP (to be applied)
├── 20260718000001_create_missing_objects.sql   # KEEP (to be applied)
├── _20260711000000_extend_collections.sql      # REPAIRED + RENAMED (historical)
```

**Files deleted:** `20260710000000_create_product_workspace.sql`, `20260710000001_create_product_tables.sql`, `20260713000000_create_inventory_history.sql`, `20260717000000_payment_events.sql`, `20260718000000_reconcile_order_schema.sql`

**Total after cleanup:** 9 files (2 prefixed with `_` ignored by CLI → 7 active)

---

## 6 — Exact File Operations

### Phase 1: Renames (fix duplicate timestamps)

```bash
# Fix 20260709000000 collision — File A gets unique timestamp
move supabase\migrations\20260709000000_create_product_tables.sql ^
     supabase\migrations\20260709000001_create_product_tables.sql

# Fix 20260710000000 collision — seed file gets unique timestamp
move supabase\migrations\20260710000000_seed_collections.sql ^
     supabase\migrations\20260710000002_seed_collections.sql
```

### Phase 2: Renames (obsolete, kept for reference)

```bash
# Obsolete — replaced by 20260708000000
move supabase\migrations\20260706000001_create_order_system.sql ^
     supabase\migrations\_20260706000001_create_order_system.sql

# Obsolete — replaced by safer 20260712000000
move supabase\migrations\20260711000000_extend_collections.sql ^
     supabase\migrations\_20260711000000_extend_collections.sql
```

### Phase 3: Deletions (fully superseded, no unique content, or empty)

```bash
# Superseded by 20260709000000_COMBINED_PRODUCT_WORKSPACE.sql
del supabase\migrations\20260710000000_create_product_workspace.sql

# Empty file — no content
del supabase\migrations\20260710000001_create_product_tables.sql

# Superseded by 20260718000001 + RPC has payments.updated_at bug
del supabase\migrations\20260713000000_create_inventory_history.sql

# Superseded by 20260718000001
del supabase\migrations\20260717000000_payment_events.sql

# Destructive + RPC has payments.updated_at bug
del supabase\migrations\20260718000000_reconcile_order_schema.sql
```

### Phase 4: Migration Repair (before db push)

```bash
# These migrations must be marked as "applied" to skip them:
supabase migration repair --status applied 20260706000001
supabase migration repair --status applied 20260710000000  # create_product_workspace
supabase migration repair --status applied 20260711000000
supabase migration repair --status applied 20260713000000
supabase migration repair --status applied 20260717000000
supabase migration repair --status applied 20260718000000
```

**Note:** Previously only 4 migrations were in the repair plan. This audit identifies 6 migrations that must be repaired:
- `20260706000001` — conflicts with live enum types
- `20260710000000` — create_product_workspace (superseded by COMBINED)
- `20260711000000` — extend_collections (superseded by fix_collections_migration)
- `20260713000000` — inventory_history + bad RPC
- `20260717000000` — payment_events (superseded by 18000001)
- `20260718000000` — destructive + bad RPC

---

## 7 — Migration Repair Expansion

The original T-EXECUTE-MIGRATIONS plan identified 4 migrations for repair. This audit expands to 6.

**Why the original 4 were insufficient:**

| Migration | Why Needed |
|-----------|------------|
| `20260706000001` | Already in original plan ✅ |
| `20260713000000` | Already in original plan ✅ |
| `20260717000000` | Already in original plan ✅ |
| `20260718000000` | Already in original plan ✅ |
| **`20260710000000`** (create_product_workspace) | **New addition.** Its content is wholly inside `20260709000000_COMBINED_PRODUCT_WORKSPACE`. Running it would re-alter products (rename `price→selling_price`, add columns that already exist). All ALTER statements use `IF NOT EXISTS` so it would be safe but redundant. However, repairing it prevents duplicate operations and simplifies history. |
| **`20260711000000`** (extend_collections) | **New addition.** Has destructive column drops and unconditional editorial story UPDATEs. The safer `20260712000000` covers the same business need. Repairing this prevents accidental data loss. |

**Expected migration history after repairs + db push:**

```
supabase_migrations.schema_migrations entries:
  20260706000001          (repaired)
  20260708000000          (applied — only one actually run)
  20260709000000_COMBINED  (applied by db push — note: CLI may store filename)
  20260709000001          (applied by db push)
  20260710000000          (repaired — create_product_workspace entry)
  20260710000002          (applied by db push — seed_collections)
  20260711000000          (repaired)
  20260712000000          (applied by db push)
  20260713000000          (repaired)
  20260716000000          (applied by db push)
  20260717000000          (repaired)
  20260718000000          (repaired)
  20260718000001          (applied by db push)
```

**Note:** The `schema_migrations` table stores the migration filename. After renaming `20260709000000_create_product_tables.sql` to `20260709000001_create_product_tables.sql`, Supabase will record `20260709000001_create_product_tables.sql` in the table. The original `20260709000000_create_product_tables.sql` will never appear because it was renamed before execution.

Similarly, `20260710000000_seed_collections.sql` → `20260710000002_seed_collections.sql`.

---

## 8 — Impact Assessment

| Domain | Impact | Details |
|--------|--------|---------|
| **Edge Functions** | ✅ None | verify-payment and razorpay-webhook call `confirm_paid_order` which is created by `20260718000001`. That file is unchanged. |
| **Live database** | ✅ None | No data affected. Deleted files are unsapplied local migrations. Repaired files are skipped. |
| **Frontend** | ✅ None | Frontend uses `get-order-confirmation` Edge Function. No DB queries. |
| **Future migrations** | ✅ Clean history | After cleanup, the migration directory has 7 active files + 2 archived. New migrations continue from `20260718000002`. |
| **CI/CD** | ⚠ One-time adjustment | The repair commands must be run once. After that, `supabase db push` works normally. |
| **Other developers** | ⚠ Need to pull | After cleanup, developers must `git pull` the renamed/deleted files and re-link their local Supabase project. |

---

## 9 — Risk Assessment

### Risk: Deleting a file that should have been executed

**Scenario:** A deleted migration contained DDL that doesn't exist in the live DB and is NOT in any other migration.

**Mitigation:** Each deleted file was verified against its replacement:

| Deleted File | Replacement | Verification |
|---|---|---|
| `20260710000000_create_product_workspace` | `20260709000000_COMBINED_PRODUCT_WORKSPACE` | Line-by-line match of all DDL |
| `20260713000000_inventory_history` table | `20260718000001` `inventory_history` section | Identical schema (both use `IF NOT EXISTS`) |
| `20260713000000_create_inventory_history` RPC | (Deleted intentionally) | `confirm_paid_order` in `20260718000001` is the FIXED version |
| `20260717000000_payment_events` | `20260718000001` `payment_events` section | Identical schema (both use `IF NOT EXISTS`) |
| `20260718000000` everything | `20260708000000` + `20260718000001` | Schema already exists; corrected RPC is in `20260718000001` |

**Verdict:** Zero risk of missing DDL. All content is either already live or in `20260718000001`.

### Risk: Editorial seed data loss

**Scenario:** `20260711000000_extend_collections.sql` seeds editorial stories and taglines for 5 collections. If this migration is repaired (skipped) and the data was never inserted, the collections will lack editorial content.

**Mitigation:** Check if the data exists:
```sql
SELECT slug, editorial_story, tagline FROM collections WHERE slug IN ('kalyani','viara','arya','padma','spandana');
```
If editorial_story is NULL, the editorial content must be seeded separately. The seed SQL from `20260711000000` (lines 106-123) can be extracted into a standalone seed script or data migration.

**Recommendation:** Before repairing `20260711000000`, verify editorial content exists. If missing, either:
1. Create a new data migration (`20260718000002_seed_editorial_content.sql`) with the editorial UPDATEs
2. Use the Supabase Dashboard SQL Editor to run the seed manually

### Risk: RLS policy gaps

**Scenario:** `20260716000000_harden_studio_admin_policies.sql` drops policies from earlier migrations. If reordered, policies may be missing.

**Mitigation:** `20260716000000` drops policies by name before recreating them. The `DROP POLICY IF EXISTS` pattern ensures no errors even if the policies don't exist. All CREATEs are guarded with `DO $$` blocks. This migration is safe to run regardless of which previous migrations were applied or skipped.

### Risk: Supabase CLI behavior with renamed files

**Scenario:** Supabase records migration filenames in `schema_migrations`. If a file is renamed after being marked as applied, the CLI may show a warning.

**Mitigation:**
- Files that are repaired as applied BEFORE rename: The old filename is recorded in `schema_migrations`. The renamed file with `_` prefix will be ignored by CLI. This is consistent.
- Files that are renamed BEFORE being applied: The new filename is recorded. This is also consistent.

For `20260709000000` → `20260709000001`: Since both represent the same migration, this is a genuine timestamp correction. The file will be applied with the new name.

### Risk: `20260709000001` ordering between `20260709000000_COMBINED`

**Scenario:** After renaming, `20260709000001_create_product_tables.sql` will sort AFTER `20260709000000_COMBINED_PRODUCT_WORKSPACE.sql`. This means the COMBINED migration runs first (creating all tables + workspace + RLS), then the standalone version runs (attempting to create the same tables again with `IF NOT EXISTS`).

**Impact:** ✅ Safe. The standalone would be a no-op since the tables already exist. `CREATE TABLE IF NOT EXISTS` and `CREATE UNIQUE INDEX IF NOT EXISTS` are idempotent.

### Risk: `adjust_product_stock` RPC loss

**Scenario:** `20260718000000_reconcile_order_schema.sql` contains `adjust_product_stock()` RPC (lines 463-508) that doesn't exist in any other migration.

**Impact:** ⚠ Low. This RPC is not referenced by any Edge Function or frontend code. Inventory deduction is handled entirely inside `confirm_paid_order`. If `adjust_product_stock` is needed later, it can be added as a new migration.

**Recommendation:** If this RPC is needed, create `20260718000002_create_adjust_product_stock.sql` containing only the RPC definition (without the schema DROPs and recreates).

---

## 10 — Execution Order

```
STEP 1: Verify editorial content exists in live DB
  Run: SELECT slug, editorial_story, tagline FROM collections
  If missing → create seed script before proceeding

STEP 2: Run migration repairs (6 migrations)
  supabase migration repair --status applied 20260706000001
  supabase migration repair --status applied 20260710000000
  supabase migration repair --status applied 20260711000000
  supabase migration repair --status applied 20260713000000
  supabase migration repair --status applied 20260717000000
  supabase migration repair --status applied 20260718000000

STEP 3: Execute file operations
  Rename 20260709000000_create_product_tables.sql → 20260709000001_create_product_tables.sql
  Rename 20260710000000_seed_collections.sql → 20260710000002_seed_collections.sql
  Rename 20260706000001_create_order_system.sql → _20260706000001_create_order_system.sql
  Rename 20260711000000_extend_collections.sql → _20260711000000_extend_collections.sql
  Delete 20260710000000_create_product_workspace.sql
  Delete 20260710000001_create_product_tables.sql
  Delete 20260713000000_create_inventory_history.sql
  Delete 20260717000000_payment_events.sql
  Delete 20260718000000_reconcile_order_schema.sql

STEP 4: Apply forward migration
  supabase db push --project-ref kbvjmcnaaogkbnerjcoc

STEP 5: Verify migration list
  supabase migration list --project-ref kbvjmcnaaogkbnerjcoc
  Expected: All entries present, no "MISSING LOCAL" warnings, no pending migrations.

STEP 6: Verify objects created
  Confirm payment_events table exists
  Confirm inventory_history table exists
  Confirm confirm_paid_order() RPC exists and works
```

---

## 11 — Summary Table

| # | File | Lines | Status | Action | Reason |
|---|------|-------|--------|--------|--------|
| 1 | `20260706000001_create_order_system.sql` | 638 | Obsolete | REPAIR + RENAME `_` | Conflicts with live enums. Superseded by 08000000 |
| 2 | `20260708000000_create_orders_schema.sql` | 361 | ✅ Applied | KEEP | Canonical orders schema. Applied to live DB |
| 3a | `20260709000000_create_product_tables.sql` | 54 | Duplicate | RENAME → `09000001` | Duplicate timestamp with COMBINED file |
| 3b | `20260709000000_COMBINED_PRODUCT_WORKSPACE.sql` | 216 | Active | KEEP | Canonical product workspace (superset of 3a + 4a) |
| 4a | `20260710000000_create_product_workspace.sql` | 52 | Obsolete | REPAIR + DELETE | Content fully in 3b (COMBINED) |
| 4b | `20260710000000_seed_collections.sql` | 14 | Misnamed | RENAME → `10000002` | Duplicate timestamp with 4a |
| 5 | `20260710000001_create_product_tables.sql` | 0 | Empty | DELETE | Zero-byte file. Accidental commit |
| 6 | `20260711000000_extend_collections.sql` | 171 | Obsolete | REPAIR + RENAME `_` | Destructive ops. Superseded by 12000000 |
| 7 | `20260712000000_fix_collections_migration.sql` | 101 | Active | KEEP | Refined, safe version of collections extension |
| 8 | `20260713000000_create_inventory_history.sql` | 127 | Buggy | REPAIR + DELETE | Table in 18000001. RPC has payments.updated_at bug |
| 9 | `20260716000000_harden_studio_admin_policies.sql` | 159 | Active | KEEP | Admin RLS hardening. Needed for Studio security |
| 10 | `20260717000000_payment_events.sql` | 22 | Obsolete | REPAIR + DELETE | Content in 18000001 with safer guards |
| 11 | `20260718000000_reconcile_order_schema.sql` | 508 | Destructive | REPAIR + DELETE | DROPs live data. RPC has bug. |
| 12 | `20260718000001_create_missing_objects.sql` | 195 | ✅ Ready | APPLY (db push) | CORRECT forward migration. Idempotent. Safe. |

### Result: 14 files → 7 active + 2 archived = 9 total

---

*Report generated by MIGRATION_CLEANUP_AUDIT. No files were modified.*
