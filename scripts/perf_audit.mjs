// HOP Production Performance Audit Script
// Measures Core Web Vitals, navigation timing, resource breakdown, and video behavior
import { chromium } from 'playwright';

const BASE = 'https://houseofpadmavati.pages.dev';

const ROUTES = [
  '/',
  '/collections',
  '/collections/kalyani',
  '/collections/viara',
  '/collections/arya',
  '/collections/padma',
  '/collections/yugen',
  '/journal',
  '/journal/how-morning-light-reads-a-weave',
  '/cart',
  '/customer-care',
  '/about',
];

const VIEWPORTS = [
  { width: 375, height: 667, label: 'Mobile-375' },
  { width: 390, height: 844, label: 'Mobile-390' },
  { width: 1440, height: 900, label: 'Desktop-1440' },
  { width: 1920, height: 1080, label: 'Desktop-1920' },
];

async function measureRoute(page, url, viewportLabel) {
  const consoleErrors = [];
  const failedRequests = [];
  const allRequests = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('requestfailed', req => {
    failedRequests.push({ url: req.url(), failure: req.failure()?.errorText });
  });
  page.on('request', req => {
    allRequests.push(req.url());
  });

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  // Collect performance metrics via CDP
  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const resources = performance.getEntriesByType('resource');
    const paint = performance.getEntriesByType('paint');

    const fcp = paint.find(e => e.name === 'first-contentful-paint');

    // Resource breakdown
    let jsBytes = 0, cssBytes = 0, imgBytes = 0, videoBytes = 0, fontBytes = 0, apiBytes = 0, otherBytes = 0;
    let jsCount = 0, cssCount = 0, imgCount = 0, videoCount = 0, fontCount = 0, apiCount = 0;

    for (const r of resources) {
      const size = r.transferSize || r.encodedBodySize || 0;
      if (r.initiatorType === 'script' || r.name.match(/\.js(\?|$)/)) { jsBytes += size; jsCount++; }
      else if (r.initiatorType === 'css' || r.name.match(/\.css(\?|$)/)) { cssBytes += size; cssCount++; }
      else if (r.initiatorType === 'img' || r.name.match(/\.(jpg|jpeg|png|webp|avif|svg|gif)(\?|$)/i)) { imgBytes += size; imgCount++; }
      else if (r.name.match(/\.(mp4|webm|m4v)(\?|$)/i) || r.initiatorType === 'video') { videoBytes += size; videoCount++; }
      else if (r.name.match(/\.(woff2?|ttf|otf|eot)(\?|$)/i)) { fontBytes += size; fontCount++; }
      else if (r.name.includes('supabase.co') || r.name.includes('/rest/') || r.name.includes('/rpc/')) { apiBytes += size; apiCount++; }
      else { otherBytes += size; }
    }

    const totalTransferred = resources.reduce((s, r) => s + (r.transferSize || r.encodedBodySize || 0), 0)
      + (nav ? (nav.transferSize || 0) : 0);

    return {
      timing: {
        ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
        domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
        loadEvent: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
        fcp: fcp ? Math.round(fcp.startTime) : null,
        htmlTransferSize: nav ? nav.transferSize : null,
      },
      resources: {
        totalCount: resources.length,
        totalTransferred,
        js: { bytes: jsBytes, count: jsCount },
        css: { bytes: cssBytes, count: cssCount },
        images: { bytes: imgBytes, count: imgCount },
        video: { bytes: videoBytes, count: videoCount },
        fonts: { bytes: fontBytes, count: fontCount },
        api: { bytes: apiBytes, count: apiCount },
        other: otherBytes,
      },
    };
  });

  // Get LCP
  const lcp = await page.evaluate(() => {
    return new Promise(resolve => {
      new PerformanceObserver(list => {
        const entries = list.getEntries();
        const last = entries[entries.length - 1];
        resolve({
          startTime: Math.round(last.startTime),
          element: last.element ? last.element.tagName + (last.element.id ? '#' + last.element.id : '') + (last.element.className ? '.' + last.element.className.split(' ')[0] : '') : 'unknown',
          url: last.url || null,
          size: last.size,
        });
      }).observe({ type: 'largest-contentful-paint', buffered: true });
      // Give a moment for buffered entries
      setTimeout(() => resolve(null), 500);
    });
  });

  // Get CLS
  const cls = await page.evaluate(() => {
    return new Promise(resolve => {
      let clsValue = 0;
      const shifts = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            shifts.push({
              value: entry.value,
              sources: entry.sources?.map(s => s.node?.tagName || 'unknown') || [],
            });
          }
        }
      }).observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => resolve({ value: Math.round(clsValue * 10000) / 10000, shifts }), 500);
    });
  });

  // Get Long Tasks
  const longTasks = await page.evaluate(() => {
    return new Promise(resolve => {
      const tasks = [];
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          tasks.push({ duration: Math.round(entry.duration), startTime: Math.round(entry.startTime) });
        }
      }).observe({ type: 'longtask', buffered: true });
      setTimeout(() => resolve(tasks), 500);
    });
  });

  return {
    url,
    viewportLabel,
    metrics,
    lcp,
    cls,
    longTasks,
    consoleErrors: consoleErrors.length,
    failedRequests: failedRequests.map(f => f.url),
    totalRequests: allRequests.length,
  };
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  // Test key routes at key viewports
  const testCases = [];
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      testCases.push({ route, vp });
    }
  }

  console.log(`Running ${testCases.length} performance measurements...`);
  console.log('');

  for (const { route, vp } of testCases) {
    const ctx = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      userAgent: vp.width <= 430
        ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1'
        : undefined,
    });
    const page = await ctx.newPage();

    try {
      const result = await measureRoute(page, `${BASE}${route}`, vp.label);
      results.push(result);
      const t = result.metrics.timing;
      console.log(`[${vp.label}] ${route} — TTFB:${t.ttfb}ms FCP:${t.fcp}ms LCP:${result.lcp?.startTime || '?'}ms CLS:${result.cls?.value || 0} Load:${t.loadEvent}ms Transfer:${Math.round(result.metrics.resources.totalTransferred/1024)}KB Reqs:${result.totalRequests} Errors:${result.consoleErrors} Failed:${result.failedRequests.length}`);
    } catch (err) {
      console.log(`[${vp.label}] ${route} — ERROR: ${err.message}`);
      results.push({ url: `${BASE}${route}`, viewportLabel: vp.label, error: err.message });
    }

    await ctx.close();
  }

  // Write JSON results
  const fs = await import('fs');
  fs.writeFileSync('perf_audit_results.json', JSON.stringify(results, null, 2));
  console.log('\nResults written to perf_audit_results.json');

  await browser.close();
}

main().catch(console.error);
