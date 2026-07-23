# Analyze Test Failures Prompt

## Context
- Read `test-results/` for failure artifacts
- Read the test file that failed

## Steps

### 1. Gather Information
- What test failed?
- What was the error message?
- Is the failure consistent or flaky?
- What's the screenshot showing?
- Is there a trace available?
- What was the application state?

### 2. Common Failure Patterns

| Pattern | Likely Cause | Fix |
|---------|-------------|-----|
| `locator not found` | Selector doesn't match | Check accessibility role/name |
| `timeout` | Element not appearing | Check loading state, async timing |
| `actionability check failed` | Element hidden/overlapped | Wait for animation to complete |
| `strict mode violation` | Multiple elements match | Make selector more specific |
| `page.goto: Navigation failed` | Server not running | Start dev server |
| Flaky test | Race condition | Better waits, test isolation |

### 3. Debug Steps

**If selector is wrong:**
```bash
# Use Playwright codegen to find correct selector
pnpm exec playwright codegen http://localhost:8080
```

**If timing issue:**
```typescript
// Add specific waits (NOT page.waitFor)
await page.waitForLoadState("networkidle");
await page.waitForSelector('[data-testid="loaded"]');
```

**If state issue:**
```typescript
// Check what's on the page
console.log(await page.content());
await page.screenshot({ path: "debug.png" });
```

### 4. Fix
- Update selector if wrong
- Add proper waits if timing
- Fix test isolation if flaky
- Fix application code if bug
