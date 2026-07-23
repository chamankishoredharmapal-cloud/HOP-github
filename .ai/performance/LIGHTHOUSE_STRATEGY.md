# Lighthouse Strategy — House of Padmavati

## Targets

| Category | Mobile | Desktop |
|----------|--------|---------|
| Performance | >= 85 | >= 90 |
| Accessibility | >= 95 | >= 95 |
| Best Practices | >= 95 | >= 95 |
| SEO | >= 95 | >= 95 |

## Auditing Process

### Regular Schedule
- **Per PR**: Lighthouse CI check on preview deployment
- **Weekly**: Full Lighthouse audit of all page types
- **Pre-release**: Final Lighthouse audit before deployment
- **Monthly**: Competitive Lighthouse comparison

### Tools
- Chrome DevTools Lighthouse tab (development)
- Lighthouse CI (automated in CI pipeline)
- PageSpeed Insights (production URLs)

## Optimization Strategy

### Performance

| Opportunity | Typical Impact | Effort |
|-------------|---------------|--------|
| Image optimization | 10-20 points | Low |
| Code splitting | 5-15 points | Medium |
| Font optimization | 3-10 points | Low |
| Critical CSS inlining | 3-8 points | Medium |
| Server response time | 3-10 points | Medium |
| Resource preloading | 2-5 points | Low |
| Reduce unused JS | 5-15 points | Medium |

### Specific Fixes

**1. Optimize Images**
```typescript
// Convert to WebP/AVIF
<picture>
  <source srcSet="hero.avif" type="image/avif" />
  <source srcSet="hero.webp" type="image/webp" />
  <img src="hero.jpg" alt="..." />
</picture>

// Lazy load non-critical images
<img loading="lazy" src="product.jpg" alt="..." />

// Set explicit dimensions
<img width="800" height="1000" src="product.jpg" alt="..." />

// Use responsive images
<img
  srcSet="product-400.jpg 400w, product-800.jpg 800w"
  sizes="(max-width: 768px) 100vw, 50vw"
  src="product-800.jpg"
  alt="..."
/>
```

**2. Code Splitting**
```typescript
// Route-level code splitting
const Collections = React.lazy(() => import("@/pages/Collections"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const StudioDashboard = React.lazy(() => import("@/studio/pages/Dashboard"));

// Component-level code splitting (for large components)
const ProductGallery = React.lazy(() => import("@/components/ProductGallery"));
```

**3. Font Optimization**
```html
<!-- Preconnect to font origins -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />

<!-- Preload critical font -->
<link
  rel="preload"
  href="/fonts/cormorant-garamond.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

### Accessibility

| Issue | Fix | Check |
|-------|-----|-------|
| Missing alt text | Add descriptive alt to all images | Audit |
| Low contrast | Ensure 4.5:1 ratio | DevTools |
| Missing labels | Add labels to all form fields | Audit |
| Heading hierarchy | h1 → h2 → h3 (no skipping) | Audit |
| ARIA attributes | Correct roles on custom elements | Audit |
| Focus indicators | Visible on all interactive | Manual |

### SEO

| Issue | Fix | Check |
|-------|-----|-------|
| Missing meta description | Add unique description per page | Audit |
| Missing OG tags | Add Open Graph tags | Audit |
| No structured data | Add JSON-LD | Audit |
| Missing canonical | Add canonical URL | Audit |
| Poor heading structure | Fix h1/h2/h3 hierarchy | Audit |

## CI Integration

```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pnpm install && pnpm build
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://preview-url.vercel.app/
            https://preview-url.vercel.app/collections
            https://preview-url.vercel.app/product/test-product
          budgetPath: .github/lighthouse/budget.json
          uploadArtifacts: true
```

## Budget File

```json
{
  "budget": {
    "performance": 90,
    "accessibility": 95,
    "best-practices": 95,
    "seo": 95,
    "resource-summary": {
      "script": 200,
      "image": 500,
      "font": 50,
      "document": 10,
      "stylesheet": 50
    }
  }
}
```

## Monitoring

- Track Lighthouse scores over time in a dashboard
- Alert on score drops > 5 points
- Monthly performance review
- Annual competitive benchmarking
