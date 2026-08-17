# Phase 3 - Staging Migration Reconciliation (Forensic Report)

**Document Type**: Read-Only Forensic Analysis
**Target**: testserver `zalbmbhczouhrdboucfe` (STAGING ONLY - production `kbvjmcnaaogkbnerjcoc` untouched)
**Date/Time**: 2026-08-17
**Status**: INVESTIGATION COMPLETE - NO FURTHER MIGRATIONS EXECUTED (see section 8)

---

## 1. Executive Summary

The staging project `zalbmbhczouhrdboucfe` ("test server", created 2026-08-16 03:42:12 UTC) was a **fresh, empty Supabase project**. It had **no pre-existing schema, no imported schema, no cloned schema, and no migration history**.

During the authorized staging push attempt, the CLI applied migration `20260706000001_create_order_system.sql` (the OLD schema - recorded in `supabase_migrations.schema_migrations`) and then **failed on migration `20260708000000_create_orders_schema.sql`** with `SQLSTATE 42710: type "order_status" already exists`.

Root cause: **the local migration chain is intrinsically inconsistent.** Migrations 1, 2, and 3 each issue `CREATE TYPE <name>` without `IF NOT EXISTS` or a prior `DROP` for the same enum names (`order_status`, `payment_status`, `product_status`) with **different label sets**. No fresh database can ever be migrated by the CLI from migration 1 -> 2 in sequence. The repo's own reconcile migration `20260718000000` documents this exact failure mode and was written because production hit it too.

All staging data is **zero rows** - no data is at risk in any resolution path.

---

## 2. Comparison Matrix (Required)

| Layer | LOCAL MIGRATIONS | STAGING SCHEMA | STAGING MIGRATION HISTORY | DOCUMENTED/ACTUAL PRODUCTION |
|---|---|---|---|---|
| Enums (public) | M1: `order_status`(pending,paid,packed,...), `payment_status`, `payment_method`, `product_status`, `coupon_type`. M2/M14: canonical `order_status`(pending_payment,confirmed,...), `payment_status`, `payment_transaction_status` | **M1 labels only**: `order_status` {pending,paid,packed,shipped,delivered,completed,cancelled,refunded,partially_refunded}, `payment_status`, `payment_method`, `product_status`(draft,active,archived), `coupon_type` | Only `20260706000001` | Canonical (per `14_PHASE_3_FINAL_CLOSURE.md` section 8; reconcile migration created canonical types on production) |
| Tables (public) | M1: collections, products, product_images, customers, addresses, orders, order_items, order_status_history, payments, inventory, wishlist_items, coupons. M2/M14: customers, shipping_addresses, orders, order_items, payments. M8/M12: inventory_history. M10/M12: payment_events. M13: customer_wishlists. M14: order_events. M15: settings | **Exact M1 set (12 tables)**: addresses, collections, coupons, customers, inventory, order_items, order_status_history, orders, payments, product_images, products, wishlist_items. **No** shipping_addresses, payment_events, order_events, inventory_history, customer_wishlists, settings | Only M1 | Canonical set incl. shipping_addresses, payment_events, order_events, settings, inventory_history (per phase-2/3 audits + `02_MIGRATION_FORENSICS.md`) |
| Sequences | M1: `order_number_seq`. M2/M14: `orders_number_seq` | `order_number_seq` only (M1) | - | `orders_number_seq` (canonical) |
| Functions/RPCs | M1: update_updated_at_column, generate_order_number, update_order_status_history, update_order_status_timestamps. M2/M14: create_order, confirm_paid_order, adjust_product_stock. M9: is_admin(user_id). M16: upsert_customer_profile. M14: release_order_inventory | **Exact M1 set (4)**: update_updated_at_column, generate_order_number, update_order_status_history, update_order_status_timestamps. **No** create_order / confirm_paid_order / release_order_inventory / upsert_customer_profile / is_admin | Only M1 | create_order, confirm_paid_order, release_order_inventory, upsert_customer_profile, is_admin (per `00_BASELINE.md` section 3, `14_PHASE_3_FINAL_CLOSURE.md` section 3) |
| RLS policies | M1: 27 policies (collections_read_public, collections_all_admin, products_read_public, ..., coupons_all_admin) | **Exact M1 set (27 policies)**, RLS enabled on all 12 tables | - | Canonical policy set incl. `*_admin_all` via `is_admin()`, order_events/payment_events policies (M14/M16-18) |
| Constraints | M1: customers.supabase_user_id FK to auth.users, orders FKs to addresses, payments FKs, checks. M2/M14: canonical FK graph (shipping_addresses etc.) | **Exact M1 constraint set** incl. `customers.supabase_user_id` FK (present in M1 ONLY, absent in M2/M14) | - | Canonical FK graph (per phase-2 audits) |
| Indexes | M1: 9 indexes. M2+: canonical index set | M1 index set only | - | Canonical index set |
| Data | - | **ALL TABLES: 0 ROWS** | - | Production data (never accessed) |

