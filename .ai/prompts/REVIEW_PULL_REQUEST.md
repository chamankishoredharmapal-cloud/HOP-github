# Review Pull Request Prompt

## Context
- Read `.ai/rules/CODE_REVIEW_STANDARDS.md` for review guidelines
- Read the PR description and linked issues

## Steps

### 1. Understand the Change
- Read the PR title and description
- Check linked issues/requirements
- Understand what problem this solves
- Check the scope (is it focused?)

### 2. Review the Code

**Architecture**:
- Does the solution fit the existing architecture?
- Is the component/feature placed in the correct location?
- Does it follow established patterns?
- Could it be simpler?

**Functionality**:
- Does it meet the acceptance criteria?
- Are edge cases handled?
- Are error states handled?
- Are loading states handled?

**Code Quality**:
- Is the code readable?
- Are names clear and descriptive?
- Are functions single-purpose?
- Is there duplication that could be extracted?
- Are there code smells?

**TypeScript**:
- Are types correct and precise?
- Are there any `any` types that should be specific?
- Are imported types using `import type`?
- Are function signatures clear?

**React**:
- Are there unnecessary re-renders?
- Are hooks used correctly? (rules of hooks)
- Are keys stable and unique?
- Is state in the right place?

**Accessibility**:
- Are images accessible (alt text)?
- Are interactive elements keyboard-friendly?
- Is the heading hierarchy correct?
- Are ARIA attributes correct?

**Performance**:
- Are images optimized?
- Is code splitting used where appropriate?
- Are there expensive computations that should be memoized?
- Are API calls efficient?

**Security**:
- Is user input validated?
- Are secrets exposed?
- Is the principle of least privilege followed?
- Are RLS policies correct?

**Testing**:
- Are there tests for the new code?
- Do tests use accessibility selectors?
- Are edge cases and error states tested?
- Are tests reliable (not flaky)?

### 3. Provide Feedback

Format comments as:
- `**issue**:` — Must be fixed before merge (blocking)
- `**suggestion**:` — Improvement to consider (non-blocking)
- `**nitpick**:` — Minor preference (can be ignored)

Be constructive and specific. Explain WHY, not just WHAT.

### 4. Final Decision
- **Approve**: No blocking issues
- **Request Changes**: Blocking issues exist
- **Comment**: Non-blocking feedback only
