---
title: "Phase 3 — Performance Audit"
document_id: "HOP-P3-02"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "Performance Engineer"
reviewer: "Technical Lead"
source_sop: "07_PERFORMANCE_AUDIT.md"
---

# Phase 3 — Performance Audit

## 1. Purpose

This procedure validates that the HOP platform meets every performance budget documented in `07_PERFORMANCE_AUDIT.md` and `01_PRE_PRODUCTION_AUDIT.md`, on the production build served from staging. It is the executable, evidence-driven implementation of the performance SOP for Phase 3.

**WHAT is being tested:** build performance, page load, Core Web Vitals, bundle sizes, CSS, images, video, fonts, lazy loading, network requests, caching, third-party resources, mobile performance, runtime performance, production build behavior.
**WHY:** "Performance is indistinguishable from quality in luxury digital experiences" (`07` Purpose). QG3 gates on Lighthouse >= 90 Desktop / >= 85 Mobile.
**WHEN:** Second audit of Phase 3 (after Accessibility). Also re-executed on affected pages after any performance-relevant fix.

## 2. Scope

Frontend assets (React 18, Vite 5, Tailwind 3), Supabase interactions, Razorpay and analytics scripts, media delivery, CDN/caching, desktop + mobile under simulated constraints. Key pages: **Index, Collection (Category/PLP), Product Detail, Cart, Checkout** (per `07` Step 1 and QG3).

## 3. Definitions

Preserved from `07`: CWV, LCP, INP, CLS, TTI, TBT, FOIT/FOUT. **Additional:** TTFB (Time to First Byte), gzipped payload (transfer size after compression).

## 4. Roles & Responsibilities

Per `07`: Performance Engineer (executes), Frontend/Backend Engineers (fixes), DevOps (caching/CDN), QA Automation (CI integration), Technical Lead (approval).

## 5. Prerequisites

- Production build (`npm run build`) deployed to staging; staging mirrors production configuration with production data volumes.
- CDN and caching layers enabled (verify per `01` Phase 7 Step 2: static assets served with `public, max-age=31536000, immutable`).
- Analytics/external scripts active to measure real-world impact (`07` Pre-Audit Checklist).
- Tools: Chrome DevTools (Lighthouse, Performance, Memory, Network, Rendering), `npm`, Supabase dashboard, WebPageTest (optional).
- `rollup-plugin-visualizer` — **PROPOSED ADDITION**: not currently in `package.json`. If not approved/installed, use the Vite build output chunk table plus Lighthouse and DevTools as the bundle evidence (recorded variance).

## 6. Inputs / Outputs

**Inputs:** staging URL, `package.json`, `vite.config.ts`, asset inventory, route config.
**Outputs:** Performance Audit Report, CWV logs, bundle analysis, optimization tickets, signed-off certification.

## 7. Dependencies

- Follows `06` in Phase 3 order (preserved). Relies on asset readiness from Studio (`10_STUDIO_AUDIT.md` / Phase 3 Studio audit).
- Threshold reconciliation: see `00_PHASE_3_MASTER_EXECUTION.md` Section 5.4.

## 8. Execution Order

1. Build performance & production build behavior
2. Core Web Vitals & Lighthouse
3. Bundle analysis
4. Images & video
5. Fonts
6. CSS
7. Runtime (React, animations, memory)
8. API & caching (Supabase / React Query)
9. Network waterfall & third-party resources
10. Mobile & throttled conditions

---

## 9. Detailed Step-by-Step Procedures

### Phase 1 — Build Performance & Production Build Behavior

1. Execute `npm run build` on the release branch. Record: total build time (seconds), any warnings (chunk size warnings, deprecated plugins), and the `dist/` output size.
2. Execute `npm run preview` and confirm built assets serve correctly (no 404s on hashed assets).
3. Verify production mode is active (`NODE_ENV=production`; minified output; Tailwind purge active per `07` Step 7.1).
4. Verify route-based code splitting is present: confirm the `dist/assets/` directory contains multiple JS chunks and that heavy routes (Category, ProductDetail, Collections, Journal, Lookbook, Studio pages, Appointments) are lazy-loaded. **Reference implementation:** `src/App.tsx` uses `React.lazy`/`Suspense` for these routes.

**PASS:** build succeeds with exit code 0; no chunk exceeds 500KB gzipped without documented code-splitting justification (`01` Phase 4 Step 5); lazy chunks exist. **FAIL:** build error, oversized chunk, or missing split → finding.

### Phase 2 — Core Web Vitals & Lighthouse

1. Run Lighthouse (incognito) on Index, Category, PDP, Cart, Checkout — Desktop and Mobile. Save reports `ph3-perf-lighthouse-<page>-<device>-<date>.json`.
2. Record CWV and scores:

