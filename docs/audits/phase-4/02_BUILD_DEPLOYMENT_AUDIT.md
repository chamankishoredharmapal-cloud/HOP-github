# Phase 4 Build & Deployment Pipeline Audit

**Document Type**: Build Pipeline Verification & Artifact Analysis  
**Audit Target**: `package.json`, `vite.config.ts`, `scripts/prerender.js`, `vercel.json`  
**Execution Date**: 2026-08-17  
**Status**: **ACTUALLY VERIFIED (PASS WITH FINDINGS)**  

---

## 1. Pipeline Verification Summary

The build pipeline consists of three sequential steps executed via `npm run build`:
1. `vite build`: Compiles TypeScript/TSX code, bundles React components, bundles CSS, splits vendor chunks, generates static assets with content hashes into `dist/`.
2. `node -e "require('fs').copyFileSync('public/404.html', 'dist/404.html')"`: Copies the static fallback 404 handler into the distribution root.
3. `node scripts/prerender.js`: Starts a local server, queries published products and collections from Supabase REST API, launches headless Chromium via Playwright, renders every static and dynamic route, extracts metadata/JSON-LD, dehydrates React Query cache, and writes prerendered static HTML files to `dist/`.

---

## 2. Command Execution Evidence

| Command | Exit Code | Time | Output Summary | Status |
|---|---|---|---|---|
| `npm run lint` | `0` | ~1.8s | ESLint exited cleanly with zero errors and zero warnings. | ACTUALLY VERIFIED |
| `npx tsc --noEmit` | `0` | ~2.5s | TypeScript compiler checked all files in `src/` and reported zero type errors. | ACTUALLY VERIFIED |
| `npm run build` | `0` | ~12.4s | Vite built 46 output files; Playwright prerendered 20 routes cleanly. | ACTUALLY VERIFIED |

---

## 3. Prerendered Route Inventory

The following 20 routes were discovered, prerendered, and saved as static HTML with dehydrated React Query state:

1. `/` (`dist/index.html`) — 30.87 kB
2. `/collections` (`dist/collections/index.html`) — 56.78 kB
3. `/collections/kalyani` (`dist/collections/kalyani/index.html`) — 50.47 kB
4. `/collections/organza` (`dist/collections/organza/index.html`) — 50.32 kB
5. `/collections/daily` (`dist/collections/daily/index.html`) — 50.28 kB
6. `/collections/bridal` (`dist/collections/bridal/index.html`) — 50.29 kB
7. `/collections/chanderi` (`dist/collections/chanderi/index.html`) — 50.31 kB
8. `/about` (`dist/about/index.html`) — 43.96 kB
9. `/customer-care` (`dist/customer-care/index.html`) — 46.74 kB
10. `/privacy-policy` (`dist/privacy-policy/index.html`) — 43.82 kB
11. `/terms` (`dist/terms/index.html`) — 43.80 kB
12. `/shipping` (`dist/shipping/index.html`) — 43.81 kB
13. `/returns` (`dist/returns/index.html`) — 43.81 kB
14. `/journal` (`dist/journal/index.html`) — 44.21 kB
15. `/lookbook` (`dist/lookbook/index.html`) — 45.90 kB
16. `/campaigns/quiet-wedding` (`dist/campaigns/quiet-wedding/index.html`) — 44.54 kB
17. `/product/3d123e03-be1b-4454-a0c3-14e809146d92` (`dist/product/3d123e03-be1b-4454-a0c3-14e809146d92/index.html`) — 55.34 kB
18. `/product/65b12852-c36b-4e09-9fd9-1e1498b8b849` (`dist/product/65b12852-c36b-4e09-9fd9-1e1498b8b849/index.html`) — 55.28 kB
19. `/product/7e32f418-f2b1-4f11-9a7c-502a24c56858` (`dist/product/7e32f418-f2b1-4f11-9a7c-502a24c56858/index.html`) — 55.31 kB
20. `/product/a2799dd3-80a5-4cc4-b510-031678a2c1f7` (`dist/product/a2799dd3-80a5-4cc4-b510-031678a2c1f7/index.html`) — 55.30 kB

In addition, the static edge fallback `dist/404.html` was verified present and standalone.

---

## 4. Build Reproducibility & Bundle Analysis

| Output Chunk | Uncompressed Size | Gzipped Size | Classification |
|---|---|---|---|
| `index-M8uiMiZZ.css` | 91.98 kB | 15.98 kB | Core CSS bundle |
| `index-DUp2vlMw.js` | 281.15 kB | 71.92 kB | Main app entry |
| `vendor-radix-DJ9JhmTn.js` | 272.60 kB | 87.88 kB | UI Primitives |
| `vendor-supabase-BD8Oym-R.js` | 216.18 kB | 56.08 kB | Supabase client SDK |
| `vendor-query-Bf4_xT2V.js` | 45.05 kB | 13.37 kB | TanStack Query |
| `vendor-icons-C7UXer5C.js` | 23.71 kB | 5.00 kB | Lucide Icons |
| `ProductDetail-BJWi6Wtg.js` | 32.47 kB | 11.99 kB | Lazy route chunk |
| `ProductWorkspace-C-g7NroG.js` | 26.40 kB | 6.18 kB | Lazy admin chunk |
| `Inventory-ypbuDp1p.js` | 18.47 kB | 5.25 kB | Lazy admin chunk |

All lazy route chunks are < 35 kB. All assets feature SHA-based content hashes for immutable caching.
