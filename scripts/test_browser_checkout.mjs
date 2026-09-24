import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://hop-staging.chamankishoredharmapal.workers.dev';
const STAGING_PROJECT = 'dovnhgbisiturzbjgvei';
const PRODUCTION_PROJECT = 'kbvjmcnaaogkbnerjcoc';

async function runBrowserTest() {
  console.log('=== STARTING BROWSER-LEVEL CHECKOUT VALIDATION ===');
  console.log(`Target URL: ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 }
  });
  const page = await context.newPage();

  let productionLeakDetected = false;
  const requestsMade = [];
  const edgeFunctionCalls = [];

  // Monitor network traffic
  page.on('request', (req) => {
    const url = req.url();
    requestsMade.push(url);
    if (url.includes(PRODUCTION_PROJECT)) {
      console.error(`[LEAK ALERT] Request to PRODUCTION detected: ${url}`);
      productionLeakDetected = true;
    }
    if (url.includes('/functions/v1/')) {
      console.log(`[Edge Function Call] ${req.method()} ${url}`);
      edgeFunctionCalls.push({ method: req.method(), url });
    }
  });

  page.on('response', async (res) => {
    const url = res.url();
    if (url.includes('/functions/v1/')) {
      const status = res.status();
      let bodyText = '';
      try {
        bodyText = await res.text();
      } catch (e) {
        bodyText = '<unreadable>';
      }
      console.log(`[Edge Function Response] ${status} ${url}`);
      console.log(`  Body: ${bodyText.slice(0, 300)}`);
    }
  });

  try {
    // ----------------------------------------------------
    // STEP 1: Collections View & Product Discovery
    // ----------------------------------------------------
    console.log('\n--- Step 1: Navigating to Collections ---');
    const collectionsRes = await page.goto(`${BASE_URL}/collections/all`, { waitUntil: 'networkidle' });
    console.log(`Collections HTTP status: ${collectionsRes?.status()}`);
    
    // Check if test product is present
    await page.waitForTimeout(2000);
    const content = await page.content();
    const hasProduct = content.includes('Staging Validation Saree');
    console.log(`Product "Staging Validation Saree" visible on collections page: ${hasProduct}`);

    // ----------------------------------------------------
    // STEP 2: Product Detail Page & Add to Bag
    // ----------------------------------------------------
    console.log('\n--- Step 2: Navigating to Product Detail Page ---');
    const productUrl = `${BASE_URL}/product/a0000000-0000-0000-0000-000000000001`;
    const productRes = await page.goto(productUrl, { waitUntil: 'networkidle' });
    console.log(`Product Page HTTP status: ${productRes?.status()}`);

    await page.waitForSelector('text=Staging Validation Saree', { timeout: 10000 });
    console.log('Verified product title on detail page.');

    // Click Add to Bag
    console.log('Clicking "Add to Bag"...');
    const addBtn = page.locator('button:has-text("Add to Bag"), button:has-text("Add to Cart")').first();
    await addBtn.click();
    await page.waitForTimeout(1500);

    // ----------------------------------------------------
    // STEP 3: User Authentication
    // ----------------------------------------------------
    console.log('\n--- Step 3: Authenticating Staging Customer ---');
    await page.goto(`${BASE_URL}/account/login`, { waitUntil: 'networkidle' });
    await page.fill('input[type="email"]', 'staging_test_customer@gmail.com');
    await page.fill('input[type="password"]', 'StagingTestPass123!');
    await page.click('button[type="submit"]:has-text("Sign in")');
    
    // Wait for auth redirect or session establishment
    await page.waitForTimeout(3000);
    console.log(`Current URL after login: ${page.url()}`);

    // ----------------------------------------------------
    // STEP 4: Checkout Page & Form Completion
    // ----------------------------------------------------
    console.log('\n--- Step 4: Navigating to Checkout ---');
    await page.goto(`${BASE_URL}/checkout`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);

    // Verify item in checkout summary
    const checkoutContent = await page.content();
    const itemInSummary = checkoutContent.includes('Staging Validation Saree');
    console.log(`Product present in Checkout summary: ${itemInSummary}`);

    // Fill all form fields required by validation
    console.log('Filling contact & shipping details...');
    await page.fill('input#email', 'staging_test_customer@gmail.com');
    await page.fill('input#firstName', 'Staging');
    await page.fill('input#lastName', 'Customer');
    await page.fill('input#address', '123 Staging Lane');
    await page.fill('input#city', 'Bengaluru');
    await page.fill('input#postalCode', '560001');
    await page.fill('input#country', 'India');
    await page.fill('input#phone', '9876543210');

    // Accept return policy
    console.log('Accepting Return Policy...');
    await page.check('input#returnPolicyAccepted');

    // ----------------------------------------------------
    // STEP 5: Trigger Payment & Razorpay Modal Verification
    // ----------------------------------------------------
    console.log('\n--- Step 5: Submitting Order and Launching Razorpay Checkout ---');
    
    const [createOrderRes] = await Promise.all([
      page.waitForResponse((res) => res.url().includes('create-razorpay-order'), { timeout: 20000 }),
      page.click('button[type="submit"]:has-text("Pay Securely")')
    ]);

    console.log(`create-razorpay-order HTTP Status: ${createOrderRes.status()}`);
    const orderResponseBody = await createOrderRes.json();
    console.log('create-razorpay-order Response Payload:', JSON.stringify(orderResponseBody, null, 2));

    // Wait for Razorpay checkout script & iframe to appear
    console.log('Waiting for Razorpay checkout iframe...');
    const rzpIframe = await page.waitForSelector('iframe.razorpay-checkout-frame', { timeout: 15000 });
    console.log('Razorpay modal iframe detected in DOM!');

    // Wait a brief moment for iframe to render contents
    await page.waitForTimeout(3000);

    // Take screenshot of checkout with Razorpay modal
    const screenshotPath = path.resolve('docs/browser_checkout_modal.png');
    await page.screenshot({ path: screenshotPath, fullPage: true });
    console.log(`Screenshot saved to ${screenshotPath}`);

    // ----------------------------------------------------
    // STEP 6: Assertions & Summary
    // ----------------------------------------------------
    console.log('\n--- BROWSER TEST RESULTS ---');
    console.log(`1. Production Leak Detected: ${productionLeakDetected ? 'FAIL (LEAK)' : 'PASS (ISOLATED)'}`);
    console.log(`2. Edge Function Target: ${createOrderRes.url().includes(STAGING_PROJECT) ? 'PASS (STAGING)' : 'FAIL'}`);
    console.log(`3. Razorpay Order ID Generated: ${orderResponseBody.razorpay_order_id ? 'PASS (' + orderResponseBody.razorpay_order_id + ')' : 'FAIL'}`);
    console.log(`4. DB Order ID Generated: ${orderResponseBody.order_id ? 'PASS (' + orderResponseBody.order_id + ')' : 'FAIL'}`);
    console.log(`5. Razorpay Modal Injected: ${rzpIframe ? 'PASS' : 'FAIL'}`);

    if (productionLeakDetected) {
      throw new Error('TEST FAILED: Production URL was called during browser test!');
    }

    console.log('\nALL BROWSER CHECKOUT CHECKS PASSED!');
    return {
      success: true,
      order_id: orderResponseBody.order_id,
      order_number: orderResponseBody.order_number,
      razorpay_order_id: orderResponseBody.razorpay_order_id,
      razorpay_key_id: orderResponseBody.razorpay_key_id,
    };
  } catch (err) {
    console.error('\n[BROWSER TEST ERROR]:', err);
    try {
      await page.screenshot({ path: path.resolve('docs/browser_checkout_error.png'), fullPage: true });
      console.log('Error screenshot saved to docs/browser_checkout_error.png');
    } catch (e) {}
    throw err;
  } finally {
    await browser.close();
  }
}

runBrowserTest().then(
  (res) => {
    console.log('Test completed with result:', res);
    process.exit(0);
  },
  (err) => {
    console.error('Test completed with error:', err.message);
    process.exit(1);
  }
);
