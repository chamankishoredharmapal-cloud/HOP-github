import { test, expect } from "@playwright/test";
import { setupSupabaseMocks } from "./mocks/supabase";

test.describe("Product image rendering (N+1 removal)", () => {
  test.beforeEach(async ({ page }) => {
    await setupSupabaseMocks(page);
  });

  test("collection page renders product images or placeholders", async ({ page }) => {
    await page.goto("/collections/all");
    await page.waitForTimeout(2000);

    const productCards = page.getByRole("link").filter({ has: page.locator("h3") });
    const count = await productCards.count();

    if (count === 0) {
      const emptyMsg = page.getByText("No products found in this collection");
      await expect(emptyMsg).toBeVisible();
      return;
    }

    const sample = Math.min(count, 4);
    const productImgs = page.locator("a[href*='/product/'] img");
    const imgCount = await productImgs.count();
    expect(imgCount).toBeGreaterThanOrEqual(sample);
  });

  test("product detail page renders gallery images or fallback message", async ({ page }) => {
    await page.goto("/collections/all");
    await page.waitForTimeout(2000);

    const firstProduct = page.getByRole("link").filter({ has: page.locator("h3") }).first();
    const exists = (await firstProduct.count()) > 0;
    test.skip(!exists, "No products found — skipping gallery test");

    await firstProduct.click();
    await page.waitForTimeout(2000);

    const noImagesMsg = page.getByText("No images available");
    const msgCount = await noImagesMsg.count();

    if (msgCount > 0) {
      await expect(noImagesMsg).toBeVisible();
      return;
    }

    const nextBtn = page.getByRole("button", { name: "Next image" });
    await expect(nextBtn).toBeVisible();
  });
});
