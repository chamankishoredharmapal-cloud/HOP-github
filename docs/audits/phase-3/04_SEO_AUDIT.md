---
title: "Phase 3 — SEO Audit"
document_id: "HOP-P3-04"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
last_updated: "2026-08-11"
category: "Phase 3 — Technical Validation"
owner: "SEO Specialist"
reviewer: "Technical Lead"
source_sop: "09_SEO_AUDIT.md"
---

# Phase 3 — SEO Audit

## 1. Purpose

This procedure validates the crawlability, indexability, metadata, structured data, and social/search readiness of the HOP platform against every requirement in `09_SEO_AUDIT.md`. It is the executable, evidence-driven implementation of the SEO SOP for Phase 3.

**WHAT is being tested:** page titles, meta descriptions, canonical URLs, robots, sitemap, Open Graph, social metadata, structured data (Product/Organization/BreadcrumbList/FAQ), heading hierarchy, indexability, internal links, image metadata, URL structure, duplicate content, 404 behavior, redirects, search-engine discoverability.
**WHY:** Organic search is a primary discovery channel for a luxury house; indexability is a pre-launch gate (`09` Quality Gates).
**WHEN:** Fourth audit of Phase 3 (after Security; `09` depends on `07` Performance, which precedes it in the preserved order).

## 2. Scope

Per `09`: Technical SEO (SPA rendering, sitemaps, robots, canonicalization), On-Page SEO, Structured Data, Image SEO, Social Search, Performance/mobile SEO impact, GSC/GA4 monitoring setup. **Out of scope:** off-page SEO, paid search, ongoing content creation (preserved).

## 3. Definitions

Preserved from `09`: SPA, SSR/prerendering, CWV, Canonical URL, SERP, OG (Open Graph).

## 4. Roles & Responsibilities

Per `09`: SEO Specialist (leads), Frontend Engineer (fixes), Content Manager (metadata), QA Engineer (validation), Technical Lead (approval).

## 5. Prerequisites

- Production build (or exact staging replica) deployed and accessible.
- Prerendering/SSR solution (if applicable) verified active — see Phase 1 note.
- GSC and GA4 access (if properties exist; otherwise recorded as gap).
- Crawler configured (Screaming Frog SEO Spider or equivalent).
- Final catalog and editorial content populated.

## 6. SPA Architecture Baseline (documented state at manual creation)

- The application uses React Router v6 `BrowserRouter` (history API) — no hash routing; clean URLs (`src/App.tsx`). This satisfies `09` Step 1.2's clean-URL requirement in substance; note that `09` references `createBrowserRouter` — the deployed implementation is `BrowserRouter`, which is functionally equivalent for clean URLs. Recorded variance.
- The application is a client-rendered SPA on a static Vite build. **`09` Step 1.1 and the Pre-Launch SEO Gate require SSR or prerendering so the raw HTML contains full content, not an empty `<div id="root">`.** Whether prerendering/SSR is active is a **critical validation point** of this audit. If it is not active, this is a P1 finding and the Pre-Launch SEO Gate (`09` Section 17) cannot pass.

---

## 7. Detailed Step-by-Step Procedures

### Phase 1 — Technical SEO Fundamentals

#### 1.1 Rendering strategy (critical)
1. Crawl key pages (Index, PDP, Category, Journal) with JavaScript disabled (Screaming Frog "rendered HTML" check, or `curl` + inspect raw HTML).
2. **Verify:** raw HTML contains page content (title, meta, headings, product markup), not only `<div id="root"></div>`.
3. **PASS:** full content in raw HTML (SSR/prerendering active). **FAIL:** empty shell → P1 finding; Pre-Launch SEO Gate remains failed.

#### 1.2 URL structure
1. Verify clean URLs (no `#` routing) across all public routes; list all primary routes from `src/App.tsx`.
2. Trailing slash: verify consistency (all `/<path>` or all `/<path>/`) and 301 enforcement per `09` Step 1.3.
3. **PASS:** clean + consistent. **FAIL:** hash routes or mixed trailing-slash behavior → finding.

### Phase 2 — Crawlability & Indexability

#### 2.1 robots.txt
1. Verify `https://<domain>/robots.txt` exists and contains (per `09` Step 6):
   ```
   User-agent: *
   Disallow: /cart/
   Disallow: /checkout/
   Disallow: /account/
   Disallow: /*?*sort=
   Allow: /
   Sitemap: https://[domain]/sitemap.xml
   ```
2. **Verify** `Disallow: /` is NOT present in the pre-launch file (per `16` Section 12.6 the launch version must allow crawling).
3. Test with GSC Robots Testing Tool if the property exists.

