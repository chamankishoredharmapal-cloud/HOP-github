const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

const OUT_DIR = 'C:\\Users\\siddh\\.gemini\\antigravity\\brain\\4edf4889-9c86-4849-b5d7-25df2167369f\\scratch\\screenshots';

async function capture() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({ channel: 'msedge' });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const routes = [
    { name: 'home', url: '/' },
    { name: 'collections', url: '/collections' },
    { name: 'category', url: '/collections/kalyani' },
    { name: 'product', url: '/product/cm6v5nsw10007gct7b30m3q1a' },
    { name: 'about', url: '/about' },
    { name: 'journal', url: '/journal' },
    { name: 'privacy', url: '/privacy-policy' },
    { name: 'terms', url: '/terms-of-service' },
    { name: 'not_found', url: '/does-not-exist' }
  ];

  for (const route of routes) {
    console.log(`Capturing ${route.name}...`);
    try {
      await page.goto(`http://localhost:8080${route.url}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(1000); // Wait for any fade-in animations
      await page.screenshot({ path: path.join(OUT_DIR, `${route.name}.png`), fullPage: true });
    } catch (e) {
      console.error(`Failed to capture ${route.name}:`, e.message);
    }
  }

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(console.error);
