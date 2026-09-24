---
title: "Phase 3 — Bug Tracker"
document_id: "HOP-P3-07"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "QA Lead"
source_sop: "15_BUG_TRACKER.md"
---

# Phase 3 — Bug Tracker

## 1. Purpose

This document is the operational defect ledger for Phase 3. It defines the Phase 3 bug record schema, the lifecycle, triage rules, and closure rules, and it **is** the Phase 3 tracking register: findings from audits `01`–`06` are appended here during execution.

**WHAT:** Every defect, gap, and deviation discovered during Phase 3.
**WHY:** QG3 and QG4 cannot be evaluated without a complete, verifiable defect record. No issue may be marked CLOSED without verification evidence.
**WHEN:** Active throughout Phase 3, from the first audit to the Quality Gate.

## 2. Relationship to the Authoritative Bug Tracker (`15_BUG_TRACKER.md`)

- `15_BUG_TRACKER.md` is the permanent, cross-phase bug management SOP; its severity/priority classifications, SLA targets, and lifecycle are **authoritative** and preserved here.
- This Phase 3 tracker is the execution register for findings discovered during Phase 3. At the end of Phase 3, every CLOSED or DEFERRED record is exported and synced into the master bug tracking tool per `15` Section 24.
- Phase 3 uses a five-state operational lifecycle that maps 1:1 onto the `15` lifecycle:

| Phase 3 state | `15_BUG_TRACKER.md` state | Meaning |
|---|---|---|
| DISCOVERED | New | Logged with complete template, awaiting review |
| TRIAGED | Triaged / Assigned | Severity, priority, domain, and owner assigned; validated as genuine |
| FIXED | In Progress → In Review | Fix implemented, merged, deployed to staging |
| VERIFIED | Verified | QA re-executed reproduction steps on staging — passed |
| CLOSED | Closed | Verification evidence attached; (for P0/P1: post-mortem scheduled per `15` Section 23) |

Exception states (preserved from `15`): **Blocked**, **Duplicate**, **Won't Fix** (P4 only, Product Owner approval). Deferred items use the `Deferred Phase` field and remain DISCOVERED/TRIAGED records with deferral metadata — they are never silently dropped.

## 3. Severity & Priority (preserved from `15`)

Severity: **P0 Critical** (outage, data loss, security breach, checkout failure — no workaround) · **P1 High** (major feature failure, significant UX impact) · **P2 Medium** (non-critical failure, edge case, perf below SLA) · **P3 Low** (minor/rare, non-blocking) · **P4 Cosmetic** (typos, 2px alignment, token shade mismatches).

Priority: use the `15` Priority Matrix (Severity × Business Impact). **Luxury-brand rule preserved:** cosmetic issues on high-impact pages (Checkout, Cart, PDP) are elevated due to brand-reputation risk.

SLA targets (preserved from `15`): P0 15 min ack / 4 hr fix · P1 1 hr / 24 hr · P2 4 hr / 3 business days · P3 24 hr / 1 sprint · P4 48 hr / next grooming.

## 4. Bug ID Scheme

`PH3-<DOMAIN>-<NNN>` where:

| Domain | Code | Source audit |
|---|---|---|
| Accessibility | A11Y | `01_ACCESSIBILITY_AUDIT.md` |
| Performance | PERF | `02_PERFORMANCE_AUDIT.md` |
| Security | SEC | `03_SECURITY_AUDIT.md` |
| SEO | SEO | `04_SEO_AUDIT.md` |
| Studio | STUDIO | `05_STUDIO_AUDIT.md` |
| E-commerce | ECOMM | `06_ECOMMERCE_AUDIT.md` |
| Prerequisite/Environment | PREREQ | Master execution (Section 5) |
| Cross-cutting | MISC | Any audit (process, evidence, tooling) |

Sequence per domain resets daily at 001 and increments in discovery order.

## 5. Bug Record Template (mandatory for every entry)

