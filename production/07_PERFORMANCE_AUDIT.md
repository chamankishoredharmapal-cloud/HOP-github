---
title: "07_PERFORMANCE_AUDIT"
project: "House of Padmavati (HOP)"
version: "1.0.0"
status: "Active"
category: "Production Operations"
severity: "CRITICAL"
---

# 07_PERFORMANCE_AUDIT

## Purpose
The purpose of this Standard Operating Procedure (SOP) is to outline the rigorous performance audit requirements for the House of Padmavati (HOP) platform. Performance is indistinguishable from quality in luxury digital experiences. Waiting for a page to load or experiencing a stuttering animation breaks the immersive, refined experience expected by the HOP clientele. This document ensures that the HOP platform operates with uncompromising speed and fluidity across all devices and network conditions.

## Scope
This procedure applies to the entire HOP digital footprint, including all frontend assets (React, Vite, Tailwind CSS), backend interactions (Supabase, API endpoints), third-party integrations (Razorpay, Analytics), media delivery (images, videos, fonts), and network configurations (CDN, caching). It covers desktop, tablet, and mobile experiences under various simulated network constraints.

## Objectives
- Achieve and maintain industry-leading Core Web Vitals metrics.
- Ensure ultra-fast load times for high-resolution product photography without sacrificing image quality.
- Guarantee silky-smooth animations (60fps) that reflect the quiet elegance of the brand.
- Minimize Time to Interactive (TTI) to provide an immediately responsive experience.
- Eliminate memory leaks and minimize Main Thread blocking.
- Enforce strict bundle size limits and efficient code splitting.

## Definitions
- **Core Web Vitals (CWV)**: A set of real-world, user-centered metrics that quantify key aspects of the user experience (LCP, INP, CLS).
- **LCP (Largest Contentful Paint)**: Measures loading performance.
- **INP (Interaction to Next Paint)**: Measures responsiveness.
- **CLS (Cumulative Layout Shift)**: Measures visual stability.
- **TTI (Time to Interactive)**: The time it takes for a page to become fully interactive.
- **TBT (Total Blocking Time)**: The total amount of time between FCP and TTI where the main thread was blocked for long enough to prevent input responsiveness.
- **FOIT/FOUT**: Flash of Invisible Text / Flash of Unstyled Text.

## Roles & Responsibilities
| Role | Responsibility |
| :--- | :--- |
| **Performance Engineer** | Executes the audit, profiles the application, and identifies bottlenecks. |
| **Frontend Engineer** | Addresses UI/UX performance issues (rendering, animations, bundle size). |
| **Backend Engineer** | Optimizes API endpoints, edge functions, and database queries. |
| **DevOps / SysAdmin** | Validates CDN configuration, caching headers, and server infrastructure. |
| **QA Automation Engineer** | Integrates performance testing into the CI/CD pipeline. |
| **Technical Lead** | Reviews the audit report and approves the platform for production readiness based on defined thresholds. |

## Prerequisites
- The platform must be deployed to a production-like staging environment with production data volumes.
- Caching layers (CDN, browser cache, API cache) must be fully configured and enabled.
- Production builds (minified, optimized) must be deployed.
- Access to Google Lighthouse, Chrome DevTools, WebPageTest, and Supabase dashboard.
- Test devices or emulators for various network and hardware profiles.

## Inputs
- Deployed staging URL of the HOP application.
- `package.json` and `vite.config.ts` files for bundle configuration.
- Asset inventory (fonts, images, scripts).
- Route configuration (React Router).

## Outputs
- Comprehensive Performance Audit Report.
- Core Web Vitals measurement logs.
- Bundle analysis visualization report (`rollup-plugin-visualizer`).
- Actionable list of performance optimization tasks (Jira/Linear tickets).
- Signed-off Performance Certification.

## Dependencies
- Must follow successful completion of Functional Testing.
- Relies on infrastructure readiness outlined in `16_PRODUCTION_READINESS.md`.
- Dependent on final asset generation by the Studio team (`10_STUDIO_AUDIT.md`).

## Execution Order
The performance audit must be executed AFTER all feature development is complete and BEFORE the final UAT (User Acceptance Testing) and Launch.

