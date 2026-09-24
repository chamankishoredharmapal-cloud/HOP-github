import { chromium } from "playwright";

const baseUrl = process.env.HOP_BASE_URL ?? "https://hop-staging.pages.dev";
const routes = ["/", "/collections/", "/cart", "/checkout"];
const browser = await chromium.launch();

try {
  for (const route of routes) {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on("pageerror", (error) => pageErrors.push(error.message));

    try {
      const response = await page.goto(new URL(route, baseUrl).toString(), {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      if (!response || !response.ok()) {
        throw new Error(`HTTP ${response?.status() ?? "unknown"}`);
      }

      await page.waitForFunction(() => (document.querySelector("#root")?.childElementCount ?? 0) > 0, undefined, {
        timeout: 15000,
      });

      const result = await page.evaluate(() => ({
        title: document.title,
        rootChildren: document.querySelector("#root")?.childElementCount ?? 0,
        hasSourceEntry: [...document.scripts].some((script) => script.src.includes("/src/")),
        hasBuiltEntry: [...document.scripts].some((script) => script.src.includes("/assets/")),
      }));

      if (result.rootChildren === 0) throw new Error("React root is empty");
      if (result.hasSourceEntry) throw new Error("Source entry is still referenced");
      if (!result.hasBuiltEntry) throw new Error("Built JavaScript entry is missing");
      if (pageErrors.some((message) => message.includes("#418") || message.includes("#423"))) {
        throw new Error(`Hydration error: ${pageErrors.join("; ")}`);
      }

      console.log(`${route} OK`, result);
    } finally {
      await page.close();
    }
  }
} finally {
  await browser.close();
}