**Verdict of comparison**: staging is exactly the state produced by migration 1 alone. Nothing else.

---

## 3. Findings (Q1-Q8)

### Q1. Why does testserver contain schema objects with little/no migration history?
**It does not contain pre-existing objects.** The objects are the direct result of the CLI push executed during this staging operation: the CLI applied migration `20260706000001` (creating all 12 tables, 5 enums, 1 sequence, 4 functions, 27 policies) and recorded it in `supabase_migrations.schema_migrations` BEFORE failing on migration 2. Proof:
- Pre-push `supabase migration list --linked`: Remote column blank for all 18 migrations (empty history).
- Push log: migration 1 applied with only `NOTICE (42710): extension "pgcrypto" already exists` (pgcrypto is pre-installed on every Supabase project). Migration 1's `CREATE TABLE collections` (no `IF NOT EXISTS`) succeeded, so the table did **not** pre-exist.
- Migration 2's `CREATE TABLE IF NOT EXISTS customers` emitted `NOTICE (42P07): relation "customers" already exists, skipping` - it skipped a table that migration 1 had just created in the same push.

### Q2. Origin of the existing staging schema?
**Supabase project initialization (fresh project) + migration 1 applied by the CLI push.** Excluded origins:
- **Imported schema**: No. Only standard Supabase schemas exist (auth, extensions, graphql, graphql_public, public, realtime, storage, supabase_migrations, vault); only standard extensions (pgcrypto, plpgsql, uuid-ossp, pg_stat_statements, supabase_vault).
- **Earlier deployment**: No. Project created 2026-08-16 03:42:12 UTC; history was empty pre-push.
- **Manual SQL**: No. All objects exactly match migration 1's SQL; no hand-made drift.
- **Another migration history / clone / branch / template**: No. A production clone would carry canonical schema + data; staging has M1 schema + 0 rows.

### Q3. Which local migrations are already represented by staging?
**Exactly one: `20260706000001_create_order_system.sql`** (the OLD/legacy schema). Confirmed by 1:1 match of tables, enums (label-for-label), sequence, functions, policies, and constraints (incl. `customers.supabase_user_id` which exists only in M1). Migrations 2-18 are NOT represented.

### Q4. Which migration failed?
**`20260708000000_create_orders_schema.sql`** - statement 6, `CREATE TYPE order_status AS ENUM (...)`, `SQLSTATE 42710 "type order_status already exists"`. The existing type is migration 1's `order_status` (labels `pending,paid,packed,...`); migration 2 defines the same type name with canonical labels (`pending_payment,confirmed,...`) and does **not** use `IF NOT EXISTS`, does **not** `DROP` first.

### Q5. Is the local migration chain intrinsically inconsistent?
**YES - by design.** Three migrations issue unconditional `CREATE TYPE` for the same names:
- M1 `20260706000001`: `order_status`, `payment_status`, `payment_method`, `product_status`, `coupon_type` (OLD labels)
- M2 `20260708000000`: `order_status`, `payment_status`, `payment_transaction_status` (canonical labels)
- M3 `20260709000000`: `product_status` (same name as M1)

