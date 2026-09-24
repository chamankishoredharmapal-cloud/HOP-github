# Phase 2 — Contradiction Register

**Audit Timestamp**: 2026-08-16T05:00:00+05:30

This document records any contradictions between the intended architecture, security standards, and the actual implementation.

## Contradictions Found and Addressed

1. **Guest Checkout vs. Supabase Auth Identity Model**
   - **Contradiction**: The initial architecture assumed `auth.uid()` would always perfectly map to `customers.id`. However, the implementation of Guest Checkout created `customers` rows with random UUIDs. Thus, `auth.uid()` != `customers.id` when a guest later signed up. This contradiction caused the P0 Identity Collision bug.
   - **Resolution**: The architecture was updated to decouple the surrogate key (`customers.id`) from the authentication key (`auth.uid()`). Identity linking and RLS ownership now revolve around the unique, validated `email` address.

2. **Client-Side vs. Server-Side Data Trust**
   - **Contradiction**: The original `checkoutService.ts` inserted customer and address data directly from the client. However, standard SECURITY.md requires zero-trust for client inputs regarding critical commerce data.
   - **Resolution**: Client-side inserts were removed. Data is now passed to the `create_order` RPC, which performs validation and atomic insertion server-side.

3. **RLS Policy Stacking (OR Logic)**
   - **Contradiction**: Previous migrations added an admin-only policy to `inventory_history`, assuming it would lock it down. However, they failed to drop the existing permissive "Authenticated users can insert" policy. In Postgres, RLS policies combine with `OR`, so the permissive policy overrode the restrictive one.
   - **Resolution**: `20260816000001_phase2_closure_hardening.sql` explicitly drops all prior permissive policies before recreating the strict admin policy.

## Open Contradictions
None. All identified contradictions have been structurally resolved.
