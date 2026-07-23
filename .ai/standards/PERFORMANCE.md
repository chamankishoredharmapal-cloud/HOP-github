# Performance Standards — House of Padmavati

> Consolidates: old `PERFORMANCE_STANDARDS.md` + resolves contradiction with `performance/LIGHTHOUSE_STRATEGY.md`
> **Contradiction resolved**: Single unified target — Mobile >= 90, Desktop >= 95.

## Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance (Desktop) | >= 95 |
| Lighthouse Performance (Mobile) | >= 90 |
| Lighthouse Accessibility | >= 95 |
| Lighthouse Best Practices | >= 95 |
| Lighthouse SEO | >= 95 |
| LCP | < 2.5s |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.5s |
| TTFB | < 800ms |
| Initial JS (gzipped) | < 200 KB |
| Lazy chunks | < 50 KB each |

## Rules

- `React.lazy()` for all route-level code splitting. Studio vs storefront are separate entry points.
- Images: WebP/AVIF with `<picture>` fallback, `loading="lazy"`, explicit width/height, responsive `srcSet`/`sizes`.
- Fonts: `font-display: swap`, preconnect to origins, WOFF2 format.
- CSS: Tailwind purge (zero unused CSS). `content-visibility: auto` for below-fold sections.
- Caching: Static assets `max-age=31536000, immutable`. HTML `no-cache`. API `max-age=300`.
- Preload critical fonts/hero images. Preconnect to Supabase + Razorpay origins.
- Run Lighthouse CI on every PR. Track Core Web Vitals in production (CrUX).
- See `reference/LIGHTHOUSE_STRATEGY.md` for detailed optimization guide.
- See `reference/BUNDLE_OPTIMIZATION.md` for bundle-size deep-dive.
- See `reference/IMAGE_OPTIMIZATION.md` for image optimization deep-dive.
