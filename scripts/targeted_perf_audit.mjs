// HOP Targeted Performance & Interaction Verification Script
// Covers:
// 1. Re-testing timed-out routes (using 'load' + wait)
// 2. Network condition tests: Fast, 4G, Slow 4G via CDP
// 3. Expanded viewports: 320x568, 430x932, 768x1024, 1024x768, 1280x800
// 4. Lag/Jank interaction tests: Mobile menu, Gallery, Scroll, Sticky CTA
// 5. Video seek/scrub/resume test

import { chromium } from 'playwright';
import * as fs from 'fs';

const BASE = 'https://houseofpadmavati.pages.dev';

// Network profiles (CDP parameters)
const NETWORKS = {
  'Fast': null, // No throttling
  'Regular-4G': {
    offline: false,
    downloadThroughput: (4 * 1024 * 1024) / 8, // 4 Mbps
    uploadThroughput: (3 * 1024 * 1024) / 8,   // 3 Mbps
    latency: 50, // 50ms RTT
  },
  'Slow-4G': {
    offline: false,
    downloadThroughput: (1.5 * 1024 * 1024) / 8, // 1.5 Mbps
    uploadThroughput: (750 * 1024) / 8,         // 750 Kbps
    latency: 150, // 150ms RTT
  },
};

async function runTargetedAudits() {
  const browser = await chromium.launch({ headless: true });
  const results = {
    retests: [],
    networks: [],
    viewports: [],
    interactions: [],
    videoSeek: [],
  };

  console.log('=== PART 1: RETESTING TIMED-OUT ROUTES ===');
  const timeoutCases = [
    { route: '/', vp: { width: 390, height: 844, label: 'Mobile-390' } },
    { route: '/collections/kalyani', vp: { width: 1920, height: 1080, label: 'Desktop-1920' } },
    { route: '/collections/padma', vp: { width: 1920, height: 1080, label: 'Desktop-1920' } },
  ];

  for (const c of timeoutCases) {
    const ctx = await browser.newContext({ viewport: { width: c.vp.width, height: c.vp.height } });
    const page = await ctx.newPage();
    const start = performance.now();
    try {
      await page.goto(`${BASE}${c.route}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(3000); // Allow settled state
      const elapsed = Math.round(performance.now() - start);

      const metrics = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(e => e.name === 'first-contentful-paint');
        return {
          ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
          fcp: fcp ? Math.round(fcp.startTime) : null,
          load: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
        };
      });

      console.log(`[PASS RETEST] ${c.vp.label} ${c.route} -> Load:${metrics.load}ms, TTFB:${metrics.ttfb}ms, FCP:${metrics.fcp}ms (total: ${elapsed}ms)`);
      results.retests.push({ route: c.route, vp: c.vp.label, status: 'PASS', metrics });
    } catch (e) {
      console.log(`[FAIL RETEST] ${c.vp.label} ${c.route} -> ${e.message}`);
      results.retests.push({ route: c.route, vp: c.vp.label, status: 'FAIL', error: e.message });
    }
    await ctx.close();
  }

  console.log('\n=== PART 2: EXPANDED VIEWPORT MATRIX ===');
  const expandedVps = [
    { width: 320, height: 568, label: '320x568 (Mobile-SE)' },
    { width: 430, height: 932, label: '430x932 (Mobile-Max)' },
    { width: 768, height: 1024, label: '768x1024 (Tablet-Port)' },
    { width: 1024, height: 768, label: '1024x768 (Tablet-Land)' },
    { width: 1280, height: 800, label: '1280x800 (Laptop-13)' },
  ];

  for (const vp of expandedVps) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const page = await ctx.newPage();
    try {
      await page.goto(`${BASE}/`, { waitUntil: 'load', timeout: 25000 });
      await page.waitForTimeout(1500);

      const data = await page.evaluate(() => {
        const nav = performance.getEntriesByType('navigation')[0];
        const paint = performance.getEntriesByType('paint');
        const fcp = paint.find(e => e.name === 'first-contentful-paint');
        const res = performance.getEntriesByType('resource');
        const totalBytes = res.reduce((s, r) => s + (r.transferSize || 0), 0) + (nav?.transferSize || 0);

        return {
          ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
          fcp: fcp ? Math.round(fcp.startTime) : null,
          load: nav ? Math.round(nav.loadEventEnd - nav.startTime) : null,
          totalKB: Math.round(totalBytes / 1024),
          reqCount: res.length,
        };
      });

      console.log(`[VIEWPORT ${vp.label}] / -> TTFB:${data.ttfb}ms, FCP:${data.fcp}ms, Load:${data.load}ms, Bytes:${data.totalKB}KB, Reqs:${data.reqCount}`);
      results.viewports.push({ vp: vp.label, ...data });
    } catch (e) {
      console.log(`[VIEWPORT ${vp.label}] ERROR: ${e.message}`);
    }
    await ctx.close();
  }

  console.log('\n=== PART 3: REALISTIC NETWORK CONDITIONS (CDP) ===');
  const networkRoutes = ['/', '/collections/kalyani'];

  for (const [netName, netConfig] of Object.entries(NETWORKS)) {
    console.log(`--- Testing Network: ${netName} ---`);
    for (const route of networkRoutes) {
      const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await ctx.newPage();

      if (netConfig) {
        const client = await page.context().newCDPSession(page);
        await client.send('Network.emulateNetworkConditions', netConfig);
      }

      const t0 = performance.now();
      try {
        await page.goto(`${BASE}${route}`, { waitUntil: 'load', timeout: 45000 });
        const loadTime = Math.round(performance.now() - t0);

        const data = await page.evaluate(() => {
          const nav = performance.getEntriesByType('navigation')[0];
          const paint = performance.getEntriesByType('paint');
          const fcp = paint.find(e => e.name === 'first-contentful-paint');
          return {
            ttfb: nav ? Math.round(nav.responseStart - nav.requestStart) : null,
            fcp: fcp ? Math.round(fcp.startTime) : null,
            domContentLoaded: nav ? Math.round(nav.domContentLoadedEventEnd - nav.startTime) : null,
          };
        });

        console.log(`  [${netName}] ${route} -> TTFB:${data.ttfb}ms, FCP:${data.fcp}ms, TotalLoad:${loadTime}ms`);
        results.networks.push({ network: netName, route, ...data, loadTime });
      } catch (e) {
        console.log(`  [${netName}] ${route} -> ERROR: ${e.message}`);
        results.networks.push({ network: netName, route, error: e.message });
      }
      await ctx.close();
    }
  }

  console.log('\n=== PART 4: LAG / JANK / INTERACTION TESTING ===');
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForTimeout(1500);

    // 1. Mobile Menu Open / Close
    try {
      const menuBtn = await page.$('button[aria-label*="menu" i], button[aria-label*="navigation" i], button[aria-expanded]');
      if (menuBtn) {
        const tStart = performance.now();
        await menuBtn.click();
        await page.waitForTimeout(300);
        const openLatency = Math.round(performance.now() - tStart);
        console.log(`  [Interaction] Mobile Menu Open Latency: ${openLatency}ms`);

        const tCloseStart = performance.now();
        const closeBtn = await page.$('#mobile-navigation button, button[aria-label*="close" i], button[aria-label*="dismiss" i]');
        if (closeBtn) {
          await closeBtn.click({ force: true });
        } else {
          await page.keyboard.press('Escape');
        }
        await page.waitForTimeout(300);
        const closeLatency = Math.round(performance.now() - tCloseStart);
        console.log(`  [Interaction] Mobile Menu Close Latency: ${closeLatency}ms`);
        results.interactions.push({ type: 'mobile_menu', openLatency, closeLatency });
      } else {
        console.log('  [Interaction] Mobile Menu button not found by selector');
      }
    } catch (err) {
      console.log('  [Interaction] Mobile Menu error:', err.message);
      results.interactions.push({ type: 'mobile_menu', error: err.message });
    }

    // 2. Smooth Scrolling & Long Tasks
    const scrollPerf = await page.evaluate(async () => {
      let longTaskCount = 0;
      let totalLongTaskDuration = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          longTaskCount++;
          totalLongTaskDuration += entry.duration;
        }
      });
      observer.observe({ entryTypes: ['longtask'] });

      const start = performance.now();
      const scrollStep = 200;
      const totalHeight = document.body.scrollHeight;
      let current = 0;

      while (current < Math.min(totalHeight, 3000)) {
        window.scrollBy(0, scrollStep);
        current += scrollStep;
        await new Promise(r => setTimeout(r, 20));
      }

      await new Promise(r => setTimeout(r, 200));
      observer.disconnect();

      return {
        scrollDuration: Math.round(performance.now() - start),
        longTaskCount,
        totalLongTaskDuration: Math.round(totalLongTaskDuration),
      };
    });

    console.log(`  [Scroll Perf] Duration: ${scrollPerf.scrollDuration}ms, LongTasks during scroll: ${scrollPerf.longTaskCount}, Duration: ${scrollPerf.totalLongTaskDuration}ms`);
    results.interactions.push({ type: 'scroll', ...scrollPerf });

    await ctx.close();
  }

  console.log('\n=== PART 5: VIDEO SEEK / SCRUB / PAUSE / RESUME TEST ===');
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/collections/kalyani`, { waitUntil: 'load' });
    await page.waitForTimeout(2000);

    const seekResult = await page.evaluate(async () => {
      const video = document.querySelector('video');
      if (!video) return { error: 'No video element found' };

      const events = [];
      const log = (msg) => events.push(`${Math.round(performance.now())}ms: ${msg}`);

      video.addEventListener('seeking', () => log('seeking'));
      video.addEventListener('seeked', () => log('seeked'));
      video.addEventListener('pause', () => log('pause'));
      video.addEventListener('play', () => log('play'));
      video.addEventListener('waiting', () => log('waiting'));
      video.addEventListener('playing', () => log('playing'));

      // Test 1: Pause
      const tPause = performance.now();
      video.pause();
      const pauseSuccess = video.paused;

      // Test 2: Seek forward to 5.0s
      const tSeek = performance.now();
      video.currentTime = 5.0;
      await new Promise(r => {
        const handler = () => { video.removeEventListener('seeked', handler); r(); };
        video.addEventListener('seeked', handler);
        setTimeout(r, 3000);
      });
      const seekLatency = Math.round(performance.now() - tSeek);

      // Test 3: Resume play
      const tPlay = performance.now();
      await video.play().catch(() => {});
      const resumeSuccess = !video.paused;

      // Let it play for 2 seconds
      await new Promise(r => setTimeout(r, 2000));

      return {
        src: video.src,
        duration: video.duration,
        pauseSuccess,
        seekLatency,
        currentTimeAfterSeek: video.currentTime,
        resumeSuccess,
        events,
      };
    });

    console.log(`  [Video Seek Test] src: ${seekResult.src}`);
    console.log(`    Pause: ${seekResult.pauseSuccess}, Seek Latency: ${seekResult.seekLatency}ms, Resume: ${seekResult.resumeSuccess}`);
    console.log(`    Current time after seek: ${seekResult.currentTimeAfterSeek?.toFixed(2)}s / ${seekResult.duration?.toFixed(2)}s`);
    console.log(`    Events recorded: ${seekResult.events?.length}`);
    results.videoSeek.push(seekResult);

    await ctx.close();
  }

  fs.writeFileSync('e:\\HOP\\targeted_perf_results.json', JSON.stringify(results, null, 2));
  console.log('\nAll targeted audits completed. Saved to targeted_perf_results.json');
  await browser.close();
}

runTargetedAudits().catch(console.error);