## Phases / Stages
1. **Preparation**: Environment configuration and tool setup.
2. **Core Metrics Measurement**: CWV and Lighthouse auditing.
3. **Asset & Network Analysis**: Bundle sizes, image optimization, font loading, caching.
4. **Runtime Performance**: React rendering, animations, API latency.
5. **Mobile & Constraint Testing**: Throttled network and lower-end device profiling.
6. **Reporting & Remediation**: Documenting findings and implementing fixes.

## Detailed Step-by-Step Procedures

### 1. Core Web Vitals Assessment
HOP maintains strict thresholds for luxury e-commerce.
1. Use Google PageSpeed Insights and Chrome User Experience Report (CrUX) to measure CWV.
2. Verify LCP (Largest Contentful Paint) is **<= 2.0 seconds** (Strict luxury standard).
3. Verify INP (Interaction to Next Paint) is **<= 100 milliseconds**.
4. Verify CLS (Cumulative Layout Shift) is **<= 0.05** (Zero shift tolerance for luxury).
5. Document metrics for the following key pages: Index, Collection, ProductDetail, Cart, Checkout.

### 2. Lighthouse Performance Audit
1. Run Lighthouse in Chrome DevTools (Incognito Mode) on Desktop and Mobile modes.
2. Target Score Requirements:
   - Performance: **95+**
   - Accessibility: **100**
   - Best Practices: **100**
   - SEO: **100**
3. Address any "Opportunities" flagged by Lighthouse that save more than 100ms.
4. Document the TBT (Total Blocking Time) and ensure it is **< 150ms**.

### 3. Bundle Size Analysis (Vite & Rollup)
1. Execute the production build command: `npm run build`.
2. Utilize `rollup-plugin-visualizer` to generate `stats.html`.
3. Analyze the output:
   - Total JavaScript payload must be **< 250KB (gzipped)** for initial load.
   - Verify tree-shaking is effectively removing unused exports from `shadcn/ui` and `lucide-react`.
   - Ensure `node_modules` is properly chunked (e.g., `vendor.js`).
4. Document the sizes of the 3 largest chunks and provide justification if any exceeds 100KB gzipped.

### 4. Image Optimization and Delivery
Luxury relies on high-fidelity visual assets, which are inherently heavy.
1. Verify all product images are served in modern formats (AVIF primary, WebP fallback).
2. Inspect image elements in DevTools. Ensure `srcset` and `sizes` attributes are present for responsive loading.
3. Verify lazy loading is implemented (`loading="lazy"`) for all images below the fold.
4. Verify LCP images (e.g., hero banners, primary product image) use `fetchpriority="high"` and are NOT lazy-loaded.
5. Check that intrinsic image dimensions (width/height attributes) are provided to prevent CLS.

### 5. Font Loading Strategy
HOP utilizes Cormorant Garamond, Inter, and Vonca Regular.
1. Verify font files are preloaded in the document `<head>` using `<link rel="preload" as="font" ... crossorigin>`.
2. Inspect the Network tab to ensure fonts load before CSS execution blocks rendering.
3. Verify the use of `font-display: swap` for body text (Inter) and `font-display: optional` or `swap` for display text (Cormorant Garamond, Vonca) to minimize FOIT/FOUT.
4. Ensure font files are subsetted (e.g., stripping cyrillic characters if not used) and served in WOFF2 format.

### 6. JavaScript Bundle and React Optimization
1. Verify Route-based code splitting: Use React DevTools Profiler to ensure `React.lazy` and `Suspense` are correctly implemented for non-critical routes (e.g., `/account`, `/lookbook`).
2. Identify unnecessary re-renders: Record a session in React DevTools while interacting with the Cart and ProductDetail pages. Address any components re-rendering more than twice unnecessarily.
3. Verify appropriate use of `useMemo` and `useCallback` for expensive calculations or stable prop references.
4. Check for Third-party script impact. Defer or async all non-critical scripts (e.g., analytics). Ensure the Razorpay script is loaded dynamically only when the user initiates checkout, or async if required globally.

