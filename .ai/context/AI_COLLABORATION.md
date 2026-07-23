# AI Collaboration Rules — House of Padmavati

## Purpose

Ensure consistent, production-grade output regardless of which AI model works on the project. These rules govern how AI agents operate on the House of Padmavati codebase.

## General Rules

1. **Always read the context**. Begin every session by reading `.ai/context/PROJECT_CONTEXT.md` to understand the project state.

2. **Follow the standards**. All code must comply with the standards in `.ai/rules/`. Do not deviate unless explicitly instructed.

3. **Use the prompts**. For recurring tasks (bug fixes, features, tests), use the relevant prompt template from `.ai/prompts/`.

4. **Update context**. End each session by updating `.ai/context/SESSION_CONTEXT.md` with what was done and what's next.

5. **No assumptions**. Never assume libraries, dependencies, or patterns exist without verifying in the codebase first.

6. **Security first**. Never introduce code that exposes secrets, keys, or PII. Never commit credentials.

7. **Production minimums**. All code must meet: WCAG 2.1 AA, Lighthouse 90+, no console.log in production, error boundaries on all pages.

## Code Consistency Rules

### File Organization
- One component per file (except small utility components)
- Colocate styles with components (Tailwind classes)
- Colocate tests near implementation (or in `__tests__/`)
- Group by feature for feature-specific code, by type for shared code

### Imports
- Use `@/` alias for `src/` imports
- Group imports: React/external → internal modules → styles
- No barrel files (index.ts re-exports) for components

### Naming
- **Components**: PascalCase, `.tsx` extension
- **Hooks**: `use` prefix, camelCase
- **Services**: camelCase, descriptive verb prefix (`fetch`, `create`, `update`, `delete`)
- **Types**: PascalCase, domain-specific (`StorefrontProduct`, `CartItem`)
- **Files**: PascalCase for components, camelCase for utilities
- **CSS classes**: Tailwind utilities (no custom CSS except animations)

### State Management
- Server data → TanStack Query (`useQuery`/`useMutation`)
- Client UI state → `useState` or `useReducer`
- Global client state → React Context (cart, wishlist)
- Form state → React Hook Form
- URL state → React Router params/search params
- Persistent state → localStorage

### TypeScript
- Use explicit interfaces for all data structures
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and primitives
- Avoid `any` — use `unknown` and narrow with type guards
- Import types with `import type` syntax

### Styling
- Use Tailwind utility classes exclusively
- Use `cn()` for conditional class merging (from `@/lib/utils`)
- Use CSS custom properties for brand colors (defined in `index.css`)
- Use Radix primitives for all interactive UI elements
- Follow shadcn/ui patterns for component composition

## Collaboration Protocol

### When Starting a Task
1. Check `.ai/context/SESSION_CONTEXT.md` for current state
2. Read relevant standards in `.ai/rules/`
3. Use the appropriate prompt template from `.ai/prompts/`
4. Review existing code for patterns to follow

### During Development
1. Write tests alongside code (TDD preferred)
2. Run lint before completing (`pnpm lint`)
3. Check TypeScript compilation (`tsc --noEmit`)
4. Verify existing tests still pass (`pnpm test:e2e`)

### When Multiple AI Models Collaborate
1. Each model writes to separate branches
2. PRs are reviewed against `.ai/rules/CODE_REVIEW_STANDARDS.md`
3. SESSION_CONTEXT.md is the shared state — always read before writing
4. No model overwrites another model's work without discussion
5. Conflicts are resolved by the most specialized model for the area

### When Finishing a Session
1. Update `.ai/context/SESSION_CONTEXT.md`
2. Ensure all tests pass
3. Ensure lint passes
4. Commit with a descriptive message following GIT_STANDARDS.md
5. Push changes and create a PR if applicable

## Quality Gates

All code must pass these gates before being considered complete:

| Gate | Requirement | Tool |
|------|-------------|------|
| Lint | No errors, no warnings | `pnpm lint` |
| TypeScript | No type errors | `tsc --noEmit` |
| Tests | All existing tests pass | `pnpm test:e2e` |
| Accessibility | WCAG 2.1 AA | axe-core / manual review |
| Performance | Lighthouse 90+ | Lighthouse CI |
| Security | No known vulnerabilities | npm audit / manual review |
| Standards | Follows `.ai/rules/*` | Manual review |