No `DROP TYPE IF EXISTS` precedes them, and Postgres `CREATE TYPE` has no `IF NOT EXISTS`. Therefore **migration 2 can never execute after migration 1 on the same database**, and migration 3 can never execute after migration 1 either. The repo's own `20260718000000_reconcile_order_schema.sql` header states this explicitly: "Because 20260708000000 used CREATE TABLE IF NOT EXISTS, the OLD schema silently persisted. This migration drops the OLD conflicting objects and recreates the CANONICAL schema." The chain cannot be applied from scratch by any CLI in sequential order; it requires the manual resolution documented in DEPLOYMENT.md (section 4 below).

### Q6. How did production historically reach its current schema?
Production (`kbvjmcnaaogkbnerjcoc`, created 2026-07-02) predates most migration files and was built via the **authoritative documented procedure - manual application in the Supabase SQL Editor in chronological order** (`docs/DEPLOYMENT.md` Database Migrations). Evidence:
- DEPLOYMENT.md: "Apply migrations in chronological order from `supabase/migrations/` in the Supabase SQL Editor. Migrations are designed to be idempotent and safe to re-run." (This idempotency claim is **false** for M1/M2/M3 - see Q5.)
- `production/AI_PRODUCTION_EXECUTION_MANUAL.md` line 1271: "production migration + seed executed by Backend Lead (H, 17:111)" - production migrations are human-executed, not CLI-automated.
- The reconcile migration `20260718000000` (added in commit `7194b48 Phase 5.1 complete`, 2026-07-16) exists precisely because production ended up with OLD schema objects persisting alongside canonical ones - i.e., production experienced the same M1/M2 conflict and was repaired manually.
- `production/phase-2/02_MIGRATION_FORENSICS.md` confirms phase-1/phase-2 migrations (`20260813000000`, `20260816000000`, `20260816000001`) were applied on top of an existing canonical production schema.

### Q7. Is there an authoritative documented migration application procedure?
**YES - two documents:**
1. `docs/DEPLOYMENT.md` Database Migrations - SQL Editor, chronological order, idempotent re-runs (the idempotency claim is contradicted by Q5 evidence).
2. `production/AI_PRODUCTION_EXECUTION_MANUAL.md` - CLI tiers: `supabase db push` = CAUTION, staging only, after dry-run review; `supabase db reset` = local dev only, NEVER linked/prod; "Never edit an already-applied migration"; production migrations executed by a human (Backend Lead). Also `00_MASTER_EXECUTION_PLAN.md` line 210: staging readiness requires migrations applied without data loss/corruption.

### Q8. Can staging be aligned WITHOUT destructive/forbidden operations?
**No CLI-only path exists.** Analysis of every compliant route:

| Route | Outcome | Forbidden op? |
|---|---|---|
| `supabase db push --linked` (re-run as-is) | Fails again at M2 `CREATE TYPE order_status` (42710). Chain 2-18 can never run after M1. | No - but ineffective |
| Edit migration files (make M2/M3 idempotent) | Would make the chain CLI-applicable, but edits committed migration files. The manual forbids editing **applied** migrations; on production M2/M3 are already applied (state unknown, cannot be verified without touching production). Requires human sign-off and changes canonical chain for future environments. | Needs human authorization |
| `supabase db reset --linked` | Rebuilds staging from local migrations - would replay M1 then FAIL at M2 again (chain is broken for fresh application too). | FORBIDDEN (destructive) |
| `supabase migration repair` | Would only rewrite history entries, does not fix the M2 conflict. | FORBIDDEN |
| Manual SQL in SQL Editor (documented production procedure) | The ONLY documented, proven path (production used it). Apply in chronological order, resolving the M1/M2/M3 enum conflicts exactly as production did (drop OLD conflicting objects, then apply canonical migrations). | Not forbidden by rules, but is manual schema alteration - requires human authorization per instruction set |

**Conclusion**: Within the letter of the current authorization (no reset, no repair, no manual marking, no manual schema alteration, no production change), staging **cannot** be aligned. The chain is intrinsically broken for CLI application. The safest authorized path is one of the two options in section 5.

---

## 4. Authoritative Procedure Evidence

