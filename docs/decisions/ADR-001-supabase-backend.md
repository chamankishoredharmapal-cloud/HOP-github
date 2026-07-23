# ADR-001: Supabase as Backend

**Date**: 2026-07-01

## Context
We needed a backend for authentication, database, storage, and API — without maintaining a custom server.

## Decision
Use Supabase (PostgreSQL + PostgREST + Auth + Storage) as the sole backend.

## Rationale
- PostgreSQL with RLS eliminates need for a backend API layer
- Built-in auth with email/password
- Storage with public buckets for media
- PostgREST auto-generates REST API from schema
- Free tier sufficient for development

## Consequences
- All business logic must live in PostgreSQL (triggers, functions, RLS)
- No service_role key in client code — anon key only
- Migrations applied via SQL Editor (no CLI tool available)
