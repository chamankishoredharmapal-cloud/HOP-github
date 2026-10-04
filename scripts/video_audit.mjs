// HOP Video Performance Certification Script
// Tests video startup, buffering, range requests, seek behavior
import { chromium } from 'playwright';

const BASE = 'https://houseofpadmavati.pages.dev';
const SUPABASE_STORAGE = 'https://kbvjmcnaaogkbnerjcoc.supabase.co/storage/v1/object/public';

async function testVideoPlayback(page, url, label, viewportLabel) {
  console.log(`\n=== VIDEO TEST: ${label} @ ${viewportLabel} ===`);

  // Navigate and find video elements
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  const videoInfo = await page.evaluate(() => {
    const videos = document.querySelectorAll('video');
    return Array.from(videos).map((v, i) => ({
      index: i,
      src: v.src || v.querySelector('source')?.src || 'none',
      poster: v.poster || 'none',
      autoplay: v.autoplay,
      muted: v.muted,
      loop: v.loop,
      playsInline: v.playsInline,
      preload: v.preload,
      width: v.videoWidth,
      height: v.videoHeight,
      duration: v.duration,
      currentTime: v.currentTime,
      readyState: v.readyState,
      networkState: v.networkState,
      paused: v.paused,
      error: v.error ? { code: v.error.code, message: v.error.message } : null,
      bufferedRanges: v.buffered.length > 0
        ? Array.from({ length: v.buffered.length }, (_, j) => ({
            start: v.buffered.start(j),
            end: v.buffered.end(j),
          }))
        : [],
      displayWidth: v.clientWidth,
      displayHeight: v.clientHeight,
    }));
  });

  if (videoInfo.length === 0) {
    console.log('  No video elements found on page.');
    return { label, viewportLabel, url, videos: [] };
  }

  console.log(`  Found ${videoInfo.length} video element(s)`);

  for (const v of videoInfo) {
    console.log(`  Video[${v.index}]:`);
    console.log(`    src: ${v.src}`);
    console.log(`    poster: ${v.poster}`);
    console.log(`    autoplay: ${v.autoplay}, muted: ${v.muted}, loop: ${v.loop}`);
    console.log(`    preload: ${v.preload}, playsInline: ${v.playsInline}`);
    console.log(`    resolution: ${v.width}x${v.height}`);
    console.log(`    display: ${v.displayWidth}x${v.displayHeight}`);
    console.log(`    duration: ${v.duration}s`);
    console.log(`    readyState: ${v.readyState}, networkState: ${v.networkState}`);
    console.log(`    paused: ${v.paused}`);
    console.log(`    error: ${JSON.stringify(v.error)}`);
    console.log(`    buffered: ${JSON.stringify(v.bufferedRanges)}`);
  }

  // Monitor video playback for 10 seconds
  const playbackResult = await page.evaluate(() => {
    return new Promise(resolve => {
      const videos = document.querySelectorAll('video');
      if (videos.length === 0) return resolve([]);

      const results = [];
      const startTime = performance.now();

      for (const video of videos) {
        const events = {
          waiting: 0,
          stalled: 0,
          error: 0,
          playing: 0,
          canplay: 0,
          loadeddata: 0,
          loadedmetadata: 0,
          timeupdate: 0,
          suspend: 0,
          firstFrameTime: null,
          playbackStartTime: null,
        };

        const handlers = {};
        for (const evt of ['waiting', 'stalled', 'error', 'playing', 'canplay', 'loadeddata', 'loadedmetadata', 'timeupdate', 'suspend']) {
          handlers[evt] = () => {
            events[evt]++;
            if (evt === 'playing' && !events.playbackStartTime) {
              events.playbackStartTime = performance.now() - startTime;
            }
            if (evt === 'loadeddata' && !events.firstFrameTime) {
              events.firstFrameTime = performance.now() - startTime;
            }
          };
          video.addEventListener(evt, handlers[evt]);
        }

        // Try to play
        video.play().catch(() => {});

        results.push({ events, handlers, video, src: video.src || video.querySelector('source')?.src || '' });
      }

      setTimeout(() => {
        const final = results.map(r => ({
          src: r.src,
          events: r.events,
          currentTime: r.video.currentTime,
          duration: r.video.duration,
          paused: r.video.paused,
          readyState: r.video.readyState,
          buffered: r.video.buffered.length > 0
            ? Array.from({ length: r.video.buffered.length }, (_, j) => ({
                start: r.video.buffered.start(j),
                end: r.video.buffered.end(j),
              }))
            : [],
        }));
        resolve(final);
      }, 10000);
    });
  });

  console.log('\n  Playback after 10s:');
  for (const r of playbackResult) {
    console.log(`    src: ${r.src}`);
    console.log(`    currentTime: ${r.currentTime?.toFixed(2)}s / ${r.duration?.toFixed(2)}s`);
    console.log(`    paused: ${r.paused}, readyState: ${r.readyState}`);
    console.log(`    events: waiting=${r.events.waiting} stalled=${r.events.stalled} error=${r.events.error} playing=${r.events.playing}`);
    console.log(`    firstFrame: ${r.events.firstFrameTime ? r.events.firstFrameTime.toFixed(0) + 'ms' : 'N/A'}`);
    console.log(`    playbackStart: ${r.events.playbackStartTime ? r.events.playbackStartTime.toFixed(0) + 'ms' : 'N/A'}`);
    console.log(`    buffered: ${JSON.stringify(r.buffered)}`);
  }

  return { label, viewportLabel, url, videos: videoInfo, playback: playbackResult };
}