- `docs/DEPLOYMENT.md` (lines 41-52): "Apply migrations in chronological order from `supabase/migrations/` in the Supabase SQL Editor."
- `production/AI_PRODUCTION_EXECUTION_MANUAL.md` (lines 521, 551-552, 787-799, 1271): `db push` = CAUTION/staging-only after dry-run; `db reset` = local-only NEVER linked/prod; "Never edit an already-applied migration"; production migration executed by Backend Lead (H).
- `production/00_MASTER_EXECUTION_PLAN.md` (line 210): staging criteria = migrations applied successfully without data loss/corruption errors.
- `supabase/migrations/20260718000000_reconcile_order_schema.sql` (header): documents the M1/M2 conflict and the canonical cleanup - the repo's own admission that the chain is not sequentially self-consistent.

---

## 5. Safest Authorized Path (Recommendation)

Given: staging has **zero data** (all tables 0 rows), migration history = only `20260706000001`, schema = exactly M1's OLD schema, and production must remain untouched.

**Option A (RECOMMENDED) - Human executes the documented SQL Editor procedure on staging:**
1. Human applies migrations to staging in chronological order in the Supabase SQL Editor (the documented production procedure).
2. When M2/M3 `CREATE TYPE` statements collide with M1's enums, apply the repo's own reconcile semantics: `DROP TYPE IF EXISTS order_status CASCADE; DROP TYPE IF EXISTS payment_status CASCADE;` etc. (exactly as `20260718000000` does), then continue the chain.
3. Because this is manual schema alteration, it requires explicit human authorization under the current instruction set.

**Option B - Human-authorized migration chain fix:**
1. Human authorizes editing M2/M3 to be idempotent (add `DROP TYPE IF EXISTS ... CASCADE` guards mirroring the reconcile migration, or wrap type creation in `DO $$` blocks).
2. After review, `supabase db push --linked` applies the full chain 2-18 cleanly on top of M1 state.
3. Risk: changes committed migration files; must confirm production's applied state is unaffected (production already applied these - a file edit does not retroactively alter production's DB, but must be reviewed per "never edit applied migrations" governance).

**Both options preserve**: zero data loss (no rows exist), production untouched, no `db reset`, no `migration repair`, no fabricated history. Webhook testing (F-P3-02) remains BLOCKED until staging reaches the canonical schema.

---

## 6. Security Confirmation

- No secret values were printed, logged, or committed during this investigation.
- No production command was executed; production project `kbvjmcnaaogkbnerjcoc` was not accessed or modified.
- Repository link state: `supabase/.temp/project-ref` = `zalbmbhczouhrdboucfe` (staging) - correct and unchanged.
- No migration was applied beyond the already-reported failed push (M1 recorded, M2 failed). No further migration commands were run after the failure.

---

## 7. Status of F-P3-02

**NOT VERIFIED - still blocked.** The four webhook scenarios cannot be executed until:
1. Staging schema reaches the canonical state (create_order, confirm_paid_order, payment_events, order_events, inventory_history, shipping_addresses, etc.).
2. The locally available webhook test secret is confirmed present (currently not in process/user/machine env - needs to be re-provided in the same session where tests run).

---

## 8. Evidence Index (all read-only)

| Evidence | Source |
|---|---|
| Project list + linked ref | `supabase projects list`; `supabase/.temp/project-ref`, `linked-project.json`, `pooler-url` |
| Migration history (remote) | `supabase migration list --linked` (pre- and post-push) |
| Push failure log | `supabase db push --linked` (SQLSTATE 42710 at M2 statement 6) |
| Staging tables/enums/sequences/functions/policies/constraints | `supabase db query --linked` (pg_tables, pg_enum, pg_sequences, pg_proc, pg_policies, pg_constraint, pg_namespace, pg_extension) |
| Row counts (0 in all 10 checked tables) | `supabase db query --linked` count queries |
| Migration file contents | `supabase/migrations/*.sql` (M1, M2, M14 read in full) |
| Documented procedure | `docs/DEPLOYMENT.md`, `production/AI_PRODUCTION_EXECUTION_MANUAL.md`, `production/00_MASTER_EXECUTION_PLAN.md`, `production/phase-2/02_MIGRATION_FORENSICS.md`, `production/phase-3/14_PHASE_3_FINAL_CLOSURE.md` |
| Git history of migrations | `git log --all -- supabase/migrations/` |

---

## 9. Stop Point

Investigation complete. No further staging mutations, webhook tests, or Phase 4 work will be executed without explicit human authorization of Option A or Option B in section 5.