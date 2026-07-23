# Release Workflow — House of Padmavati

## Overview

Standard process for releasing to production.

## Release Types

| Type | Frequency | Approval | Description |
|------|-----------|----------|-------------|
| Major | Monthly | Product + Tech | New features, breaking changes |
| Minor | Weekly | Tech Lead | Bug fixes, small features |
| Patch | As needed | Developer | Critical bug fixes, security |
| Hotfix | Immediate | Team Lead | P0 production issues |

## Release Cycle

### Phase 1: Preparation (Start: 3 days before release)

**Code Review:**
- [ ] All PRs merged to `develop`
- [ ] Last commits reviewed and stable
- [ ] All CI checks pass on `develop`

**Testing:**
- [ ] Full test suite passes
- [ ] Regression test suite passes
- [ ] Manual smoke test of critical journeys
- [ ] Cross-browser testing complete
- [ ] Mobile testing complete

**Performance:**
- [ ] Lighthouse scores >= 90
- [ ] Bundle size within budget
- [ ] No performance regressions

**Accessibility:**
- [ ] axe-core scan passes
- [ ] Keyboard navigation verified
- [ ] Screen reader tested

**Documentation:**
- [ ] Release notes drafted
- [ ] CHANGELOG updated
- [ ] API documentation updated (if needed)

### Phase 2: Release Candidate (1 day before release)

**Create Release Branch:**
```bash
git checkout develop
git pull
git checkout -b release/v{version}
```

**Release Candidate Testing:**
- [ ] Deploy to staging
- [ ] Full regression test on staging
- [ ] Product owner sign-off
- [ ] Stakeholder review (if needed)

**Final Checks:**
- [ ] Database migrations tested on staging
- [ ] Edge Functions tested on staging
- [ ] Environment variables configured
- [ ] Rollback plan documented

### Phase 3: Release (Release Day)

**Deploy:**
```bash
# Merge release branch to main
git checkout main
git pull
git merge release/v{version}

# Tag the release
git tag v{version}
git push origin v{version}

# Deploy frontend (automatic via CI)
# Deploy database migrations
supabase db push

# Deploy Edge Functions
supabase functions deploy
```

**Post-Deployment Verification:**
- [ ] Homepage loads
- [ ] Critical journeys work
- [ ] No console errors
- [ ] API endpoints responding
- [ ] Database queries working
- [ ] Edge Functions responding
- [ ] Monitoring alerts configured

**Rollback Ready:**
- [ ] Previous deployment version noted
- [ ] Rollback command documented
- [ ] Rollback tested on staging

### Phase 4: Post-Release (After Release)

- [ ] Monitor for 24 hours
- [ ] Check error rates
- [ ] Check performance metrics
- [ ] Address any issues
- [ ] Retrospective (1 week after)

## Versioning

Follow [Semantic Versioning](https://semver.org/):

```
v{major}.{minor}.{patch}
```

| Change | Version Bump |
|--------|-------------|
| Breaking change | Major |
| New feature | Minor |
| Bug fix | Patch |
| Security fix | Patch (urgent) |

## Release Checklist

### Pre-Release
- [ ] All PRs merged
- [ ] Tests passing
- [ ] Lighthouse >= 90
- [ ] Accessibility clean
- [ ] Team lead approval
- [ ] Release notes ready
- [ ] Rollback plan ready

### During Release
- [ ] Release branch merged
- [ ] Tag created
- [ ] Frontend deployed
- [ ] Migrations applied
- [ ] Edge Functions deployed
- [ ] Deployment verified

### Post-Release
- [ ] Smoke test passed
- [ ] Monitoring OK
- [ ] Issues addressed
- [ ] Retrospective scheduled
