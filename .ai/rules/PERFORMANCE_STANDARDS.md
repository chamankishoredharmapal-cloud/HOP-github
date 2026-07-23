# Performance Standards — House of Padmavati

## Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | ≥ 90 |
| Lighthouse Accessibility | ≥ 95 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | ≥ 95 |
| First Contentful Paint (FCP) | < 1.5s |
| Largest Contentful Paint (LCP) | < 2.5s |
| First Input Delay (FID) / INP | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 |
| Time to Interactive (TTI) | < 3.5s |
| Total Bundle Size (initial) | < 200KB gzipped |
| Total Bundle Size (lazy) | < 50KB per chunk |

## Code Optimization

### Bundle Size
- Use dynamic imports (`React.lazy`) for route-level code splitting
- Code-split at feature boundaries (studio vs storefront)
- Tree-shake unused imports (Vite handles this automatically)
- Avoid large libraries; prefer native APIs when possible
- Use `vite-bundle-visualizer` to analyze bundle composition

### Rendering
- Use `React.memo` only when profiling shows unnecessary re-renders
- Avoid inline object/function creation in render (use hooks)
- Use `useMemo` for expensive computations
- Use `useCallback` for stable function references
- Virtualize long lists with `react-window` or similar (if needed)

### Images
```typescript
// Use modern formats
<img src="image.avif" alt="product" />
<picture>
  <source srcSet="image.avif" type="image/avif" />
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="product" />
</picture>

// Lazy load below-fold images
<img loading="lazy" src="image.jpg" alt="product" />

// Set explicit dimensions to prevent CLS
<img width="800" height="1000" src="image.jpg" alt="product" />

// Use responsive images
<img
  srcSet="image-400.jpg 400w, image-800.jpg 800w, image-1200.jpg 1200w"
  sizes="(max-width: 768px) 100vw, 50vw"
  src="image-800.jpg"
  alt="product"
/>
```

### Fonts
```typescript
// In index.html — preconnect to font origins
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

// Use font-display: swap to prevent invisible text
@font-face {
  font-family: "Cormorant Garamond";
  font-display: swap;
  src: url("/fonts/cormorant-garamond.woff2") format("woff2");
}
```

### CSS
- Purge unused styles (Tailwind handles this)
- Avoid large CSS-in-JS runtime
- Extract critical CSS inline for above-fold content
- Use `content-visibility: auto` for below-fold sections
- Avoid expensive CSS properties (box-shadow on animations, filter)

## Network Optimization

### Caching
```
# Static assets (hashed filenames): Cache-Control: public, max-age=31536000, immutable
# HTML: Cache-Control: no-cache
# API responses: Cache-Control: public, max-age=300
```

### Preloading
```html
<!-- Critical resources -->
<link rel="preload" href="/fonts/cormorant-garamond.woff2" as="font" crossorigin />
<link rel="preload" href="/hero-image.webp" as="image" />

<!-- Key pages (next likely navigation) -->
<link rel="prefetch" href="/collections" as="document" />
```

### Resource Hints
```html
<link rel="dns-prefetch" href="https://supabase.co" />
<link rel="preconnect" href="https://supabase.co" />
<link rel="preconnect" href="https://api.razorpay.com" />
```

## Monitoring

- Run Lighthouse CI on every PR
- Monitor Core Web Vitals in production (CrUX)
- Use `performance.mark()` and `performance.measure()` for custom metrics
- Track API response times via TanStack Query devtools
- Set up performance budgets in CI (enforce via Lighthouse CI or bundlesize)
