# ADR-004: RLS with Default-Deny for Orders

**Date**: 2026-07-08

## Context
The orders schema stores sensitive customer data (names, addresses, phone numbers). We needed to decide on access control.

## Decision
Enable RLS with zero policies — default-deny for all roles. Only `service_role` key can access directly.

**Status**: This decision is being reconsidered. The Studio orders module requires `authenticated` SELECT access to display order data.

## Rationale (original)
- Maximum data protection by default
- Force intentional policy creation
- Service role key used by `create_order()` RPC (security definer)

## Consequences
- Studio orders page returns empty results without explicit `SELECT` policies
- RLS policies must be added before orders module is functional
- RPC `create_order()` works because it's `SECURITY DEFINER`
