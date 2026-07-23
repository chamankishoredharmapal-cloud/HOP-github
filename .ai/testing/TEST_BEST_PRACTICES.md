# Test Best Practices — House of Padmavati

## General

1. **Test the critical path first** — focus on flows that generate revenue
2. **One assertion per behavior** — each test validates one thing
3. **Descriptive names** — `test("shows error when email is invalid")` not `test("test 1")`
4. **No logic in tests** — no conditionals, loops, or complex computations
5. **Deterministic** — same input always produces same result
6. **Fast** — tests should complete in milliseconds to seconds
7. **Isolated** — no test depends on another test's state

## Playwright-Specific

1. **No CSS selectors** — use `getByRole`, `getByText`, `getByTestId`
2. **No `page.waitFor(timeout)`** — use `waitForSelector`, `toBeVisible`, `toHaveText`
3. **Use `test.step`** for multi-step scenarios
4. **Use page objects** for reusable selectors
5. **Avoid `page.evaluate()`** — test the UI, not the JS runtime
6. **Test on real viewports** — `1440x900` (desktop), `390x844` (mobile)
7. **Use realistic data** — seed database with representative fixtures
8. **Clean up test data** — delete created records after tests

## Accessibility Testing

1. **Integrate axe-core** into Playwright tests
2. **Run accessibility on every page** in critical journeys
3. **Test keyboard navigation** — tab through all interactive elements
4. **Test with screen readers** — periodically, not in CI
5. **Check color contrast** — especially on CTAs and text

## Performance Testing

1. **Set performance budgets** in CI (Lighthouse scores, bundle size)
2. **Track Core Web Vitals** over time
3. **Monitor bundle size** with `vite-bundle-visualizer`
4. **Test on throttled networks** (Slow 3G) for critical pages
5. **Test on mobile hardware** for real-world performance

## Test Data Management

1. **Use factories** (not hard-coded data) for test fixtures
2. **Seed test database** before test run, clean up after
3. **Never use production data** for testing
4. **Use unique identifiers** to avoid collisions in parallel runs
5. **Document test data** — what it represents, why it exists

## Flaky Test Prevention

1. **No shared mutable state** between tests
2. **No timing-dependent assertions** — use `toHaveText` not `expect(await ...)`
3. **Retry flaky tests** (max 2 retries in CI)
4. **Investigate flaky tests** — fix the root cause, don't ignore
5. **Use `trace: "on-first-retry"`** to capture debug info

## Test Organization

1. **Group by feature** (not by test type)
2. **Name files by feature** — `cart.spec.ts`, `checkout.spec.ts`
3. **Use `describe` blocks** for organization within files
4. **Order tests logically** — setup first, then actions, then assertions
5. **Keep files focused** — one feature per file, max 100 lines per test

## Code Review for Tests

Check for:
- [ ] Test covers the behavioral requirement
- [ ] No CSS selectors
- [ ] Uses accessibility roles
- [ ] No hard-coded waits
- [ ] Proper test isolation
- [ ] Error and edge cases covered
- [ ] Test data is appropriate
- [ ] Test is readable and well-structured
