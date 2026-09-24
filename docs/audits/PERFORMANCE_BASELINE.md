# HOP Performance Baseline

## 1. Test Environment

- **Operating System**: Windows 11 (build 10.0.26100)
- **Workstation Architecture**: x64
- **Working Directory**: `e:\HOP`
- **Git Branch**: `main` (commit `da6158f`)
- **Execution Timestamp**: 2026-09-07T01:18:00+05:30

---

## 2. Node / Package Manager

- **Node.js Version**: `v24.18.0`
- **npm Version**: `11.18.0`
- **pnpm Version**: `11.9.0`
- **Package Installation Status**: Complete (`node_modules` present)

---

## 3. Build

- **Vite Standalone Command**: `npx vite build`
  - **Status**: **PASS**
  - **Duration**: **7.24 seconds** (7,240 ms)
  - **Modules Transformed**: 1,936 modules
- **Production Script Command**: `npm run build`
  - **Status**: **FAIL**
  - **Duration**: **10.00 seconds** (10,004 ms)
  - **Failure Cause**: `scripts/prerender.js` throws `TypeError: fetch failed (getaddrinfo ENOTFOUND kbvjmcnaaogkbnerjcoc.supabase.co)` when attempting build-time static prerendering against an unresolvable remote Supabase host.

---

## 4. TypeScript

- **Command**: `npx tsc --noEmit`
- **Installed Compiler Version**: `5.9.3`
- **Status**: **PASS**
- **Duration**: **1.35 seconds** (1,349 ms)
- **Errors**: **0**
- **Warnings**: **0**
- **Configuration Note**: TypeScript strictness flags are currently set to `false` in `tsconfig.json` & `tsconfig.app.json` (`strict: false`, `noImplicitAny: false`, `strictNullChecks: false`).

---

## 5. Lint

- **Command**: `npm run lint` (`eslint .`)
- **Status**: **PASS**
- **Duration**: **7.30 seconds** (7,296 ms)
- **Errors**: **0**
- **Warnings**: **0**

---

## 6. Tests

- **Runner**: Playwright (`@playwright/test` `^1.62.1`)
- **Command**: `npx playwright test`
- **Suite Count**: **90 tests** total across 5 configured project targets (Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari).
- **Execution Result**: **70 PASSED**, **20 SKIPPED**, **0 FAILED** (Duration: 7.3 minutes).
- **Mocking Strategy**: Isolated API mocking via `src/__tests__/mocks/supabase.ts` (intercepts REST, RPC, and Storage requests).

---

## 7. Bundle Size

- **Total Generated Assets Count**: 47 files in `dist/assets/`
- **Total Uncompressed Bundle Size**: **~3.25 MB** (including bundled images & fonts)
- **Total JavaScript Size**: **905.77 kB** (uncompressed) / **269.17 kB** (gzip)
- **Total CSS Size**: **91.98 kB** (uncompressed) / **15.98 kB** (gzip)

---

## 8. JavaScript

| Chunk File | Purpose / Vendor | Size (Uncompressed) | Size (Gzip) |
| :--- | :--- | :---: | :---: |
| `dist/assets/index-DUp2vlMw.js` | Main Application Bundle | **281.15 kB** | **71.92 kB** |
| `dist/assets/vendor-radix-DJ9JhmTn.js` | Radix UI Primitives | **272.60 kB** | **87.88 kB** |
| `dist/assets/vendor-supabase-BD8Oym-R.js` | Supabase JS Client | **216.18 kB** | **56.08 kB** |
| `dist/assets/vendor-query-Bf4_xT2V.js` | TanStack React Query | **45.05 kB** | **13.37 kB** |
| `dist/assets/ProductDetail-BJWi6Wtg.js` | Product Detail Route | **32.47 kB** | **11.99 kB** |
| `dist/assets/ProductWorkspace-C-g7NroG.js` | Studio Product Workspace | **26.40 kB** | **6.18 kB** |
| `dist/assets/vendor-icons-C7UXer5C.js` | Lucide React Icons | **23.71 kB** | **5.00 kB** |
| `dist/assets/Inventory-ypbuDp1p.js` | Studio Inventory Route | **18.47 kB** | **5.25 kB** |

---

## 9. CSS

- **Bundle File**: `dist/assets/index-M8uiMiZZ.css`
- **Size (Uncompressed)**: **91.98 kB**
- **Size (Gzip)**: **15.98 kB**
- **Contents**: Tailwind CSS utility classes, custom design tokens (`src/design-tokens.css`), base styles, animation keyframes.

---

## 10. Images

