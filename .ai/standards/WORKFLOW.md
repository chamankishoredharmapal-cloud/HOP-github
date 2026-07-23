# Workflow Standards — House of Padmavati

> Consolidates: old `GIT_STANDARDS.md` + `GITHUB_STANDARDS.md` + `CODE_REVIEW_STANDARDS.md` + `DEPLOYMENT_STANDARDS.md`

## Git

### Branches
```
main ← develop ← feature/xxx | fix/xxx | refactor/xxx | docs/xxx | chore/xxx
```

### Commit Messages (Conventional Commits)
```
<type>(<scope>): <description>
```
Types: `feat`, `fix`, `refactor`, `docs`, `style`, `test`, `chore`, `perf`, `security`, `db`.

```
feat(cart): add persistent localStorage cart
fix(checkout): correct tax calculation
db(migrations): add inventory_history table
```

**Before commit**: lint, typecheck, tests pass. No debug code, no secrets, no large files.

## Pull Requests

- Title follows conventional commit style. PR description includes: what, why, how to test, screenshots.
- Checklist: lint, tests, manual testing, a11y, responsive, docs updated.
- Reviewer checks: architecture fit, functionality, code quality, types, React patterns, a11y, performance, security, tests.
- Comments: `**issue**` (blocking), `**suggestion**` (non-blocking), `**nitpick**` (preference).
- Squash merge to main. Linear history required.

## GitHub

- Branch protection on main: require PR review (1 min), stale reviews dismissed, status checks required.
- Labels: `bug`, `feature`, `priority:*`, `area:*`, `good-first-issue`.
- CI: Lint + TypeCheck on every push. E2E on PRs to develop/main. Build verification. Deploy on merge.
- Dependabot + CodeQL enabled.

## Deployment

| Branch | Env | Auto-deploy |
|--------|-----|-------------|
| `feature/*` | Preview (PR) | On PR open |
| `develop` | Staging | On push |
| `main` | Production | On merge |

**Pre-deploy checklist**: Tests pass, build succeeds, migrations backward-compatible, Lighthouse >= 90, Edge Functions deploy, rollback plan ready.

**Post-deploy**: Smoke test critical journeys, monitor for 30 min, check error rates.

See `guides/DEPLOY.md` for full deployment workflow.
