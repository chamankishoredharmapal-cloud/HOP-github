# ADR-003: TanStack React Query for Server State

**Date**: 2026-07-01

## Context
We needed a predictable pattern for fetching, caching, and mutating Supabase data.

## Decision
Use TanStack React Query v5 for all server-state management.

## Rationale
- Declarative queries with automatic caching
- Mutations with cache invalidation
- Loading/error states built-in
- Consistent pattern across all features

## Consequences
- All Supabase calls are wrapped in service functions, consumed via hooks
- Query key convention: `["domain", "entity", ...filters]`
- Cache invalidation by prefix after mutations
- No global state for server data — React Query owns it
