# Lighthouse Strategy — House of Padmavati

> From: old `performance/LIGHTHOUSE_STRATEGY.md` + `performance/CORE_WEB_VITALS.md` (consolidated, contradiction with `standards/PERFORMANCE.md` resolved)

## Targets (Single Source)

| Category | Desktop | Mobile |
|----------|---------|--------|
| Performance | >= 95 | >= 90 |
| Accessibility | >= 95 | >= 95 |
| Best Practices | >= 95 | >= 95 |
| SEO | >= 95 | >= 95 |

## Schedule

- Per PR: Lighthouse CI on preview deployment
- Weekly: Full audit of all page types
- Pre-release: Final audit
- Monthly: Competitive benchmark

## Key Optimizations (by Impact)

| Opportunity | Impact | Effort |
|-------------|--------|--------|
| Image optimization (WebP/AVIF, responsive, lazy) | 10-20 pts | Low |
| Code splitting (route-level React.lazy) | 5-15 pts | Medium |
| Font optimization (swap, preconnect, WOFF2) | 3-10 pts | Low |
| Critical CSS inlining | 3-8 pts | Medium |
| Resource preloading (hero, fonts) | 2-5 pts | Low |
| Reduce unused JS | 5-15 pts | Medium |

## Core Web Vitals

### LCP (< 2.5s)
- Preload hero image (`fetchpriority="high"`)
- Font `font-display: swap`, preconnect origins
- Minimize TTFB via CDN + Supabase edge network

### INP (< 200ms)
- Break up long tasks (`setTimeout(0)`, `requestAnimationFrame`)
- Defer non-critical JS. Code-split routes.
- Avoid layout thrashing (batch read/write)

### CLS (< 0.1)
- Explicit width/height on all images (`aspect-ratio` CSS)
- Reserve space for dynamic content (`min-height` on loading states)
- `font-display: swap` + `size-adjust` for fallback fonts

## CI Integration

```yaml
- uses: treosh/lighthouse-ci-action@v10
  with:
    urls: |
      https://preview-url.vercel.app/
      https://preview-url.vercel.app/collections
    budgetPath: .github/lighthouse/budget.json
```

### Budget
```json
{ "performance": 90, "accessibility": 95, "seo": 95,
  "resource-summary": { "script": 200, "image": 500, "font": 50 } }
```
