# Review Code — House of Padmavati

> From: old `rules/CODE_REVIEW_STANDARDS.md` + `prompts/REVIEW_PULL_REQUEST.md`

## Before Requesting Review

Author verifies:
- [ ] `pnpm lint` — 0 errors
- [ ] `tsc --noEmit` — 0 errors
- [ ] All tests pass
- [ ] New tests for new functionality
- [ ] No debug code, no secrets, no TODOs
- [ ] PR description complete (what, why, how to test)
- [ ] Screenshots (if visual change)

## Review Checklist

| Category | Check |
|----------|-------|
| **Architecture** | Fits project patterns? Correct location? Could it be simpler? |
| **Functionality** | Meets acceptance criteria? Edge cases? Error states? Loading states? |
| **Code Quality** | Readable? Single-responsibility? Clear names? No duplication? |
| **TypeScript** | Precise types? No `any`? `import type`? |
| **React** | Correct hooks? Stable keys? Right state location? No unnecessary re-renders? |
| **Accessibility** | Alt text? Keyboard nav? Heading hierarchy? ARIA correct? |
| **Performance** | Images optimized? Code-split? Memoized? |
| **Security** | Input validated? Secrets exposed? RLS correct? |
| **Testing** | Coverage adequate? BDD pattern? A11y selectors? Edge cases? |

## Comments Format

- `**issue**:` — Must fix before merge (blocking)
- `**suggestion**:` — Consider improving (non-blocking)
- `**nitpick**:` — Minor preference (can ignore)

Be respectful, explain WHY, praise good code. Respond within 24 hours.