async function testSupabaseLatency() {
  console.log('\n\n=== SUPABASE API LATENCY TEST ===');
  const https = await import('https');

  const endpoints = [
    { label: 'get_public_store_settings', url: 'https://kbvjmcnaaogkbnerjcoc.supabase.co/rest/v1/rpc/get_public_store_settings' },
    { label: 'products', url: 'https://kbvjmcnaaogkbnerjcoc.supabase.co/rest/v1/products?select=*' },
    { label: 'collections', url: 'https://kbvjmcnaaogkbnerjcoc.supabase.co/rest/v1/collections?select=*' },
    { label: 'journal_articles (published)', url: 'https://kbvjmcnaaogkbnerjcoc.supabase.co/rest/v1/journal_articles?select=*&status=eq.published' },
  ];

  for (const ep of endpoints) {
    const times = [];
    for (let i = 0; i < 3; i++) {
      const start = performance.now();
      try {
        const response = await fetch(ep.url, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidmptY25hYW9na2JuZXJqY29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjcwNjgsImV4cCI6MjA2NzY0MzA2OH0.XnvFwGLqP6G8F_cZGSA1yCDVjmel-0KJhO-gBQG2z5A',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtidmptY25hYW9na2JuZXJqY29jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjcwNjgsImV4cCI6MjA2NzY0MzA2OH0.XnvFwGLqP6G8F_cZGSA1yCDVjmel-0KJhO-gBQG2z5A',
          },
        });
        const elapsed = performance.now() - start;
        const body = await response.text();
        times.push({ elapsed: Math.round(elapsed), status: response.status, bytes: body.length });
      } catch (err) {
        times.push({ elapsed: Math.round(performance.now() - start), error: err.message });
      }
    }
    console.log(`  ${ep.label}:`);
    times.forEach((t, i) => {
      console.log(`    Run ${i + 1}: ${t.elapsed}ms, status: ${t.status}, body: ${t.bytes} bytes`);
    });
  }
}

async function main() {
  const browser = await chromium.launch({ headless: true });

  // Video pages to test
  const videoPages = [
    { url: `${BASE}/`, label: 'Homepage Hero' },
    { url: `${BASE}/collections/kalyani`, label: 'Collection Kalyani' },
    { url: `${BASE}/collections/viara`, label: 'Collection Viara' },
    { url: `${BASE}/collections/arya`, label: 'Collection Arya' },
    { url: `${BASE}/collections/padma`, label: 'Collection Padma' },
    { url: `${BASE}/collections/yugen`, label: 'Collection Yugen' },
    { url: `${BASE}/lookbook`, label: 'Lookbook' },
    { url: `${BASE}/about`, label: 'About/The House' },
  ];

  const viewports = [
    { width: 390, height: 844, label: 'Mobile-390' },
    { width: 1440, height: 900, label: 'Desktop-1440' },
  ];

  const allResults = [];

  for (const vp of viewports) {
    for (const vPage of videoPages) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
        userAgent: vp.width <= 430
          ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15'
          : undefined,
      });
      const page = await ctx.newPage();
      try {
        const result = await testVideoPlayback(page, vPage.url, vPage.label, vp.label);
        allResults.push(result);
      } catch (err) {
        console.log(`  ERROR: ${err.message}`);
      }
      await ctx.close();
    }
  }

  // Test Supabase latency
  await testSupabaseLatency();

  // Write results
  const fs = await import('fs');
  fs.writeFileSync('video_audit_results.json', JSON.stringify(allResults, null, 2));
  console.log('\nVideo results written to video_audit_results.json');

  await browser.close();
}

main().catch(console.error);