### 7. CSS Optimization
1. Verify Tailwind CSS purging is active in production (`NODE_ENV=production`).
2. Analyze the generated CSS file. It must be **< 30KB (gzipped)**.
3. Use Chrome DevTools Coverage tab to identify unused CSS. Target > 90% utilization of loaded CSS on critical paths.

### 8. API Performance and Caching (Supabase & React Query)
1. Inspect API response times via the Network tab.
2. Supabase Edge Functions response time must be **< 200ms** (95th percentile).
3. Verify database query efficiency (use `EXPLAIN ANALYZE` in Supabase SQL Editor for slow endpoints). Ensure proper indexes exist on queried columns.
4. Validate TanStack React Query configuration.
   - Ensure `staleTime` and `gcTime` are appropriately set for relatively static data (e.g., product catalog: `staleTime: 5 * 60 * 1000`).
   - Verify that aggressive polling is disabled unless strictly required.
5. Verify Browser Cache and CDN Cache headers (`Cache-Control`) are correctly set for static assets (immutable, max-age=31536000) and API responses (where applicable).

### 9. Memory Leak Detection
1. Open Chrome DevTools -> Memory tab.
2. Take a Heap Snapshot on the Home page.
3. Navigate extensively through Collections -> ProductDetail -> Cart -> Home.
4. Take a second Heap Snapshot.
5. Compare snapshots to identify detached DOM nodes or uncollected JavaScript objects.

### 10. Animation Performance
HOP animations must be elegant and flawless.
1. Open Chrome DevTools -> Rendering tab -> Enable "Frame Rendering Stats".
2. Trigger key animations (menu opening, cart sliding in, page transitions).
3. Verify animations run consistently at **60fps**.
4. Ensure CSS transitions use GPU-accelerated properties (`transform`, `opacity`) instead of layout-triggering properties (`width`, `height`, `margin`, `top`).

### 11. Network Waterfall Analysis
1. Load the Home page and Product Detail page with an empty cache.
2. Analyze the Network Waterfall chart.
3. Ensure there are no long request chains (e.g., script loads -> requests API -> loads font -> renders).
4. Verify critical requests are prioritized and parallelized where possible.

### 12. Preloading and Prefetching
1. Verify that hovering over navigational links triggers prefetching of route chunks (via React Router or custom implementation).
2. Ensure high-priority assets required for the next likely interaction (e.g., checkout JS chunk when on the cart page) are preloaded.

### 13. Mobile Performance & Throttling
1. Switch DevTools to Mobile mode.
2. Apply "Fast 3G" network throttling and "4x slowdown" CPU throttling.
3. Navigate the site. Verify the TTI remains **< 4.0 seconds** under these constrained conditions.
4. Ensure the UI remains responsive (no freezing) during data fetching.

## Validation Steps
- The Performance Engineer shall execute each procedure and document findings.
- Automated Lighthouse CI checks must pass in the deployment pipeline.
- Visual inspection of the Network Waterfall to confirm optimized loading sequences.

## Checklists

### Pre-Audit Checklist
- [ ] Staging environment matches production configuration.
- [ ] Production build (`npm run build`) is deployed.
- [ ] Analytics and external tracking scripts are active (to measure real-world impact).
- [ ] CDN is fully enabled.
- [ ] Supabase production instance is used (or a replica with matching resources).

### CWV & Lighthouse Checklist
- [ ] LCP <= 2.0s
- [ ] INP <= 100ms
- [ ] CLS <= 0.05
- [ ] Lighthouse Performance >= 95
- [ ] TBT < 150ms

### Assets & Optimization Checklist
- [ ] Main JS bundle < 250KB gzipped.
- [ ] Main CSS bundle < 30KB gzipped.
- [ ] Images served as AVIF/WebP.
- [ ] Below-the-fold images lazy-loaded.
- [ ] LCP images use `fetchpriority="high"`.
- [ ] Fonts use `font-display: swap/optional`.
- [ ] Fonts are preloaded.
- [ ] `Cache-Control` headers verified for static assets.

### Runtime Checklist
- [ ] Animations run at 60fps (GPU accelerated).
- [ ] No detached DOM nodes found in Heap Snapshots.
- [ ] React rendering optimized (no redundant renders on critical paths).
- [ ] API responses < 200ms.
- [ ] Route-based code splitting verified.

