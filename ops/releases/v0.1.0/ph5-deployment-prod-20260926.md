# COND-06 Cloudflare Pages Production Deployment Evidence

**Date**: 2026-09-26 15:31:00 IST
**Deployment Platform**: Cloudflare Pages
**Project Name**: `hop-production`
**Target Branch**: `main`
**Deployed Commit**: `da6158f39112fcb2f266591d903775bf3b24542c`
**Commit Subject**: `audit(phase-4): complete infrastructure seo and performance verification`
**Production URL**: `https://hop-production.pages.dev`
**Active Deployment URL**: `https://4b95b616.hop-production.pages.dev`

---

## 1. Pre-Deployment Quality Gates

| Gate | Check | Command | Exit Code | Result | Evidence |
|------|-------|---------|-----------|--------|----------|
| **QG-TS** | TypeScript Compilation | `pnpm exec tsc --noEmit` | 0 | PASS | 0 errors |
| **QG-LINT** | ESLint Code Quality | `pnpm lint` | 0 | PASS | 0 errors, 0 warnings |
| **QG-BUILD** | Vite Production Build | `pnpm run build` | 0 | PASS | Built in 5.02s, 1934 modules |
| **QG-SSG** | Prerender Pipeline | `node scripts/prerender.js` | 0 | PASS | 18 routes discovered & prerendered |
| **QG-SEC** | Secret Leakage Scan | File regex audit on `dist/` | 0 | PASS | Zero private secrets or service keys leaked |
| **QG-ROUTING** | SPA Fallback & Routing | `_redirects` + `_headers` | 0 | PASS | Static + dynamic SPA paths return HTTP 200 |

---

## 2. Deployment Artifacts

- Total Files Uploaded: 96 static assets + `_headers` + `_redirects`
- Main CSS: `dist/assets/index-CivnGgel.css` (91.63 kB / 15.93 kB gzip)
- Main JS Bundle: `dist/assets/index-0GJtLv5z.js` (281.17 kB / 71.92 kB gzip)
- Vendor Bundles:
  - `vendor-radix-fqSSXqJk.js` (83.50 kB gzip)
  - `vendor-supabase-c4PrwZh3.js` (55.32 kB gzip)
  - `vendor-query-Bcew_c3V.js` (13.34 kB gzip)
  - `vendor-icons-Bfre4Hq0.js` (5.00 kB gzip)

---

## 3. Deployment Output Logs

```text
⛅️ wrangler 4.141.0
Uploading... (96/96)
✨ Success! Uploaded 0 files (96 already uploaded)
✨ Uploading _headers
✨ Uploading _redirects
🌎 Deploying...
✨ Deployment complete! Take a peek over at https://4b95b616.hop-production.pages.dev
```

---

## 4. Verification Status

- Homepage `https://hop-production.pages.dev/` returns `HTTP/1.1 200 OK`
- Prerendered HTML verified containing full semantic DOM and Schema.org metadata
- SPA route `/cart` returns `HTTP/1.1 200 OK`
- SPA route `/checkout` returns `HTTP/1.1 200 OK`
- SPA route `/wishlist` returns `HTTP/1.1 200 OK`
- SPA route `/account/login` returns `HTTP/1.1 200 OK`
- All security headers verified present in production HTTP responses

**Verdict**: COND-06 COMPLETE. Production commit `da6158f` deployed and active on Cloudflare Pages `hop-production`.