| Metric | Audit target (`07`) | QG3 gate minimum | FAIL if |
|---|---|---|---|
| LCP | <= 2.0s | — | > 2.0s (audit), > 2.5s (PRR hard limit) |
| INP | <= 100ms | — | > 100ms |
| CLS | <= 0.05 | — | > 0.05 |
| TBT | < 150ms | — | >= 150ms |
| Lighthouse Performance | >= 95 | >= 90 Desktop / >= 85 Mobile | < 95 audit / < gate on key pages |
| Best Practices | 100 | — | < 100 |
| SEO | 100 | — | < 100 (cross-check in SEO audit) |

3. Address any Lighthouse "Opportunity" saving more than 100ms per `07` Step 2.3 (log as finding if not addressable in-scope).

**PASS:** all metrics meet audit targets on all five pages × both devices.
**FAIL:** any metric below threshold → finding with measured values.

### Phase 3 — Bundle Size Analysis

1. Run bundle analysis: `npx vite build --mode production` with visualizer (if approved) → `stats.html`; else record the Vite build chunk table.
2. Verify (per `07` Step 3):
   - Total JavaScript payload for initial load < **250KB gzipped**.
   - Tree-shaking removes unused exports (shadcn/ui, lucide-react).
   - Vendor chunking present (e.g., `vendor`/React chunk).
   - Document the 3 largest chunks; justify any chunk > 100KB gzipped.
3. CSS: generated CSS file < **30KB gzipped** (`07` Step 7.2); DevTools Coverage shows > 90% CSS utilization on critical paths.

**PASS:** all three checks. **FAIL:** over-budget payload/CSS or unjustified chunk → finding.

### Phase 4 — Images & Video

1. Verify product images served in **AVIF (primary) with WebP fallback** (`07` Step 4.1).
2. Verify `srcset`/`sizes` attributes on responsive `<img>` elements.
3. Verify `loading="lazy"` on all below-the-fold images; **LCP images (hero, primary product image) use `fetchpriority="high"` and are NOT lazy-loaded**.
4. Verify intrinsic `width`/`height` (or `aspect-ratio`) attributes to prevent CLS.
5. Video (if any on Lookbook/Index): verify `<video>` uses preload metadata, poster image, and lazy/autoplay-muted handling per Studio asset standards.
6. Image file naming: descriptive hyphenated names (cross-checked in SEO audit).

**PASS:** all checks. **FAIL:** missing format, missing srcset, lazy-loaded LCP image, or missing dimensions → finding.

### Phase 5 — Font Loading Strategy

HOP fonts: **Cormorant Garamond, Inter, Vonca Regular** (`07` Step 5; brand standards).

1. Verify fonts preloaded in `<head>` via `<link rel="preload" as="font" ... crossorigin>`.
2. Verify `font-display: swap` for body text (Inter) and `font-display: swap|optional` for display text (Cormorant Garamond, Vonca) to minimize FOIT/FOUT.
3. Verify fonts served as **WOFF2, subsetted**, from a trusted origin.
4. Network tab: fonts must not block rendering.

**PASS:** all checks. **FAIL:** un-preloaded render-blocking fonts, missing font-display, non-WOFF2 → finding.

### Phase 6 — Runtime Performance

1. **React rendering:** DevTools Profiler on Cart and PDP; identify components re-rendering more than twice unnecessarily (`07` Step 6.2); verify `useMemo`/`useCallback` where justified.
2. **Animations:** enable Rendering → Frame Rendering Stats; trigger menu open, cart drawer, page transitions; **verify consistent 60fps** and GPU-accelerated properties only (`transform`, `opacity`).
3. **Memory:** Heap Snapshot on Home → navigate Collections → PDP → Cart → Home → second snapshot. **Verify:** no detached DOM nodes / uncollected objects.

**PASS:** no excessive renders, 60fps animations, clean heap comparison. **FAIL:** jank (<60fps) or leak evidence → finding.

### Phase 7 — API Performance & Caching

1. Network tab: record Supabase query and Edge Function response times on PDP (product fetch), Category (listing), Checkout (create-razorpay-order).
2. **Edge Function response time < 200ms (95th percentile)** (`07` Step 8.2).
3. Slow endpoints: run `EXPLAIN ANALYZE` in the Supabase SQL editor on the staging project; verify indexes exist on queried columns.
4. TanStack React Query configuration: static catalog data uses `staleTime: 5 * 60 * 1000` per `07`; no aggressive polling.
5. Browser/CDN cache headers: static assets `immutable, max-age=31536000`; API responses cached where applicable.

**PASS:** all checks. **FAIL:** function latency >= 200ms p95, missing indexes, missing cache headers → finding.

### Phase 8 — Network Waterfall & Third-Party Resources

