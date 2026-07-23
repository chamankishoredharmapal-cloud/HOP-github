# GitHub Standards — House of Padmavati

## Repository Setup

- **Default branch**: `main`
- **Branch protection**: Required on `main`
  - Require pull request reviews (1 minimum)
  - Dismiss stale reviews when new commits are pushed
  - Require status checks (lint, typecheck, test)
  - Require linear history (no merge commits — use squash merge)

## Issue Templates

### Bug Report
```markdown
**Describe the bug**
[Clear description]

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
[What should happen]

**Actual behavior**
[What actually happens]

**Screenshots/Videos**
[If applicable]

**Environment**
- Browser: [e.g. Chrome 120, Safari 17]
- OS: [e.g. Windows 11, macOS 14]
- Viewport: [e.g. 1440x900]

**Additional context**
[Logs, errors, etc.]
```

### Feature Request
```markdown
**Problem statement**
[What problem does this solve?]

**Proposed solution**
[How should it work?]

**Alternatives considered**
[Other approaches]

**Acceptance criteria**
- [ ] Criterion 1
- [ ] Criterion 2

**Design references**
[Links to mockups, Figma, etc.]
```

## Labels

| Category | Labels |
|----------|--------|
| Type | `bug`, `feature`, `enhancement`, `refactor`, `docs`, `test`, `chore` |
| Priority | `priority:critical`, `priority:high`, `priority:medium`, `priority:low` |
| Status | `blocked`, `in-progress`, `review-needed`, `ready-to-merge` |
| Area | `area:storefront`, `area:studio`, `area:payments`, `area:auth`, `area:database`, `area:infra` |
| Difficulty | `good-first-issue`, `help-wanted` |

## Project Board

- **Columns**: Backlog → To Do → In Progress → Review → Done
- **Automation**: Issues/PRs move automatically based on status
- **Sprints**: 2-week sprints tracked via GitHub Milestones

## Actions / CI

Required workflows:
1. **Lint & TypeCheck** — runs on every push to any branch
2. **E2E Tests** — runs on PRs to `develop` and `main`
3. **Build** — verifies production build succeeds
4. **Deploy** — auto-deploys `main` to production, `develop` to staging

## Security

- Enable Dependabot for dependency updates
- Enable CodeQL analysis for vulnerability scanning
- Require signed commits for `main` branch
- Secrets stored as GitHub Repository Secrets (never in code)
- Branch protection rules prevent direct pushes to `main`
- Regular audit of collaborator access
