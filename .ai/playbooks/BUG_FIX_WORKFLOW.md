# Bug Fix Workflow — House of Padmavati

## Overview

Standard workflow for fixing bugs, from identification to deployment.

## Flow Diagram

```
Bug Reported → Triage → Reproduce → Debug → Fix → Test → Review → Deploy → Verify
```

## Steps

### 1. Bug Reported
Bug enters the system via:
- GitHub Issue (bug report template)
- Internal testing
- User feedback
- Monitoring alert

### 2. Triage (within 24 hours)
- [ ] Confirm it's a bug (not a feature request)
- [ ] Assign severity: P0 (critical), P1 (high), P2 (medium), P3 (low)
- [ ] Assign to appropriate developer
- [ ] Label with `bug` + severity + area
- [ ] P0/P1: notify team immediately
- [ ] P2/P3: add to sprint backlog

### 3. Reproduce
- [ ] Check the bug report for reproduction steps
- [ ] Try to reproduce locally
- [ ] If can't reproduce: request more details, check environment differences
- [ ] Document reproduction steps exactly
- [ ] Take screenshots/screen recording if visual

### 4. Debug
- [ ] Check console errors
- [ ] Check network requests
- [ ] Trace the data flow
- [ ] Identify the root cause
- [ ] Check if it's a frontend, backend, or data issue

### 5. Write a Failing Test
- [ ] Create a test that reproduces the bug
- [ ] Verify the test fails with current code
- [ ] This ensures the fix is verifiable

### 6. Fix
- [ ] Apply the minimal fix necessary
- [ ] Consider edge cases
- [ ] Ensure no regressions in related functionality
- [ ] P0/P1: hotfix branch from main
- [ ] P2/P3: feature branch from develop

### 7. Test
- [ ] New test passes
- [ ] All existing tests pass
- [ ] Manual verification
- [ ] Check related features for regressions
- [ ] P0/P1: test on staging

### 8. Code Review
- [ ] Create PR with clear description of bug and fix
- [ ] Reference the issue number
- [ ] Reviewer checks: fix is correct, no regressions, tests adequate
- [ ] Address review feedback

### 9. Deploy
- [ ] P0/P1: Emergency deployment (fast-track review)
- [ ] P2/P3: Regular deployment cycle
- [ ] Deploy to production

### 10. Verify in Production
- [ ] Confirm the bug is fixed in production
- [ ] Run related tests
- [ ] Monitor for any new issues
- [ ] Close the issue

## Branch Strategy

| Severity | Branch From | Branch Name | Merge To |
|----------|-------------|-------------|----------|
| P0 | main | fix/{issue}-description | main |
| P1 | develop | fix/{issue}-description | develop |
| P2 | develop | fix/{issue}-description | develop |
| P3 | develop | fix/{issue}-description | develop |

## Timeline

| Severity | Fix Time | Review Time | Deploy Time |
|----------|----------|-------------|-------------|
| P0 | 4 hours | 1 hour | Immediate |
| P1 | 24 hours | 4 hours | Same batch |
| P2 | 1 week | 24 hours | Next release |
| P3 | 2 weeks | 24 hours | Next sprint |
