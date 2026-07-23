# Run Tests — House of Padmavati

> From: old `prompts/RUN_PLAYWRIGHT.md` + `prompts/ANALYZE_FAILURES.md` + `prompts/FIX_FAILURES.md`

## Commands

| Command | Use |
|---------|-----|
| `pnpm dev &` | Start dev server (background) |
| `pnpm test:e2e` | Run all tests |
| `pnpm test:e2e -- file.spec.ts` | Single file |
| `pnpm test:e2e -- --headed` | Visible browser |
| `pnpm test:e2e -- --ui` | Interactive UI mode |
| `pnpm test:e2e -- --debug` | Step debugger |
| `pnpm exec playwright codegen URL` | Record selectors |

## Analyze Failures

| Pattern | Likely Cause | Fix |
|---------|-------------|-----|
| `locator not found` | Wrong selector | Check role/name |
| `timeout` | Element not appearing | Wait for load state |
| `strict mode violation` | Multiple matches | Narrow selector |
| `Navigation failed` | Server not running | Start dev server |
| Flaky | Race condition | Better waits, isolate test |

## Debug Steps

```typescript
// Debug a specific failure
await page.waitForLoadState("networkidle");
await page.screenshot({ path: "debug.png" });
console.log(await page.content());
```

## Fix Common Issues

| Before | After |
|--------|-------|
| `page.click(".class")` | `page.getByRole("button", { name: /text/i }).click()` |
| `page.waitFor(2000)` | `page.waitForLoadState("networkidle")` |
| `expect(await ...)` | `await expect(...).toHaveText()` |

Run the test 3x after fixing to confirm stability.
