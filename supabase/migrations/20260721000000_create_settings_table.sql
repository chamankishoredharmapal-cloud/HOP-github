-- =============================================================================
-- House of Padmavati — Create Settings Table Migration
-- Migration: 20260721000000
-- Description: Creates key-value settings table for Studio admin configuration.
-- =============================================================================

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'settings'
      AND policyname = 'Authenticated users can manage settings'
  ) THEN
    CREATE POLICY "Authenticated users can manage settings"
      ON settings FOR ALL TO authenticated USING (true) WITH CHECK (true);
  END IF;
END;
$$;
