# Generate Documentation Prompt

## Context
- Read `.ai/context/PROJECT_CONTEXT.md` for project overview
- Read the source code being documented
- Read existing docs in `docs/` for style reference

## Steps

### 1. Identify What to Document
- Component/function public API
- Setup and configuration steps
- Architecture decisions
- Workflows and processes
- API endpoints
- Database schema

### 2. Choose Documentation Type

**For Components:**
```typescript
/**
 * {ComponentName}
 *
 * [Brief description of what this component does]
 *
 * @example
 * <{ComponentName} product={product} onAddToCart={handleAdd} />
 *
 * @param {ComponentNameProps} props - Component props
 * @param {Product} props.product - The product to display
 * @param {(id: string) => void} props.onAddToCart - Callback when add to cart is clicked
 */
```

**For Hooks:**
```typescript
/**
 * use{Name}
 *
 * [Description of what this hook does and when to use it]
 *
 * @example
 * const { data, isLoading, error } = use{Name}(id);
 *
 * @param {string} id - The ID to fetch
 * @returns {{ data: Type | undefined, isLoading: boolean, error: Error | null }}
 */
```

**For Services:**
```typescript
/**
 * {name}Service
 *
 * [Description of the service module]
 *
 * @example
 * const products = await {name}Service.fetchProducts();
 * const product = await {name}Service.fetchProduct(id);
 */
```

**For Pages/Routes:**
```markdown
# {Page Name}

## Route
`/path/to/page`

## Description
[What this page does]

## Props (if any)
- [prop]: [description]

## State
- Loading: [what user sees]
- Empty: [what user sees]
- Error: [what user sees]
- Success: [what user sees]

## API Calls
- [endpoint]: [purpose]

## Accessibility
- [any special considerations]
```

### 3. Write Documentation
- Focus on WHY and HOW, not WHAT (code is self-documenting)
- Include clear examples
- Document edge cases and assumptions
- Keep it concise but complete
- Use consistent formatting (markdown)

### 4. Verify
- [ ] Documentation is accurate (matches code behavior)
- [ ] Examples are correct and copy-pasteable
- [ ] No typos or grammatical errors
- [ ] Links are valid
- [ ] Consistent with existing documentation style
