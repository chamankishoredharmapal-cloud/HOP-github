import http from 'http';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Read MIME types
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

// Security headers matching vercel.json
const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-src 'self' https://api.razorpay.com; object-src 'none'; base-uri 'self'; form-action 'self';",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function startServer(port = 4173) {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const parsedUrl = new URL(req.url, `http://localhost:${port}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      // Apply security headers
      for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
        res.setHeader(k, v);
      }

      let filePath = path.join(distDir, reqPath);
      let stat;
      try {
        stat = await fs.stat(filePath);
        if (stat.isDirectory()) {
          filePath = path.join(filePath, 'index.html');
          stat = await fs.stat(filePath);
        }
      } catch (e) {
        // file doesn't exist
      }

      if (stat && stat.isFile()) {
        const ext = path.extname(filePath);
        res.setHeader('Content-Type', MIME_TYPES[ext] || 'application/octet-stream');
        if (filePath.includes('assets')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else if (ext === '.html') {
          res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
        }
        res.writeHead(200);
        const data = await fs.readFile(filePath);
        return res.end(data);
      }

      // Check if 404
      try {
        const notFoundPath = path.join(distDir, '404.html');
        const notFoundData = await fs.readFile(notFoundPath);
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.writeHead(404);
        return res.end(notFoundData);
      } catch (e) {
        res.writeHead(404);
        return res.end('Not Found');
      }
    });

    server.listen(port, () => {
      resolve(server);
    });
  });
}

async function runAudit() {
  console.log("Starting static test server on port 4173...");
  const server = await startServer(4173);
  const browser = await chromium.launch();

  const auditResults = {
    timestamp: new Date().toISOString(),
    routesTested: [],
    performanceMetrics: {},
    seoAudit: {},
    routingAudit: {},
    securityHeaders: {}
  };

  const routesToTest = [
    { path: '/', type: 'homepage', isPrerendered: true },
    { path: '/collections', type: 'collections', isPrerendered: true },
    { path: '/collections/kalyani', type: 'collection_detail', isPrerendered: true },
    { path: '/about', type: 'about', isPrerendered: true },
    { path: '/customer-care', type: 'customer_care', isPrerendered: true },
    { path: '/privacy-policy', type: 'legal', isPrerendered: true },
    { path: '/journal', type: 'journal', isPrerendered: true },
    { path: '/lookbook', type: 'lookbook', isPrerendered: true },
    { path: '/campaigns/quiet-wedding', type: 'campaign', isPrerendered: true },
    { path: '/nonexistent-route-xyz-404', type: 'nonexistent', isPrerendered: false },
    { path: '/sitemap.xml', type: 'sitemap', isPrerendered: true, isXml: true },
    { path: '/robots.txt', type: 'robots', isPrerendered: true, isText: true }
  ];

  // Also check dynamic product route if prerendered
  try {
    const pDirs = await fs.readdir(path.join(distDir, 'product'));
    if (pDirs.length > 0) {
      routesToTest.push({
        path: `/product/${pDirs[0]}`,
        type: 'product_detail',
        isPrerendered: true
      });
    }
  } catch (e) {}

  for (const r of routesToTest) {
    console.log(`Auditing route ${r.path}...`);
    const page = await browser.newPage();
    const url = `http://localhost:4173${r.path}`;
    
    let httpStatus = 0;
    let headers = {};
    page.on('response', (res) => {
      if (res.url() === url || res.url() === url + '/') {
        httpStatus = res.status();
        headers = res.headers();
      }
    });

    const response = await page.goto(url, { waitUntil: 'networkidle' });
    const finalStatus = response ? response.status() : httpStatus;

    if (r.isXml || r.isText) {
      const content = await page.content();
      auditResults.routesTested.push({
        path: r.path,
        type: r.type,
        httpStatus: finalStatus,
        contentType: headers['content-type'] || '',
        contentSample: content.slice(0, 300)
      });
      await page.close();
      continue;
    }

    // Measure Core Web Vitals and SEO elements
    const seoData = await page.evaluate(() => {
      const title = document.title;
      const metaDesc = document.querySelector('meta[name="description"]')?.getAttribute('content');
      const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      const ogTitle = document.querySelector('meta[property="og:title"]')?.getAttribute('content');
      const ogDesc = document.querySelector('meta[property="og:description"]')?.getAttribute('content');
      const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute('content');
      const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
      const robots = document.querySelector('meta[name="robots"]')?.getAttribute('content');
      const jsonLdScripts = Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => {
        try {
          return JSON.parse(s.textContent || '{}');
        } catch (e) {
          return { error: 'invalid_json' };
        }
      });
      const h1Tags = Array.from(document.querySelectorAll('h1')).map(h => h.textContent?.trim());
      const h2Tags = Array.from(document.querySelectorAll('h2')).map(h => h.textContent?.trim());

      return {
        title,
        metaDesc,
        canonical,
        ogTitle,
        ogDesc,
        ogImage,
        ogUrl,
        robots,
        jsonLdScripts,
        h1Tags,
        h2Tags
      };
    });

    // Extract Navigation Timing
    const perfTiming = await page.evaluate(() => {
      const navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        const nav = navEntries[0];
        return {
          ttfb: nav.responseStart - nav.requestStart,
          domInteractive: nav.domInteractive,
          domContentLoaded: nav.domContentLoadedEventEnd,
          loadEventEnd: nav.loadEventEnd,
          transferSize: nav.transferSize,
          encodedBodySize: nav.encodedBodySize,
          decodedBodySize: nav.decodedBodySize
        };
      }
      return null;
    });

    // Measure Paint Metrics
    const paintMetrics = await page.evaluate(() => {
      const paintEntries = performance.getEntriesByType('paint');
      const metrics = {};
      for (const p of paintEntries) {
        metrics[p.name] = p.startTime;
      }
      return metrics;
    });

    auditResults.routesTested.push({
      path: r.path,
      type: r.type,
      httpStatus: finalStatus,
      headers,
      seo: seoData,
      timing: perfTiming,
      paint: paintMetrics
    });

    await page.close();
  }

  // Measure Mobile Viewport for Homepage and Product Detail
  console.log("Measuring Mobile Viewport performance...");
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
    isMobile: true,
    hasTouch: true
  });

  for (const path of ['/', '/collections/kalyani', '/about']) {
    const page = await mobileContext.newPage();
    await page.goto(`http://localhost:4173${path}`, { waitUntil: 'networkidle' });
    
    const mobilePerf = await page.evaluate(() => {
      const paint = {};
      performance.getEntriesByType('paint').forEach(p => { paint[p.name] = p.startTime; });
      const nav = performance.getEntriesByType('navigation')[0];
      return {
        paint,
        ttfb: nav ? nav.responseStart - nav.requestStart : null,
        domInteractive: nav ? nav.domInteractive : null,
        loadEventEnd: nav ? nav.loadEventEnd : null
      };
    });

    auditResults.performanceMetrics[`mobile_${path}`] = mobilePerf;
    await page.close();
  }
  await mobileContext.close();

  await browser.close();
  server.close();

  const outPath = path.resolve(__dirname, '../production/phase-4/audit_results_raw.json');
  await fs.writeFile(outPath, JSON.stringify(auditResults, null, 2), 'utf-8');
  console.log(`Audit complete. Results written to ${outPath}`);
}

runAudit().catch(e => {
  console.error("Audit failed:", e);
  process.exit(1);
});
