import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/__tests__",
  timeout: 30000,
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: "line",
  webServer: {
    command: "npm run dev",
    url: "http://localhost:8080",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
  },
  use: {
    browserName: "chromium",
    headless: true,
    baseURL: "http://localhost:8080",
    viewport: { width: 1440, height: 900 },
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
});
