# PRODUCTION OPERATIONS MANUAL
## Document: 09_SEO_AUDIT
**Project:** House of Padmavati (HOP)
**System:** Luxury E-Commerce Platform
**Date:** 2026-08-05
**Version:** 1.0.0
**Status:** DRAFT

---

## 1. Purpose
The purpose of this Standard Operating Procedure (SOP) is to establish a rigorous framework for conducting the Search Engine Optimization (SEO) audit of the House of Padmavati (HOP) digital platform. This document ensures that the SPA architecture (React/Vite) is correctly configured for search engine crawlability, indexability, and ranking, reflecting the brand's luxury positioning in organic search results.

## 2. Scope
This audit applies to the entire HOP production web environment.
**In Scope:**
- Technical SEO (SPA rendering, sitemaps, robots.txt, canonicalization).
- On-Page SEO (meta tags, headings, URL structure).
- Structured Data (Schema.org implementations).
- Image SEO (alt text, optimization, naming).
- Social Search (Open Graph, Twitter Cards).
- Performance & Mobile (Core Web Vitals impact on SEO).
- Monitoring Setup (Google Search Console, Google Analytics 4).
**Out of Scope:**
- Off-page SEO (backlink building campaigns).
- Paid Search (PPC, Google Ads setup).
- Ongoing content creation.

## 3. Objectives
- Ensure complete indexability of all public routes within the SPA framework.
- Verify comprehensive and accurate metadata across all pages.
- Validate correct implementation of structured data for products, organization, and content.
- Confirm optimal performance metrics (Core Web Vitals) to support SEO rankings.
- Establish baseline monitoring for search visibility and organic traffic.

## 4. Definitions
- **SPA (Single Page Application):** A web application that interacts with the user by dynamically rewriting the current web page with new data from the web server, instead of the default method of a web browser loading entire new pages.
- **SSR (Server-Side Rendering) / Prerendering:** Techniques used to render SPA pages into static HTML for search engine crawlers.
- **Core Web Vitals (CWV):** A set of specific factors that Google considers important in a webpage's overall user experience (LCP, FID/INP, CLS).
- **Canonical URL:** An HTML link tag with attribute `rel="canonical"` used to indicate the preferred version of a web page to search engines.
- **SERP:** Search Engine Results Page.
- **OG (Open Graph):** A protocol created by Facebook to standardize the use of metadata to represent the content of a page.

## 5. Roles & Responsibilities
| Role | Responsibility |
|------|----------------|
| **SEO Specialist** | Leads the audit, analyzes technical gaps, defines keyword strategies. |
| **Frontend Engineer** | Implements technical fixes (meta tags, routing, schema, prerendering). |
| **Content Manager** | Ensures content freshness, updates meta descriptions and image alt texts. |
| **QA Engineer** | Validates implementation of SEO fixes across desktop and mobile. |
| **Technical Lead** | Approves architectural changes (e.g., SSR implementation, server configuration). |

## 6. Prerequisites
- The production build (or exact staging replica) must be deployed and accessible.
- Prerendering or SSR solution (if applicable for the React Vite SPA) must be active.
- Access to Google Search Console (GSC) and Google Analytics 4 (GA4) properties.
- Crawling tools configured (e.g., Screaming Frog, Sitebulb).
- Lighthouse and PageSpeed Insights access.
- Final product catalog and editorial content must be populated.

## 7. Inputs
- Production or staging URL.
- Master Keyword Strategy document.
- `04_CONTENT_REVIEW.md` (for content validation).
- Access to Supabase backend (for dynamic SEO data verification).

## 8. Outputs
- Comprehensive SEO Audit Report.
- Jira tickets for any technical SEO deficiencies.
- Verified XML sitemap and robots.txt.
- GSC and GA4 configuration sign-off.

## 9. Dependencies
- **Performance Audit:** SEO relies heavily on the outcomes of `07_PERFORMANCE_AUDIT.md`.
- **Content Review:** Metadata relies on `04_CONTENT_REVIEW.md`.
- **Accessibility Audit:** Proper heading structures and alt texts overlap with `06_ACCESSIBILITY_AUDIT.md`.

## 10. Execution Order
1. Technical Architecture Review.
2. Crawlability & Indexability Audit.
3. On-Page SEO & Metadata Review.
4. Structured Data Validation.
5. Performance & Mobile Assessment.
6. Setup & Monitoring Configuration.

## 11. Phases / Stages

### Phase 1: Technical SEO Fundamentals
Focuses on the foundation required for search engines to discover and read the SPA.

