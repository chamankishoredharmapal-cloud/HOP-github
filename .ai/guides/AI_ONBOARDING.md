# AI Onboarding — House of Padmavati

> From: old `playbooks/AI_COLLABORATION_RULES.md` (formerly `context/AI_COLLABORATION.md` — deleted)

## How AI Models Operate

### Every Session Start
1. Read `memory/next-session.md` for handoff context
2. Read `memory/completed.md` for what's been done
3. Read `memory/known-bugs.md` if fixing bugs
4. Read relevant `standards/*.md` for the task domain
5. Read relevant `guides/*.md` for the task workflow

### Every Session End
1. Update `memory/next-session.md` with: what was completed, what's next, blockers, decisions
2. Update `memory/completed.md` with new completions
3. Update `memory/known-bugs.md` with any new bugs found
4. Update `memory/technical-debt.md` with any debt incurred
5. Ensure all tests pass, lint passes
6. Commit with conventional commit message

### Quality Gates (Must Pass)
| Gate | Tool |
|------|------|
| Lint | `pnpm lint` |
| TypeScript | `tsc --noEmit` |
| Tests | `pnpm test:e2e` |
| Accessibility | axe-core (0 violations) |
| Performance | Lighthouse >= 90 (mobile) / >= 95 (desktop) |

### Prohibited Patterns
- CSS selectors in tests (use accessibility roles)
- `any` in TypeScript (use `unknown`)
- `page.waitFor(timeout)` (use smart waits)
- Exposing secrets or credentials
- Modifying `standards/` without team discussion
- Barrel files (index.ts re-exports) for components
- Inline styles (use Tailwind)
- `console.log` in production code

### Multi-Model Collaboration
- Each model writes to separate branches
- `memory/next-session.md` is the shared state
- No model overwrites another's work without discussion
- Conflicts resolved by the most specialized model
- PR reviews check compliance with these rules
