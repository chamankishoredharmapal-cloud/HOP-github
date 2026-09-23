import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { chromium } from 'playwright';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../dist');

// Basic manual dotenv parsing to avoid adding dependencies
async function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    const content = await fs.readFile(envPath, 'utf-8');
    for (const line of content.split('\n')) {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
        process.env[key] = value;
      }
    }
  } catch (e) {
    console.warn("Could not load .env file", e);
  }
}

function serializeSafe(data) {
  // Prevent script injection and XSS by escaping HTML tags in JSON
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

async function fetchRoutes() {
  await loadEnv();
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const routes = [
    '/',
    '/collections',
    '/about',
    '/customer-care',
    '/privacy-policy',
    '/terms-of-service',
    '/shipping-policy',
    '/returns-policy',
    '/lookbook',
    '/journal',
    '/campaigns/quiet-wedding'
  ];

  // Journal detail pages are static local files in this project, we can read them from src/data
  try {
    const jContent = await fs.readFile(path.resolve(__dirname, '../src/data/journalArticles.ts'), 'utf-8');
    const slugMatches = jContent.match(/slug:\s*["']([^"']+)["']/g);
    if (slugMatches) {
      for (const m of slugMatches) {
        const slug = m.match(/["']([^"']+)["']/)[1];
        routes.push(`/journal/${slug}`);
      }
    }
  } catch(e) {
    console.warn("Could not parse journal articles", e);
  }

  // Try to fetch dynamic routes from Supabase (optional - graceful degradation)
  if (supabaseUrl && supabaseKey) {
    const headers = {
      'apikey': supabaseKey,
      'Authorization': `Bearer ${supabaseKey}`
    };

    console.log("Fetching dynamic routes from Supabase...");

    // Fetch active products with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const pRes = await fetch(`${supabaseUrl}/rest/v1/products?select=id&status=eq.published`, { 
        headers,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (pRes.ok) {
        const products = await pRes.json();
        for (const p of products) {
          routes.push(`/product/${p.id}`);
        }
        console.log(`Found ${products.length} published products`);
      } else {
        console.warn(`Failed to fetch products: ${pRes.statusText}, using static routes only`);
      }
    } catch (e) {
      console.warn(`Product fetch failed (timeout or network): ${e.message}, using static routes only`);
    }

    // Fetch collections with timeout
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      const cRes = await fetch(`${supabaseUrl}/rest/v1/collections?select=slug`, { 
        headers,
        signal: controller.signal 
      });
      clearTimeout(timeoutId);
      
      if (cRes.ok) {
        const collections = await cRes.json();
        for (const c of collections) {
          routes.push(`/collections/${c.slug}`);
        }
        console.log(`Found ${collections.length} collections`);
      } else {
        console.warn(`Failed to fetch collections: ${cRes.statusText}, using static routes only`);
      }
    } catch (e) {
      console.warn(`Collection fetch failed (timeout or network): ${e.message}, using static routes only`);
    }
  } else {
    console.warn("Supabase credentials not found, using static routes only");
  }

  return routes;
}

async function run() {
  const routes = await fetchRoutes();
  console.log(`Discovered ${routes.length} routes to prerender.`);

  const browser = await chromium.launch();
  const context = await browser.newContext();

  // Route interception to serve files directly from dist without an HTTP server
  await context.route('**/*', async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    
    if (url.hostname === 'localhost') {
      // It's a local asset request
      let reqPath = url.pathname;
      if (reqPath.endsWith('/')) {
        reqPath = reqPath.slice(0, -1);
      }
      
      let filePath = path.join(distDir, reqPath);
      let fileStat;
      try {
        fileStat = await fs.stat(filePath);
      } catch (e) {
        // file doesn't exist
      }

      if (fileStat && fileStat.isFile()) {
        return route.fulfill({ path: filePath });
      } else {
        // Fallback to index.html for SPA routing
        return route.fulfill({ path: path.join(distDir, 'index.html') });
      }
    }
    
    return route.continue();
  });

  const page = await context.newPage();

  // Log console messages from the page for debugging
  page.on('console', msg => {
    console.log(`[PAGE CONSOLE] ${msg.type()}: ${msg.text()}`);
  });
  page.on('pageerror', error => {
    console.error(`[PAGE ERROR] ${error.message}`);
  });

  let hasError = false;
  const failedRoutes = [];

  for (const route of routes) {
    console.log(`Prerendering ${route}...`);
    try {
      await page.goto(`http://localhost:8080${route}`, { waitUntil: 'domcontentloaded' });
      
      // Wait for the explicit deterministic signal from our React hook
      await page.waitForFunction(() => window.__PRERENDER_STATUS === "ready", undefined, { timeout: 15000 });

      // Extract React Query State safely
      const rqState = await page.evaluate(() => {
        if (window.ReactQueryDehydrate && window.__QUERY_CLIENT__) {
          return window.ReactQueryDehydrate(window.__QUERY_CLIENT__);
        }
        return null;
      });

      // Extract HTML
      let html = await page.content();

      // Inject React Query State
      if (rqState) {
        const safeState = serializeSafe(rqState);
        const scriptTag = `<script>window.__REACT_QUERY_STATE__ = ${safeState};</script>`;
        html = html.replace('</body>', `${scriptTag}\n</body>`);
      }

      // Save HTML
      const outDir = route === '/' ? distDir : path.join(distDir, route);
      await fs.mkdir(outDir, { recursive: true });
      await fs.writeFile(path.join(outDir, 'index.html'), html, 'utf-8');
      
      console.log(`[OK] ${route}`);
    } catch (e) {
      console.error(`[FAIL] ${route}: ${e.message}`);
      failedRoutes.push({ route, error: e.message });
      // Continue with other routes instead of breaking
    }
  }

  await browser.close();

  if (failedRoutes.length > 0) {
    console.warn(`Prerendering completed with ${failedRoutes.length} failures (build continues):`);
    for (const f of failedRoutes) {
      console.warn(`  - ${f.route}: ${f.error}`);
    }
  } else {
    console.log("Prerendering completed successfully.");
  }
}

run().catch(e => {
  console.error("Prerendering failed:", e);
  process.exit(1);
});
