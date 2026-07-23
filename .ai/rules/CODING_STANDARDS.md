# Coding Standards — House of Padmavati

## General Principles

- Write code for humans first, computers second
- Favor clarity over cleverness
- Be explicit; avoid implicit behavior
- Don't repeat yourself (DRY), but don't prematurely abstract
- Fail fast and visibly — throw errors, don't swallow them
- Every function does one thing well
- Maximum line length: 100 characters
- Indentation: 2 spaces (no tabs)
- Semicolons required
- Single quotes for strings (except JSX)

## File Organization

```
// Standard file structure
1. Imports (grouped: external → internal → styles)
2. Type definitions (if any)
3. Constants (if any)
4. Component/function definition
5. Default export (if applicable)
```

## Imports

```typescript
// External libraries first
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

// Internal modules (use @/ alias)
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/product";

// Styles last (if not using Tailwind exclusively)
import "./styles.css";
```

## Naming Conventions

| Construct | Convention | Example |
|-----------|-----------|---------|
| Variables | camelCase | `productName`, `isLoading` |
| Functions | camelCase, verb prefix | `fetchProducts`, `handleSubmit` |
| Booleans | prefix with `is`, `has`, `should` | `isLoading`, `hasError` |
| Constants | UPPER_SNAKE_CASE | `MAX_QUANTITY`, `DEFAULT_CURRENCY` |
| Types/Interfaces | PascalCase | `StorefrontProduct`, `CartItem` |
| Enums | PascalCase | `OrderStatus` |
| Enums values | PascalCase | `OrderStatus.Pending` |
| CSS classes | Tailwind only | (no custom classes) |
| Files | PascalCase (components) | `ProductDetail.tsx` |
| Files | camelCase (utils) | `productService.ts` |

## Error Handling

```typescript
// Good — explicit error handling
try {
  const result = await riskyOperation();
  return result;
} catch (error) {
  console.error("Failed to perform risky operation:", error);
  throw new Error("RiskyOperationFailed");
}

// Bad — silent failure
try {
  await riskyOperation();
} catch {}
```

## Comments

- No comments that explain what the code does (the code should be self-documenting)
- Use comments to explain WHY, not WHAT
- Use JSDoc for public APIs and exported functions

```typescript
// Good — explains rationale
// We use a Set here because lookups are O(1) vs O(n) for arrays

// Bad — states the obvious
// This function fetches products
```

## Functions

```typescript
// Good — pure function, single responsibility
function formatPrice(amount: number, currency: string): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
  }).format(amount);
}

// Good — async function with typed return
async function fetchProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}
```

## Testing

- Write tests for all new code
- Follow BDD pattern: `describe` → `test`/`it` → `expect`
- Use `data-testid` attributes for selectors
- Name tests descriptively: `test("adds item to cart when user clicks add")`