### Phase 2: On-Page Optimization
Focuses on the visible and hidden content elements that determine relevance.

### Phase 3: Structured Data & Rich Snippets
Focuses on enhancing SERP appearance for products and the brand.

### Phase 4: Monitoring & Analytics
Focuses on establishing tools for ongoing SEO measurement.

## 12. Detailed Step-by-Step Procedures

### Step 1: Technical SEO Fundamentals (SPA Considerations)
1. **Verify Rendering Strategy:** Ensure that the Vite/React application is either Server-Side Rendered (SSR) or Prerendered for search engine bots. Use an SEO crawler (like Screaming Frog) configured to crawl with JavaScript disabled to verify that the raw HTML contains the full page content, not just an empty `<div id="root"></div>`.
2. **Review Routing:** Verify that React Router v6 is using `createBrowserRouter` (history API) and not hash routing (`#`). URLs must be clean (e.g., `/collections/bridal` instead of `/#/collections/bridal`).
3. **Trailing Slashes:** Ensure consistency. Choose either trailing slashes (e.g., `/about/`) or no trailing slashes (e.g., `/about`), and implement 301 redirects to enforce this globally.

### Step 2: Meta Tags Audit
1. **Global Check:** Use a crawler to extract `<title>` and `<meta name="description">` for every page.
2. **Title Tags:** 
   - Verify length is between 50-60 characters.
   - Verify format follows: `[Page Name] | House of Padmavati`.
   - Ensure uniqueness across all pages.
3. **Meta Descriptions:**
   - Verify length is between 150-160 characters.
   - Ensure they include relevant keywords (e.g., "handcrafted Indian sarees", "luxury bridal wear").
   - Ensure a clear call-to-action where appropriate.
4. **Dynamic Metadata:** Verify that ProductDetail and Category pages pull metadata dynamically from the Supabase backend.

### Step 3: Heading Structure Verification
1. Verify exactly one `<h1>` tag per page.
2. Verify logical hierarchy (`<h2>` follows `<h1>`, `<h3>` follows `<h2>`).
3. Ensure headings contain primary and secondary keywords naturally.
4. Ensure utility headings (e.g., "Navigation", "Footer") are not using semantic `h1-h6` tags improperly.

### Step 4: Canonical URL Implementation
1. Inspect the `<head>` of all indexable pages for `<link rel="canonical" href="..." />`.
2. Ensure the href attribute points to the absolute, correct version of the URL (including `https://`).
3. For paginated pages (e.g., `/collections/all?page=2`), ensure the canonical tag points to the base URL or handles pagination correctly according to current Google guidelines.

### Step 5: Sitemap.xml Generation and Validation
1. Verify the existence of `https://[domain]/sitemap.xml`.
2. Ensure it is dynamically generated or regularly updated to reflect new products and editorial content.
3. Validate the sitemap against the XML schema.
4. Ensure it only contains canonical, indexable URLs (no 404s, 301s, or pages with noindex tags).

### Step 6: Robots.txt Configuration
1. Verify the existence of `https://[domain]/robots.txt`.
2. Ensure the following directives are present:
   ```text
   User-agent: *
   Disallow: /cart/
   Disallow: /checkout/
   Disallow: /account/
   Disallow: /*?*sort=
   Allow: /
   Sitemap: https://[domain]/sitemap.xml
   ```
3. Test the robots.txt file using the GSC Robots Testing Tool.

### Step 7: Schema.org Structured Data
1. **Product Schema:** Verify on ProductDetail pages. Must include `name`, `image`, `description`, `sku`, `brand`, `offers` (price, currency, availability).
2. **Organization Schema:** Verify on the Index and About pages. Must include logo, social profiles, contact info.
3. **BreadcrumbList Schema:** Verify on Category and ProductDetail pages to reflect site hierarchy.
4. **FAQ Schema:** Verify on Customer Service or specific product FAQ pages.

### Step 8: Image SEO
1. **Alt Text:** Verify every non-decorative `<img>` has descriptive alt text. For products, it should describe the visual details of the saree.
2. **File Names:** Verify image files are descriptively named using hyphens (e.g., `jasmine-silk-saree-front.jpg` not `IMG_9823.jpg`).
3. **Lazy Loading:** Ensure `<img loading="lazy">` is used for below-the-fold images to improve performance, but critical above-the-fold images (LCP) are loaded eagerly.

### Step 9: Internal Linking Strategy
1. Verify main navigation links to all primary categories and high-value pages.
2. Verify contextual linking within Journal articles to related Product pages.
3. Ensure there are no "orphan pages" (pages with no internal links pointing to them).
4. Verify breadcrumbs are functional and provide crawl paths back to category roots.

