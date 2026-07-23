# P1-005 — Build & Bundle Audit

## Summary

Production build and bundle optimization audit of the House of Padmavati codebase. Implemented evidence-based vendor code splitting via Rollup `manualChunks` in `vite.config.ts`. Reduced entry bundle size from 782.4 kB to 255.0 kB (67% reduction) and eliminated Vite chunk size warning (>500 kB).

**Result:** Entry bundle 782.4 kB ➔ 255.0 kB. 0 chunk size warnings.

---

## Initial Findings

During initial baseline production build (`npm run build`), Rollup produced a monolithic main entry chunk:
- `dist/assets/index-*.js`: **782.41 kB** (pre-gzip) / 223.08 kB (gzip)
- Warning emitted: `(!) Some chunks are larger than 500 kB after minification.`

---

## Root Cause Analysis

### Finding 1: Monolithic Vendor Bundling in Entry Chunk

- **Evidence Classification:** VERIFIED
- **Why it existed:** Default Vite/Rollup configuration bundled all third-party node_modules (`@radix-ui/*`, `@supabase/supabase-js`, `@tanstack/react-query`, `lucide-react`, `recharts`) directly into the primary application entry chunk (`index.js`).
- **Validity:** Valid performance issue. Monolithic entry chunks delay time-to-interactive (TTI) and prevent browser parallel script download and caching.
- **Fix applied:** Configured targeted vendor chunking in `vite.config.ts` via `build.rollupOptions.output.manualChunks`:
  - `vendor-radix`: 277.97 kB (Radix UI primitives)
  - `vendor-supabase`: 216.18 kB (Supabase JS client)
  - `vendor-query`: 41.48 kB (TanStack React Query)
  - `vendor-icons`: 23.71 kB (Lucide icons)
  - `index.js`: **255.02 kB** (App entry logic & remaining utilities)

---

## Changes Made

1. **`vite.config.ts`**: Added `build.rollupOptions.output.manualChunks` predicate splitting `@radix-ui`, `@supabase`, `@tanstack`, `lucide-react`, and `recharts` into isolated vendor chunks.

---

## Files Modified

| File | Lines Changed | Change Type |
|------|---------------|-------------|
| `vite.config.ts` | 15 | Configured Rollup manualChunks |

---

## Verification

| Check | Command | Result |
|-------|---------|--------|
| Main Bundle Size | `npm run build` | **255.0 kB** (was 782.4 kB) |
| Chunk Warnings | `npm run build` | **0 warnings** (>500 kB warning eliminated) |
| ESLint | `npm run lint` | 0 errors, 0 warnings |
| TypeScript | `npx tsc --noEmit` | 0 errors |
| Playwright E2E Tests | `npx playwright test` | 14 passed, 4 skipped |

---

## Self Review (Mandatory 5-Question Audit)

1. **Did I modify more files than necessary?** No. Only `vite.config.ts` was updated.
2. **Did I preserve existing behavior?** Yes. Chunking is a pure bundling optimization with zero runtime logic changes.
3. **Did I introduce architectural debt?** No. Vendor chunking is standard Rollup architecture.
4. **Could the solution be simpler?** No. Manual chunking in Vite config is the cleanest standard solution.
5. **Would this pass a senior engineering code review?** Yes. Fully adheres to Performance and Evidence policies.

---

## Remaining Risks

**None.** Bundle split into cached vendor assets under recommended thresholds.

---

## Recommendation

**Close P1-005.** Acceptance criteria satisfied.