#### 2.2 sitemap.xml
1. Verify `https://<domain>/sitemap.xml` exists, is valid XML (schema-valid), and contains only canonical, indexable URLs (no 404/301/noindex pages) per `09` Step 5.
2. Verify it updates with catalog/editorial changes (generation strategy documented: cron vs. edge function per `09` Documentation Requirements).

#### 2.3 404 behavior
1. Visit `/does-not-exist` and a deleted product URL.
2. **Verify:** server returns HTTP 404 (not a 200 soft-404); the NotFound UI renders with navigation back to the shop.
3. **PASS:** real 404 status. **FAIL:** soft 404 (200) → P1 finding (this is the documented SPA failure mode in `09` Section 20).

#### 2.4 Redirects
1. Verify 301 redirects for any known old URLs / consolidated products; no redirect chains (per `09` Step 13.4). Document the redirect map.

#### 2.5 Indexability (GSC)
1. If a GSC property exists: verify domain ownership, submit sitemap, check for manual actions/security issues (`09` Step 18). If no property exists, record as a gap for launch preparation.

### Phase 3 — On-Page SEO & Metadata

#### 3.1 Title tags (every indexable page)
1. Crawl all pages; extract `<title>`.
2. **Verify:** 50–60 characters; format `[Page Name] | House of Padmavati`; unique across pages; no duplicates.

#### 3.2 Meta descriptions
1. **Verify:** 150–160 characters; unique; relevant keywords (e.g., "handcrafted Indian sarees", "luxury bridal wear"); clear CTA where appropriate.

#### 3.3 Dynamic metadata
1. **Verify:** PDP and Category metadata pulled dynamically from Supabase (not hardcoded); Studio SEO fields (Meta Title, Meta Description, canonical, OG image per `10` Step 19) propagate to the rendered page.

#### 3.4 Canonical URLs
1. Inspect `<head>` on all indexable pages: `<link rel="canonical" href="https://[domain]/...">` absolute, correct version.
2. Filter/sort parameterized URLs (e.g., `?sort=`, category filters): canonical points to the base URL or is blocked per robots (`09` Step 21).

#### 3.5 Heading hierarchy (cross-check with A11y audit)
1. Exactly one `<h1>` per page; logical `<h1>→<h2>→<h3>`; no skips; utility headings do not misuse h1–h6. (Overlaps `01_ACCESSIBILITY_AUDIT.md` Phase 5 — results must be consistent.)

#### 3.6 Internal linking
1. Main nav links to all primary categories and high-value pages.
2. Journal articles link contextually to related products (verify via the journal→product relationship data).
3. No orphan pages; breadcrumbs functional on Category/PDP (`09` Step 9).

#### 3.7 Duplicate content
1. Identify products in multiple categories/collections — canonical resolves to one authoritative URL (`09` Step 21).
2. Verify parameterized URLs don't create indexable duplicates.

### Phase 4 — Structured Data & Rich Snippets

#### 4.1 Schema.org validation
1. **Product schema** on PDP: `name`, `image`, `description`, `sku`, `brand`, `offers` (price, currency, availability).
2. **Organization schema** on Index/About: logo, social profiles, contact info.
3. **BreadcrumbList** on Category and PDP.
4. **FAQ schema** where applicable (Customer Care/FAQ content).
5. Validate JSON-LD with Google Rich Results Test and Schema Validator for: Index, 3 PDPs, 2 Category pages, 1 Journal article.
6. **PASS:** 0 errors (warnings recorded). **FAIL:** critical schema errors or stale data (price mismatch between UI and JSON-LD — the documented failure mode in `09` Section 20) → finding.

#### 4.2 Rich snippet eligibility
1. Google Rich Results Test on key PDPs → "Product" rich snippets eligible.

### Phase 5 — Image SEO, Social & Content Signals

#### 5.1 Image metadata
1. Alt text descriptive (non-decorative images), product images describe the saree visually; file names descriptive hyphenated (e.g., `jasmine-silk-saree-front.jpg`); lazy loading correct per Performance audit results.

#### 5.2 Open Graph & Twitter Cards
1. Verify on all pages: `og:title`, `og:description`, `og:image`, `og:url`.
2. Verify `twitter:card` = `summary_large_image`.
3. `og:image` dimensions 1200x630px and brand-appropriate.

#### 5.3 Content freshness signals
1. Journal: published/updated timestamps visible and present in Article schema (`09` Step 16).

#### 5.4 Keyword strategy validation
1. Verify target keywords (e.g., "Kanjeevaram silk sarees", "luxury Indian fashion", "handwoven sarees") appear naturally in metadata/headings — no stuffing (`09` Step 15).

