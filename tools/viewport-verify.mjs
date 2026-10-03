// Mobile-first remediation — viewport verification (Chromium, production build).
// Serves ./dist with an inline static server (SPA fallback) and checks every
// priority viewport for horizontal overflow + captures evidence screenshots.
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const OUT = path.join(ROOT, process.argv[2] || "docs/audit-evidence");

const MIME = {
  ".html": "text/html",
  ".js": "text/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
};

function serve(req, res) {
  const urlPath = decodeURIComponent(req.url.split("?")[0]);
  let file = path.join(DIST, urlPath);
  if (urlPath.endsWith("/")) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    // SPA fallback for client routes (/cart, /collections/..., ...)
    if (!path.extname(file)) {
      res.writeHead(200, { "content-type": "text/html" });
      res.end(fs.readFileSync(path.join(DIST, "index.html")));
      return;
    }
    res.writeHead(404);
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(serve);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const port = server.address().port;
const BASE = `http://127.0.0.1:${port}`;
console.log(`serving ${DIST} at ${BASE}`);

const VIEWPORTS = [
  { name: "320x568", width: 320, height: 568 },
  { name: "360x800", width: 360, height: 800 },
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "430x932", width: 430, height: 932 },
  { name: "768x1024", width: 768, height: 1024 },
  { name: "1024x768", width: 1024, height: 768 },
  { name: "1440x900", width: 1440, height: 900 },
];

const ROUTES = ["/", "/collections", "/cart", "/journal", "/customer-care", "/account/login"];

const browser = await chromium.launch();
const results = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
  const page = await context.newPage();
  for (const route of ROUTES) {
    const url = BASE + route;
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
      await page.waitForTimeout(2500);
      const overflow = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        offenders: Array.from(document.querySelectorAll("body *"))
          .filter((el) => {
            const r = el.getBoundingClientRect();
            return r.width > window.innerWidth + 1 && r.width < 5000;
          })
          .slice(0, 5)
          .map((el) => `${el.tagName.toLowerCase()}.${String(el.className?.baseVal ?? el.className ?? "").split(" ").slice(0, 3).join(".")}`),
      }));
      const ok = overflow.scrollWidth <= overflow.innerWidth + 1;
      results.push({ viewport: vp.name, route, ok, ...overflow });
      const dir = path.join(OUT, vp.name);
      fs.mkdirSync(dir, { recursive: true });
      const shot = path.join(dir, `${route === "/" ? "home" : route.replaceAll("/", "_")}.png`);
      await page.screenshot({ path: shot });
      console.log(`${ok ? "PASS" : "FAIL"} ${vp.name} ${route} scrollWidth=${overflow.scrollWidth} innerWidth=${overflow.innerWidth} offenders=${overflow.offenders.join("|")}`);
    } catch (e) {
      results.push({ viewport: vp.name, route, ok: false, error: String(e).split("\n")[0] });
      console.log(`ERROR ${vp.name} ${route} ${String(e).split("\n")[0]}`);
    }
  }
  await context.close();
}
await browser.close();
server.close();

const fails = results.filter((r) => !r.ok);
console.log(`\nTOTAL=${results.length} PASS=${results.length - fails.length} FAIL=${fails.length}`);
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, "viewport-results.json"), JSON.stringify(results, null, 2));
process.exit(fails.length > 0 ? 1 : 0);
