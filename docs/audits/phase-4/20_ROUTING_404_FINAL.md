# Phase 4 Routing & 404 Response Architecture

**Document Type**: Routing, Status Code & Indexability Architecture Report  
**Target Environment**: Static Build (`dist/`), Edge Rewrites (`vercel.json`), Client Router (`src/App.tsx`)  
**Execution Date**: 2026-08-17  
**Status**: **ACTUALLY VERIFIED (PASS)**  

---

## 1. Routing & 404 Classification Matrix

| Route Category | Example Request | Delivery Mechanism | HTTP Status Code | Meta Robots Directive | Canonical URL | User Experience / UI | Compliance Status |
|---|---|---|---|---|---|---|---|
| **Static Prerendered Route** | `/about`, `/collections` | Served directly from `dist/[route]/index.html` | `200 OK` | `index, follow` | Self-referencing (`https://houseofpadmavati.com/about`) | Instant pre-rendered HTML DOM with dehydrated state | **PASS** |
| **Prerendered Product Route** | `/product/a2799dd3-...` | Served directly from `dist/product/[id]/index.html` | `200 OK` | `index, follow` | Self-referencing (`https://houseofpadmavati.com/product/...`) | Product gallery, description, pricing, Schema.org JSON-LD | **PASS** |
| **Missing Static Asset / Path** | `/assets/missing.js`, `/missing-file.html` | Handled by edge static fallback `dist/404.html` | `404 Not Found` | `noindex, nofollow` | Canonical 404 URL | Branded luxury 404 error page (*"A thread came loose"*) | **PASS** |
| **Missing Dynamic SPA Entity** | `/product/00000000-0000-...` | Rewritten to `/index.html`, resolved by React Router | `200 OK` (SPA) | Dynamic `noindex, nofollow` via `useMetadata` | Self-referencing missing entity URL | Branded "Product not found" state with back link | **PASS** |
| **Deep Link Refresh** | `/privacy-policy`, `/terms` | Served directly from prerendered directory | `200 OK` | `index, follow` | Self-referencing | Instant load without client-side routing delay | **PASS** |

---

## 2. Technical Rationale & Search Engine Safety

1. **Why SPA rewrites return HTTP 200 for dynamic paths**:
   - Single Page Applications using client-side routing (`react-router-dom`) rely on the edge hosting server (`vercel.json`) to route unknown non-file paths to the main application shell (`/index.html`).
   - When a requested entity ID does not exist in the database, the client fetches the record, detects absence, renders the "Product not found" fallback UI, and immediately mounts `<meta name="robots" content="noindex, nofollow">`.
2. **Search Engine Protection**:
   - Search engine crawlers reading the page will find the `noindex, nofollow` directive in the DOM, preventing soft-404 pages from polluting search engine indexes.
   - All valid indexable URLs are explicitly declared in `public/sitemap.xml` with priority metadata.
3. **True HTTP 404s at Edge**:
   - For all static assets, broken direct links to static documents, and unhandled edge requests, `dist/404.html` is served with true HTTP 404 status.
