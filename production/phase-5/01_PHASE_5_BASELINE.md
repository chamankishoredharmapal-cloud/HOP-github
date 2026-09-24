# Phase 5 — System & Environment Final Baseline

**Document ID**: HOP-PROD-PH5-001  
**Target Environment**: House of Padmavati (HOP) — Full Stack E-Commerce Platform  
**Audit Phase**: Phase 5 — Independent Reconciliation & Go/No-Go (Part 1 Baseline)  
**Execution Timestamp**: 2026-08-17T14:10:00+05:30  
**Auditor**: Independent Final Audit Authority  
**Authoritative Status**: **PART 1 BASELINE ESTABLISHED — STOPPED AT PART 1 GATE**  

---

## 1. Executive Summary & Objective

This document establishes the authoritative system, repository, database, infrastructure, and application baseline for **Phase 5 Part 1: Collect → Reconstruct → Challenge**.

The purpose of this baseline is to fix the exact point-in-time state of the House of Padmavati (HOP) platform across all physical and logical layers, verify environment separation, and measure drift against the baselines established in Phases 1 through 4.

---

## 2. Git & Version Control Baseline

| Parameter | Observed State | Verification Method | Status |
|---|---|---|---|
| **Repository Root** | `e:\HOP` | Filesystem inspection | **VERIFIED** |
| **Active Branch** | `main` | `git status` | **VERIFIED** |
| **Current Commit HEAD** | `da6158f` (`audit(phase-4): complete infrastructure seo and performance verification`) | `git log -n 1` | **VERIFIED** |
| **Working Tree State** | Clean (0 modified, 0 staged, 0 untracked in tracked paths) | `git status --porcelain` | **VERIFIED** |
| **Branch Divergence** | Ahead of `origin/main` by 9 commits (Local staging/audit commits) | `git status` | **VERIFIED** |

### Recent Commit Trajectory (Phases 1–4 Execution):
1. `da6158f` — `audit(phase-4): complete infrastructure seo and performance verification`
2. `05a0225` — `commerce(phase-3): complete application and commerce validation`
3. `6809389` — `chore(release): finalize phase 3 closure state`
4. `9edd2c0` — `security(phase-2): complete security and customer identity hardening`
5. `f649d82` — `docs(release): record pre-launch reconciliation and PRR for v0.1.0`
6. `c5cb893` — `feat(phase-4): complete Quality Assurance and cross-browser E2E suite`
7. `a5fc760` — `feat(phase-3): complete technical validation and QG3 approval`
8. `8f5747b` — `feat(phase-2): complete brand and experience validation`
9. `1faebee` — `fix(studio): resolve product creation and image upload by aligning products schema with Supabase`
10. `dab9aab` — `release: complete editorial rewrite and stable storefront foundation`

---

## 3. Environment & Cloud Boundary Baseline

### 3.1 Supabase Project Topology

| Property | Staging Environment | Production Environment | Boundary Verdict |
|---|---|---|---|
| **Project Ref** | `zalbmbhczouhrdboucfe` | `kbvjmcnaaogkbnerjcoc` | **ISOLATED** |
| **Project Name** | `test server` | `HOP's Project` | **ISOLATED** |
| **Organization ID** | `eagjbocoaaidgtkajpxf` | `eagjbocoaaidgtkajpxf` | Same Org |
| **Region** | `ap-southeast-2` (Sydney) | `ap-south-1` (Mumbai) | **ISOLATED** |
| **PostgreSQL Version** | 17.6.1.155 (GA channel) | 17.6.1.155 (GA channel) | Homogeneous Engine |
| **CLI Linked State** | `linked: true` | `linked: false` | **STAGING LINKED / PROD UNTOUCHED** |
| **Production Mutation Guard** | Zero active write sessions | Zero write sessions | **SAFE (100% UNTOUCHED)** |

### 3.2 Staging Database & Migration Baseline
- **Linked Project Ref**: `zalbmbhczouhrdboucfe`
- **Total Local Migrations**: 18 SQL files (`supabase/migrations/`)
- **Total Remote Applied Migrations**: 18 migrations (verified via `npx supabase migration list --linked`)
- **Migration Sync State**: 100% synchronized (Zero pending, zero diverged)
- **Database Schema Objects**:
  - **Tables (13)**: `products`, `collections`, `orders`, `order_items`, `customers`, `shipping_addresses`, `customer_wishlists`, `inventory_history`, `payments`, `payment_events`, `settings`, `appointments`, `journal_articles`
  - **RPC Functions (10)**: `create_order`, `confirm_paid_order`, `cancel_order`, `record_payment_event`, `release_order_inventory`, `upsert_customer_profile`, `is_admin`, `get_customer_id_by_email`, `admin_update_order_status`, `admin_update_inventory`
  - **RLS Status**: Enabled and strictly enforced on all public tables with `public.is_admin()` JWT verification.

