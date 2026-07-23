# AI Collaboration Rules — House of Padmavati

## Purpose

Ensure consistent, production-grade output across all AI models (DeepSeek, Gemini, ChatGPT, future coding agents) working on this project.

## Core Rule

**All AI models must read `.ai/context/PROJECT_CONTEXT.md` at the start of every session.** This is mandatory. Without this context, the AI will produce inconsistent or incorrect code.

## Rules of Engagement

### 1. Context First
- Read `.ai/context/PROJECT_CONTEXT.md` for project state, conventions, and decisions
- Read `.ai/context/SESSION_CONTEXT.md` for what was last worked on
- Read `.ai/rules/*.md` for specific standards relevant to the task
- Read `.ai/prompts/{TASK}.md` for the task-specific prompt template

### 2. Standards Compliance
All code must comply with the relevant standards in `.ai/rules/`:
- `.ai/rules/CODING_STANDARDS.md` — general coding conventions
- `.ai/rules/REACT_STANDARDS.md` — React component patterns
- `.ai/rules/TYPESCRIPT_STANDARDS.md` — TypeScript conventions
- `.ai/rules/SUPABASE_STANDARDS.md` — Supabase/DB conventions
- `.ai/rules/PLAYWRIGHT_STANDARDS.md` — testing conventions
- `.ai/rules/ACCESSIBILITY_STANDARDS.md` — WCAG compliance
- `.ai/rules/PERFORMANCE_STANDARDS.md` — performance targets

### 3. Task Prompt Usage
Use the appropriate prompt template from `.ai/prompts/`:
- Building features → `.ai/prompts/BUILD_FEATURE.md`
- Fixing bugs → `.ai/prompts/FIX_BUG.md`
- Writing tests → `.ai/prompts/CREATE_PLAYWRIGHT_TEST.md`
- Refactoring → `.ai/prompts/REFACTOR_CODE.md`
- PR review → `.ai/prompts/REVIEW_PULL_REQUEST.md`

### 4. Code Patterns (Must Follow)

| Pattern | Requirement |
|---------|-------------|
| File naming | PascalCase (components), camelCase (services/hooks) |
| Imports | Use `@/` alias, group: external → internal → styles |
| Styling | Tailwind only, use `cn()` for conditional classes |
| State management | React Query (server), Context (global), RHF (forms) |
| Testing | BDD, accessibility roles, no CSS selectors |
| Accessibility | WCAG 2.1 AA, semantic HTML, keyboard accessible |
| Types | `interface` for objects, `type` for unions, no `any` |

### 5. Session Management

**Start of session:**
```markdown
1. Read PROJECT_CONTEXT.md
2. Read SESSION_CONTEXT.md
3. Read relevant rules (by task type)
4. Read relevant prompt template
5. Review existing code for patterns
```

**End of session:**
```markdown
1. Update SESSION_CONTEXT.md with:
   - What was completed
   - What's next
   - Any blockers or decisions made
2. Ensure all tests pass
3. Ensure lint passes
4. Commit with conventional commit message
```

### 6. Quality Gates (Mandatory)

Before any code is considered complete, it must pass:

| Gate | Command/Check |
|------|--------------|
| Lint | `pnpm lint` — no errors |
| TypeScript | `tsc --noEmit` — no errors |
| Tests | `pnpm test:e2e` — all pass |
| Accessibility | axe-core — 0 violations |
| Performance | Lighthouse >= 90 |

### 7. Communication Protocol

When multiple AI models collaborate:
- Write to separate branches
- SESSION_CONTEXT.md is the shared state
- No model overwrites another's work without discussion
- Conflicts resolved by the most specialized model
- PR reviews check compliance with these rules

### 8. Prohibited Patterns

Do NOT:
- Use CSS selectors in tests (use accessibility roles)
- Use `any` in TypeScript (use `unknown`)
- Use `page.waitFor(timeout)` (use smart waits)
- Expose secrets or credentials
- Modify `.ai/rules/*` without team discussion
- Create barrel files (index.ts re-exports) for components
- Use inline styles (use Tailwind classes)
- Add console.log in production code

### 9. Decision Record

Significant architectural decisions must be documented in:
- `.ai/context/SESSION_CONTEXT.md` (temporary)
- `docs/decisions/` (permanent, as ADRs)

### 10. Continuous Improvement

- Rules in `.ai/rules/` can be updated by team consensus
- Prompt templates in `.ai/prompts/` can be refined
- Checklists in `.ai/checklists/` grow as the project matures
- Share learnings from each AI session to improve the system
