# Build Feature — House of Padmavati

> From: old `prompts/BUILD_FEATURE.md` + `playbooks/FEATURE_DEVELOPMENT_WORKFLOW.md`

## Steps

### 1. Understand
- Read the spec in `specs/{FEATURE}.md`
- Read acceptance criteria
- Review existing similar features for patterns
- Check `memory/roadmap.md` for strategic alignment

### 2. Plan
- Component tree → Data flow → API needs → DB changes → Tests
- Create feature branch: `feature/{feature-name}`

### 3. Implement (order)
1. Database migration (if needed) — per `standards/DATABASE.md`
2. Edge Functions (if needed) — per `guides/DEPLOY.md`
3. Types/interfaces in `src/types/` or colocated
4. Service layer (`fetchX`, `createX` in `src/services/`)
5. Custom hooks in `src/hooks/`
6. UI Components with `data-testid` — per `standards/CODING.md`
7. Page component + route in `App.tsx`
8. Tests — per `guides/WRITE_TESTS.md`

### 4. Verify
- [ ] `pnpm lint` passes
- [ ] `tsc --noEmit` passes
- [ ] `pnpm test:e2e` passes
- [ ] Manual test: happy path, empty state, error state, edge cases
- [ ] Lighthouse >= 90 (mobile) / >= 95 (desktop)
- [ ] Keyboard nav + screen reader check
- [ ] `quality/definition-of-done.md` met

### 5. Submit
- PR with description, screenshots, testing notes
- Reference spec file
- Squash merge to develop