### 3.3 Supabase Edge Functions Baseline
Verified 7 active Edge Functions deployed on staging project `zalbmbhczouhrdboucfe`:

| Function Slug | Version | JWT Verification | Security Transport | Staging Status |
|---|---|---|---|---|
| `create-razorpay-order` | v6 | `verify_jwt: true` | Bearer Auth + Customer Ownership Check | **ACTIVE** |
| `verify-payment` | v6 | `verify_jwt: true` | Bearer Auth + Constant-time HMAC-SHA256 | **ACTIVE** |
| `razorpay-webhook` | v6 | `verify_jwt: false` | Constant-time HMAC-SHA256 (`x-razorpay-signature`) | **ACTIVE** |
| `cancel-payment` | v2 | `verify_jwt: true` | Bearer Auth + Customer Ownership Check | **ACTIVE** |
| `get-order-confirmation` | v2 | `verify_jwt: true` | Bearer Auth + Customer Ownership Check | **ACTIVE** |
| `release-inventory` | v2 | `verify_jwt: true` | Bearer Auth + Admin Role Check (`public.is_admin()`) | **ACTIVE** |
| `send-email` | v2 | `verify_jwt: true` | Bearer Auth + Recipient Scope Check | **ACTIVE** |

---

## 4. Repository & Application Build Baseline

| Subsystem | Baseline Specification | Verification Result |
|---|---|---|
| **Node.js Runtime** | Node.js v20+ / Windows x64 | **COMPATIBLE** |
| **Frontend Framework** | React 18.3.1 + TypeScript 5.5.3 + Vite 5.4.21 | **VERIFIED** |
| **CSS Architecture** | Tailwind CSS 3.4.11 + PostCSS + Vanilla Design Tokens | **VERIFIED** |
| **Data Fetching / State** | TanStack React Query v5 + Context API | **VERIFIED** |
| **Static Site Generator** | Custom Playwright Chromium Crawler (`scripts/prerender.js`) | **VERIFIED** (20 static routes) |
| **Lint Status** | `npm run lint` (`eslint .`) | **PASS (0 errors, 0 warnings)** |
| **Type Check Status** | `npx tsc --noEmit` | **PASS (0 errors)** |
| **Build Artifacts** | `npm run build` (`dist/` directory) | **PASS (46 assets, 20 HTML routes)** |
| **Entry JS Bundle Size** | `dist/assets/index-DUp2vlMw.js` | **71.92 kB gzip** (< 200 kB budget) |
| **Entry CSS Bundle Size** | `dist/assets/index-M8uiMiZZ.css` | **15.98 kB gzip** (< 50 kB budget) |

---

## 5. Infrastructure & Delivery Baseline

| Dimension | Configuration File | Observed Specification | Verified Behavior |
|---|---|---|---|
| **Hosting Target** | `vercel.json` | Static JAMstack output directory `dist` | **VERIFIED** |
| **Security Headers** | `vercel.json` | Strict CSP, HSTS (`max-age=63072000; includeSubDomains; preload`), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` | **VERIFIED** |
| **Edge Routing & 404** | `vercel.json` | Prerendered HTML routes served statically; `dist/404.html` returned on missing static assets; dynamic entities route to `dist/index.html` fallback. | **VERIFIED** |
| **Public DNS** | Domain Registrar | Apex domain `houseofpadmavati.com` resolves to NXDOMAIN (pre-launch staging state). | **DEFERRED TO GO-LIVE** |

---

## 6. Multi-Phase Baseline Drift Analysis

| Property | Phase 1 Baseline | Phase 2 Baseline | Phase 3 Baseline | Phase 4 Baseline | Phase 5 Part 1 Current State | Drift Assessment |
|---|---|---|---|---|---|---|
| **Git Commit** | `dab9aab` | `9edd2c0` | `05a0225` | `da6158f` | `da6158f` | **Zero Drift from Phase 4** |
| **Working Tree** | Clean | Uncommitted Diff | Clean | Clean | Clean | **Committed & Clean** |
| **Supabase Staging** | Local / Offline | Partial Migrations | Linked & Tested | Linked & Audited | Linked (`zalbmbhczouhrdboucfe`) | **Stable & 100% Synchronized** |
| **Migrations Applied** | 15 migrations | 18 migrations | 18 migrations | 18 migrations | 18 migrations | **Zero Schema Drift** |
| **Edge Functions** | 3 deployed | 7 deployed | 7 deployed | 7 deployed | 7 deployed (Active v6/v2) | **Zero Function Drift** |
| **Prerender Routes** | 11 static | 15 static | 20 static | 20 static | 20 static | **Zero Route Drift** |

---

## 7. Baseline Conclusion

The system state is stable, fully synchronized between local repository and remote staging environment (`zalbmbhczouhrdboucfe`), and completely isolated from the untouched production project (`kbvjmcnaaogkbnerjcoc`).

**Phase 5 Baseline Status**: **ESTABLISHED & VERIFIED**.
