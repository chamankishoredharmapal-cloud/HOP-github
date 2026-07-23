# Coding Standards — House of Padmavati

> Consolidates: old `CODING_STANDARDS.md` + `REACT_STANDARDS.md` + `TYPESCRIPT_STANDARDS.md`

## General

- Favor clarity over cleverness. No implicit behavior. Fail fast. DRY but don't over-abstract.
- Max line length: 100 characters. Indent: 2 spaces. Semicolons required. Single quotes for strings (except JSX).
- One component per file (except small utilities). Colocate tests in `__tests__/`. No barrel files.

## File Organization

```
1. Imports: external → internal (@/ alias) → styles
2. Type definitions
3. Constants
4. Component / function
5. Export (named, not default — exceptions: pages, lazy routes)
```

## Naming

| Construct | Convention | Example |
|-----------|-----------|---------|
| Components | PascalCase, .tsx | `ProductCard.tsx` |
| Hooks | camelCase, use prefix | `useProduct.ts` |
| Services | camelCase, verb prefix | `fetchProducts()` |
| Types/Interfaces | PascalCase | `StorefrontProduct` |
| Booleans | is/has/should prefix | `isLoading`, `hasError` |
| Constants | UPPER_SNAKE_CASE | `MAX_QUANTITY` |
| Files (components) | PascalCase | `ProductDetail.tsx` |
| Files (utils) | camelCase | `productService.ts` |
| CSS classes | Tailwind only | (no custom classes) |

## TypeScript

- `interface` for objects, `type` for unions/primitives/functional.
- `import type` for type-only imports. No `any` — use `unknown` + type guards.
- `as const` for literal types. Discriminated unions for state machines.

```typescript
interface Product { id: string; name: string; price: number }
type Status = "active" | "inactive" | "draft"
type CartAction = { type: "ADD_ITEM"; product: Product } | { type: "REMOVE_ITEM"; id: string }

function processData(data: unknown): string {
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}
```

## React

- Named function declarations for components. Props interface: `{ComponentName}Props` — colocated.
- Custom hooks in `src/hooks/` returning objects (not arrays, except useState).
- State management: TanStack Query (server), useReducer + Context (global), useState (UI), React Hook Form (forms).
- Performance: `React.memo`/`useMemo`/`useCallback` only when profiling shows need. `React.lazy()` for route splitting.
- Accessibility: semantic HTML, Radix primitives, keyboard-accessible, alt text, aria-labels.
- Error boundaries on every lazy-loaded route + root.

```typescript
function useProduct(id: string) {
  return useQuery({ queryKey: ["product", id], queryFn: () => productService.fetchProduct(id) });
}
```

## Imports

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";
```

## Error Handling

```typescript
try { return await riskyOperation() }
catch (error) { console.error("Failed:", error); throw new Error("OperationFailed") }
```

No silent failures. No comments that explain WHAT (code is self-documenting). Comments explain WHY.
