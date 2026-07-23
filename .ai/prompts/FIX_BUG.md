# Fix Bug Prompt

## Context
- Read `.ai/context/SESSION_CONTEXT.md` for current project state
- Read `.ai/rules/TESTING_STANDARDS.md` for testing approach

## Bug Report

**Bug**: [Description]
**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]
**Expected**: [What should happen]
**Actual**: [What happens instead]
**Environment**: [Browser, OS, viewport]

## Steps

### 1. Reproduce the Bug
- Run the application
- Follow the steps to reproduce
- Note any console errors
- Check network tab for API failures
- Take screenshots if visual

### 2. Locate the Root Cause
- Search for relevant code
- Read the component(s) involved
- Trace the data flow
- Identify the specific line(s) causing the issue
- Check: Is it a rendering issue? Data issue? State issue? API issue?

### 3. Write a Failing Test
```typescript
// In src/__tests__/
// Write a test that reproduces the bug
// The test should fail with the current code
```

### 4. Fix the Bug
- Apply the minimal change necessary
- Consider edge cases
- Ensure no regressions

### 5. Verify the Fix
- [ ] The new test passes
- [ ] All existing tests pass
- [ ] Manual verification that the bug is fixed
- [ ] No new console errors
- [ ] No regressions in related functionality

### 6. Document
- Update any relevant comments in code
- Add a brief note in the PR about the root cause and fix
