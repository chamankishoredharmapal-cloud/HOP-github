# Phase 1 — Production Readiness Audit

**Project:** House of Padmavati (HOP)

**Status:** Active

**Owner:** Lead Software Engineer

**Start Date:** 2026-07-24

---

## 1. Purpose

Phase 1 is the foundational quality gate of the HOP engineering lifecycle. Its purpose is to establish production-level build integrity across the entire codebase before any new feature work resumes.

During this phase:
- **No new features are developed.**
- **No business logic is changed.**
- **No UX is altered.**

All effort is directed toward correctness, stability, and architectural hygiene. Every warning, every error, every unchecked dependency, and every runtime concern is investigated and resolved or documented with engineering justification.

Phase 1 answers one question: *Is this codebase production-ready at the build, type, lint, and dependency level?*

---

## 2. Goals

| # | Goal | Measurement |
|---|------|-------------|
| 1 | Zero TypeScript errors | `npx tsc --noEmit` exits 0 |
| 2 | Zero ESLint warnings | `npm run lint` exits 0 |
| 3 | Successful production build | `npm run build` exits 0 |
| 4 | Passing automated tests | `npx playwright test` — all tests pass |
| 5 | Runtime stability | No console errors in production-like environment |
| 6 | Secure dependencies | No critical/high vulnerabilities in `npm audit` |
| 7 | Production-grade architecture | Documented import architecture; no barrel anti-patterns |
| 8 | Production-ready bundle | Bundle size analyzed; no dead code shipped |

---

## 3. Engineering Principles & Mandatory Policies

Every change made during Phase 1 must adhere to these core principles and mandatory policies:

| Principle | Description |
|-----------|-------------|
| Minimal changes | Solve the problem with the fewest lines changed. Do not rewrite unrelated code. |
| Preserve UX | Do not alter user-facing behavior, layout, text, or interaction. |
| Preserve architecture | Do not restructure modules, rename exports, or move files unless required to fix a validated issue. |
| No unnecessary refactoring | If it isn't broken, don't "improve" it. Every change must be justified by a ticket. |
| No new features | Zero feature work during this phase. |
| Root cause before solution | Understand *why* a warning/error exists. Do not blindly suppress. |
| Verify every change | Every ticket must pass lint, type-check, build, and test gates before closing. |
| Small commits | Each ticket gets its own commit. Do not bundle unrelated work. |
| Production-first engineering | Think in terms of runtime behavior, bundle size, error paths, and edge cases. |

### Mandatory Engineering Policies

1. **Type Safety Policy:**
   Do NOT manually invent or fabricate Supabase database types to satisfy TypeScript. The database schema is the source of truth. If TypeScript errors originate from missing database types:
   - First determine whether the tables actually exist in Supabase.
   - If they exist, regenerate database types from the real schema or update the generated schema correctly.
   - If they do not exist, investigate why application code references them.

2. **Dependency Security Policy:**
   Do NOT use `npm audit fix` as a blanket solution. Perform an engineering audit for every vulnerability. Determine:
   - Direct vs transitive dependency
   - Runtime vs development dependency
   - Exploitability & attack vector
   - Breaking vs non-breaking upgrade path
   - Safest targeted remediation
   Only apply upgrades that are technically justified. Document every dependency decision.

3. **Root Cause Policy:**
   Before implementing ANY ticket, perform a PRE-TICKET ANALYSIS:
   - Read affected files completely.
   - Understand architecture and map dependencies.
   - Explain root cause with evidence.
   - Evaluate alternative solutions (smallest safe fix).
   - Estimate regression risk.
   No code should be modified before the investigation is complete.

4. **Performance Policy:**
   Never optimize simply because a warning exists. Every optimization must first identify the actual bottleneck supported by empirical evidence (e.g. bundle analyzer output, runtime traces).

5. **Completion Workflow:**
   Every ticket must follow this strict lifecycle:
   `Pre-change analysis` ➔ `Implementation` ➔ `Post-change diff` ➔ `Verification` ➔ `Regression analysis` ➔ `Documentation` ➔ `Master plan update` ➔ `Proceed`

