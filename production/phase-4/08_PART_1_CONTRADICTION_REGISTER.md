# Phase 4 Part 1 Contradiction Register

**Document Type**: Authoritative Contradiction Register for Part 1  
**Execution Date**: 2026-08-17  
**Status**: **COMPLETE**  

---

## 1. Contradictions Identified & Analyzed

| ID | Document / Requirement A | Observed Reality / Artifact B | Analysis & Resolution |
|---|---|---|---|
| **C-P4-01** | Rule: "Authorized staging Supabase project: `zalbmbhczouhrdboucfe`" | File: `.env` lines 1 & 3 contain `VITE_SUPABASE_PROJECT_ID="kbvjmcnaaogkbnerjcoc"` and `VITE_SUPABASE_URL="https://kbvjmcnaaogkbnerjcoc.supabase.co"` | The local environment configuration file retained the initial production project ref rather than the authorized staging project ref. Linked state in Supabase CLI correctly uses staging `zalbmbhczouhrdboucfe`. |
| **C-P4-02** | File: `supabase/config.toml` has `project_id = "kbvjmcnaaogkbnerjcoc"` | File: `supabase/.temp/project-ref` has `zalbmbhczouhrdboucfe` | `config.toml` reflects the original production configuration while active CLI linking overrides this with the staging project ref. |
| **C-P4-03** | Doc: `DEPLOYMENT.md` claims "Migrations are designed to be idempotent and safe to re-run." | Reality: Migration 2 `20260708000000` fails on fresh database with duplicate enum `order_status` after migration 1. | Confirmed by forensic investigation `15_MIGRATION_RECONCILIATION_STAGING.md`. The migration chain requires the documented SQL Editor / reconcile procedure. |
| **C-P4-04** | Standard: Domain `houseofpadmavati.com` is the canonical production URL. | Reality: `nslookup houseofpadmavati.com` returns `NXDOMAIN`. | Domain is not yet pointed to Vercel DNS nameservers; canonical tags and OpenGraph tags in prerendered HTML correctly pre-configure `https://houseofpadmavati.com`. |