1. Load Index and PDP with empty cache. Inspect the waterfall: no long request chains; critical requests prioritized/parallelized.
2. Third-party scripts (analytics, Razorpay): verify `defer`/`async` for analytics; **Razorpay `checkout.js` loads dynamically only when checkout is initiated** (reference: `src/lib/razorpay.ts` `loadRazorpayScript`) — verify via Network tab that it is absent on Index/PDP and present only on Checkout.
3. Resource hints: `preconnect`/`dns-prefetch` for Supabase, Razorpay, CDN origins as applicable.

**PASS:** clean waterfall, deferred third-party, dynamic Razorpay load. **FAIL:** render-blocking third-party or premature Razorpay load → finding.

### Phase 9 — Mobile Performance & Throttling

1. DevTools mobile emulation; **Fast 3G** network + **4x CPU slowdown** (`07` Step 13).
2. Navigate Index → Category → PDP → Cart. **Verify TTI < 4.0s** under constraint; UI responsive during data fetch (no freezes).
3. Record RUM-style measurements if Web Vitals tracking active in staging (`01` Phase 8 Step 4).

**PASS:** TTI < 4.0s, no UI freezing. **FAIL:** TTI >= 4.0s or frozen UI → finding.

---

## 10. Validation Steps

1. Execute each phase and record values in the checklist.
2. Re-run Lighthouse CI checks (if configured in CI) must pass.
3. Visual inspection of waterfall for optimized loading.

## 11. Evidence Required (per `07` Section "Evidence Required")

- Lighthouse screenshots/JSON (Desktop + Mobile).
- Network waterfall screenshot for initial load (Index, PDP).
- Bundle analysis output (`stats.html` or build chunk table).
- DevTools Performance trace `.json` during key interactions.
- Heap snapshot comparison export.
- Supabase `EXPLAIN ANALYZE` output for any slow query.

## 12. Pass / Fail Criteria (checklist-level)

| Check | PASS | FAIL |
|---|---|---|
| Build | exit 0, no chunk > 500KB gzip | build error / oversized chunk |
| LCP / INP / CLS / TBT | <= 2.0s / <= 100ms / <= 0.05 / < 150ms | any exceeded |
| Lighthouse Perf | >= 95 (audit); >= 90/85 gate | below gate on any key page |
| JS payload | < 250KB gzipped initial | exceeded |
| CSS | < 30KB gzipped, > 90% utilization | exceeded |
| Images/Video | AVIF/WebP, srcset, lazy correct, LCP eager+preloaded | any violation |
| Fonts | WOFF2 subsetted, preloaded, swap/optional | render-blocking or FOIT |
| Runtime | 60fps, no leak, no excess renders | jank / leak |
| API | Edge Functions < 200ms p95 | >= 200ms |
| Caching | immutable static headers | missing headers |
| Mobile throttled | TTI < 4.0s | TTI >= 4.0s |

## 13. After FAIL / Remediation & Re-test

1. **Document** failures in `07_PHASE_3_BUG_TRACKER.md` (category `PERF`; severity per `15`).
2. **Fix** only documented findings, using the remedies in `07` Troubleshooting (preload LCP element, reserve aspect ratios, animate transform/opacity only, defer third-party scripts, cache API responses).
3. **Verify** by re-running the exact failed measurement on staging.
4. **Re-test** the affected phase plus a Lighthouse pass on the affected page; confirm no CWV regression.
5. **Close** only with evidence attached.

## 14. Performance Exceptions

Any unavoidable exception (e.g., third-party script bloat) must be logged in `PERFORMANCE_EXCEPTIONS.md` with technical justification, per `07` Documentation Requirements.

## 15. Common Failure Scenarios (preserved from `07`)

Large lazy-loaded LCP hero; render-blocking scripts in `<head>`; CLS from dynamic banners/images without reserved space; high TBT during hydration; uncached Supabase responses.

## 16. Troubleshooting (preserved from `07`)

- High LCP → check waterfall position of LCP element; preload; investigate TTFB.
- CLS non-zero → DevTools Experience track; assign aspect-ratio/width/height.
- Janky animations → animate only transform/opacity; promote layers.

## 17. Best Practices (preserved from `07`)

Aggressive route-level code splitting; optimistic UI with React Query mutations; liberal `preconnect`/`dns-prefetch`/`preload`.

## 18. Standards

Google Web Vitals · HTTP/2 & HTTP/3 · W3C Resource Hints (per `07`).

## 19. Sign-off Requirements

Performance Engineer · Technical Lead · Product Owner acknowledgement (per `07`).

## 20. Completion Criteria

All targets met on staging, evidence collected, exceptions documented, Technical Lead sign-off.

## 21. References

- → `07_PERFORMANCE_AUDIT.md` (authoritative source)
- → `01_PRE_PRODUCTION_AUDIT.md` (build thresholds)
- → `00_MASTER_EXECUTION_PLAN.md` (QG3 gate)
- → `08_PHASE_3_COMPLETION.md`
- → `07_PHASE_3_BUG_TRACKER.md`
- → `09_SEO_AUDIT.md` (CWV/LCP used for SEO)

---
*End of Document*
