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
    baseURL: "http://localhost:8080",
    ignoreHTTPSErrors: true,
    launchOptions: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { 
        browserName: 'chromium',
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'firefox',
      use: { 
        browserName: 'firefox',
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'webkit',
      use: { 
        browserName: 'webkit',
        viewport: { width: 1440, height: 900 }
      },
    },
    {
      name: 'Mobile Chrome',
      use: {
        browserName: 'chromium',
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36',
        isMobile: true,
        hasTouch: true
      },
    },
    {
      name: 'Mobile Safari',
      use: {
        browserName: 'webkit',
        viewport: { width: 390, height: 844 },
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1',
        isMobile: true,
        hasTouch: true
      },
    }
  ],
});
