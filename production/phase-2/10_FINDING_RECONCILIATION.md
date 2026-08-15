# Phase 2 — Finding Reconciliation

**Audit Timestamp**: 2026-08-16T04:59:00+05:30

This document tracks all security findings discovered during the Phase 2 audit and verifies their remediation.

| Finding ID | Description | Severity | Status | Verification Evidence |
|---|---|---|---|---|
| F-P2-01 | **IDOR in `create-razorpay-order`**: Allowed users to retry/tamper with orders they did not own. | Critical (P1) | REMEDIATED | Edge function updated to enforce `order.customers.email == auth.email()` or `is_admin()`. Verified in `04_EDGE_FUNCTION_SECURITY.md`. |
| F-P2-02 | **Timing Attack in HMAC Verification**: `verify-payment` and `razorpay-webhook` used vulnerable string equality (`===`). | Critical (P1) | REMEDIATED | Implemented XOR-based `timingSafeEqual` in both functions. Verified in `06_PAYMENT_SECURITY.md`. |
| F-P2-03 | **Identity Collision for Returning Guests**: Guest checkouts assigned random UUIDs, causing unique email constraint violations upon signup. | High (P0) | REMEDIATED | Created `upsert_customer_profile` RPC. RLS on wishlists/addresses migrated from `auth.uid()` to `email`. Verified in `03_CUSTOMER_IDENTITY_AUDIT.md`. |
| F-P2-04 | **Permissive RLS on `inventory_history`**: Allowed any authenticated user to tamper with inventory logs due to OR-based policy overlap. | High (P0) | REMEDIATED | `20260816000001_phase2_closure_hardening.sql` drops all permissive policies and enforces strict `public.is_admin()`. Verified in `02_MIGRATION_FORENSICS.md`. |
| F-P2-05 | **Permissive RLS on `settings`**: Allowed any authenticated user to write store configuration. | High (P0) | REMEDIATED | `20260816000001_phase2_closure_hardening.sql` enforces `public.is_admin()` for all writes. Verified in `02_MIGRATION_FORENSICS.md`. |
| F-P2-06 | **Inconsistent Admin Verification**: Mixed use of `EXISTS(profiles)` and `public.is_admin()` for RLS across tables. | Medium (P2) | REMEDIATED | Standardized all admin RLS policies across 7 core tables to use `public.is_admin()` checking the JWT. Verified in `02_MIGRATION_FORENSICS.md`. |

## Conclusion
All identified vulnerabilities have been successfully remediated, peer-reviewed, and verified in the current working tree.
