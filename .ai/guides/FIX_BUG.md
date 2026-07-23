# Fix Bug — House of Padmavati

> From: old `prompts/FIX_BUG.md` + `playbooks/BUG_FIX_WORKFLOW.md`

## Steps

### 1. Reproduce
- Follow steps in bug report
- Check console errors, network tab, application state
- Cannot reproduce? Request more details, check environment differences

### 2. Locate Root Cause
- Trace data flow: action → API → state → render
- Is it rendering? Data? State? API? Race condition?
- Use `git bisect` if regression

### 3. Write Failing Test
```typescript
test("reproduces bug #123", async ({ page }) => {
  // Steps that trigger the bug
  await expect(page.getByRole("alert")).toContainText("expected error");
});
```
Verify the test fails with current code.

### 4. Fix
- Minimal change. Consider edge cases. No regressions.
- P0/P1: hotfix from main. P2/P3: branch from develop.

### 5. Verify
- [ ] New test passes
- [ ] All existing tests pass
- [ ] Manual confirmation
- [ ] Related features still work
- [ ] Update `memory/known-bugs.md` if applicable

### 6. Submit
- PR with: what happened, root cause, fix, how tested
- Reference issue number
- Fast-track review for P0/P1
