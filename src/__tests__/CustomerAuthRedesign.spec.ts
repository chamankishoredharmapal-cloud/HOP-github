import { test, expect } from "@playwright/test";
import { setupSupabaseMocks } from "./mocks/supabase";

const SAMPLE_SAREE = {
  id: "prod-padmini",
  productId: "prod-padmini",
  name: "Padmini · Coastal Pattu",
  price: 4800000,
  formattedPrice: "₹ 48,000",
  image: "https://placehold.co/800x600/jasmine/teal?text=Padmini",
  collection: "Kalyani",
  quantity: 1,
};

test.describe("Customer Auth & Checkout Experience Redesign", () => {
  test("Unauthenticated customer at checkout sees concise HOP account creation form with phone", async ({ page }) => {
    await setupSupabaseMocks(page, { authenticated: false });

    await page.addInitScript((item) => {
      window.localStorage.setItem("hop-cart", JSON.stringify([item]));
    }, SAMPLE_SAREE);

    await page.goto("/checkout", { waitUntil: "networkidle" });

    // Verify concise account creation step is visible
    await expect(page.getByText(/Create your HOP account/i)).toBeVisible();
    await expect(page.locator("#accountFullName")).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#phone")).toBeVisible();
    await expect(page.locator("#accountPassword")).toBeVisible();
    await expect(page.getByRole("button", { name: /continue to delivery/i })).toBeVisible();

    // Verify unobtrusive sign-in toggle exists
    const signInBtn = page.getByRole("button", { name: /^sign in$/i });
    await expect(signInBtn).toBeVisible();
    await signInBtn.click();

    // Verify sign in view displays cleanly
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#password")).toBeVisible();
    await expect(page.getByRole("button", { name: /sign in & continue/i })).toBeVisible();
    await expect(page.getByText(/forgot password\?/i)).toBeVisible();

    // Verify cart items were 100% preserved
    const cartRaw = await page.evaluate(() => window.localStorage.getItem("hop-cart"));
    expect(cartRaw).toBeTruthy();
    const cartItems = JSON.parse(cartRaw!);
    expect(cartItems[0].name).toBe("Padmini · Coastal Pattu");
  });

  test("Authenticated customer has identity preloaded and default address flow", async ({ page }) => {
    await setupSupabaseMocks(page, { authenticated: true });

    await page.addInitScript((item) => {
      window.localStorage.setItem("hop-cart", JSON.stringify([item]));
    }, SAMPLE_SAREE);

    await page.goto("/checkout", { waitUntil: "networkidle" });

    // Authenticated user should see checkout steps and contact section
    await expect(page.getByText(/checkout\./i)).toBeVisible();
    await expect(page.locator("#email")).toBeVisible();
    await expect(page.locator("#returnPolicyAccepted")).toBeVisible();

    // Cart items are preserved
    const cartRaw = await page.evaluate(() => window.localStorage.getItem("hop-cart"));
    expect(cartRaw).toBeTruthy();
    expect(JSON.parse(cartRaw!).length).toBe(1);
  });

  test("Mobile-first viewport integrity: zero horizontal overflow across devices", async ({ page }) => {
    await setupSupabaseMocks(page, { authenticated: true });

    await page.addInitScript((item) => {
      window.localStorage.setItem("hop-cart", JSON.stringify([item]));
    }, SAMPLE_SAREE);

    const viewports = [
      { width: 320, height: 568, name: "iPhone SE 1st gen" },
      { width: 375, height: 667, name: "iPhone SE 2nd/3rd gen" },
      { width: 390, height: 844, name: "iPhone 12/13/14" },
      { width: 430, height: 932, name: "iPhone 14/15 Pro Max" },
      { width: 1440, height: 900, name: "Desktop" },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/checkout", { waitUntil: "networkidle" });

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow, `Expected no horizontal overflow on ${vp.name} (${vp.width}x${vp.height})`).toBe(false);
    }
  });

  test("Standalone Login and Signup pages support redirect back to checkout", async ({ page }) => {
    await setupSupabaseMocks(page, { authenticated: false });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("/account/login?redirect=/checkout", { waitUntil: "networkidle" });

    // Verify password visibility toggle is present
    await expect(page.getByLabel(/show password/i)).toBeVisible();

    // Verify create account link preserves redirect parameter
    const signupLink = page.getByRole("link", { name: /create an account/i });
    const href = await signupLink.getAttribute("href");
    expect(href).toContain("redirect=%2Fcheckout");
  });
});