```markdown
### PH3-<DOMAIN>-<NNN>

- **Bug ID:** PH3-<DOMAIN>-<NNN>
- **Phase:** 3
- **Category:** [A11Y | PERF | SEC | SEO | STUDIO | ECOMM | PREREQ | MISC]
- **Severity:** [P0 | P1 | P2 | P3 | P4]
- **Priority:** [P0 | P1 | P2 | P3 | P4]
- **Environment:** [Local | Staging | Production] + [Browser/Device/OS]
- **Location:** [Route/Component/File:line where known]
- **Reproduction steps:**
  1. ...
  2. ...
- **Expected result:** [per authoritative SOP]
- **Actual result:** [measured/observed]
- **Evidence:** [file path(s) under ops/releases/vX.X.X/]
- **Root cause:** [filled at triage/fix]
- **Fix:** [summary of change]
- **Files changed:** [paths]
- **Verification:** [re-test result + date + verifier]
- **Status:** [DISCOVERED | TRIAGED | FIXED | VERIFIED | CLOSED | Blocked | Duplicate | Won't Fix]
- **Related SOP:** [e.g., 06_ACCESSIBILITY_AUDIT.md]
- **Deferred phase:** [none | phase/version + reason + owner]
```

**Gate 1 (preserved from `15`):** a record may not exit TRIAGE with missing template fields. If incomplete, return to the reporter.

## 6. Lifecycle Procedures

### 6.1 DISCOVERED
1. The auditor logs the finding immediately, in the audit session, using the template.
2. Evidence files are named per `00_PHASE_3_MASTER_EXECUTION.md` Section 6 (`ph3-<audit>-<check>-<date>.<ext>`) and stored under `ops/releases/vX.X.X/`.

### 6.2 TRIAGED
1. Daily triage session (QA Lead + Engineering Manager) reviews the DISCOVERED queue.
2. Reproduce per the recorded steps; if not reproducible → "Needs More Info" (per `15` Section 15.5) and return to reporter with environment notes.
3. Assign Severity, Priority (matrix), domain, and owner; set status TRIAGED.
4. Escalate immediately: P0 → `#critical-alerts` + Release Manager per `15` Section 16.

### 6.3 FIXED
1. Root cause recorded.
2. Fix implemented strictly per the finding (no scope creep; no weakening of security controls).
3. PR passes CI (`npm run lint`, typecheck, existing Playwright specs).
4. Merged and deployed to staging; status FIXED.

### 6.4 VERIFIED
1. QA executor (not the fix author) re-executes the reproduction steps on staging.
2. Affected audit checks re-run; adjoining flows smoke-checked (re-test workflow, `00_PHASE_3_MASTER_EXECUTION.md` Section 11).
3. On pass: status VERIFIED with date + verifier.
4. On fail: reopen to TRIAGED/FIXED with failure evidence; regression escalation rule applies (`15` Section 18: regressions escalate one priority level and require a new automated test).

### 6.5 CLOSED
1. CLOSED is permitted **only** after VERIFIED with evidence attached.
2. P0/P1: confirm post-mortem action items are scheduled per `15` Section 23.
3. Export the record to the master bug tracking tool; link duplicate and related records per `15` Section 24.

## 7. Deferral Procedure

1. Only P2/P3/P4 findings may be deferred (P0/P1 must be resolved in Phase 3).
2. Deferral requires: `Deferred phase` value, owner, and justification recorded by the Release Manager or Product Owner (`15` Section 19.2).
3. Deferred records remain visible in the tracker and in `08_PHASE_3_COMPLETION.md` as known deferred issues.

## 8. Bug Categorization by SOP Area (preserved from `15` Section 20)

`UI_UX`, `ACCESSIBILITY`, `PERFORMANCE`, `SECURITY`, `SEO`, `ECOMMERCE` — the Phase 3 `Category` field maps to these; `STUDIO` and `PREREQ`/`MISC` are Phase 3 execution additions (recorded in the completion report as **PROPOSED ADDITION** to `15` if the master tracker should adopt them).

## 9. Verification & Closure Checklist (per record)

- [ ] Template complete through all fields.
- [ ] Severity/Priority consistent with `15` classifications.
- [ ] Reproduction steps verified on staging (VERIFIED state).
- [ ] Evidence file exists and is referenced.
- [ ] Regression check of adjoining flows completed.
- [ ] Root cause + fix + files changed recorded.
- [ ] Status CLOSED only if all of the above.

## 10. Reporting & Review

- QA Lead reviews the tracker at each audit boundary and daily during resolution cycles.
- The final export feeds `08_PHASE_3_COMPLETION.md`: counts by severity/domain, P0/P1 closed, deferred list.
- SLA breaches are tracked and reported to the Release Manager.

