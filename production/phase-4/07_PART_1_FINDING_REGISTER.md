# Phase 4 Part 1 Finding Register

**Document Type**: Authoritative Finding & Risk Register for Part 1  
**Execution Date**: 2026-08-17  
**Status**: **COMPLETE**  

---

## 1. Finding Register

| Finding ID | Severity | Category | Description | Impact | Recommended Resolution |
|---|---|---|---|---|---|
| **F-P4-01** | MEDIUM | Environment Isolation | Local `.env` contains `VITE_SUPABASE_PROJECT_ID="kbvjmcnaaogkbnerjcoc"` and `VITE_SUPABASE_URL="https://kbvjmcnaaogkbnerjcoc.supabase.co"`, referencing the production project rather than the authorized staging project `zalbmbhczouhrdboucfe`. | Running local builds or prerender queries reads data from the production read-only REST API instead of staging. | Update `.env` to reference staging project URL and keys for local/staging workflows, while maintaining separate environment variables in Vercel. |
| **F-P4-02** | LOW | Config Consistency | `supabase/config.toml` contains `project_id = "kbvjmcnaaogkbnerjcoc"` (production), while `.temp/project-ref` and `.temp/linked-project.json` point to staging `zalbmbhczouhrdboucfe`. | Supabase CLI uses `.temp/project-ref` for `--linked` commands, but `config.toml` has a cosmetic mismatch. | Align `config.toml` `project_id` to staging or document as standard repository template default. |
| **F-P4-03** | LOW | Media Asset Referencing | `src/data/collectionVideos.ts` contains hardcoded Supabase Storage URLs pointing to `https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public/HOP-films/...`. | Video playback relies on production public storage bucket availability. | Use relative paths or dynamic storage base URL configuration. |
| **F-P4-04** | INFO | Network & DNS | `houseofpadmavati.com` resolves to `NXDOMAIN` on public DNS. | Expected prior to Phase 5 production domain configuration. | Complete domain registration and DNS records during Phase 5 production launch. |
| **F-P4-05** | INFO | Staging Schema Alignment | Staging database schema has migration 1 applied and requires human sign-off per `15_MIGRATION_RECONCILIATION_STAGING.md`. | Staging database contains 0 rows; commerce webhook tests in E2E suite are skipped when local server runs without active webhook secret. | Execute human-authorized migration alignment on staging when proceeding with staging data seeding. |
