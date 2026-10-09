-- =============================================================================
-- House of Padmavati — Phase 1: Security Incident Containment
-- Migration: 20261009010000_phase1_security_containment_harden_settings_rls.sql
--
-- Description: Drops permissive settings_read_authenticated policy so only
-- administrators can access public.settings directly. Non-admin users and
-- visitors read safe public settings projections through get_public_store_settings() RPC.
-- =============================================================================

-- Drop legacy permissive SELECT policy that allowed all authenticated accounts
-- (including customer accounts) to read internal store settings.
DROP POLICY IF EXISTS settings_read_authenticated ON public.settings;

-- Ensure settings_admin_all policy exists with strict is_admin() guard
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'settings'
      AND policyname = 'settings_admin_all'
  ) THEN
    CREATE POLICY settings_admin_all
      ON public.settings FOR ALL
      TO authenticated
      USING (public.is_admin())
      WITH CHECK (public.is_admin());
  END IF;
END;
$$;
