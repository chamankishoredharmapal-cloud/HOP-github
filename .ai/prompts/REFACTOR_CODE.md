# Refactor Code Prompt

## Context
- Read `.ai/rules/CODING_STANDARDS.md` for conventions
- Read `.ai/rules/TYPESCRIPT_STANDARDS.md` for type conventions
- Read `.ai/rules/REACT_STANDARDS.md` for component patterns

## Refactoring Specification

**Target**: [File(s) to refactor]
**Goal**: [What improvement are we making? e.g., extract logic, improve readability, reduce duplication]
**Constraints**: [Must maintain API compatibility, no behavior change, etc.]

## Steps

### 1. Understand the Current Code
- Read the full file(s)
- Understand what the code does
- Identify the problems:
  - Duplication?
  - Poor naming?
  - Too many responsibilities?
  - Hard to test?
  - Performance issues?
  - Type safety issues?

### 2. Write Tests First (if tests don't exist)
```typescript
// Capture current behavior in tests
// So we know we haven't changed behavior
```

### 3. Plan the Refactoring

Common refactoring patterns:

**Extract Component**: Large component → smaller components
```typescript
// Before
function ProductPage() {
  // 200 lines of JSX
}

// After
function ProductPage() {
  return (
    <ProductHero />
    <ProductDetails />
    <RelatedProducts />
  );
}
```

**Extract Hook**: Component logic → custom hook
```typescript
// Before
function CartPage() {
  const [items, dispatch] = useReducer(cartReducer, []);
  // ... cart logic
}

// After
function CartPage() {
  const { items, addItem, removeItem, total } = useCart();
}
```

**Extract Service**: Inline API calls → service module
```typescript
// Before
const { data } = await supabase.from("products").select("*");

// After
const products = await productService.fetchProducts();
```

**Simplify Types**: Complex types → simpler, more precise types
```typescript
// Before
interface Product {
  [key: string]: any;
}

// After
interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
}
```

### 4. Apply Changes
- One refactoring at a time
- Run tests after each change
- Keep commits atomic

### 5. Verify
- [ ] All existing tests pass
- [ ] Behavior is unchanged
- [ ] No new TypeScript errors
- [ ] No linting errors
- [ ] Code is measurably improved (fewer lines, better types, etc.)
