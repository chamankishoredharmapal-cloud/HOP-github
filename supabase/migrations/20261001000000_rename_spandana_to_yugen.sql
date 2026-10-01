-- =============================================================================
-- House of Padmavati — Rename Spandana collection to YŪGEN (canonical)
-- Forward migration: renames the existing collection row in place so all
-- product → collection relationships (via collection_id FK) remain intact.
-- Historical migration 20260711000000_extend_collections.sql is intentionally
-- left untouched; this migration carries the rename forward.
-- Canonical customer-facing name: YŪGEN (macron preserved)
-- Canonical ASCII-safe slug/URL: yugen
-- Legacy slugs `spandana` and `designer-wear` redirect to `/collections/yugen`
-- at the routing layer (see Category.tsx canonical redirect).
-- =============================================================================

UPDATE collections
SET slug = 'yugen',
    name = 'YŪGEN'
WHERE slug = 'spandana'
  AND NOT EXISTS (SELECT 1 FROM collections WHERE slug = 'yugen');