6. **Self Review (Mandatory):**
   Before marking a ticket complete, answer these 5 questions:
   - Did I modify more files than necessary?
   - Did I preserve existing behavior?
   - Did I introduce architectural debt?
   - Could the solution be simpler?
   - Would this pass a senior engineering code review?
   If any answer is no, revise the implementation before proceeding.

---

## 4. Evidence Discipline

All findings in audit reports must be classified using one of these categories:

| Classification | Meaning | When to Use |
|----------------|---------|-------------|
| **VERIFIED** | Proven by direct observation or test | A warning was reproduced and the fix eliminated it. An `npm audit` finding was confirmed. |
| **OBSERVED** | Seen in a specific context but not exhaustively proven | A console log appeared during navigation. A timing issue was seen but not consistently reproduced. |
| **INFERRED** | Deduced from code analysis without runtime confirmation | Analysis of import graph suggests a circular dependency. Type inference indicates a potential null path. |
| **UNVERIFIED** | Suspected but not confirmed | A dependency is unused (based on grep, but tree-shaking not verified). |
| **UNKNOWN** | No conclusion could be reached | A warning source could not be definitively traced. Further investigation required. |

Use the strictest classification the evidence supports. Change classification if new evidence surfaces.

---

## 5. Ticket Tracker

| Ticket | Title | Priority | Status | Owner | Verification | Completion Date |
|--------|-------|----------|--------|-------|--------------|-----------------|
| P1-001 | ESLint Audit | Critical | Complete | Lead Engineer | Lint, tsc, build, tests | 2026-07-24 |
| P1-002 | TypeScript Script & Compiler Audit | Critical | Complete | Lead Engineer | `tsc --noEmit`, strict mode review | 2026-07-24 |
| P1-003 | Dependency & Vulnerability Audit | Critical | Complete | Lead Engineer | `npm audit`, dependency review | 2026-07-24 |
| P1-004 | Tailwind Audit | High | Complete | Lead Engineer | Build output, class analysis | 2026-07-24 |
| P1-005 | Build & Bundle Audit | High | Complete | Lead Engineer | Bundle analyzer, build output | 2026-07-24 |
| P1-006 | Supabase Import Architecture Audit | High | Complete | Lead Engineer | Import graph, barrel analysis | 2026-07-24 |
| P1-007 | Runtime Console Audit | Medium | Complete | Lead Engineer | DevTools console, network tab | 2026-07-24 |
| P1-008 | Final Phase 1 Verification | Critical | Complete | Lead Engineer | Full matrix | 2026-07-24 |

---

## 6. Detailed Ticket Specifications

### P1-001 — ESLint Audit

**Objective:** Eliminate every ESLint warning while preserving behavior, architecture, and UX.

**Why this matters:** ESLint warnings represent either bugs, architectural smells, or technical debt. Leaving them unresolved normalizes warning blindness and reduces confidence in the lint signal.

**Root Cause Investigation:** Run `npm run lint`, read every affected file, classify each warning as bug / architectural smell / false positive / acceptable trade-off.

**Scope:**
- All `.ts` and `.tsx` files in `src/`
- All ESLint rules configured in `eslint.config.js`
- Both `react-hooks/exhaustive-deps` and `react-refresh/only-export-components` warnings

**Out of Scope:**
- Changing ESLint configuration rules
- Adding new rules
- Refactoring beyond what is necessary to resolve warnings

**Files likely affected:**
- `src/components/ui/sidebar.tsx`
- `src/hooks/useMetadata.ts`

**Engineering approach:**
1. Read each file completely and understand why the warning exists
2. Determine whether each warning is valid
3. For valid warnings: apply the minimal fix that eliminates the warning without architectural regression
4. For invalid warnings: document the justification with evidence

**Deliverables:**
- Zero ESLint warnings
- `engineering/phase-1/P1-001-eslint.md`

**Verification commands:**
```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright test
```

**Acceptance criteria:**
- [ ] 0 ESLint errors
- [ ] 0 ESLint warnings
- [ ] Build passes
- [ ] Tests pass
- [ ] No TypeScript regressions
- [ ] No architectural regression
- [ ] Documentation created

**Rollback considerations:** Each change is independently revertible. Removing an export (e.g., `useSidebar`) may require re-adding it if a consumer appears in future work, but this is a one-line change.

