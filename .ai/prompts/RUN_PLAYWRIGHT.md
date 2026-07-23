# Run Playwright Tests Prompt

## Steps

### 1. Start the Development Server
```bash
# Start the Vite dev server in the background
pnpm dev &
```

### 2. Run Tests

**All tests:**
```bash
pnpm test:e2e
```

**Specific test file:**
```bash
pnpm test:e2e -- src/__tests__/{filename}.spec.ts
```

**Headed mode (see the browser):**
```bash
pnpm test:e2e -- --headed
```

**UI mode (interactive test runner):**
```bash
pnpm test:e2e -- --ui
```

**Debug mode:**
```bash
pnpm test:e2e -- --debug
```

### 3. View Results
- HTML report: `test-results/html/index.html` (open in browser)
- Test output in terminal
- Screenshots on failure in `test-results/`

### 4. Analyze Failures
- Check the error message
- Review the trace (if available)
- Check the screenshot
- Look at the test code for selector issues
- Check if the application state is correct
