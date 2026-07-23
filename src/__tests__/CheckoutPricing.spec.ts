import { test, expect } from "@playwright/test";
import { setupSupabaseMocks } from "./mocks/supabase";

test.describe("Checkout pricing authority (server-side pricing)", () => {
  test.beforeEach(async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/collections/all");
    await page.waitForTimeout(2000);
  });

  test("tampered cart prices are blocked by client-side validation before reaching Edge Function", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /add to bag/i }).first();
    await addBtn.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const raw = localStorage.getItem("hop-cart");
      if (raw) {
        const cart = JSON.parse(raw);
        cart[0].price = 1;
        cart[0].formattedPrice = "₹ 1";
        localStorage.setItem("hop-cart", JSON.stringify(cart));
      }
    });

    await page.goto("/checkout");
    await page.waitForTimeout(1000);

    await page.getByRole("textbox", { name: "Email address" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "First name" }).fill("Test");
    await page.getByRole("textbox", { name: "Last name" }).fill("User");
    await page.getByRole("textbox", { name: "Address", exact: true }).fill("123 Test St");
    await page.getByRole("textbox", { name: "City" }).fill("Mumbai");
    await page.getByRole("textbox", { name: "Postal code" }).fill("400001");
    await page.getByRole("textbox", { name: "Country" }).fill("India");

    await page.getByRole("button", { name: /pay securely/i }).click();
    await page.waitForTimeout(2000);

    await expect(page.getByText(/pricing error/i)).toBeVisible();
  });

  test("missing product returns error during checkout", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /add to bag/i }).first();
    await addBtn.click();
    await page.waitForTimeout(500);

    await page.route("**/functions/v1/create-razorpay-order", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "product_not_found" }),
      });
    });

    await page.goto("/checkout");
    await page.waitForTimeout(1000);

    await page.getByRole("textbox", { name: "Email address" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "First name" }).fill("Test");
    await page.getByRole("textbox", { name: "Last name" }).fill("User");
    await page.getByRole("textbox", { name: "Address", exact: true }).fill("123 Test St");
    await page.getByRole("textbox", { name: "City" }).fill("Mumbai");
    await page.getByRole("textbox", { name: "Postal code" }).fill("400001");
    await page.getByRole("textbox", { name: "Country" }).fill("India");

    await page.getByRole("button", { name: /pay securely/i }).click();
    await page.waitForTimeout(2000);

    await expect(page.getByText(/not found/i)).toBeVisible();
  });

  test("unpublished product returns error during checkout", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /add to bag/i }).first();
    await addBtn.click();
    await page.waitForTimeout(500);

    await page.route("**/functions/v1/create-razorpay-order", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "product_not_available" }),
      });
    });

    await page.goto("/checkout");
    await page.waitForTimeout(1000);

    await page.getByRole("textbox", { name: "Email address" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "First name" }).fill("Test");
    await page.getByRole("textbox", { name: "Last name" }).fill("User");
    await page.getByRole("textbox", { name: "Address", exact: true }).fill("123 Test St");
    await page.getByRole("textbox", { name: "City" }).fill("Mumbai");
    await page.getByRole("textbox", { name: "Postal code" }).fill("400001");
    await page.getByRole("textbox", { name: "Country" }).fill("India");

    await page.getByRole("button", { name: /pay securely/i }).click();
    await page.waitForTimeout(2000);

    await expect(page.getByText(/not available/i)).toBeVisible();
  });

  test("invalid quantity (zero) returns error during checkout", async ({ page }) => {
    const addBtn = page.getByRole("button", { name: /add to bag/i }).first();
    await addBtn.click();
    await page.waitForTimeout(500);

    await page.evaluate(() => {
      const raw = localStorage.getItem("hop-cart");
      if (raw) {
        const cart = JSON.parse(raw);
        cart[0].quantity = 0;
        localStorage.setItem("hop-cart", JSON.stringify(cart));
      }
    });

    await page.route("**/functions/v1/create-razorpay-order", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "invalid_quantity" }),
      });
    });

    await page.goto("/checkout");
    await page.waitForTimeout(1000);

    await page.getByRole("textbox", { name: "Email address" }).fill("test@example.com");
    await page.getByRole("textbox", { name: "First name" }).fill("Test");
    await page.getByRole("textbox", { name: "Last name" }).fill("User");
    await page.getByRole("textbox", { name: "Address", exact: true }).fill("123 Test St");
    await page.getByRole("textbox", { name: "City" }).fill("Mumbai");
    await page.getByRole("textbox", { name: "Postal code" }).fill("400001");
    await page.getByRole("textbox", { name: "Country" }).fill("India");

    await page.getByRole("button", { name: /pay securely/i }).click();
    await page.waitForTimeout(2000);

    await expect(page.getByText(/invalid quantity/i)).toBeVisible();
  });
});
