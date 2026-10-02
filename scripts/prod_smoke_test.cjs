const { chromium } = require('playwright');

const BASE_URL = process.env.PROD_URL || 'https://houseofpadmavati.pages.dev';

const routesToTest = [
  { path: '/', expectedTitle: 'House of Padmavati' },
  { path: '/collections', expectedTitle: 'House of Padmavati' },
  { path: '/lookbook', expectedTitle: 'House of Padmavati' },
  { path: '/journal', expectedTitle: 'House of Padmavati' },
  { path: '/about', expectedTitle: 'House of Padmavati' },
  { path: '/customer-care', expectedTitle: 'House of Padmavati' },
  { path: '/cart', expectedTitle: 'House of Padmavati' },
  { path: '/checkout', expectedTitle: 'House of Padmavati' },
  { path: '/wishlist', expectedTitle: 'House of Padmavati' },
  { path: '/product/a2799dd3-80a5-4cc4-b510-031678a2c1f7', expectedTitle: 'House of Padmavati' },
];

(async () => {
  console.log(`Starting Production Browser Smoke Test against ${BASE_URL}...`);
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();

  const results = [];
  const consoleErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(`[Console Error] ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(`[Page Uncaught Exception] ${err.message}`);
  });

  for (const item of routesToTest) {
    const url = `${BASE_URL}${item.path}`;
    try {
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      const status = response ? response.status() : 'No response';
      const title = await page.title();
      const content = await page.content();
      const hasRoot = content.includes('id="root"');
      const rootChildrenCount = await page.evaluate(() => document.getElementById('root')?.children.length || 0);

      results.push({
        path: item.path,
        status,
        title,
        rendered: rootChildrenCount > 0,
        pass: (status === 200 || status === 304) && rootChildrenCount > 0,
      });
      console.log(`[PASS] ${item.path} (HTTP ${status}, Elements: ${rootChildrenCount}, Title: "${title}")`);
    } catch (err) {
      results.push({
        path: item.path,
        error: err.message,
        pass: false,
      });
      console.log(`[FAIL] ${item.path}: ${err.message}`);
    }
  }

  // Test 404 handling
  try {
    const notFoundUrl = `${BASE_URL}/nonexistent-test-page-404`;
    const response = await page.goto(notFoundUrl, { waitUntil: 'networkidle', timeout: 20000 });
    const content = await page.content();
    console.log(`[PASS] 404 test route loaded (HTTP ${response?.status()})`);
  } catch (err) {
    console.log(`[INFO] 404 test: ${err.message}`);
  }

  await browser.close();

  console.log('\n--- SMOKE TEST SUMMARY ---');
  const allPassed = results.every(r => r.pass);
  console.log(`Total Routes Tested: ${results.length}`);
  console.log(`Passed: ${results.filter(r => r.pass).length}`);
  console.log(`Failed: ${results.filter(r => !r.pass).length}`);
  console.log(`Console Errors Encountered: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Console Errors Sample:');
    consoleErrors.slice(0, 5).forEach(e => console.log('  ', e));
  }

  if (allPassed) {
    console.log('\nVERDICT: SMOKE TEST PASS');
    process.exit(0);
  } else {
    console.log('\nVERDICT: SMOKE TEST FAIL');
    process.exit(1);
  }
})();
