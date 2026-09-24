# Phase 4 Routing & Indexability Audit

**Document Type**: Routing, Sitemap, Robots.txt & Indexability Verification  
**Audit Target**: `public/sitemap.xml`, `public/robots.txt`, SPA Rewrites, 404 Statuses  
**Execution Date**: 2026-08-17  
**Status**: **ACTUALLY VERIFIED (PASS)**  

---

## 1. Robots.txt Audit

File path: `public/robots.txt` / `dist/robots.txt`  
Content inspection:
```text
User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/
Disallow: /checkout
Disallow: /checkout/

Sitemap: https://houseofpadmavati.com/sitemap.xml
```

- **Verification**: Crawlers are allowed on all public marketing, collection, editorial, and product pages.
- **Admin & Checkout Protection**: Administrative workspace routes (`/admin`) and checkout flow (`/checkout`) are disallowed from indexing.
- **Sitemap Declaration**: Explicitly declares the absolute canonical sitemap location `https://houseofpadmavati.com/sitemap.xml`.

---

## 2. Sitemap.xml Audit

File path: `public/sitemap.xml` / `dist/sitemap.xml`  
Format: Valid XML with `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`

- **Static Marketing Routes Included**:
  - `https://houseofpadmavati.com/` (priority 1.0, daily)
  - `https://houseofpadmavati.com/collections` (priority 0.9, weekly)
  - `https://houseofpadmavati.com/collections/kalyani` (priority 0.8)
  - `https://houseofpadmavati.com/collections/organza` (priority 0.8)
  - `https://houseofpadmavati.com/collections/daily` (priority 0.8)
  - `https://houseofpadmavati.com/collections/bridal` (priority 0.8)
  - `https://houseofpadmavati.com/collections/chanderi` (priority 0.8)
  - `https://houseofpadmavati.com/about` (priority 0.7)
  - `https://houseofpadmavati.com/journal` (priority 0.7)
  - `https://houseofpadmavati.com/lookbook` (priority 0.7)
  - `https://houseofpadmavati.com/customer-care` (priority 0.6)
  - `https://houseofpadmavati.com/privacy-policy` (priority 0.5)
  - `https://houseofpadmavati.com/terms` (priority 0.5)
  - `https://houseofpadmavati.com/shipping` (priority 0.5)
  - `https://houseofpadmavati.com/returns` (priority 0.5)

- **Verification**: All URLs in sitemap use the canonical `https://` protocol and domain.

---

## 3. Dynamic Routing & 404 Response Behavior

1. **Static Edge 404 (`dist/404.html`)**:
   - Request: `GET /nonexistent-route-xyz-404`
   - Response: HTTP 404 Not Found
   - Headers: `Cache-Control: no-cache`
   - Meta Tag: `<meta name="robots" content="noindex, nofollow">`
   - Status: ACTUALLY VERIFIED (PASS)
2. **Client-Side SPA Dynamic 404**:
   - Request: Nonexistent product ID or collection slug handled within client router
   - Response: Renders branded "Product Not Found" fallback with link back to `/collections`
   - Meta Tag: Dynamic `noindex, nofollow` applied via `useMetadata({ noIndex: true })`.
