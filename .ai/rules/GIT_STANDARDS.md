# Git Standards — House of Padmavati

## Branch Strategy

```
main                    # Production-ready code
  ├── develop           # Integration branch
      ├── feature/*     # New features
      ├── fix/*         # Bug fixes
      ├── refactor/*    # Code refactoring
      ├── docs/*        # Documentation
      └── chore/*       # Maintenance tasks
```

### Branch Naming
```
feature/add-wishlist-sharing
fix/cart-total-calculation
refactor/payment-service
docs/api-documentation
chore/update-dependencies
```

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
| Type | Usage |
|------|-------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring |
| `docs` | Documentation |
| `style` | Formatting (no production change) |
| `test` | Adding or fixing tests |
| `chore` | Maintenance, dependencies, tooling |
| `perf` | Performance improvement |
| `security` | Security fix |
| `db` | Database migration |

### Examples
```
feat(cart): add persistent localStorage cart
fix(checkout): correct tax calculation for international orders
refactor(payment): extract payment verification to edge function
docs(api): add order confirmation endpoint documentation
test(cart): add e2e test for cart persistence across sessions
db(migrations): add inventory_history table
security(auth): add rate limiting to login endpoint
```

### Body (when needed)
- Explain WHAT and WHY, not HOW
- Reference issue numbers: `Closes #42`
- Breaking changes: `BREAKING CHANGE: ...`

## Commit Checklist

Before committing:
- [ ] Code passes `pnpm lint`
- [ ] Code passes `tsc --noEmit` (or `tsc -p tsconfig.node.json --noEmit`)
- [ ] All tests pass
- [ ] No debugging code (console.log, debugger)
- [ ] No TODO comments (unless tracked in issues)
- [ ] No secrets, keys, or credentials
- [ ] No large files (images > 1MB should be in storage, not git)

## Pull Requests

### PR Title
Same convention as commit messages:
```
feat(cart): add wishlist to cart migration
```

### PR Description Template
```markdown
## Description
[Brief description of changes]

## Type
- [ ] feat
- [ ] fix
- [ ] refactor
- [ ] docs
- [ ] test
- [ ] chore

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)

## Related Issues
Closes #[issue-number]
```

### PR Checklist
- [ ] Branch is up to date with target branch
- [ ] No merge conflicts
- [ ] Lint passes
- [ ] Tests pass
- [ ] Reviewed by at least one other developer
- [ ] Documentation updated (if needed)
- [ ] Database migrations are backward-compatible
