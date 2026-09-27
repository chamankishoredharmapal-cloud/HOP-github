import { test, expect } from "@playwright/test";

test.describe("HOP Studio — Security & Access Boundaries", () => {
  test("unauthenticated visitor navigating to /studio is redirected to /studio/login", async ({ page }) => {
    await page.goto("/studio");
    await expect(page).toHaveURL(/\/studio\/login/);
    await expect(page.locator("text=Studio Login")).toBeVisible();
  });

  test("unauthenticated visitor navigating to /studio/collections is redirected to /studio/login", async ({ page }) => {
    await page.goto("/studio/collections");
    await expect(page).toHaveURL(/\/studio\/login/);
  });

  test("unauthenticated visitor navigating to /studio/media is redirected to /studio/login", async ({ page }) => {
    await page.goto("/studio/media");
    await expect(page).toHaveURL(/\/studio\/login/);
  });

  test("unauthenticated visitor navigating to /studio/activity is redirected to /studio/login", async ({ page }) => {
    await page.goto("/studio/activity");
    await expect(page).toHaveURL(/\/studio\/login/);
  });

  test("studio login surface strictly contains no public registration or signup elements", async ({ page }) => {
    await page.goto("/studio/login");
    // Verify no "Sign up", "Create account", or "Register" buttons/links exist
    const signupLinks = page.locator("a, button", { hasText: /sign up|create account|register/i });
    await expect(signupLinks).toHaveCount(0);
    // Verify login inputs
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

test.describe("HOP Storefront — Collection Film Dynamic Integration", () => {
  test("homepage renders collection film chapters with dynamic media links", async ({ page }) => {
    await page.goto("/");
    // Check threshold hero
    const threshold = page.locator(".hop-threshold");
    await expect(threshold).toBeVisible();

    // Check collection films section
    const collectionsSection = page.locator("#collections");
    await expect(collectionsSection).toBeVisible();

    // Check Kalyani chapter link exists and points to /collections/kalyani
    const kalyaniLink = page.locator('a[href="/collections/kalyani"]').first();
    await expect(kalyaniLink).toBeVisible();

    // Navigate to Kalyani collection
    await kalyaniLink.click();
    await expect(page).toHaveURL(/\/collections\/kalyani/);

    // Verify collection detail page loads with film/poster container
    const heroMedia = page.locator(".hop-page .aspect-\\[2\\/1\\]").first();
    await expect(heroMedia).toBeVisible();
  });

  test("collections directory (/collections) displays collection film chapters", async ({ page }) => {
    await page.goto("/");
    const collectionsLink = page.locator('a[href="/collections"]').first();
    await expect(collectionsLink).toBeVisible();
    await collectionsLink.click();
    await expect(page).toHaveURL(/\/collections/);
    await expect(page.locator("h1")).toBeVisible({ timeout: 10000 });
    await expect(page.locator('a[href="/collections/kalyani"]').first()).toBeVisible({ timeout: 10000 });
  });
});
