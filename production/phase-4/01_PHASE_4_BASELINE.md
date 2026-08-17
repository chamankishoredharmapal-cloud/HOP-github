# Phase 4 Baseline — House of Padmavati

**Document Type**: Authoritative Baseline & Initial State Register  
**Audit Target**: House of Padmavati (HOP) — Phase 4: Infrastructure, Delivery, SEO & Performance  
**Date/Timestamp**: 2026-08-17  
**Authoritative Verdict**: **ESTABLISHED**  

---

## 1. Git Repository Baseline

| Property | Value | Evidence Source | Status |
|---|---|---|---|
| **Branch** | `main` | `git status` -> `On branch main` | ACTUALLY VERIFIED |
| **Commit Hash (HEAD)** | `05a02250acd64dc5aed4adae7f9a82ab2ef0e3e4` | `git rev-parse HEAD` | ACTUALLY VERIFIED |
| **Commit Subject** | `commerce(phase-3): complete application and commerce validation` | `git log -n 1 --oneline` | ACTUALLY VERIFIED |
| **Working Tree Status** | Clean (0 modified, 0 untracked in git index) | `git status` | ACTUALLY VERIFIED |
| **Preceding Phase 3 Closure** | PASS (Unconditional) | `production/phase-3/14_PHASE_3_FINAL_CLOSURE.md` | ACTUALLY VERIFIED |

---

## 2. Supabase Infrastructure Baseline

| Configuration Item | Required State | Configured State | Actual Verification | Status |
|---|---|---|---|---|
| **Production Project Ref** | `kbvjmcnaaogkbnerjcoc` | Unlinked | `npx supabase projects list` -> `linked: false` | ACTUALLY VERIFIED |
| **Production Project Isolation** | 100% Untouched | Preserved | Zero mutations sent to `kbvjmcnaaogkbnerjcoc` | ACTUALLY VERIFIED |
| **Authorized Staging Ref** | `zalbmbhczouhrdboucfe` | `test server` | `supabase/.temp/project-ref` -> `zalbmbhczouhrdboucfe`, `linked: true` | ACTUALLY VERIFIED |
| **Staging Region** | `ap-southeast-2` | `ap-southeast-2` | `npx supabase projects list` | ACTUALLY VERIFIED |
| **Staging Database Engine** | PostgreSQL 17.6.1 | `17.6.1.155 (ga)` | `npx supabase projects list` | ACTUALLY VERIFIED |
| **Staging Edge Functions** | 7 functions active | 7 deployed | `npx supabase functions list` -> 7 ACTIVE | ACTUALLY VERIFIED |
| **config.toml project_id** | `zalbmbhczouhrdboucfe` | `kbvjmcnaaogkbnerjcoc` | `supabase/config.toml` contains production ID | CURRENTLY CONFIGURED (CONTRADICTION RECORDED) |
| **.env Supabase URL** | Staging URL | Production URL | `.env` contains `https://kbvjmcnaaogkbnerjcoc.supabase.co` | CURRENTLY CONFIGURED (CONTRADICTION RECORDED) |

---

## 3. Deployment & Hosting Baseline

| Component | Target Platform | Local Configuration | Status |
|---|---|---|---|
| **Hosting Provider** | Vercel | `vercel.json` present (rewrites + security headers) | CURRENTLY CONFIGURED |
| **Build System** | Vite + Playwright SSG | `package.json` build pipeline (`vite build && copy 404.html && prerender.js`) | ACTUALLY VERIFIED |
| **Framework Target** | React 18.3.1 SPA with SSG | `src/App.tsx`, `scripts/prerender.js` | ACTUALLY VERIFIED |
| **DNS Configuration** | `houseofpadmavati.com` | `nslookup houseofpadmavati.com` -> NXDOMAIN (pre-launch) | NOT VERIFIED (PUBLIC DNS PENDING) |
| **CDN / Caching** | Vercel Edge Network | `vercel.json` headers + Vite hashed assets | CURRENTLY CONFIGURED |

---

## 4. Verification Methodology

For each baseline assertion:
1. **WHAT was checked**: Repository commit state, Supabase project link state, environment variables, hosting configuration.
2. **HOW was it checked**: Direct shell execution of `git status`, `git rev-parse HEAD`, `npx supabase projects list`, `npx supabase functions list`, and file system inspection.
3. **WHAT evidence proves it**: Exact outputs recorded in test artifacts and raw logs.
4. **WHAT could still fail**: If `.env` is used during builds, the build embeds production references rather than staging.