**Regression risks:** Minimal. The only non-trivial change is removing `useSidebar` from the sidebar module's export block. Zero external consumers were found via grep.

**Documentation required:** `engineering/phase-1/P1-001-eslint.md`

**Definition of Done:**
- [ ] All warnings resolved
- [ ] Verification commands pass
- [ ] Documentation written
- [ ] Ticket closed

---

### P1-002 — TypeScript Script & Compiler Audit

**Objective:** Eliminate all TypeScript errors and ensure the compiler configuration is production-grade.

**Why this matters:** TypeScript errors represent type-safety violations that can lead to runtime failures. A clean `tsc --noEmit` is the minimum bar for production confidence. Additionally, the compiler configuration itself must be reviewed for strictness, target compatibility, and path resolution correctness.

**Root Cause Investigation:**
- Run `npx tsc --noEmit` and capture all errors
- Review `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`
- Check `strict: true` is enabled, `noUnusedLocals`, `noUnusedParameters`, `exactOptionalPropertyTypes`
- Review path aliases in `vite.config.ts` vs `tsconfig.json` for consistency

**Scope:**
- All `.ts` and `.tsx` files
- All TypeScript configuration files
- Path alias configuration (vite + tsconfig)

**Out of Scope:**
- Changing runtime behavior
- Adding type annotations beyond what is needed to fix errors
- Third-party type package installation (unless required for a fix)

**Files likely affected:**
- `tsconfig.json`
- `tsconfig.app.json`
- `tsconfig.node.json`
- Various `.ts`/`.tsx` files with type errors

**Engineering approach:**
1. Run compiler across all configs
2. Classify each error: missing type, incorrect type, unreachable code, configuration issue
3. Fix each error with minimal type annotation changes
4. Review compiler strictness settings and document recommended changes

**Deliverables:**
- Zero TypeScript errors across all configs
- `engineering/phase-1/P1-002-typescript.md`

**Verification commands:**
```bash
npx tsc --noEmit
npx tsc -p tsconfig.app.json --noEmit
npx tsc -p tsconfig.node.json --noEmit
npm run build
npx playwright test
```

**Acceptance criteria:**
- [ ] 0 TypeScript errors (all configs)
- [ ] Build passes
- [ ] Tests pass
- [ ] Compiler configuration documented
- [ ] Strictness review completed

---

### P1-003 — Dependency & Vulnerability Audit

**Objective:** Eliminate all critical and high-severity vulnerabilities. Remove unused dependencies. Verify dependency integrity.

**Why this matters:** Outdated or vulnerable dependencies are the most common attack vector in web applications. Unused dependencies increase bundle size and attack surface.

**Root Cause Investigation:**
- Run `npm audit` and classify every finding by severity
- Review `package.json` for unused dependencies (cross-reference with imports in `src/`)
- Review `pnpm-lock.yaml` / `package-lock.json` for duplicate resolutions
- Check for deprecated packages

**Scope:**
- All `dependencies` and `devDependencies` in `package.json`
- Lock file integrity
- Transitive dependency review

**Out of Scope:**
- Major framework upgrades (React, Vite, etc.) — these belong in a separate upgrade ticket
- Peer dependency warnings that do not affect runtime

**Files likely affected:**
- `package.json`
- `package-lock.json` / `pnpm-lock.yaml`

**Engineering approach:**
1. Run `npm audit` and tabulate findings
2. For each vulnerability: check if a patch/minor upgrade fixes it
3. For unused dependencies: verify by grepping import statements, then remove
4. Audit bundled dependency count with `vite-plugin-inspect` or similar
5. Document any vulnerabilities that cannot be fixed (with justification)

**Deliverables:**
- Zero critical/high vulnerabilities
- Clean dependency inventory
- `engineering/phase-1/P1-003-dependencies.md`

**Verification commands:**
```bash
npm audit
npm run build
npx playwright test
```

**Acceptance criteria:**
- [ ] Zero critical vulnerabilities
- [ ] Zero high vulnerabilities (or documented exceptions)
- [ ] No unused dependencies in `package.json`
- [ ] Build passes
- [ ] Tests pass

---

### P1-004 — Tailwind Audit

**Objective:** Eliminate ambiguous Tailwind class warnings and review the Tailwind configuration for correctness.

