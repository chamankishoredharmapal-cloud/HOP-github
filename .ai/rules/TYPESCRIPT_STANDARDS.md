# TypeScript Standards — House of Padmavati

## Configuration

- `tsconfig.app.json`: `strict: false`, `jsx: react-jsx`, target ES2020
- `tsconfig.node.json`: `strict: true`, target ES2022
- Path alias: `@/*` → `./src/*`

## Type Rules

### Prefer `interface` over `type` for objects
```typescript
// Good
interface Product {
  id: string;
  name: string;
  price: number;
}

// Acceptable (union, intersection, primitive aliases)
type Status = "active" | "inactive" | "draft";
type Nullable<T> = T | null;
```

### Use `type` for unions and functional types
```typescript
type CartAction =
  | { type: "ADD_ITEM"; product: Product }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "CLEAR_CART" };

type FetchFn<T> = (id: string) => Promise<T>;
```

### Import types explicitly
```typescript
// Good
import type { Product } from "@/types/product";

// Bad (imports both type and value)
import { Product } from "@/types/product";
```

### Avoid `any`
```typescript
// Good
function processData(data: unknown): string {
  if (typeof data === "string") return data;
  return JSON.stringify(data);
}

// Bad
function processData(data: any): string {
  return data.toString();
}
```

### Use `as const` for literal types
```typescript
const ORDER_STATUSES = ["pending", "confirmed", "shipped", "delivered"] as const;
type OrderStatus = (typeof ORDER_STATUSES)[number];
```

### Type function parameters and return values
```typescript
// Good
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// Bad
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}
```

## Patterns

### Discriminated Unions for State
```typescript
interface LoadingState { status: "loading"; }
interface SuccessState<T> { status: "success"; data: T; }
interface ErrorState { status: "error"; error: string; }

type AsyncState<T> = LoadingState | SuccessState<T> | ErrorState;
```

### Generic Constraints
```typescript
interface HasId {
  id: string;
}

function fetchById<T extends HasId>(items: T[], id: string): T | undefined {
  return items.find((item) => item.id === id);
}
```

### Type Guards
```typescript
function isProduct(item: unknown): item is Product {
  return (
    typeof item === "object" &&
    item !== null &&
    "id" in item &&
    "name" in item
  );
}
```

## Enums

Prefer `as const` objects over TypeScript enums:
```typescript
const PaymentStatus = {
  Pending: "pending",
  Completed: "completed",
  Failed: "failed",
  Refunded: "refunded",
} as const;

type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
```
