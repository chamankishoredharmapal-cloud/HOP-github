# Feature Development Workflow — House of Padmavati

## Overview

Standard workflow for building new features, from ideation to deployment.

## Flow Diagram

```
Idea → Requirements → Design → Implementation → Testing → Review → Deploy
```

## Steps

### 1. Ideation & Requirements
- [ ] Feature request created (GitHub Issue)
- [ ] Problem statement defined
- [ ] Acceptance criteria defined
- [ ] UX considerations documented
- [ ] Technical constraints identified
- [ ] Dependencies identified

### 2. Design Review
- [ ] Wireframes/mockups created (if applicable)
- [ ] Design approved (Figma or similar)
- [ ] Mobile and desktop layouts reviewed
- [ ] Loading, empty, error states designed
- [ ] Accessibility considerations documented
- [ ] Animation/motion defined

### 3. Technical Planning
- [ ] Component tree defined
- [ ] Data flow documented
- [ ] API endpoints identified (new Edge Functions or Supabase queries)
- [ ] Database schema changes planned (migrations)
- [ ] Types/interfaces defined
- [ ] State management approach chosen
- [ ] Testing strategy defined
- [ ] Estimated effort

### 4. Implementation

#### Create Feature Branch
```bash
git checkout develop
git pull
git checkout -b feature/{feature-name}
```

#### Implement in Order
1. Database migrations (if any)
2. Edge Functions (if any)
3. Types/Interfaces
4. Service layer (API calls)
5. Custom hooks
6. UI Components
7. Page component
8. Routing

#### Follow Standards
- [ ] Code follows `.ai/rules/*` standards
- [ ] Accessibility (WCAG 2.1 AA)
- [ ] Responsive design
- [ ] Performance considered
- [ ] Security considered

### 5. Testing

#### Write Tests
- [ ] E2E tests for the feature
- [ ] Test: happy path
- [ ] Test: error states
- [ ] Test: empty states
- [ ] Test: edge cases
- [ ] Accessibility testing

#### Run Tests
- [ ] `pnpm lint` — no errors
- [ ] `tsc --noEmit` — no errors
- [ ] `pnpm test:e2e` — all pass
- [ ] New feature tests pass

### 6. Code Review
- [ ] Create PR from `feature/xxx` → `develop`
- [ ] PR description with: what, why, how to test
- [ ] Screenshots (if visual change)
- [ ] Assign reviewer
- [ ] Address all feedback
- [ ] Re-request review if needed
- [ ] Merge (squash merge)

### 7. Staging Deployment
- [ ] Auto-deployed to staging
- [ ] Smoke test on staging
- [ ] Verify with product owner (if needed)

### 8. Production Deployment
- [ ] PR from `develop` → `main`
- [ ] Review (focus on integration)
- [ ] Deploy to production
- [ ] Post-deployment verification
- [ ] Monitor for issues

## Branch Strategy

```
main ← develop ← feature/{feature-name}
```

## Timeline

| Phase | Duration | Owner |
|-------|----------|-------|
| Requirements | 1-3 days | PM + Developer |
| Design | 1-5 days | Designer |
| Implementation | 3-10 days | Developer |
| Testing | 1-3 days | Developer + QA |
| Review | 1-2 days | Reviewer |
| Deploy | 1 day | Developer |