### Step 10: Page Speed Impact on SEO
1. Run Lighthouse on Key Pages (Index, ProductDetail, Collection).
2. Verify LCP (Largest Contentful Paint) is < 2.5s.
3. Verify CLS (Cumulative Layout Shift) is < 0.1.
4. Verify INP (Interaction to Next Paint) is within acceptable limits.

### Step 11: Mobile-Friendliness
1. Run pages through the Google Mobile-Friendly Test tool.
2. Ensure touch targets are appropriately sized (minimum 48x48 pixels).
3. Verify text is legible without zooming.
4. Ensure the mobile viewport does not cause horizontal scrolling.

### Step 12: Social Sharing Previews (Open Graph & Twitter Cards)
1. Verify `<meta property="og:title">`, `og:description`, `og:image`, `og:url` on all pages.
2. Verify `<meta name="twitter:card" content="summary_large_image">`.
3. Ensure `og:image` dimensions are optimal (1200x630px) and represent the HOP brand elegantly.

### Step 13: 404 Page Handling & Redirects
1. Intentionally visit a non-existent URL (e.g., `/does-not-exist`).
2. Verify the server returns a 404 status code (not a 200 soft 404).
3. Verify the NotFound UI component renders and provides helpful navigation back to the shop.
4. Verify 301 redirects are in place for any old URLs or consolidated products.

### Step 14: Crawlability Assessment (SPA specific)
1. Fetch the page as Googlebot (using GSC URL Inspection or user-agent switchers).
2. Verify that content loaded via TanStack React Query is visible in the initial HTML payload (via SSR or prerendering) and not entirely reliant on client-side fetching post-load.

### Step 15: Keyword Strategy Validation
1. Verify integration of target keywords (e.g., "Kanjeevaram silk sarees", "luxury Indian fashion", "handwoven sarees").
2. Ensure keyword usage is natural and reflects the brand's sophisticated tone, avoiding keyword stuffing.

### Step 16: Content Freshness Signals
1. Review the Journal/Blog section.
2. Ensure timestamps or updated dates are present in the UI and in Article schema to signal freshness to search engines.

### Step 17: International SEO (If applicable)
1. If HOP targets specific regions (e.g., US, UK, India separately), verify `hreflang` tags are correctly implemented.
2. Ensure currency switching does not create duplicate indexable URLs unless properly parameterized or canonicalized.

### Step 18: Google Search Console Setup
1. Verify domain ownership in GSC.
2. Submit the verified `sitemap.xml`.
3. Check for any manual actions or security issues reported in the console.

### Step 19: Analytics Integration
1. Verify Google Analytics 4 (GA4) or chosen analytics script is firing correctly.
2. Ensure ecommerce tracking (view_item, add_to_cart, purchase) is capturing data without impacting initial page load performance.

### Step 20: Rich Snippet Testing
1. Use the Google Rich Results Test tool.
2. Input key Product URLs and verify that "Product" rich snippets are eligible.
3. Fix any warnings or errors reported by the tool.

### Step 21: Duplicate Content Prevention
1. Identify any potential duplicate content (e.g., products sitting in multiple categories).
2. Ensure canonical tags resolve to a single authoritative URL.
3. Ensure URL parameters used for sorting/filtering (e.g., `?sort=price_desc`) are handled via canonicals or blocked in robots.txt.

## 13. Validation Steps
1. **Automated Crawl:** Run a full site crawl using Screaming Frog SEO Spider.
2. **Review Crawl Report:** Check for 4xx/5xx errors, missing meta tags, missing H1s, and non-canonical URLs.
3. **Manual Inspection:** Inspect source code on 5 random Product pages, 2 Category pages, and the Index page for Schema markup and correct SSR payload.
4. **Tool Validation:** Pass critical templates through Google Rich Results Test and PageSpeed Insights.

## 14. Checklists
- [ ] Prerendering or SSR is active and serving fully populated HTML to bots.
- [ ] Clean URLs implemented (no hashes, consistent trailing slashes).
- [ ] Title tags are present, unique, and 50-60 characters.
- [ ] Meta descriptions are present, unique, and 150-160 characters.
- [ ] Only one `<h1>` tag per page, followed by logical `<h2>`/`<h3>` hierarchy.
- [ ] Canonical tags are present on all indexable pages.
- [ ] `sitemap.xml` is valid and dynamically updating.
- [ ] `robots.txt` is configured to allow crawling while protecting sensitive routes.
- [ ] Product Schema.org is valid without errors.
- [ ] Organization Schema.org is implemented on the homepage.
- [ ] Images have descriptive alt text and optimal file names.
- [ ] Open Graph and Twitter Cards are correctly populated.
- [ ] Core Web Vitals (LCP, CLS) meet Google's "Good" thresholds.
- [ ] Mobile-friendliness verified across templates.
- [ ] 404 pages return a 404 status code (no soft 404s).
- [ ] GSC domain verified and sitemap submitted.
- [ ] GA4 script implemented correctly.

