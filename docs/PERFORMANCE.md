# Performance

## Build Output

The app is a static SPA. Build produces `dist/` with:

- `index.html` — entry point
- `assets/` — hashed JS, CSS, images

## Bundle Size

Current dependencies total ~1.2 MB uncompressed (before tree-shaking by Vite).

### Largest Dependencies

| Package | Approx. Size | Notes |
|---------|-------------|-------|
| `@supabase/supabase-js` | ~30 KB | Tree-shaken — unused features excluded |
| `@tanstack/react-query` | ~25 KB | Core + devtools excluded |
| `react-router-dom` | ~20 KB | |
| `lucide-react` | Tree-shaken | Only used icons included |
| `recharts` | ~100 KB | Only in Studio dashboard |
| `react-day-picker` | ~15 KB | Only in Studio |
| shadcn components | ~0.5-1 KB each | Tree-shaken by Vite |

## Optimization Notes

- All images loaded from Supabase Storage CDN
- Videos use `preload="auto"` for hero, `preload="metadata"` for collection films
- React Query cached with 0 staleTime by default (refetch on mount)
- Route-level code splitting is **not** currently implemented
- Fonts loaded from Google Fonts CDN (Cormorant Garamond + Inter)

## 🚧 Planned Improvements

- Route-level lazy loading with `React.lazy()` + `Suspense`
- Image optimization pipeline
- Video compression strategy
- Service worker for offline support
- Lighthouse performance budget

## Current Lighthouse Scores (Estimates)

| Metric | Estimate | Notes |
|--------|----------|-------|
| Performance | ~70-85 | Video autoplay impacts LCP |
| Accessibility | ~90+ | Semantic HTML, ARIA labels |
| Best Practices | ~90 | HTTPS, modern JS |
| SEO | ~95 | Meta tags, semantic structure |