### Phase 6 — Performance & Mobile (SEO impact)

1. From `02_PERFORMANCE_AUDIT.md` results: LCP <= 2.0s (09's 2.5s "Good" threshold is satisfied by the stricter HOP target), CLS <= 0.05, INP <= 100ms on key pages.
2. Mobile-friendliness: touch targets >= 48x48px (per `09` Step 11.2 — recorded alongside the A11y 44x44px standard); text legible without zoom; no horizontal scrolling on mobile viewport.

### Phase 7 — Monitoring Configuration

1. GA4 (or chosen analytics): verify script fires correctly, ecommerce events (`view_item`, `add_to_cart`, `purchase`) tracked without harming initial load (per `09` Step 19; performance cross-checked in Performance audit).
2. GSC property verified; sitemap submitted.
3. **PASS:** monitoring configured. **FAIL/gap:** absent — recorded as launch-prep gap, not a Phase 3 blocking finding (per `09`, the Analytics Gate applies pre-public-launch).

---

## 8. Validation Steps

1. Automated crawl (Screaming Frog) of the full site; export PDF summary.
2. Review crawl report: 4xx/5xx, missing/duplicate titles, missing meta, missing H1, non-canonical URLs.
3. Manual source inspection on 5 random PDPs, 2 Category pages, Index (per `09` Step 13.3).
4. Rich Results Test + PageSpeed Insights on key templates.
5. robots.txt + sitemap validation.

## 9. Evidence Required (per `09`)

- Screaming Frog crawl summary (PDF export).
- Rich Results Test screenshots (Product pages).
- Lighthouse SEO scores (from Performance audit evidence).
- GSC verified-property screenshot (if property exists).
- Raw-HTML rendering evidence (JS-disabled crawl or curl output) for the SPA rendering check.
- curl outputs: 404 status test, robots.txt, sitemap.xml.

## 10. Pass / Fail Criteria (checklist-level, preserved from `09`)

| Check | PASS | FAIL |
|---|---|---|
| SPA crawlability | full content in raw HTML | empty `<div id="root">` |
| Title tags | 100% present, unique, 50–60 chars | missing/duplicate |
| H1 | exactly 1 per page | 0 or >1 |
| Status codes | real 404s, 200 on valid pages | soft 404s, redirect chains |
| Schema | 0 errors in Rich Results | critical schema errors |
| Canonicals | present on all indexable pages | absent/incorrect |
| robots/sitemap | directives per spec, valid sitemap | missing/blocking |
| OG/Twitter | populated on all pages | missing |

## 11. After FAIL / Remediation & Re-test

1. **Document** findings in `07_PHASE_3_BUG_TRACKER.md` (category `SEO`; P1 for SPA-rendering/soft-404/canonical failures, P2/P3 for metadata gaps).
2. **Fix** only documented findings (e.g., soft-404 → server-side 404; canonical → correct tag; schema → fix JSON-LD escaping per `09` Troubleshooting).
3. **Verify** via re-crawl / re-validation with the same tool.
4. **Re-test** affected pages plus the A11y heading check if markup changed.
5. **Close** only with evidence attached.

## 12. Common Failure Scenarios (preserved from `09`)

Soft 404s from client-side routing; empty SPA shell when prerendering fails; duplicate content via filter parameters without canonicals; stale schema data (price mismatch).

## 13. Troubleshooting (preserved from `09`)

Prerendering failure → check edge function/build script timeouts. Invalid schema → lint JSON-LD, escape quotes in dynamic strings. "Crawled — currently not indexed" → evaluate content quality/internal linking, orphan check.

## 14. Best Practices (preserved from `09`)

Luxury tone in metadata (no clickbait); balance image compression with fidelity; proactive GA4 alerts on organic traffic drops.

## 15. Standards

Google Search Central Guidelines · Schema.org · WCAG 2.1 AA (overlap areas) per `09`.

## 16. Sign-off Requirements

SEO Specialist · Technical Lead · Product Owner (launch-readiness acknowledgement) per `09`.

## 17. Completion Criteria

Checklist verified; Critical/High SEO tickets resolved and re-tested; final report archived; results fed into `08_PHASE_3_COMPLETION.md`.

## 18. References

- → `09_SEO_AUDIT.md` (authoritative source)
- → `02_PERFORMANCE_AUDIT.md` (CWV evidence)
- → `01_ACCESSIBILITY_AUDIT.md` (heading/alt overlap)
- → `07_PHASE_3_BUG_TRACKER.md`
- → `08_PHASE_3_COMPLETION.md`
- → `00_MASTER_EXECUTION_PLAN.md`

---
*End of Document*
