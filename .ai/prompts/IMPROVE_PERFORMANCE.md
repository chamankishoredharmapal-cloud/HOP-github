# Improve Performance Prompt

## Context
- Read `.ai/rules/PERFORMANCE_STANDARDS.md` for targets
- Current performance baseline (Lighthouse, Core Web Vitals)

## Steps

### 1. Measure Current Performance

```bash
# Run Lighthouse via CLI
npx lighthouse http://localhost:8080 --view --preset=desktop
npx lighthouse http://localhost:8080 --view --preset=mobile

# Or use Chrome DevTools Lighthouse tab
```

### 2. Diagnose Issues

Check these in order of impact:

**Images (usually biggest impact):**
- Are images optimized (WebP/AVIF, compressed)?
- Are images lazy-loaded below the fold?
- Are images sized correctly (no 4000px images in 400px containers)?
- Are explicit width/height set (prevent CLS)?

**JavaScript:**
- Is the bundle too large? Check with `vite-bundle-visualizer`
- Are large components lazy-loaded?
- Are there unnecessary re-renders?
- Are third-party scripts loaded async?

**Fonts:**
- Are fonts displayed with `font-display: swap`?
- Are font origins preconnected?
- Are fonts subset to needed characters?

**CSS:**
- Is critical CSS inlined?
- Is unused CSS purged (Tailwind handles this)?

### 3. Apply Fixes

```typescript
// Lazy load below-fold images
<img loading="lazy" src="product.jpg" alt="..." width="400" height="500" />

// Use modern image formats
<picture>
  <source srcSet="product.avif" type="image/avif" />
  <source srcSet="product.webp" type="image/webp" />
  <img src="product.jpg" alt="..." />
</picture>

// Code-split routes
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));

// Preconnect to critical origins
<link rel="preconnect" href="https://fonts.googleapis.com" />

// Memoize expensive computations
const total = useMemo(() => calculateTotal(items), [items]);
```

### 4. Verify
- [ ] Lighthouse Performance >= 90
- [ ] LCP < 2.5s
- [ ] CLS < 0.1
- [ ] Bundle size < 200KB gzipped (initial)
- [ ] No render-blocking resources
- [ ] Images properly optimized
