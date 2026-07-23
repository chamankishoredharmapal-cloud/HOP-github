# Improve Lighthouse Score Prompt

## Context
- Read `.ai/rules/PERFORMANCE_STANDARDS.md` for performance targets
- Run Lighthouse in Chrome DevTools or via CLI
- Current Lighthouse report

## Steps

### 1. Identify Issues
Run Lighthouse in Chrome DevTools:
1. Open the application
2. Open DevTools → Lighthouse tab
3. Run report (Mobile + Desktop)
4. Note all failing audits

### 2. Performance Fixes

**Images:**
- [ ] Convert to WebP/AVIF format
- [ ] Add `loading="lazy"` for below-fold images
- [ ] Add explicit width/height (prevents CLS)
- [ ] Use responsive images with `srcSet` and `sizes`
- [ ] Compress images (quality 80-85%)

**JavaScript:**
- [ ] Code-split with `React.lazy()`
- [ ] Remove unused imports
- [ ] Move third-party scripts to load async/defer
- [ ] Reduce main-thread work
- [ ] Minimize polyfills

**CSS:**
- [ ] Remove unused CSS (Tailwind purge handles this)
- [ ] Inline critical CSS (above-fold)
- [ ] Avoid @import (use <link> instead)

**Fonts:**
- [ ] Add `font-display: swap`
- [ ] Preconnect to font origins
- [ ] Subset fonts (only needed characters)
- [ ] Use WOFF2 format

**Server:**
- [ ] Enable text compression (gzip/brotli)
- [ ] Implement CDN caching
- [ ] Optimize TTFB

### 3. Accessibility Fixes
- [ ] Add alt text to all images
- [ ] Fix color contrast issues
- [ ] Add ARIA labels where needed
- [ ] Ensure heading hierarchy
- [ ] Add focus indicators

### 4. SEO Fixes
- [ ] Add meta description
- [ ] Add Open Graph tags
- [ ] Add structured data (JSON-LD)
- [ ] Fix heading hierarchy
- [ ] Add canonical URL

### 5. Verify
- [ ] Run Lighthouse again and compare scores
- [ ] All scores ≥ 90 (Performance), ≥ 95 (Accessibility, SEO, Best Practices)
