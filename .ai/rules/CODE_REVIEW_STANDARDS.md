# Code Review Standards — House of Padmavati

## Purpose

Code reviews ensure quality, consistency, and knowledge sharing across the team. Every PR must be reviewed before merging to `main`.

## Before Requesting Review

The author must verify:
- [ ] `pnpm lint` passes with no errors
- [ ] `tsc --noEmit` passes (or relevant type-check command)
- [ ] All existing tests pass
- [ ] New tests written for new functionality
- [ ] No debug code (console.log, debugger, TODO comments)
- [ ] No secrets or credentials in code
- [ ] Branch is up to date with target branch
- [ ] PR description is complete
- [ ] Changes are scoped (one PR = one logical change)

## Review Checklist

### Architecture & Design
- [ ] Does the solution follow the project architecture?
- [ ] Is the component organized correctly (feature vs shared)?
- [ ] Does it use the right state management approach?
- [ ] Is the data flow correct?
- [ ] Could this be simplified?

### Functionality
- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled? (empty states, error states, loading states)
- [ ] Are there any race conditions?
- [ ] Are user inputs validated?

### Code Quality
- [ ] Is the code readable and self-documenting?
- [ ] Are functions single-responsibility?
- [ ] Are variable and function names clear?
- [ ] Are there any code smells?
- [ ] Is there unnecessary complexity?

### Performance
- [ ] Are there unnecessary re-renders?
- [ ] Are images optimized?
- [ ] Are API calls efficient (batching, caching)?
- [ ] Is code splitting used where appropriate?

### Accessibility
- [ ] Are all images having alt text?
- [ ] Is keyboard navigation working?
- [ ] Are focus indicators visible?
- [ ] Are ARIA attributes correct?
- [ ] Does it pass axe-core?

### Security
- [ ] Are user inputs validated and sanitized?
- [ ] Are secrets exposed?
- [ ] Are RLS policies correct?
- [ ] Is payment data handled securely?
- [ ] Are API endpoints protected?

### Testing
- [ ] Are new features covered by tests?
- [ ] Do tests follow the BDD pattern?
- [ ] Are accessibility roles used for selectors?
- [ ] Are error states tested?
- [ ] Are edge cases covered?

## Review Process

1. **Author** requests review (assign reviewer)
2. **Reviewer** examines code within 24 hours
3. **Reviewer** leaves comments:
   - `nitpick`: Minor style preference (author can ignore)
   - `suggestion`: Improvement that could be made (author should consider)
   - `issue`: Must be fixed before merge (blocking)
4. **Author** addresses feedback:
   - Fix blocking issues
   - Discuss disagreements
   - Request re-review if significant changes
5. **Reviewer** approves or requests changes
6. **Author** merges (squash merge to `main`)

## Review Etiquette

### For Reviewers
- Be respectful and constructive
- Explain WHY something should change, not just WHAT
- Praise good code and clever solutions
- Focus on the code, not the author
- Distinguish between blocking issues and nits
- Respond promptly (within 24 hours)

### For Authors
- Be open to feedback
- Explain your reasoning when you disagree
- Keep PRs small and focused (< 400 lines preferred)
- Respond to all comments
- Say thank you

## What to Block

These issues require changes before merge:
- Security vulnerabilities
- Data loss risks
- Breaking changes without migration plan
- Missing tests for critical functionality
- Accessibility violations
- Performance regressions
- Code that doesn't compile
- Secrets in code
