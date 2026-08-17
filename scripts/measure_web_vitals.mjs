import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.otf': 'font/otf',
  '.mp4': 'video/mp4'
};

function startServer(port = 4174) {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const parsedUrl = new URL(req.url, `http://localhost:${port}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      let filePath = path.join(distDir, reqPath);
      let stat;
      try {
        stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
          stat = await fs.stat(filePath);
        }
      } catch (e) {}

      if (stat && stat.isFile()) {
        const ext = path.extname(filePath);
        res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
        res.writeHead(200);
        const data = await fs.readFile(filePath);
        return res.end(data);
      }

      try {
        const notFoundPath = path.join(distDir, '404.html');
        const notFoundData = await fs.readFile(notFoundPath);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.writeHead(404);
        return res.end(notFoundData);
      } catch (e) {
        res.writeHead(404);
        return res.end('Not Found');
      }
    });

    server.listen(port, () => resolve(server));
  });
}

async function measurePage(browser, pageUrl, contextOptions = {}) {
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();

  // Inject performance observer script before document loads
  await page.addInitScript(() => {
    window.__vitals = {
      lcp: null,
      cls: 0,
      fcp: null,
      longTasks: [],
      tbt: 0
    };

    // FCP & Paint
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          window.__vitals.fcp = entry.startTime;
        }
      }
    }).observe({ type: 'paint', buffered: true });

    // LCP
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      if (entries.length > 0) {
        window.__vitals.lcp = entries[entries.length - 1].startTime;
      }
    }).observe({ type: 'largest-contentful-paint', buffered: true });

    // CLS
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          window.__vitals.cls += entry.value;
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });

    // Long Tasks for TBT
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (entry.duration > 50) {
          window.__vitals.longTasks.push(entry.duration);
          window.__vitals.tbt += (entry.duration - 50);
        }
      }
    }).observe({ type: 'longtask', buffered: true });
  });

  const response = await page.goto(pageUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000); // allow layout shifts to settle

  const navTiming = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return {
      ttfb: nav ? nav.responseStart - nav.requestStart : null,
      domInteractive: nav ? nav.domInteractive : null,
      loadEventEnd: nav ? nav.loadEventEnd : null,
      transferSize: nav ? nav.transferSize : null
    };
  });

  const vitals = await page.evaluate(() => window.__vitals);

  await page.close();
  await context.close();

  return {
    status: response.status(),
    navTiming,
    vitals
  };
}

async function run() {
  const server = await startServer(4174);
  const browser = await chromium.launch();

  const pagesToTest = [
    { name: 'Homepage (Desktop)', url: 'http://localhost:4174/', viewport: { width: 1440, height: 900 } },
    { name: 'Homepage (Mobile)', url: 'http://localhost:4174/', viewport: { width: 390, height: 844 }, isMobile: true },
    { name: 'Collections (Desktop)', url: 'http://localhost:4174/collections', viewport: { width: 1440, height: 900 } },
    { name: 'Collections (Mobile)', url: 'http://localhost:4174/collections', viewport: { width: 390, height: 844 }, isMobile: true },
    { name: 'Collection Detail - Kalyani (Desktop)', url: 'http://localhost:4174/collections/kalyani', viewport: { width: 1440, height: 900 } },
    { name: 'Collection Detail - Kalyani (Mobile)', url: 'http://localhost:4174/collections/kalyani', viewport: { width: 390, height: 844 }, isMobile: true },
    { name: 'About - Our Story (Desktop)', url: 'http://localhost:4174/about', viewport: { width: 1440, height: 900 } },
    { name: 'Customer Care (Desktop)', url: 'http://localhost:4174/customer-care', viewport: { width: 1440, height: 900 } },
  ];

  // Try product detail
  try {
    const pDirs = await fs.readdir(path.join(distDir, 'product'));
    if (pDirs.length > 0) {
      pagesToTest.push({
        name: 'Product Detail (Desktop)',
        url: `http://localhost:4174/product/${pDirs[0]}`,
        viewport: { width: 1440, height: 900 }
      });
      pagesToTest.push({
        name: 'Product Detail (Mobile)',
        url: `http://localhost:4174/product/${pDirs[0]}`,
        viewport: { width: 390, height: 844 },
        isMobile: true
      });
    }
  } catch (e) {}

  const results = [];

  for (const p of pagesToTest) {
    console.log(`Measuring ${p.name}...`);
    const measurement = await measurePage(browser, p.url, {
      viewport: p.viewport,
      isMobile: p.isMobile || false
    });
    results.push({
      page: p.name,
      url: p.url,
      ...measurement
    });
  }

  await browser.close();
  server.close();

  const outPath = path.resolve(__dirname, '../production/phase-4/web_vitals_measurements.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Measurements saved to ${outPath}`);
}

run().catch(console.error);