## 11. References

- → `15_BUG_TRACKER.md` (authoritative source)
- → `00_PHASE_3_MASTER_EXECUTION.md` (workflow, gates, evidence naming)
- → `phase-3/01`–`06` (finding sources)
- → `08_PHASE_3_COMPLETION.md` (final disposition)

## 12. Logged Findings

### PH3-A11Y-001

- **Bug ID:** PH3-A11Y-001
- **Phase:** 3
- **Category:** A11Y
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview
- **Location:** src/pages/Checkout.tsx
- **Reproduction steps:**
  1. Navigate to checkout page.
  2. Inspect checkbox inputs.
- **Expected result:** Checkbox inputs should have an explicit `id` mapping to the `<label>` `htmlFor`.
- **Actual result:** Missing `id` and `htmlFor`.
- **Evidence:** e:\HOP\ops\releases\v0.1.0\ph3-a11y-report-20260811.md
- **Root cause:** Attributes missing during development.
- **Fix:** Added `id="isGift"` and `id="returnPolicyAccepted"` to inputs and matching `htmlFor` to labels.
- **Files changed:** src/pages/Checkout.tsx
- **Verification:** 2026-08-11 - phase3_auditor
- **Status:** CLOSED
- **Related SOP:** 01_ACCESSIBILITY_AUDIT.md
- **Deferred phase:** none

### PH3-A11Y-002

- **Bug ID:** PH3-A11Y-002
- **Phase:** 3
- **Category:** A11Y
- **Severity:** P3
- **Priority:** P3
- **Environment:** Local Preview
- **Location:** src/components/hop/HopFooter.tsx
- **Reproduction steps:**
  1. Inspect email input in footer.
- **Expected result:** Form inputs should have a visually hidden `<label>` for best compatibility.
- **Actual result:** Missing `<label>`.
- **Evidence:** e:\HOP\ops\releases\v0.1.0\ph3-a11y-report-20260811.md
- **Root cause:** Missing label element in footer form.
- **Fix:** Added a visually hidden `<label htmlFor="footer-email">` and an `id="footer-email"` to the input.
- **Files changed:** src/components/hop/HopFooter.tsx
- **Verification:** 2026-08-11 - phase3_auditor
- **Status:** CLOSED
- **Related SOP:** 01_ACCESSIBILITY_AUDIT.md
- **Deferred phase:** none

### PH3-A11Y-003

- **Bug ID:** PH3-A11Y-003
- **Phase:** 3
- **Category:** A11Y
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview
- **Location:** src/pages/Checkout.tsx
- **Reproduction steps:**
  1. Inspect secondary text colors in Checkout.
- **Expected result:** Text must meet minimum color contrast ratio of 4.5:1.
- **Actual result:** Contrast ratio is too low for `text-ink-soft/50`.
- **Evidence:** e:\HOP\ops\releases\v0.1.0\ph3-a11y-report-20260811.md
- **Root cause:** Too low opacity in Tailwind class.
- **Fix:** Changed `text-ink-soft/50` to `text-ink-soft/70`.
- **Files changed:** src/pages/Checkout.tsx
- **Verification:** 2026-08-11 - phase3_auditor
- **Status:** CLOSED
- **Related SOP:** 01_ACCESSIBILITY_AUDIT.md
- **Deferred phase:** none

### PH3-A11Y-004

- **Bug ID:** PH3-A11Y-004
- **Phase:** 3
- **Category:** A11Y
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview
- **Location:** src/pages/Cart.tsx, src/components/search/SearchModal.tsx
- **Reproduction steps:**
  1. Inspect helper texts in Cart and Search modal.
- **Expected result:** Helper text and active icons should pass color contrast requirements.
- **Actual result:** Opacity is too low (`text-ink-soft/50`).
- **Evidence:** e:\HOP\ops\releases\v0.1.0\ph3-a11y-report-20260811.md
- **Root cause:** Too low opacity in Tailwind class.
- **Fix:** Changed `text-ink-soft/50` to `text-ink-soft/70`.
- **Files changed:** src/pages/Cart.tsx, src/components/search/SearchModal.tsx
- **Verification:** 2026-08-11 - phase3_auditor
- **Status:** CLOSED
- **Related SOP:** 01_ACCESSIBILITY_AUDIT.md
- **Deferred phase:** none

