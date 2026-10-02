const { chromium } = require('playwright');

const TARGET_HOST = 'https://houseofpadmavati.pages.dev';
const COMPARE_HOST = 'https://hop-production.pages.dev';

async function runVerification() {
  console.log('====================================================');
  console.log(`PRODUCTION HOSTNAME COMPREHENSIVE VERIFICATION`);
  console.log(`Target:  ${TARGET_HOST}`);
  console.log(`Compare: ${COMPARE_HOST}`);
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  let totalErrors = 0;

  // 1. DESKTOP VERIFICATION
  console.log('>>> [1/4] Running Desktop Viewport Tests (1440x900)...');
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  });
  const desktopPage = await desktopContext.newPage();

  const consoleErrors = [];
  const networkErrors = [];

  desktopPage.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore favicon or non-critical 3rd party tracker if any
      consoleErrors.push(text);
    }
  });

  desktopPage.on('response', resp => {
    const status = resp.status();
    const url = resp.url();
    if (status >= 400 && !url.includes('favicon.ico')) {
      networkErrors.push(`${status} ${resp.request().method()} ${url}`);
    }
  });

  // 1.1 Homepage
  console.log('Testing Desktop Homepage (https://houseofpadmavati.pages.dev/)...');
  const homeResp = await desktopPage.goto(TARGET_HOST + '/', { waitUntil: 'domcontentloaded' });
  const homeStatus = homeResp.status();
  console.log(`Homepage HTTP Status: ${homeStatus}`);
  if (homeStatus !== 200) {
    console.error(`ERROR: Homepage status is ${homeStatus}, expected 200`);
    totalErrors++;
  }

  const title = await desktopPage.title();
  console.log(`Page title: "${title}"`);
  if (!title.includes('House of Padmavati')) {
    console.error(`ERROR: Title does not contain "House of Padmavati"`);
    totalErrors++;
  }

  // Check YUGEN in footer
  const footerYugen = await desktopPage.locator('footer a[href="/collections/yugen"]').textContent();
  console.log(`Footer YUGEN link text: "${footerYugen?.trim()}"`);
  if (!footerYugen || !footerYugen.includes('YŪGEN')) {
    console.error(`ERROR: Footer YŪGEN link missing macron: got "${footerYugen}"`);
    totalErrors++;
  }

  // 1.2 Collections /collections/yugen
  console.log('Testing /collections/yugen...');
  const yugenResp = await desktopPage.goto(`${TARGET_HOST}/collections/yugen`, { waitUntil: 'domcontentloaded' });
  console.log(`/collections/yugen HTTP Status: ${yugenResp.status()}`);
  if (yugenResp.status() !== 200) {
    console.error(`ERROR: /collections/yugen status is ${yugenResp.status()}`);
    totalErrors++;
  }
  const yugenHeading = await desktopPage.locator('h1, h2, h3').first().textContent();
  console.log(`YŪGEN room heading: "${yugenHeading?.trim()}"`);

  // Hard refresh on deep link
  console.log('Testing hard refresh on /collections/yugen...');
  await desktopPage.reload({ waitUntil: 'domcontentloaded' });
  const yugenHeadingAfterReload = await desktopPage.locator('h1, h2, h3').first().textContent();
  console.log(`YŪGEN room heading after hard refresh: "${yugenHeadingAfterReload?.trim()}"`);

  // 1.3 Legacy alias redirect: /collections/spandana
  console.log('Testing legacy alias /collections/spandana canonicalization...');
  await desktopPage.goto(`${TARGET_HOST}/collections/spandana`, { waitUntil: 'domcontentloaded' });
  const finalSpandanaUrl = desktopPage.url();
  console.log(`Resolved URL for /collections/spandana: ${finalSpandanaUrl}`);
  if (!finalSpandanaUrl.includes('/collections/yugen')) {
    console.warn(`WARNING: /collections/spandana did not redirect to /collections/yugen (got ${finalSpandanaUrl})`);
  }

  // 1.4 Legacy alias redirect: /collections/designer-wear
  console.log('Testing legacy alias /collections/designer-wear canonicalization...');
  await desktopPage.goto(`${TARGET_HOST}/collections/designer-wear`, { waitUntil: 'domcontentloaded' });
  const finalDesignerUrl = desktopPage.url();
  console.log(`Resolved URL for /collections/designer-wear: ${finalDesignerUrl}`);

  // 1.5 Cart route
  console.log('Testing /cart...');
  const cartResp = await desktopPage.goto(`${TARGET_HOST}/cart`, { waitUntil: 'domcontentloaded' });
  console.log(`/cart HTTP Status: ${cartResp.status()}`);
  if (cartResp.status() !== 200) {
    console.error(`ERROR: /cart status is ${cartResp.status()}`);
    totalErrors++;
  }

  // 1.6 Checkout route
  console.log('Testing /checkout...');
  const checkoutResp = await desktopPage.goto(`${TARGET_HOST}/checkout`, { waitUntil: 'domcontentloaded' });
  console.log(`/checkout HTTP Status: ${checkoutResp.status()}`);
  if (checkoutResp.status() !== 200) {
    console.error(`ERROR: /checkout status is ${checkoutResp.status()}`);
    totalErrors++;
  }

  // 1.7 Account Login route
  console.log('Testing /account/login...');
  const authResp = await desktopPage.goto(`${TARGET_HOST}/account/login`, { waitUntil: 'domcontentloaded' });
  console.log(`/account/login HTTP Status: ${authResp.status()}`);
  if (authResp.status() !== 200) {
    console.error(`ERROR: /account/login status is ${authResp.status()}`);
    totalErrors++;
  }

  // 1.8 Studio Login route
  console.log('Testing /studio/login...');
  const studioResp = await desktopPage.goto(`${TARGET_HOST}/studio/login`, { waitUntil: 'domcontentloaded' });
  console.log(`/studio/login HTTP Status: ${studioResp.status()}`);

  console.log(`Console errors captured on desktop: ${consoleErrors.length}`);
  if (consoleErrors.length > 0) {
    console.log('Console errors:', consoleErrors);
  }
  console.log(`Network errors (4xx/5xx) captured on desktop: ${networkErrors.length}`);
  if (networkErrors.length > 0) {
    console.log('Network errors:', networkErrors);
  }

  await desktopContext.close();

  // 2. MOBILE VIEWPORT VERIFICATION
  console.log('\n>>> [2/4] Running Mobile Viewport Tests (390x844 - iPhone)...');
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1'
  });
  const mobilePage = await mobileContext.newPage();

  const mobileConsoleErrors = [];
  const mobileNetworkErrors = [];

  mobilePage.on('console', msg => {
    if (msg.type() === 'error') mobileConsoleErrors.push(msg.text());
  });
  mobilePage.on('response', resp => {
    if (resp.status() >= 400 && !resp.url().includes('favicon.ico')) {
      mobileNetworkErrors.push(`${resp.status()} ${resp.url()}`);
    }
  });

  const mobHomeResp = await mobilePage.goto(`${TARGET_HOST}/`, { waitUntil: 'domcontentloaded' });
  console.log(`Mobile Homepage HTTP Status: ${mobHomeResp.status()}`);

  const mobFooterYugen = await mobilePage.locator('footer a[href="/collections/yugen"]').textContent();
  console.log(`Mobile Footer YUGEN text: "${mobFooterYugen?.trim()}"`);

  await mobilePage.goto(`${TARGET_HOST}/collections/yugen`, { waitUntil: 'domcontentloaded' });
  console.log(`Mobile /collections/yugen loaded successfully.`);

  await mobileContext.close();

  // 3. COMPARISON WITH OLD PRODUCTION (hop-production.pages.dev)
  console.log('\n>>> [3/4] Comparing Against Existing Production Host (hop-production.pages.dev)...');
  const compareContext = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const comparePage = await compareContext.newPage();
  const oldResp = await comparePage.goto(COMPARE_HOST + '/', { waitUntil: 'domcontentloaded' });
  console.log(`hop-production.pages.dev HTTP Status: ${oldResp.status()}`);
  const oldTitle = await comparePage.title();
  console.log(`hop-production.pages.dev Title: "${oldTitle}"`);
  const oldFooterYugen = await comparePage.locator('footer a[href="/collections/yugen"]').textContent();
  console.log(`hop-production.pages.dev Footer YUGEN text: "${oldFooterYugen?.trim()}"`);
  await compareContext.close();

  await browser.close();

  console.log('\n====================================================');
  console.log(`SUMMARY: Verification finished with ${totalErrors} fatal errors.`);
  console.log('====================================================');

  if (totalErrors > 0) {
    process.exit(1);
  }
}

runVerification().catch(err => {
  console.error('Test run crashed:', err);
  process.exit(1);
});
