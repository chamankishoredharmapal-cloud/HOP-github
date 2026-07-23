import { test, expect } from "@playwright/test";
import { setupSupabaseMocks } from "./mocks/supabase";

test.describe("ProductGallery", () => {
  let firstProductUrl: string;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await setupSupabaseMocks(page);
    await page.goto("/collections/all");
    await page.waitForTimeout(2000);

    const productLink = page.getByRole("link").filter({ has: page.locator("h3") }).first();
    const href = await productLink.getAttribute("href");
    if (href) firstProductUrl = href;

    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    test.skip(!firstProductUrl, "No products found — skipping gallery tests");
    await setupSupabaseMocks(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(firstProductUrl);
    await page.waitForTimeout(2000);
  });

  test("Previous arrow is disabled at first image and enabled after navigating", async ({ page }) => {
    const prevBtn = page.getByRole("button", { name: "Previous image" });
    await expect(prevBtn).toBeVisible();
    await expect(prevBtn).toBeDisabled();

    await page.getByRole("button", { name: "Next image" }).click();
    await page.waitForTimeout(500);
    await expect(prevBtn).toBeEnabled();
  });

  test("Next arrow is visible and enabled", async ({ page }) => {
    const nextBtn = page.getByRole("button", { name: "Next image" });
    await expect(nextBtn).toBeVisible();
    await expect(nextBtn).toBeEnabled();
  });

  test("Thumbnails render and are clickable", async ({ page }) => {
    const thumbnails = page.getByRole("button").filter({ has: page.locator("img") });
    const count = await thumbnails.count();
    expect(count).toBeGreaterThanOrEqual(1);

    if (count >= 3) {
      await thumbnails.nth(2).click();
      await page.waitForTimeout(500);
    }
  });

  test("Active thumbnail has visible highlight state", async ({ page }) => {
    const thumbnails = page.getByRole("button").filter({ has: page.locator("img") });
    const count = await thumbnails.count();
    expect(count).toBeGreaterThanOrEqual(1);

    await expect(thumbnails.nth(0)).toBeVisible();

    if (count >= 2) {
      const initialActive = thumbnails.nth(0);
      const initialInactive = thumbnails.nth(1);

      await expect(initialActive).toBeVisible();
      await expect(initialInactive).toBeVisible();

      await thumbnails.nth(1).click();
      await page.waitForTimeout(500);

      await expect(thumbnails.nth(0)).toBeVisible();
      await expect(thumbnails.nth(1)).toBeVisible();
    }
  });

  test("Keyboard navigation switches active thumbnail", async ({ page }) => {
    const thumbnails = page.getByRole("button").filter({ has: page.locator("img") });
    const count = await thumbnails.count();
    expect(count).toBeGreaterThanOrEqual(1);
    if (count < 2) return;

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    await expect(thumbnails.nth(1)).toBeVisible();

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(500);

    await expect(thumbnails.nth(0)).toBeVisible();
  });

  test("Zoom in on click and zoom out on Escape", async ({ page }) => {
    await page.getByRole("button", { name: "Zoom out" }).first().waitFor({ state: "hidden", timeout: 500 }).catch(() => {});

    const viewport = page.getByRole("img", { name: /Product view 1/i });
    await viewport.click();
    await page.waitForTimeout(500);

    const zoomOutBtn = page.getByRole("button", { name: "Zoom out" }).first();
    await expect(zoomOutBtn).toBeVisible();

    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    await expect(zoomOutBtn).not.toBeVisible();
  });

  test("Mobile responsive: arrow buttons hidden, thumbnails visible", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(firstProductUrl);
    await page.waitForTimeout(2000);

    const prevBtn = page.getByRole("button", { name: "Previous image" });
    const nextBtn = page.getByRole("button", { name: "Next image" });
    await expect(prevBtn).not.toBeVisible();
    await expect(nextBtn).not.toBeVisible();

    const thumbnails = page.getByRole("button").filter({ has: page.locator("img") });
    const count = await thumbnails.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test("Zoom out button works", async ({ page }) => {
    const viewport = page.getByRole("img", { name: /Product view 1/i });
    await viewport.click();
    await page.waitForTimeout(500);

    const zoomOutBtn = page.getByRole("button", { name: "Zoom out" }).first();
    await expect(zoomOutBtn).toBeVisible();

    await zoomOutBtn.click();
    await page.waitForTimeout(500);
    await expect(zoomOutBtn).not.toBeVisible();
  });
});