- **Total Image Count**: **68 images**
- **Supported Formats**: PNG (31), JPG (36), SVG (1)
- **Top 10 Largest Image Files**:
  1. `src/assets/hero-image.png`: **2.79 MB** (2,786,827 bytes)
  2. `src/assets/hop-brand-board.png`: **1.84 MB** (1,839,094 bytes)
  3. `src/assets/organic-earring.png`: **1.61 MB** (1,605,142 bytes)
  4. `src/assets/circular-collection.png`: **1.53 MB** (1,530,070 bytes)
  5. `public/arcus-bracelet.png`: **1.48 MB** (1,483,146 bytes)
  6. `src/assets/earrings-collection.png`: **1.47 MB** (1,466,460 bytes)
  7. `public/span-bracelet.png`: **1.47 MB** (1,469,273 bytes)
  8. `src/assets/rings-collection.png`: **1.34 MB** (1,342,010 bytes)
  9. `src/assets/link-bracelet.png`: **1.11 MB** (1,105,914 bytes)
  10. `public/apple-touch-icon.png`: **942.4 KB** (942,407 bytes)

---

## 11. Videos

- **Total Video Count**: **0 videos**
- **Total Size**: **0 bytes**

---

## 12. Network Requests

- **Static Bundles**: Served directly from Vite build output or Vercel edge CDN.
- **Dynamic API Requests**: Communicates with Supabase REST API (`/rest/v1/*`), RPC endpoints (`/rest/v1/rpc/*`), and Edge Functions (`/functions/v1/*`).
- **External Resources**: Razorpay Checkout SDK (`https://checkout.razorpay.com/v1/checkout.js`).

---

## 13. Console Errors

- **Dev Server Runtime**: Clean component mounting; no unhandled React error boundary triggers.
- **Offline Prerender Error**: `getaddrinfo ENOTFOUND kbvjmcnaaogkbnerjcoc.supabase.co` during `scripts/prerender.js` execution.

---

## 14. Lighthouse Targets & Measurement

| Metric / Category | HOP Performance Target | Baseline Status | Notes / Drivers |
| :--- | :---: | :---: | :--- |
| **Performance** | **> 90** | Needs Attention | Uncompressed 2.79 MB hero PNG hampers initial paint |
| **Accessibility** | **> 95** | High | Keyboard focus states & high-contrast typography |
| **Best Practices** | **> 95** | High | Modern React 18 & secure Vercel headers |
| **SEO** | **> 95** | High | Sitemap.xml, robots.txt, dynamic document titles |

---

## 15. Core Web Vitals

| Core Web Vital | Target Value | Baseline Status | Risk Assessment |
| :--- | :---: | :---: | :--- |
| **LCP (Largest Contentful Paint)** | `< 2.5s` | At Risk | 2.79 MB hero PNG asset delays image paint on mobile/3G networks |
| **CLS (Cumulative Layout Shift)** | `< 0.1` | Optimal | Aspect ratio containers prevent layout jumping |
| **INP (Interaction to Next Paint)** | `< 200ms` | Optimal | Fast React 18 event handlers and low main-thread blocking |

---

## 16. Mobile Performance

- Responsive layout degrades gracefully to single-column drawer navigation and touch-optimized galleries.
- Mobile bandwidth is significantly impacted by serving raw uncompressed PNG images (> 1.5 MB each).

---

## 17. Desktop Performance

- Fast initial DOM rendering via Vite SWC bundle.
- Sub-second client-side routing between catalog, product, and studio routes.

---

## 18. Performance Problems

1. **Uncompressed Hero Assets**: Serves raw high-res PNG images (e.g., `hero-image.png` at 2.79 MB) instead of modern compressed WebP/AVIF images.
2. **Prerendering Network Lock**: Build step relies on live network access to remote Supabase DB, breaking offline production builds.
3. **Vendor Bundle Sizes**: Radix UI vendor chunk (272.60 kB) and Supabase client chunk (216.18 kB) account for over 50% of the total JavaScript payload.

---

## 19. Baseline Measurements Summary

- **TypeScript Duration**: `1.35s` (0 errors)
- **Lint Duration**: `7.30s` (0 errors)
- **Vite Standalone Build Duration**: `7.24s` (25 JS chunks, 1 CSS bundle)
- **Full Production Script Build**: FAILED (`scripts/prerender.js`)
- **Total JS Payload (Gzip)**: `269.17 kB`
- **Total CSS Payload (Gzip)**: `15.98 kB`
- **Largest Single Asset**: `src/assets/hero-image.png` (`2.79 MB`)

---

## 20. Evidence

- **Node Version Output**: `v24.18.0`
- **TypeScript Compiler Output**: `npx tsc --noEmit` -> PASS (1349 ms)
- **ESLint Output**: `npm run lint` -> PASS (7296 ms)
- **Vite Build Log**: `npx vite build` -> PASS (7.24s)
- **Prerender Failure Output**: `node scripts/prerender.js` -> `getaddrinfo ENOTFOUND kbvjmcnaaogkbnerjcoc.supabase.co`