**Why this matters:** Ambiguous classes like `duration-[1000ms]` generate build warnings and may not apply the intended styles. Configuration inconsistencies can lead to design drift and unused CSS in production.

**Root Cause Investigation:**
- Capture all Tailwind build warnings
- Review `tailwind.config.ts` content paths, theme extensions, and variants
- Check for unused custom classes in the `theme.extend` block
- Verify the `content` glob matches all source files that use Tailwind

**Scope:**
- `tailwind.config.ts`
- All `.tsx` files using Tailwind classes
- Build output CSS size

**Out of Scope:**
- Design system changes
- Class name refactoring unrelated to ambiguous utility warnings

**Files likely affected:**
- `tailwind.config.ts`
- Files containing `duration-[1000ms]`, `duration-[1200ms]`, `duration-[1400ms]` (identified in build output)

**Engineering approach:**
1. Capture all Tailwind warnings from `npm run build` output
2. Identify each ambiguous class and determine the intended utility
3. Replace with unambiguous Tailwind values or configure safeList entries
4. Verify content paths cover all source directories
5. Analyze output CSS for unexpected inclusions or omissions

**Deliverables:**
- Zero Tailwind build warnings
- `engineering/phase-1/P1-004-tailwind.md`

**Verification commands:**
```bash
npm run build 2>&1 | Select-String -Pattern "warn"
npm run lint
npx playwright test
```

**Acceptance criteria:**
- [ ] Zero ambiguous class warnings in build output
- [ ] Content paths are complete
- [ ] Build passes
- [ ] No visual regressions (verified via existing tests)

---

### P1-005 — Build & Bundle Audit

**Objective:** Analyze the production bundle for size, dead code, and suboptimal chunking. Reduce bundle where safe.

**Why this matters:** A 760 kB main bundle (pre-compression) degrades initial load time, especially on mobile networks. Large chunks indicate missing code splitting or unintended monolithic bundling.

**Root Cause Investigation:**
- Run production build and analyze `dist/assets/` output
- Identify the largest chunks and their contents
- Check for duplicate dependencies or polyfilled modules
- Review lazy loading boundaries in route configuration
- Investigate the warning about chunks exceeding 500 kB

**Scope:**
- Production build output in `dist/`
- Route-level code splitting
- Vendor chunk analysis
- Image asset optimization

**Out of Scope:**
- Implementing a full code-splitting strategy (this may span into Phase 2)
- Changing framework configuration (Vite/Rollup) without clear benefit

**Files likely affected:**
- Route definitions
- `vite.config.ts` (if manual chunking is required)
- Lazy-loaded import statements

**Engineering approach:**
1. Run build with `--report` or external bundle analyzer
2. Identify the largest modules contributing to `index-*.js`
3. Check for incorrectly eager imports that should be lazy
4. Evaluate manual chunk configuration for vendor splitting
5. Document recommended improvements that exceed this ticket's scope

**Deliverables:**
- Bundle analysis report
- Implemented safe bundle optimizations
- `engineering/phase-1/P1-005-bundle.md`

**Verification commands:**
```bash
npm run build
npx playwright test
```

**Acceptance criteria:**
- [ ] Bundle analysis completed and documented
- [ ] No regressions in build output
- [ ] Tests pass
- [ ] Recommendations documented for Phase 2

---

### P1-006 — Supabase Import Architecture Audit

**Objective:** Audit the Supabase client import pattern. The current mixed static + dynamic import of `client.ts` is flagged by Vite as a suboptimal chunking scenario.

**Why this matters:** Vite reports that `client.ts` is both statically and dynamically imported. This prevents the module from being moved into a separate async chunk, defeating the purpose of the dynamic import and potentially causing the Supabase client to be included in the main bundle.

**Root Cause Investigation:**
- Map all static import sites of `src/integrations/supabase/client.ts`
- Map all dynamic import sites
- Determine whether the dynamic import is necessary or if a unified static pattern is correct
- Check for barrel re-exports that cause unintended static inclusion

**Scope:**
- `src/integrations/supabase/client.ts`
- All files importing from Supabase integration
- Service files in `src/services/` and `src/studio/services/`
- The contact service that uses dynamic import