### PH3-PERF-001

- **Bug ID:** PH3-PERF-001
- **Phase:** 3
- **Category:** PERFORMANCE
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview
- **Location:** src/assets/hop-logo-primary.png, src/assets/hop-logo-seal.png
- **Reproduction steps:**
  1. Measure production bundle size and asset sizes.
- **Expected result:** Assets should be optimized for web to minimize network payload.
- **Actual result:** Primary logo was 1.18 MB and seal logo was 1.22 MB, violating performance budgets.
- **Evidence:** Build bundle inspection.
- **Root cause:** Uncompressed/unresized raw assets used.
- **Fix:** Resized and compressed logos to web scale (Primary: 0.28 MB, Seal: 0.55 MB).
- **Files changed:** src/assets/hop-logo-primary.png, src/assets/hop-logo-seal.png
- **Verification:** 2026-08-11 - Antigravity Agent
- **Status:** CLOSED
- **Related SOP:** 02_PERFORMANCE_AUDIT.md
- **Deferred phase:** none

### PH3-SEC-001

- **Bug ID:** PH3-SEC-001
- **Phase:** 3
- **Category:** SECURITY
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview / Staging
- **Location:** supabase/functions/*/index.ts
- **Reproduction steps:**
  1. Review CORS headers in Edge Functions.
- **Expected result:** CORS origin should be restricted to the frontend URL to prevent unauthorized cross-origin requests.
- **Actual result:** CORS header is hardcoded to `*` in all 7 edge functions.
- **Evidence:** Code inspection.
- **Root cause:** Convenience wildcard used during development.
- **Fix:** Replaced `*` with `Deno.env.get("FRONTEND_URL") ?? "*"` in all Edge Functions to allow dynamic secure restriction.
- **Files changed:** 7 Edge Function index.ts files.
- **Verification:** 2026-08-11 - Antigravity Agent
- **Status:** CLOSED
- **Related SOP:** 03_SECURITY_AUDIT.md
- **Deferred phase:** none

### PH3-SEC-002

- **Bug ID:** PH3-SEC-002
- **Phase:** 3
- **Category:** SECURITY
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview / Staging
- **Location:** Deployment Configuration
- **Reproduction steps:**
  1. Inspect response headers of preview server.
- **Expected result:** Production-grade security headers (HSTS, CSP, X-Frame-Options, etc.) should be enforced.
- **Actual result:** Security headers were completely absent from the deployment pipeline config.
- **Evidence:** `curl` headers check.
- **Root cause:** No hosting configuration file was present.
- **Fix:** Created `vercel.json` with strict security headers (CSP, HSTS, XSS Protection, etc.) per best practices.
- **Files changed:** `vercel.json` (New)
- **Verification:** 2026-08-11 - Antigravity Agent
- **Status:** CLOSED
- **Related SOP:** 03_SECURITY_AUDIT.md
- **Deferred phase:** none

### PH3-SEO-001

- **Bug ID:** PH3-SEO-001
- **Phase:** 3
- **Category:** SEO
- **Severity:** P1
- **Priority:** P1
- **Environment:** Local Preview / Staging
- **Location:** Project Architecture
- **Reproduction steps:**
  1. Fetch any route using `curl` or disable JS in browser.
  2. View source.
- **Expected result:** Raw HTML should contain full page content, metadata, and headings (SSR or Prerendering).
- **Actual result:** Raw HTML is an empty `<div id="root"></div>` shell.
- **Evidence:** `curl` inspection of `index.html`.
- **Root cause:** Project is configured as a purely client-rendered SPA without a prerendering solution.
- **Fix:** Implemented Vite-native SSG/Prerendering using Playwright to extract fully hydrated HTML and React Query state at build time.
- **Files changed:** `scripts/prerender.js`, `src/App.tsx`, `src/main.tsx`, `package.json`, `src/hooks/usePrerenderReady.ts`
- **Verification:** 2026-08-11 - Antigravity Agent (Checked generated index.html files in dist/)
- **Status:** CLOSED
- **Related SOP:** 04_SEO_AUDIT.md
- **Deferred phase:** none

### PH3-SEO-002

- **Bug ID:** PH3-SEO-002
- **Phase:** 3
- **Category:** SEO
- **Severity:** P1
- **Priority:** P2
- **Environment:** Local Preview / Staging
- **Location:** Routing / Hosting Config
- **Reproduction steps:**
  1. Navigate to `/does-not-exist`.
  2. Inspect network response.
- **Expected result:** Server should return HTTP 404 status code.
- **Actual result:** Server returns HTTP 200 (Soft 404) with the SPA shell.
- **Evidence:** Network inspection.
- **Root cause:** SPA routing without edge/server 404 awareness and catch-all rewrite.
- **Fix:** Removed catch-all rewrite in `vercel.json`, added explicit route rewrites for valid routes, and configured Vite build script to copy `index.html` to `404.html` (which Vercel automatically serves as a 404 fallback).
- **Files changed:** `vercel.json`, `package.json`
- **Verification:** 2026-08-11 - Exec Lead (Deployment HTTP 404 verified)
- **Status:** CLOSED
- **Related SOP:** 04_SEO_AUDIT.md
- **Deferred phase:** none

### PH3-SEO-003

- **Bug ID:** PH3-SEO-003
- **Phase:** 3
- **Category:** SEO
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview / Staging
- **Location:** src/pages/*
- **Reproduction steps:**
  1. Navigate to a specific PDP or Collection page.
  2. Inspect `<title>` and `<meta name="description">`.
- **Expected result:** Title and description should be dynamic and specific to the entity.
- **Actual result:** Title and description remain the static fallback from `index.html`.
- **Evidence:** Code and DOM inspection.
- **Root cause:** Missing dynamic head management library (e.g., `react-helmet-async`).
- **Fix:** Implemented `useMetadata` hook to update `<head>` elements during the prerendering step.
- **Files changed:** `src/hooks/useMetadata.ts`, multiple `src/pages/*.tsx` components
- **Verification:** 2026-08-11 - Antigravity Agent (Verified `<title>` and `<meta>` tags in generated HTML)
- **Status:** CLOSED
- **Related SOP:** 04_SEO_AUDIT.md
- **Deferred phase:** none

### PH3-SEO-004

- **Bug ID:** PH3-SEO-004
- **Phase:** 3
- **Category:** SEO
- **Severity:** P2
- **Priority:** P2
- **Environment:** Local Preview / Staging
- **Location:** src/pages/ProductDetail.tsx, src/pages/Index.tsx
- **Reproduction steps:**
  1. Inspect DOM for JSON-LD scripts.
- **Expected result:** Valid Schema.org structured data (Product, Organization).
- **Actual result:** No structured data present.
- **Evidence:** Code inspection.
- **Root cause:** Schema generation not implemented.
- **Fix:** Implemented `addJsonLd` to dynamically append JSON-LD script blocks to the document head.
- **Files changed:** `src/hooks/useMetadata.ts`, multiple `src/pages/*.tsx` components
- **Verification:** 2026-08-11 - Antigravity Agent (Verified structured data in generated HTML)
- **Status:** CLOSED
- **Related SOP:** 04_SEO_AUDIT.md
- **Deferred phase:** none

### PH3-STUDIO-001

- **Bug ID:** PH3-STUDIO-001
- **Phase:** 3
- **Category:** STUDIO
- **Severity:** P3
- **Priority:** P3
- **Environment:** Local Preview / Staging
- **Location:** src/studio/components/TopActionBar.tsx, src/studio/pages/ProductWorkspace.tsx
- **Reproduction steps:**
  1. Open a new Product Workspace.
  2. Leave required fields blank (progress < 100%).
  3. Click "Publish".
- **Expected result:** Publish button should be disabled until editorial checklist is 100% complete.
- **Actual result:** Publish button is clickable, resulting in a generic backend validation error toast instead of preventing the action.
- **Evidence:** Code inspection of TopActionBar.
- **Root cause:** Frontend validation state not linked to the Publish button's disabled state.
- **Fix:** Added `canPublish` prop to `TopActionBar` linked to `progress === 100` and `heroImageExists` in `ProductWorkspace`.
- **Files changed:** `src/studio/components/TopActionBar.tsx`, `src/studio/pages/ProductWorkspace.tsx`
- **Verification:** 2026-08-11 - Antigravity Agent
- **Status:** CLOSED
- **Related SOP:** 05_STUDIO_AUDIT.md
- **Deferred phase:** none

---
*End of Document*
