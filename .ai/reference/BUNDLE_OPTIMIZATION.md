# Bundle Optimization — House of Padmavati

> From: old `performance/BUNDLE_OPTIMIZATION.md`

## Targets

| Asset | Size |
|-------|------|
| Initial JS (gzipped) | < 200 KB |
| Lazy chunks | < 50 KB each |
| Initial CSS (gzipped) | < 20 KB |
| Total page weight | < 1 MB |

## Strategy

### Code Splitting
```typescript
// Route-level (already in App.tsx)
const Collections = React.lazy(() => import("@/pages/Collections"));

// Component-level (when component is large/heavy)
const ProductGallery = React.lazy(() => import("./ProductGallery"));
```

### Vendor Chunking (vite.config.ts)
```typescript
manualChunks: {
  vendor: ["react", "react-dom", "react-router-dom"],
  supabase: ["@supabase/supabase-js"],
  query: ["@tanstack/react-query"],
  forms: ["react-hook-form", "@hookform/resolvers", "zod"],
}
```

### Tree Shaking
- Import directly: `import { Button } from "@/components/ui/button"` (not barrel)
- No barrel files for components
- Dynamic imports for conditionally-used libs
- Prefer `import format from "date-fns/format"` over `import { format } from "date-fns"`

### Analyze
```bash
pnpm exec vite-bundle-visualizer
pnpm list --depth=0  # dependency audit
pnpm audit           # vulnerability check
```
