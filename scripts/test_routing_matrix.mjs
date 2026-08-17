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
  '.svg': 'image/svg+xml',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

const SECURITY_HEADERS = {
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https:; connect-src 'self' https: wss:; frame-src 'self' https://api.razorpay.com; object-src 'none'; base-uri 'self'; form-action 'self';",
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

function startServer(port = 4175) {
  return new Promise((resolve) => {
    const server = http.createServer(async (req, res) => {
      const parsedUrl = new URL(req.url, `http://localhost:${port}`);
      let reqPath = decodeURIComponent(parsedUrl.pathname);

      for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
        res.setHeader(k, v);
      }

      // Check if file exists directly
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

      // SPA rewrite rule: if path has no file extension, rewrite to dist/index.html with 200 OK (simulating Vercel SPA rewrite)
      if (!path.extname(reqPath)) {
        const indexPath = path.join(distDir, 'index.html');
        try {
          const indexData = await fs.readFile(indexPath);
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.writeHead(200);
          return res.end(indexData);
        } catch (e) {}
      }

      // Static missing asset (e.g. missing .js / .css / direct 404)
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

async function run() {
  const server = await startServer(4175);
  const browser = await chromium.launch();

  const testMatrix = [
    { name: 'Known valid static route', path: '/about' },
    { name: 'Known valid collection route', path: '/collections/kalyani' },
    { name: 'Known invalid static asset', path: '/assets/nonexistent-asset-12345.js' },
    { name: 'Invalid product route (nonexistent UUID)', path: '/product/00000000-0000-0000-0000-000000000000' },
    { name: 'Invalid collection route (nonexistent slug)', path: '/collections/nonexistent-collection-slug' },
    { name: 'Deep-link route refresh', path: '/privacy-policy' }
  ];

  const results = [];

  for (const t of testMatrix) {
    const page = await browser.newPage();
    const url = `http://localhost:4175${t.path}`;
    
    let initialHttpStatus = 0;
    let initialContentType = '';
    page.on('response', (res) => {
      if (res.url() === url || res.url() === url + '/') {
        initialHttpStatus = res.status();
        initialContentType = res.headers()['content-type'] || '';
      }
    });

    try {
      const response = await page.goto(url, { waitUntil: 'load', timeout: 10000 });
      await page.waitForTimeout(500);
      const finalHttpStatus = response ? response.status() : initialHttpStatus;

      // Extract DOM metadata
      const domData = await page.evaluate(() => {
        const title = document.title;
        const metaRobots = document.querySelector('meta[name="robots"]')?.getAttribute('content');
        const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
        const h1 = document.querySelector('h1')?.textContent?.trim() || '';
        const bodySnippet = document.body?.innerText?.slice(0, 200).replace(/\s+/g, ' ');
        return {
          title,
          metaRobots,
          canonical,
          h1,
          bodySnippet
        };
      });

      results.push({
        scenario: t.name,
        path: t.path,
        httpStatus: finalHttpStatus,
        contentType: initialContentType,
        ...domData
      });
    } catch (e) {
      results.push({
        scenario: t.name,
        path: t.path,
        error: e.message
      });
    }

    await page.close();
  }

  await browser.close();
  server.close();

  const outPath = path.resolve(__dirname, '../production/phase-4/routing_matrix_results.json');
  await fs.writeFile(outPath, JSON.stringify(results, null, 2), 'utf-8');
  console.log(`Routing matrix test complete. Results written to ${outPath}`);
}

run().catch(console.error);
