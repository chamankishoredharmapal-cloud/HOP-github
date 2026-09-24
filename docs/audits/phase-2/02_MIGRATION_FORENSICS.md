# Phase 2 — Migration Forensics

**Audit Timestamp**: 2026-08-16T04:51:00+05:30

This document tracks all new database migrations introduced during Phase 1 and Phase 2 remediation.

## 1. `20260813000000_phase1_remediation.sql`
- **Purpose**: Addressed Phase 1 verification gaps (F-07/F-08).
- **Changes**:
  - Drops and recreates the `order_events_event_type_check` constraint on the `order_events` table to ensure that the allowed enum values strictly match the actual values emitted by the Edge Functions (`order.created`, `order.payment_failed`, `order.cancelled`, etc.).
- **Security Impact**: Data integrity enforcement.

## 2. `20260816000000_phase2_security_remediation.sql`
- **Purpose**: Resolves P0 Customer Identity and RLS vulnerabilities.
- **Changes**:
  - **`customers_self_insert`**: Adds missing INSERT policy enforcing `email = auth.email()`.
  - **`shipping_addresses`**: Adds missing UPDATE and DELETE policies mapped securely via the `customers` table join.
  - **`customer_wishlists`**: Drops `auth.uid()` policies and replaces them with policies mapped via `email = auth.email()` against the `customers` table. This is critical because guest checkouts create a random UUID for the customer, so `auth.uid()` will not match the guest `customer.id` upon subsequent signup.
  - **`upsert_customer_profile` (RPC)**: Creates a `SECURITY DEFINER` function to safely handle returning guest signups without violating the unique email constraint, returning the existing customer ID.
- **Security Impact**: Resolves identity collisions and restores wishlist/shipping address ownership.

## 3. `20260816000001_phase2_closure_hardening.sql`
- **Purpose**: Hardens admin authorization and removes overly permissive RLS policies.
- **Changes**:
  - **`inventory_history`**: Drops overlapping, permissive policies introduced by previous migrations (e.g., 0716, 0718-01, 0720-01) and establishes a single, definitive admin-only policy using `public.is_admin()`.
  - **`settings`**: Drops permissive policies and restricts all write operations to `public.is_admin()`. Allows unauthenticated/authenticated SELECT for storefront configuration.
  - **Admin Standardization**: Normalizes all admin RLS policies across `orders`, `order_items`, `payments`, `payment_events`, `shipping_addresses`, `customers`, and `order_events` to rely explicitly on `public.is_admin()` (which uses the JWT `app_metadata` rather than a mutable table lookup).
- **Security Impact**: Eliminates privilege escalation vectors and ensures consistent admin authorization.

## Conclusion
All migrations are strictly additive, correct, and address identified security findings without introducing new vectors. No destructive schema drops or unapproved architectural changes were made.
