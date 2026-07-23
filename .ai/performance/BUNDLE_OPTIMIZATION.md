# Bundle Optimization — House of Padmavati

## Targets

| Asset | Size Target |
|-------|-------------|
| Initial JS (gzipped) | < 200 KB |
| Lazy-loaded chunks | < 50 KB each |
| Initial CSS (gzipped) | < 20 KB |
| Total page weight | < 1 MB |

## Strategy

### 1. Code Splitting

**Route-Level (already implemented):**
```typescript
// Each route is a separate chunk
const Collections = React.lazy(() => import("@/pages/Collections"));
const ProductDetail = React.lazy(() => import("@/pages/ProductDetail"));
const StudioDashboard = React.lazy(() => import("@/studio/pages/Dashboard"));
```

**Component-Level (when needed):**
```typescript
const ProductGallery = React.lazy(() => import("./ProductGallery"));
const ReviewSection = React.lazy(() => import("./ReviewSection"));
```

### 2. Tree Shaking

Vite automatically tree-shakes unused imports. Ensure:
- Import only what you need: `import { Button } from "@/components/ui/button"` not `import * from`
- No barrel files (index.ts re-exports) for components
- Dynamic imports for conditionally-used libraries

```typescript
// Bad — imports entire library
import { format, parse, differenceInDays } from "date-fns";

// Good — imports specific functions
import format from "date-fns/format";
import parse from "date-fns/parse";
```

### 3. Vendor Chunk Splitting

Vite automatically splits vendor chunks. Configure in `vite.config.ts`:

```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ["react", "react-dom", "react-router-dom"],
        ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
        supabase: ["@supabase/supabase-js"],
        query: ["@tanstack/react-query"],
        forms: ["react-hook-form", "@hookform/resolvers", "zod"],
      },
    },
  },
},
```

### 4. Analyze Bundle

```bash
# Visualize bundle composition
pnpm add -D vite-bundle-visualizer
pnpm exec vite-bundle-visualizer

# Check gzipped sizes
pnpm build && dir dist\assets /s
```

### 5. Dependency Audit

```bash
# Find large dependencies
pnpm list --depth=0

# Check for unused dependencies
pnpm depcheck

# Audit for vulnerabilities
pnpm audit
```

### 6. Remove Unused Code

- Remove console.log statements before production
- Remove commented-out code
- Remove unused imports (ESLint rule: `@typescript-eslint/no-unused-vars`)
- Remove unused components
- Remove unused CSS (Tailwind purge handles this)

## Monitoring

- Run `vite-bundle-visualizer` weekly
- Track bundle size in CI (fail if > 10% increase)
- Alert on significant dependency additions
- Review new dependencies before adding
