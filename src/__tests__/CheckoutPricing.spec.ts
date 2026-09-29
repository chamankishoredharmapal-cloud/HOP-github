import { test, expect, Page } from "@playwright/test";
import { setupSupabaseMocks } from "./mocks/supabase";

const VALID_CART_ITEM = {
  id: "prod-padmini",
  productId: "prod-padmini",
  name: "Padmini · Coastal Pattu",
  price: 4800000,
  formattedPrice: "₹ 48,000",
  image: "https://placehold.co/800x600/jasmine/teal?text=Padmini",
  collection: "Kalyani",
  quantity: 1,
};

async function fillCheckoutForm(page: Page) {
  await page.locator("#email").fill("test@example.com");
  await page.locator("#firstName").fill("Test");
  await page.locator("#lastName").fill("User");
  await page.locator("#phone").fill("9876543210");
  await page.locator("#address").fill("123 Test St");
  await page.locator("#city").fill("Mumbai");
  await page.locator("#state").fill("Maharashtra");
  await page.locator("#postalCode").fill("400001");
  await page.locator("#country").fill("India");
  await page.locator("#returnPolicyAccepted").check();
}

test.describe("Checkout pricing authority (server-side pricing)", () => {
  test.beforeEach(async ({ page }) => {
    await setupSupabaseMocks(page);
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test("tampered cart prices are blocked by client-side validation before reaching Edge Function", async ({ page }) => {
    await page.addInitScript((item) => {
      const tamperedItem = { ...item, price: 1, formattedPrice: "₹ 1" };
      window.localStorage.setItem("hop-cart", JSON.stringify([tamperedItem]));
    }, VALID_CART_ITEM);

    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillCheckoutForm(page);

    await page.getByRole("button", { name: /pay/i }).click();

    await expect(page.getByText(/pricing error/i)).toBeVisible();
  });

  test("missing product returns error during checkout", async ({ page }) => {
    await page.addInitScript((item) => {
      window.localStorage.setItem("hop-cart", JSON.stringify([item]));
    }, VALID_CART_ITEM);

    await page.route("**/functions/v1/create-razorpay-order", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "product_not_found" }),
      });
    });

    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillCheckoutForm(page);

    await page.getByRole("button", { name: /pay/i }).click();

    await expect(page.getByText(/not found/i)).toBeVisible();
  });

  test("unpublished product returns error during checkout", async ({ page }) => {
    await page.addInitScript((item) => {
      window.localStorage.setItem("hop-cart", JSON.stringify([item]));
    }, VALID_CART_ITEM);

    await page.route("**/functions/v1/create-razorpay-order", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "product_not_available" }),
      });
    });

    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillCheckoutForm(page);

    await page.getByRole("button", { name: /pay/i }).click();

    await expect(page.getByText(/not available/i)).toBeVisible();
  });

  test("invalid quantity returns error during checkout", async ({ page }) => {
    await page.addInitScript((item) => {
      window.localStorage.setItem("hop-cart", JSON.stringify([item]));
    }, VALID_CART_ITEM);

    await page.route("**/functions/v1/create-razorpay-order", async (route) => {
      await route.fulfill({
        status: 400,
        contentType: "application/json",
        body: JSON.stringify({ error: "invalid_quantity" }),
      });
    });

    await page.goto("/checkout", { waitUntil: "networkidle" });
    await fillCheckoutForm(page);

    await page.getByRole("button", { name: /pay/i }).click();

    await expect(page.getByText(/invalid quantity/i)).toBeVisible();
  });
});