## Pass / Fail Criteria
- **Pass**: All Core Web Vitals metrics meet or exceed the strict HOP thresholds. Lighthouse score >= 95. No memory leaks detected. All checklists completed successfully.
- **Fail**: Any CWV metric falls below the threshold. Lighthouse score < 95. Evidence of janky animations (<60fps). Payload sizes exceed limits without documented justification.

## Acceptance Criteria
The performance audit is considered accepted when the Performance Engineer provides the final report, all critical and high-severity bottlenecks have been resolved, and the Technical Lead signs off on the metrics.

## Quality Gates
- **Build Pipeline**: Fail CI build if bundle size exceeds thresholds.
- **Staging Deployment**: Fail automated E2E performance tests if LCP > 2.5s on staging.

## Evidence Required
- Screenshot of Lighthouse scores (Desktop and Mobile).
- Screenshot of Chrome DevTools Network Waterfall for initial load.
- Exported `stats.html` from `rollup-plugin-visualizer`.
- Performance profiling trace file (`.json` export from DevTools Performance tab) during key interactions.

## Documentation Requirements
- All performance exceptions (e.g., unavoidable third-party script bloat) must be documented in a `PERFORMANCE_EXCEPTIONS.md` log with technical justification.
- Any complex memoization or rendering optimization must be heavily commented in the source code.

## Common Failure Scenarios
- **Large LCP Image**: Hero image not optimized, not preloaded, or lazy-loaded by mistake.
- **Render Blocking CSS/JS**: Third-party scripts added to the `<head>` without `defer` or `async`.
- **Cumulative Layout Shift (CLS)**: Dynamic banners, alert bars, or images loading without reserved spatial dimensions.
- **High TBT**: Complex React hydration process on the main thread, or heavy data processing on initial load.
- **Uncached API Responses**: Supabase endpoints returning identical data without caching headers, causing redundant server load and delay.

## Troubleshooting
- **LCP is too high**: Check the Network tab. Is the LCP element (usually an image) requested late in the waterfall? Move it earlier via preload. Is the TTFB (Time to First Byte) high? Investigate server/CDN response.
- **CLS is non-zero**: Use the 'Experience' track in the DevTools Performance panel to identify the exact nodes shifting. Assign explicit CSS `aspect-ratio`, `width`, and `height`.
- **Animations are janky**: Ensure you are animating `transform` and `opacity` only. Avoid animating `height` or `padding`. Use the 'Layers' tab to ensure the animated element is promoted to its own composite layer.

## Best Practices
- **Aggressive Code Splitting**: Split code at the route level, and dynamically import heavy components (e.g., complex 3D viewers, large modal dialogs) only when needed.
- **Optimistic UI**: Use React Query's optimistic updates for mutations (e.g., adding to cart) to make the UI feel instantaneous regardless of network latency.
- **Resource Hints**: Liberally use `preconnect`, `dns-prefetch`, and `preload` for critical external domains (e.g., Supabase API, Razorpay) and internal assets.

## Standards
- Google Web Vitals guidelines.
- HTTP/3 and HTTP/2 multiplexing standards for asset delivery.
- W3C Resource Hints specifications.

## Review Process
1. The Performance Engineer conducts the audit and drafts the report.
2. The Frontend and Backend engineering teams review the findings and address the tickets.
3. A subsequent, abbreviated audit is performed to verify fixes.
4. Final review by the Technical Lead.

## Sign-off Requirements
- Performance Engineer Signature & Date
- Technical Lead Signature & Date
- Product Owner Signature & Date (Acknowledging the balance of performance and feature set)

## Completion Criteria
This SOP is completed when the HOP platform meets all performance targets on the staging environment, the evidence is collected, and final sign-off is achieved.

## References
- `→ See [01_PRE_PRODUCTION_AUDIT.md]`
- `→ See [10_STUDIO_AUDIT.md]`
- `→ See [16_PRODUCTION_READINESS.md]`
- [Google Web Vitals](https://web.dev/vitals/)
- [Vite Build Options](https://vitejs.dev/config/build-options.html)