**Out of Scope:**
- Refactoring Supabase queries or data access patterns
- Replacing the Supabase client library

**Files likely affected:**
- `src/integrations/supabase/client.ts`
- `src/services/contactService.ts`
- Potentially other service files

**Engineering approach:**
1. Trace the complete import graph for `client.ts`
2. Identify why `contactService.ts` uses dynamic import vs static import used by all other services
3. Determine the correct pattern: either make all imports static or make the dynamic import truly async-isolated
4. Apply the minimal change to resolve the mixed-import warning

**Deliverables:**
- Resolved mixed-import warning
- Documented import architecture decision
- `engineering/phase-1/P1-006-supabase-imports.md`

**Verification commands:**
```bash
npm run build 2>&1 | Select-String -Pattern "client"
npm run lint
npx tsc --noEmit
npx playwright test
```

**Acceptance criteria:**
- [ ] No mixed static/dynamic import warning for `client.ts`
- [ ] Build passes
- [ ] Tests pass
- [ ] Import pattern is consistent

---

### P1-007 — Runtime Console Audit

**Objective:** Ensure zero console output (logs, warnings, errors) in production and development runtime environments.

**Why this matters:** Console output in production indicates debugging artifacts, unhandled states, or missing error boundaries. It degrades professional credibility and can leak implementation details.

**Root Cause Investigation:**
- Start the dev server and navigate all routes while monitoring the console
- Check for stray `console.log`, `console.warn`, `console.error`, `console.info` calls in source code
- Review error boundaries for uncaught error handling

**Scope:**
- All `.ts` and `.tsx` files in `src/`
- Dev server runtime console output
- Production build runtime console output (preview)

**Out of Scope:**
- Third-party library console output that cannot be suppressed
- Network request logging in dev tools

**Files likely affected:**
- Any file containing `console.log`, `console.warn`, or `console.error` outside error handling contexts
- Error boundary implementations

**Engineering approach:**
1. Grep for `console.log`, `console.warn`, `console.error`, `console.info`, `console.debug` across the entire `src/` directory
2. Start dev server, navigate every route, capture console output
3. For each console call: determine if it is a debugging artifact, intentional logging, or error reporting
4. Remove debugging artifacts; preserve legitimate error reporting with proper logging abstraction if needed
5. Review error boundaries for coverage gaps

**Deliverables:**
- Zero console output from application code in production
- `engineering/phase-1/P1-007-runtime-console.md`

**Verification commands:**
```bash
npm run dev  (manual route navigation with console monitoring)
npm run build && npx vite preview  (production mode check)
grep -r "console\.\(log\|warn\|error\|info\|debug\)" src/ --include="*.ts" --include="*.tsx"
```

**Acceptance criteria:**
- [ ] No `console.log` / `console.debug` in source code
- [ ] No unexpected console output during route navigation
- [ ] Build passes
- [ ] Tests pass

---

### P1-008 — Final Phase 1 Verification

**Objective:** Execute the complete Phase 1 verification matrix and certify readiness for Phase 2.

**Why this matters:** Final verification ensures that no regression was introduced across the phase and that all acceptance criteria are collectively satisfied.

**Scope:**
- Full verification matrix execution
- Cross-ticket regression check
- Documentation completeness review
- Phase 1 sign-off

**Out of Scope:**
- New audit findings (these go to Phase 2)

**Engineering approach:**
1. Run all verification commands across all completed tickets
2. Verify every audit report exists and is complete
3. Check that no new warnings or errors were introduced by later tickets
4. Write the phase completion report
5. Hand off to Phase 2 planning

**Deliverables:**
- Signed verification matrix
- Phase 1 completion report
- `engineering/phase-1/P1-008-final-verification.md`

**Verification commands:**
```bash
npm run lint
npx tsc --noEmit
npm run build
npx playwright test
npm audit
```

**Acceptance criteria:**
- [ ] All Phase 1 tickets complete
- [ ] All verification checks pass
- [ ] All documentation is written and reviewed
- [ ] No unresolved blockers
- [ ] Ready for Phase 2

---

## 7. Standard Workflow

Every ticket follows the same process:

```
1. Read the affected files completely
        │
        ▼
2. Understand the architecture and context
        │
        ▼
3. Investigate root cause of the issue
        │
        ▼
4. Design the smallest safe fix
        │
        ▼
5. Implement the fix
        │
        ▼
6. Run verification commands
        │
        ▼
7. Document findings in audit report
        │
        ▼
8. Commit with descriptive message
        │
        ▼
9. Mark ticket complete in tracker
```

**Commit message format:**
```
P1-{number}: {short description}

{Optional longer description of the change, why it was made, and what risks were considered.}
```

---

## 8. Required Documentation

Every completed ticket must produce an audit report.

**Naming convention:**
```
engineering/phase-1/P1-{number}-{short-name}.md
```

**Examples:**
```
engineering/phase-1/P1-001-eslint.md
engineering/phase-1/P1-002-typescript.md
engineering/phase-1/P1-003-dependencies.md
```

**Each report must contain:**

| Section | Description |
|---------|-------------|
| Summary | 2-3 sentence overview |
| Initial Findings | Raw state before the fix |
| Root Cause Analysis | Evidence-classified findings with rationale |
| Changes Made | Summary of all code changes |
| Files Modified | Table of files with line counts and change types |
| Verification | Table of checks with commands and results |
| Remaining Risks | Accepted trade-offs or deferred work |
| Recommendation | Close, defer, or escalate |

Reports are written to be read by other engineers, not as release notes. Use precise language and evidence classifications.

---

## 9. Verification Checklist

### Pre-ticket

- [ ] Repository is on a clean branch
- [ ] `npm install` succeeds
- [ ] `npx tsc --noEmit` succeeds (baseline)
- [ ] `npm run lint` shows known warnings (baseline)
- [ ] `npm run build` succeeds (baseline)
- [ ] `npx playwright test` passes (baseline)

### Per-ticket

- [ ] Dependencies: no new vulnerabilities introduced
- [ ] TypeScript: `npx tsc --noEmit` exits 0
- [ ] Lint: `npm run lint` exits 0
- [ ] Build: `npm run build` exits 0
- [ ] Tests: `npx playwright test` — all tests pass
- [ ] Runtime: no new console output
- [ ] Accessibility: no new aXe violations (if applicable)
- [ ] Bundle: no unexpected size increase
- [ ] Console: no new errors in browser dev tools

### Post-ticket

- [ ] Audit report written
- [ ] Commit pushed
- [ ] Tracker updated

---

## 10. Final Phase Completion Checklist

Phase 1 is complete only when:

- [ ] **P1-001 — ESLint Audit:** Complete
- [ ] **P1-002 — TypeScript Audit:** Complete
- [ ] **P1-003 — Dependency Audit:** Complete
- [ ] **P1-004 — Tailwind Audit:** Complete
- [ ] **P1-005 — Bundle Audit:** Complete
- [ ] **P1-006 — Supabase Import Audit:** Complete
- [ ] **P1-007 — Runtime Console Audit:** Complete
- [ ] **P1-008 — Final Verification:** Complete
- [ ] Every ticket satisfies its Definition of Done
- [ ] Every verification command passes
- [ ] Every audit report is written and placed in `engineering/phase-1/`
- [ ] No unresolved blockers remain
- [ ] Phase completion report is written
- [ ] Hand-off to Phase 2 is documented

---

## 11. Future Notes

*This section captures lessons learned and observations made during Phase 1 that inform future phases.*

**P1-001 Retrospective:**
- The original ticket referenced 12 ESLint warnings, but only 4 were present at execution time. Future tickets should verify the baseline before writing the ticket spec, or include a "baseline capture" step as part of the workflow.
- The `@typescript-eslint/no-unused-vars: "off"` rule in `eslint.config.js` is a notable gap. Consider enabling it in Phase 2 after cleaning up any violations.

**Known items for Phase 2 consideration:**
- Enabling `@typescript-eslint/no-unused-vars` after cleanup
- Reviewing `vite.config.ts` for manual chunk splitting
- Moving `useSidebar` to a dedicated file if external consumers emerge
- Reviewing `tsconfig.json` for additional strict flags

---

*This document is the single source of truth for Phase 1 of the HOP Production Readiness Audit. It should be reviewed and updated as the phase progresses.*
