# React Standards — House of Padmavati

## Component Structure

```typescript
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductCardProps {
  product: StorefrontProduct;
  className?: string;
}

function ProductCard({ product, className }: ProductCardProps) {
  return (
    <article className={cn("group relative", className)}>
      <img src={product.images[0]} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </article>
  );
}

export { ProductCard };
```

## Rules

### Component Creation
- One component per file (exceptions: small utility components)
- Named function declarations (not arrow functions for components)
- Props interface named `{ComponentName}Props` and colocated
- Export named, not default (exceptions: pages, lazy-loaded routes)
- Use `.tsx` extension for all components

### Hooks
- Custom hooks in `src/hooks/`, named `use{Name}.ts`
- Hooks return objects (not arrays, except useState)
- Custom hooks that wrap TanStack Query follow this pattern:
  ```typescript
  function useProduct(id: string) {
    return useQuery({
      queryKey: ["product", id],
      queryFn: () => productService.fetchProduct(id),
    });
  }
  ```

### State Management
- Server state → TanStack Query
- Form state → React Hook Form + Zod
- Global client state → Context + useReducer
- UI state → useState
- Computed state → useMemo
- Callback stability → useCallback

### Performance
- Use `React.memo` only when profiling shows a need
- Lazy-load route components with `React.lazy`
- Use `useMemo`/`useCallback` only for expensive operations
- Avoid inline function definitions in render (extract to hooks)
- Use `key` on all list items (stable, unique keys)

### Accessibility
- Use semantic HTML (`<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`)
- All interactive elements must be keyboard-accessible
- Use Radix primitives for complex interactive widgets (dialogs, dropdowns, tabs)
- Alt text on all images
- `aria-label` on icon-only buttons
- Role attributes where semantic HTML is insufficient

### Error Boundaries
- Wrap each lazy-loaded route in an ErrorBoundary
- Wrap the entire app in a root ErrorBoundary
- ErrorBoundary shows a user-friendly message with retry option

```typescript
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  // Standard error boundary implementation
}
```

### Forms
- Use React Hook Form for all forms
- Use Zod for validation schemas
- Use shadcn/ui form components (FormField, FormItem, FormLabel, FormControl, FormMessage)
- Show validation errors inline, not in toasts
- Disable submit button while submitting
- Show loading state during submission

```typescript
const formSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2, "Name must be at least 2 characters"),
});

function CheckoutForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  // ...
}
```
