// Production smoke + mobile verification for the mobile-first remediation.
// Target: https://houseofpadmavati.pages.dev (no transactions, no writes).
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE = process.env.HOP_PROD_URL || "https://houseofpadmavati.pages.dev";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "docs", "prod-smoke");
fs.mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1440x900", width: 1440, height: 900 },
];

const browser = await chromium.launch();
const summary = { base: BASE, routes: [], interactions: {}, consoleErrors: [], failedRequests: [] };

async function checkRoute(page, route) {
  const errors = [];
  const failed = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text().slice(0, 200)); });
  page.on("response", (r) => { if (r.status() >= 400) failed.push(`${r.status()} ${r.url().slice(0, 120)}`); });
  page.on("requestfailed", (r) => failed.push(`FAILED ${r.url().slice(0, 120)}`));
  const resp = await page.goto(BASE + route, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2500);
  const status = resp?.status() ?? -1;
  const overflow = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    innerWidth: window.innerWidth,
  }));
  const ok = status === 200 && overflow.scrollWidth <= overflow.innerWidth + 1;
  summary.routes.push({ route, status, ok, overflow, errors, failed });
  console.log(`${ok ? "PASS" : "FAIL"} ${route} status=${status} scroll=${overflow.scrollWidth}/${overflow.innerWidth} consoleErr=${errors.length} failedReq=${failed.length}`);
  for (const e of errors) { summary.consoleErrors.push({ route, e }); console.log(`  console: ${e}`); }
  for (const f of failed) { summary.failedRequests.push({ route, f }); console.log(`  net: ${f}`); }
  return { errors, failed };
}

// --- Per-viewport overflow sweep on core routes ---
for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await ctx.newPage();
  for (const route of ["/", "/collections", "/cart", "/journal", "/customer-care"]) {
    await checkRoute(page, `${route} @${vp.name}`);
  }
  await ctx.close();
}

// --- Interaction pass at 390x844 ---
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await ctx.newPage();
  const ix = {};
  page.on("console", (m) => { if (m.type() === "error") summary.consoleErrors.push({ route: "ix", e: m.text().slice(0, 200) }); });
  page.on("response", (r) => { if (r.status() >= 400) summary.failedRequests.push({ route: "ix", f: `${r.status()} ${r.url().slice(0, 120)}` }); });

  await page.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  // Mobile nav open/close
  await page.getByRole("button", { name: "Open menu" }).click();
  await page.waitForSelector("#mobile-navigation", { timeout: 10000 });
  ix.navOpen = true;
  await page.screenshot({ path: path.join(OUT, "390-nav-open.png") });
  await page.getByRole("button", { name: "Close menu" }).click();
  await page.waitForSelector("#mobile-navigation", { state: "detached", timeout: 10000 }).catch(() => {});
  ix.navClose = (await page.locator("#mobile-navigation").count()) === 0;

  // Room + PDP discovery
  await page.goto(BASE + "/collections/kalyani", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const productHref = await page.locator('a[href^="/product/"]').first().getAttribute("href").catch(() => null);
  ix.roomOk = true;
  if (productHref) {
    await page.goto(BASE + productHref, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(2000);
    ix.gallery = (await page.locator('[role="region"][aria-roledescription="carousel"]').count()) > 0;
    ix.counter = ((await page.getByText(/^\d+ \/ \d+$/).first().count().catch(() => 0)) ?? 0) > 0;
    const price = (await page.locator("main").getByText(/^₹ [\d,]+/).first().textContent().catch(() => null)) ?? "";
    ix.priceText = price.trim();
    ix.priceOk = /^₹ [\d,]+$/.test(price.trim());
    // Scroll to bottom: sticky bar should appear (inline CTA out of view)
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1200);
    const stickyVisible = await page.evaluate(() => {
      const el = document.querySelector('[aria-label="Add this drape to your bag"]');
      if (!el) return "missing";
      const r = el.getBoundingClientRect();
      return r.top < window.innerHeight && r.bottom > 0 ? "visible" : "parked";
    });
    ix.stickyCta = stickyVisible;
    await page.screenshot({ path: path.join(OUT, "390-pdp-bottom.png") });
  }

  // Journal article
  await page.goto(BASE + "/journal", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  const artHref = await page.locator('a[href^="/journal/"]').first().getAttribute("href").catch(() => null);
  if (artHref && artHref !== "/journal") {
    await page.goto(BASE + artHref, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(1500);
    ix.article = (await page.locator("main h1").count()) > 0;
  } else { ix.article = "no-articles"; }

  // Customer-care form usability
  await page.goto(BASE + "/customer-care", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(1500);
  ix.careLabels = (await page.locator('label[for="care-first-name"], label[for="care-email"], label[for="care-message"]').count());
  const inputSize = await page.evaluate(() => {
    const el = document.querySelector("#care-first-name");
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { h: Math.round(r.height), font: getComputedStyle(el).fontSize };
  });
  ix.careInput = inputSize;

  // Checkout usability (expect auth redirect → login form)
  await page.goto(BASE + "/checkout", { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.waitForTimeout(2000);
  ix.checkoutUrl = page.url();
  ix.loginForm = (await page.locator('input[type="email"], input[type="password"]').count()) >= 1;

  // Desktop regression screenshot
  await ctx.close();
  const dctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const dpage = await dctx.newPage();
  await dpage.goto(BASE + "/", { waitUntil: "domcontentloaded", timeout: 60000 });
  await dpage.waitForTimeout(2500);
  await dpage.screenshot({ path: path.join(OUT, "1440-home.png") });
  const dOverflow = await dpage.evaluate(() => ({ sw: document.documentElement.scrollWidth, iw: window.innerWidth }));
  ix.desktopOverflow = dOverflow;
  await dctx.close();

  summary.interactions = ix;
  console.log("\nINTERACTIONS:", JSON.stringify(ix, null, 2));
}

await browser.close();
fs.writeFileSync(path.join(OUT, "prod-smoke.json"), JSON.stringify(summary, null, 2));
const routeFails = summary.routes.filter((r) => !r.ok);
console.log(`\nROUTES=${summary.routes.length} PASS=${summary.routes.length - routeFails.length} FAIL=${routeFails.length}`);
console.log(`CONSOLE ERRORS=${summary.consoleErrors.length} FAILED REQ=${summary.failedRequests.length}`);
process.exit(routeFails.length > 0 ? 1 : 0);
