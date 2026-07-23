# Build Feature Prompt

## Context
- Read `.ai/context/PROJECT_CONTEXT.md` for full project context
- Read `.ai/rules/CODING_STANDARDS.md` for coding conventions
- Read `.ai/rules/REACT_STANDARDS.md` for React patterns
- Read `.ai/rules/TYPESCRIPT_STANDARDS.md` for TypeScript conventions

## Feature Definition

**Feature Name**: [Name]
**Description**: [Brief description]
**Acceptance Criteria**:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

## Steps

### 1. Understand Existing Patterns
- Search for similar existing features in the codebase
- Read 2-3 existing implementations to understand patterns
- Check if there are existing components, hooks, or services you should reuse

### 2. Plan Implementation
- Identify files to create or modify
- Define the component tree
- Plan data flow (API calls → state → render)
- Plan test scenarios

### 3. Create Types
```typescript
// Define any new types in src/types/ or colocated with the feature
```

### 4. Create Service Layer (if needed)
```typescript
// src/services/{feature}Service.ts
// Use Supabase client from @/integrations/supabase/client
// Follow existing service patterns (fetch, create, update, delete)
```

### 5. Create Hooks (if needed)
```typescript
// src/hooks/use{Feature}.ts
// Use TanStack Query for server state
// Return typed objects
```

### 6. Create Components
```typescript
// Follow React Standards
// Use shadcn/ui components where possible
// Use cn() for conditional classes
// Add data-testid attributes for testing
```

### 7. Create Page (if applicable)
```typescript
// In src/pages/
// Lazy-load with React.lazy()
// Set metadata with useMetadata hook
```

### 8. Add Routing (if applicable)
```typescript
// In src/App.tsx
// Lazy-loaded route
```

### 9. Write Tests
```typescript
// In src/__tests__/
// BDD pattern
// Accessibility-first selectors
// Test: happy path, empty state, error state, edge cases
```

### 10. Style
- Use Tailwind utility classes
- Follow luxury brand design standards
- Responsive design (mobile-first)
- Animations (subtle, purposeful)

### 11. Verify
- [ ] `pnpm lint` passes
- [ ] `tsc --noEmit` passes
- [ ] `pnpm test:e2e` passes
- [ ] Manual testing in browser
- [ ] Lighthouse check
- [ ] Accessibility check (keyboard nav, screen reader)
