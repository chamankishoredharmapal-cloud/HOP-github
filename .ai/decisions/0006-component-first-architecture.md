# ADR-0006: Component-First Architecture

**Status**: Accepted  
**Date**: 2026-07-19  
**Author**: AI Architecture Team  

## Context
The codebase needs a clear, scalable component architecture that supports both the public storefront and the admin studio. Without clear boundaries, components become tightly coupled, hard to test, and difficult to maintain.

## Decision
Adopt a component-first architecture with clear layers:

```
Pages (route entry points, data orchestration)
  → Feature Components (domain-specific, e.g., ProductGallery, CartItem)
    → UI Components (generic, reusable, e.g., Button, Dialog, Input)
      → Radix Primitives (accessible headless components)
```

- **UI components** (`src/components/ui/`): Generic, reusable, no business logic, no API calls. Follow shadcn/ui patterns.
- **Feature components** (`src/components/hop/`, `src/studio/components/`): Domain-specific, may use hooks and services.
- **Pages** (`src/pages/`, `src/studio/pages/`): Route entry points. Minimal logic — delegate to feature components.
- **Hooks** (`src/hooks/`, `src/studio/hooks/`): Encapsulate stateful logic, API calls, and side effects.
- **Services** (`src/services/`, `src/studio/services/`): API layer — all Supabase/Edge Function calls.
- **Contexts** (`src/contexts/`): Global client state (cart, wishlist).

## Consequences
### Positive
- Clear dependency direction (pages → features → UI → Radix)
- Components are easily testable (UI components are pure, feature components have mocked hooks)
- Studio and storefront share UI layer but have separate feature components
- Easy to find and reason about code

### Negative
- More files than flat architecture
- Requires discipline to maintain boundaries
- Cross-cutting concerns (loading states, error handling) must be consistent

## Compliance
- UI components: no imports from `src/services/`, `src/hooks/`, or `src/pages/`
- Feature components: may import from `src/hooks/`, `src/services/`, `src/components/ui/`
- Pages: minimal JSX, mostly orchestrating feature components
- Studio components: in `src/studio/`, may import UI from `src/components/ui/`
- No circular dependencies between layers
