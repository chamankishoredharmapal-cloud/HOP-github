# Core Web Vitals — House of Padmavati

## Targets

| Metric | Target | 75th Percentile |
|--------|--------|-----------------|
| Largest Contentful Paint (LCP) | < 2.5s | < 2.5s |
| Interaction to Next Paint (INP) | < 200ms | < 200ms |
| Cumulative Layout Shift (CLS) | < 0.1 | < 0.1 |
| First Contentful Paint (FCP) | < 1.5s | < 2.0s |
| Time to First Byte (TTFB) | < 800ms | < 1.2s |

## LCP (Largest Contentful Paint)

### What affects LCP
- Hero images (especially on homepage)
- Product images on product detail pages
- Large text blocks (h1 with custom fonts)

### Optimization

**Hero Images:**
```typescript
// Preload the hero LCP image
<link rel="preload" href="/hero.webp" as="image" />

// Use modern formats
<picture>
  <source srcSet="hero.avif" type="image/avif" />
  <source srcSet="hero.webp" type="image/webp" />
  <img
    src="hero.jpg"
    alt="House of Padmavati — Heritage Collection"
    fetchpriority="high"
    width="1440"
    height="800"
  />
</picture>
```

**Fonts:**
```typescript
// Use font-display: swap
@font-face {
  font-family: "Cormorant Garamond";
  font-display: swap;
  src: url("/fonts/cormorant-garamond.woff2") format("woff2");
}
```

**Server:**
- Minimize TTFB with CDN
- Use Supabase edge network
- Enable compression (Brotli)

## INP (Interaction to Next Paint)

### What affects INP
- JavaScript execution time
- Long tasks (> 50ms)
- Large bundle sizes
- Complex component re-renders

### Optimization

**JavaScript:**
```typescript
// Break up long tasks
setTimeout(() => {
  heavyComputation();
}, 0);

// Use requestAnimationFrame for visual updates
requestAnimationFrame(() => {
  updateUI();
});

// Defer non-critical JS
<script defer src="non-critical.js" />
```

**Rendering:**
```typescript
// Avoid layout thrashing
// Bad: read → write → read → write
const width = element.clientWidth; // read
element.style.width = width + 100 + "px"; // write
const height = element.clientHeight; // read
element.style.height = height + 50 + "px"; // write

// Good: batch reads, then batch writes
const width = element.clientWidth;
const height = element.clientHeight;
requestAnimationFrame(() => {
  element.style.width = width + 100 + "px";
  element.style.height = height + 50 + "px";
});
```

## CLS (Cumulative Layout Shift)

### What affects CLS
- Images without dimensions
- Ads/dynamic content without reserved space
- Web fonts causing FOIT/FOUT
- Late-loading content pushing visible content

### Optimization

**Images:**
```typescript
// Always set explicit dimensions
<img width="800" height="1000" src="product.jpg" alt="..." />

// Or use aspect-ratio
<div style="aspect-ratio: 4/5">
  <img src="product.jpg" alt="..." />
</div>
```

**Dynamic Content:**
```typescript
// Reserve space for dynamic content
<div style="min-height: 200px">
  {isLoading ? <Skeleton /> : <ActualContent />}
</div>
```

**Fonts:**
```typescript
// Use font-display: swap to prevent invisible text
// Apply size-adjust for fallback fonts to reduce layout shift
@font-face {
  font-family: "Cormorant Garamond";
  font-display: swap;
  size-adjust: 100%;
}
```

## Monitoring

```typescript
// Report Web Vitals to analytics
import { onLCP, onINP, onCLS } from "web-vitals";

function sendToAnalytics(metric: any) {
  console.log(metric.name, metric.value);
  // Send to analytics service
}

onLCP(sendToAnalytics);
onINP(sendToAnalytics);
onCLS(sendToAnalytics);
```

## Testing

- Use PageSpeed Insights for real-user data (CrUX)
- Use Lighthouse for lab data
- Test on real mobile devices (Moto G4, iPhone SE)
- Test on throttled networks (Slow 3G, 4X CPU slowdown)
- Monitor in production with RUM (Real User Monitoring)
