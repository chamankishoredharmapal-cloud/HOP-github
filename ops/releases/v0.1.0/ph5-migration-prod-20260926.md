# COND-01 Production Supabase Migration Evidence

**Date**: 2026-09-26 14:32:15
**Production Project**: kbvjmcnaaogkbnerjcoc (PRODUCTION-HOP)
**Migration State Before**: 18/21 applied
**Migrations Executed**: 
  1. 20260916000000_add_deposit_payment_statuses.sql
  2. 20260916010000_fix_refund_deposit_payment_status.sql
  3. 20260916020000_atomic_mark_delivery_paid_rpc.sql
**Migration State After**: 21/21 applied

## Dry-Run Result
PASS - Only migrations 19-21 were pending.

## Execution Result
PASS - All 3 migrations applied successfully.

## Validation Results

### Migration State
21/21 migrations applied (verified via supabase migration list --linked)

### Tables Verified (13/13)
collections, customer_wishlists, customers, inventory_history, order_events, order_items, orders, payment_events, payments, product_images, products, settings, shipping_addresses

### RPCs/Functions Verified (9/9)
confirm_paid_order, create_order, generate_order_number, is_admin, mark_delivery_paid_rpc, refund_deposit, release_order_inventory, update_updated_at_column, upsert_customer_profile

### Payment Status Enum Verified (12/12)
pending, paid, failed, refunded, partially_refunded, deposit_pending, deposit_paid, partially_paid, fully_paid, balance_due, cancelled

### Payment Events Constraint Verified
CHECK constraint includes: verify_payment, refund, chargeback, payment.failed, payment.captured, mark_delivery_paid

### Security Verified
- RLS enabled on all 13 tables: PASS
- Policies present on all tables: PASS (40 policies total)
- is_admin function verified: PASS

### Types Regenerated
PASS - New payment statuses and RPCs present in src/types/supabase.ts

## Errors/Warnings
None. Supabase CLI v2.109.1. Update available: v2.118.0.

## Recovery Information
- PITR available via Supabase Dashboard (manual intervention required)
- Production project tier: unknown (Pro/Team/Enterprise)
- PITR retention: tier-dependent (typically 7-30 days)
- Recovery procedure: Dashboard -> Backups -> Point-in-Time Recovery

## Evidence Artifact Location
ops/releases/v0.1.0/ph5-migration-prod-20260926.md