## 15. Pass / Fail Criteria
| Metric | Pass | Fail |
|--------|------|------|
| SPA Crawlability | Full HTML content in view-source | Empty `<div id="root">` |
| Title Tags | 100% presence on indexable pages | Missing or duplicate titles |
| H1 Tags | Exactly 1 per page | 0 or >1 per page |
| Status Codes | 404s return 404, valid pages return 200 | Soft 404s, redirect chains |
| Schema | Rich Results Test shows 0 Errors | Critical Schema Errors |

## 16. Acceptance Criteria
- The site can be crawled seamlessly by major search engine bots.
- All product pages are eligible for rich snippets in SERPs.
- The platform achieves a Lighthouse SEO score of 95 or higher on all core templates.
- No duplicate content issues are reported by crawling tools.

## 17. Quality Gates
- **Pre-Launch SEO Gate:** The site cannot be launched until SPA rendering (SSR/Prerendering) is verified and functional.
- **Analytics Gate:** GSC and GA4 must be active before the site goes public.

## 18. Evidence Required
- PDF export of Screaming Frog crawl summary.
- Screenshots of Google Rich Results Test passes for Product pages.
- Screenshots of Lighthouse SEO scores.
- Screenshot of GSC verified property.

## 19. Documentation Requirements
- Document any specific URL structures required by the routing system.
- Log the sitemap generation strategy (cron job vs. edge function).
- Maintain a record of target keywords mapped to specific landing pages.

## 20. Common Failure Scenarios
- **Soft 404s:** React Router handles the 404 visually, but the server still returns a 200 OK.
- **Empty SPA Shell:** Prerendering fails, and Googlebot only sees the loading state or empty div.
- **Duplicate Content via Parameters:** Filtering URLs (e.g., `?color=red`) get indexed because they lack canonical tags pointing to the base category.
- **Broken Schema via Dynamic Data:** Product prices update in the UI but the Schema JSON-LD fails to update, causing a mismatch penalty.

## 21. Troubleshooting
- **If Prerendering fails:** Check the edge function or build script responsible for generating static HTML. Ensure timeouts are not causing partial renders.
- **If Schema is invalid:** Validate the JSON-LD string using a linter. Ensure all quotes are properly escaped in dynamic strings (e.g., product descriptions with quotes).
- **If GSC reports "Crawled - currently not indexed":** Evaluate content quality and internal linking. Ensure the page is not an orphan.

## 22. Best Practices
- **Luxury Branding in SEO:** Avoid clickbait titles. Maintain the sophisticated tone of House of Padmavati even in meta descriptions.
- **Image Optimization:** Given the visual nature of luxury fashion, balance image compression with high fidelity. Use WebP formats.
- **Proactive Monitoring:** Set up custom alerts in GA4 for sudden drops in organic traffic.

## 23. Standards
- Compliance with Google Search Central Guidelines.
- Adherence to Schema.org standards.
- Web Content Accessibility Guidelines (WCAG) 2.1 AA (overlaps with heading and alt text SEO).

## 24. Review Process
- The SEO Specialist performs the audit using crawling tools.
- The Frontend Engineer reviews the technical findings related to the SPA architecture.
- The Technical Lead approves any necessary backend/infrastructure changes.

## 25. Sign-off Requirements
- Signature from the SEO Specialist confirming all checks pass.
- Signature from the Technical Lead confirming architectural stability.
- Signature from the Product Owner authorizing launch readiness from a search perspective.

## 26. Completion Criteria
- All items in the Checklist are verified.
- Critical and High priority Jira tickets generated from this audit are resolved and re-tested.
- The final SEO Audit Report is archived in the project repository.

## 27. References
- `→ See [00_MASTER_EXECUTION_PLAN.md]`
- `→ See [04_CONTENT_REVIEW.md]`
- `→ See [06_ACCESSIBILITY_AUDIT.md]`
- `→ See [07_PERFORMANCE_AUDIT.md]`
- `→ See [16_PRODUCTION_READINESS.md]`

---
**End of SOP: 09_SEO_AUDIT**
