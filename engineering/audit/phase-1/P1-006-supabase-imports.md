# P1-006 — Supabase Import Architecture Audit

## Summary

Supabase import architecture audit of the House of Padmavati codebase. Reconciled mixed static/dynamic client import pattern by refactoring `src/services/contactService.ts` to use standard static import (`import { supabase } from "@/integrations/supabase/client"`). Re-established unified client import architecture across all 23 application services and eliminated Vite build warning.

**Result:** Mixed static/dynamic import warning ➔ 0 warnings. Unified static import architecture achieved.

---

## Initial Findings

During baseline production build (`npm run build`), Vite emitted a chunking architecture warning:
```
(!) src/integrations/supabase/client.ts is dynamically imported by src/services/contactService.ts but also statically imported by 22 other services... dynamic import will not move module into another chunk.
```

---

## Root Cause Analysis

### Finding 1: Suboptimal Dynamic Client Import in `contactService.ts`

- **Evidence Classification:** VERIFIED
- **Why it existed:** `submitContactForm` in `contactService.ts` used `const { supabase } = await import("@/integrations/supabase/client");` under the assumption of lazy loading the Supabase client. However, 22 other services in `src/services/` and `src/studio/services/` statically import `supabase` at module scope.
- **Validity:** Valid architectural defect. In Rollup/Vite, a module statically imported anywhere in the entry bundle graph cannot be code-split by a single dynamic import site. The dynamic import produced build warning overhead without any bundle size reduction.
- **Fix applied:** Replaced `await import(...)` with top-level static import `import { supabase } from "@/integrations/supabase/client";` in `src/services/contactService.ts`.

---

## Changes Made

1. **`src/services/contactService.ts`**: Replaced inline `await import("@/integrations/supabase/client")` with top-level `import { supabase } from "@/integrations/supabase/client"`.

---

## Files Modified

| File | Lines Changed | Change Type |
|------|---------------|-------------|
| `src/services/contactService.ts` | 2 | Refactored dynamic import to top-level static import |

---

## Verification

| Check | Command | Result |
|-------|---------|--------|
| Supabase Import Warning | `npm run build` | **0 warnings** (warning eliminated) |
| ESLint | `npm run lint` | 0 errors, 0 warnings |
| TypeScript | `npx tsc --noEmit` | 0 errors |
| Playwright E2E Tests | `npx playwright test` | 14 passed, 4 skipped |

---

## Self Review (Mandatory 5-Question Audit)

1. **Did I modify more files than necessary?** No. Only `src/services/contactService.ts` was modified.
2. **Did I preserve existing behavior?** Yes. `submitContactForm` functions identically.
3. **Did I introduce architectural debt?** No. Established 100% consistent static import architecture.
4. **Could the solution be simpler?** No. Top-level static import is the cleanest solution.
5. **Would this pass a senior engineering code review?** Yes. Adheres strictly to Root Cause and Minimal Changes policies.

---

## Remaining Risks

**None.** Import architecture is unified and warning-free.

---

## Recommendation

**Close P1-006.** Acceptance criteria satisfied.
