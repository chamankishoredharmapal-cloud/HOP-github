# Phase 3 — SSG & Hydration Application Audit

**Audit Timestamp**: 2026-08-16T05:25:00+05:30  

---

## 1. Prerendering Architecture (`scripts/prerender.js`)

- **Discovery Engine**:
  - Dynamically fetches published products and active collections from Supabase database during build.
  - Generates static HTML for 20 core routes (Homepage, collections, product PDPs, journal, about, policies).
- **Headless Browser Rendering**:
  - Uses Puppeteer in headless mode.
  - Injects `window.__PRERENDER_STATUS = "ready"` listener.
  - Renders complete HTML with serialized `__REACT_QUERY_STATE__` script tags in the `<head>`.
- **Static Artifacts Output**:
  - Stores prerendered HTML directly in `dist/` subdirectories with fallback `404.html` (copy of `dist/index.html`).

---

## 2. Client Hydration Behavior (`src/App.tsx` & `src/hooks/usePrerenderReady.ts`)

- **State Hydration**:
  - `<HydrationBoundary state={window.__REACT_QUERY_STATE__}>` initializes TanStack Query cache with the exact state dehydrated during SSG.
  - Eliminates initial client-side network fetches for static data, resulting in instantaneous page loads.
- **Hydration Mismatch Mitigation**:
  - `ProductGallery.tsx` synchronized with Embla carousel using `init`, `reInit`, `select`, `settle`, `resize` events and `requestAnimationFrame` to ensure zero mismatch between prerendered DOM and client interactive state.
  - `usePrerenderReady` properly positioned at top-level of component scope conforming to React Rules of Hooks.

---

## 3. Route Navigation & Static Verification

| Route | Prerender Status | Dehydrated State Injected | Hydration Flash | Result |
|-------|------------------|---------------------------|-----------------|--------|
| `/` | OK | Yes | None | **PASS** |
| `/collections` | OK | Yes | None | **PASS** |
| `/collections/kalyani` | OK | Yes | None | **PASS** |
| `/product/a2799dd3-...` | OK | Yes | None | **PASS** |
| `/about` | OK | Yes | None | **PASS** |
| `/customer-care` | OK | Yes | None | **PASS** |
| `/shipping-policy` | OK | Yes | None | **PASS** |
| `/returns-policy` | OK | Yes | None | **PASS** |
| `/journal` | OK | Yes | None | **PASS** |
| `/lookbook` | OK | Yes | None | **PASS** |
