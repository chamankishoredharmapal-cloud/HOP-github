# Phase 4 Finding Disposition Register

**Document Type**: Definitive Finding Disposition Register  
**Audit Target**: All Phase 4 Findings (F-P4-01 through F-P4-08)  
**Execution Date**: 2026-08-17  
**Status**: **COMPLETE**  

---

## 1. Itemized Finding Dispositions

| Finding ID | Title / Scope | Previous Classification | Forensic Investigation & Evidence | Final Disposition | Justification |
|---|---|---|---|---|---|
| **F-P4-01** | Production references in local `.env` | MEDIUM | Analyzed git tracking (`git ls-files .env` = untracked), `.gitignore` (line 16), and key privileges (public read-only anon key). Build uses environment variables scoped by Vercel deployment targets. | **ACCEPTABLE RISK / DOCUMENTATION ONLY** | No secret exposure or repo contamination. Public anon key is safe for read-only static generation. |
| **F-P4-02** | `supabase/config.toml` project ID | LOW | Inspected Supabase CLI resolution order. CLI `--linked` commands read exclusively from `supabase/.temp/project-ref` (`zalbmbhczouhrdboucfe`). Production `kbvjmcnaaogkbnerjcoc` is `linked: false`. | **DOCUMENTATION ONLY** | `config.toml` `project_id` is non-authoritative template default; production remains 100% isolated. |
| **F-P4-03** | Production Supabase Storage CDN in `collectionVideos.ts` | LOW | Inspected all 6 URLs in `collectionVideos.ts`. Bucket `HOP-films` is a public brand media repository. Assets are static MP4s cached at edge (`max-age=31536000`). | **CLOSED (INTENTIONAL PUBLIC BRAND MEDIA)** | Category A/D: Read-only public media assets. No operational or transactional database dependency. |
| **F-P4-04** | Production DNS currently NXDOMAIN | INFO | Queried DNS (`Resolve-DnsName houseofpadmavati.com` -> NXDOMAIN). Standard pre-launch posture. | **PHASE 5 DEPENDENCY** | Domain delegation and apex record provisioning belong exclusively to Phase 5 Go-Live. |
| **F-P4-05** | Staging migration/schema contradiction | INFO / SUSPECT | Executed `npx supabase migration list --linked`. Remote `zalbmbhczouhrdboucfe` has all 18 migrations applied. `pg_tables` verified all 13 canonical tables; `pg_proc` verified all 10 canonical RPCs. | **CLOSED / INVALIDATED CONTRADICTION** | The contradiction was caused by reading an outdated historical investigation report (`15_...`) instead of querying the live database. Live staging schema is 100% canonical. |
| **F-P4-06** | Dynamic SPA Soft-404 | LOW | Tested with Playwright. Static 404s return HTTP 404. Dynamic missing paths render fallback UI and inject `<meta name="robots" content="noindex, nofollow">`. | **CLOSED (INTENTIONAL SPA ARCHITECTURE)** | Prevents search engine indexing while delivering smooth SPA user experience. |
| **F-P4-07** | Dynamic Sitemap Expansion | LOW | Prerender script automatically discovers all published products and collections from Supabase REST API during build and generates prerendered routes. | **CLOSED** | All published products are discovered and built into static distribution HTML during `npm run build`. |
| **F-P4-08** | External APM Integration | LOW | Inspected client error handling. `ErrorBoundary.tsx` catches exceptions and hides stacks in production. Cloud APM (Sentry) can be attached in Phase 5. | **PHASE 5 ENHANCEMENT** | Zero runtime blockers; ErrorBoundary provides full client-side fault isolation. |
