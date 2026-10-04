import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });

  console.log('Testing PDP interactions on /product/a2799dd3-80a5-4cc4-b510-031678a2c1f7...');
  await page.goto('https://houseofpadmavati.pages.dev/product/a2799dd3-80a5-4cc4-b510-031678a2c1f7', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);

  // Gallery thumbnail clicks
  const thumbs = await page.$$('button[aria-label*="product image" i], button[aria-label*="Show product image" i]');
  console.log('Thumbnail count:', thumbs.length);
  if (thumbs.length > 1) {
    const t0 = performance.now();
    await thumbs[1].click();
    await page.waitForTimeout(200);
    console.log('Gallery Thumbnail Switch Latency:', Math.round(performance.now() - t0), 'ms');
  }

  // Zoom toggle
  const zoomBtn = await page.$('button[aria-label*="zoom" i]');
  if (zoomBtn) {
    const tZoom = performance.now();
    await zoomBtn.click();
    await page.waitForTimeout(200);
    console.log('Gallery Zoom Latency:', Math.round(performance.now() - tZoom), 'ms');
  }

  // Add to Bag / CTA interaction
  const ctaBtn = await page.$('button:has-text("Acquire"), button:has-text("Add to Bag"), button:has-text("Bag")');
  if (ctaBtn) {
    const tBag = performance.now();
    await ctaBtn.click();
    await page.waitForTimeout(300);
    console.log('Add to Bag CTA Latency:', Math.round(performance.now() - tBag), 'ms');
  }

  await browser.close();
})();
