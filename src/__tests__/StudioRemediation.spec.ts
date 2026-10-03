import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

function getEnvConfig() {
  const envPath = path.resolve(".env");
  let url = "https://kbvjmcnaaogkbnerjcoc.supabase.co";
  let anonKey = "";

  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, "utf-8");
    const urlMatch = content.match(/VITE_SUPABASE_URL=["']?([^"'\r\n]+)/);
    if (urlMatch) url = urlMatch[1].trim();
    const keyMatch = content.match(/VITE_SUPABASE_PUBLISHABLE_KEY=["']?([^"'\r\n]+)/);
    if (keyMatch) anonKey = keyMatch[1].trim();
  }
  return { url, anonKey };
}

test.describe("HOP Studio Remediation — End-to-End Pipeline & Security Verification", () => {
  const { url, anonKey } = getEnvConfig();

  test("public storefront loads journal articles from database with seamless fallback", async ({ page }) => {
    await page.goto("/journal");
    await expect(page.locator("h1")).toHaveText("Field notes & reflections.");

    // Featured article should be visible
    const featuredTitle = page.locator(".hop-journal-feature h2");
    await expect(featuredTitle).toBeVisible();
    const titleText = await featuredTitle.textContent();
    expect(titleText).toBeTruthy();

    // Earlier entries list
    const earlierSection = page.locator("text=/Earlier entries/i");
    await expect(earlierSection).toBeVisible();

    // Click through to article detail
    const firstArticleLink = page.locator('a[href^="/journal/"]').first();
    await firstArticleLink.click();
    await expect(page).toHaveURL(/\/journal\/.+/);

    // Detail page article headline
    const detailTitle = page.locator("h1");
    await expect(detailTitle).toBeVisible();
  });

  test("journal detail route renders correct metadata and breadcrumb navigation", async ({ page }) => {
    await page.goto("/journal/how-morning-light-reads-a-weave");
    await expect(page.locator("h1")).toHaveText("How morning light reads a weave.");

    const backButton = page.locator("text=Back to Journal");
    await expect(backButton).toBeVisible();

    // Verify metadata was set
    const title = await page.title();
    expect(title).toContain("How morning light reads a weave.");
  });

  test("footer dynamically consumes store settings and renders Whisper links", async ({ page }) => {
    await page.goto("/");
    const whisperSection = page.locator("text=Whisper");
    await expect(whisperSection).toBeVisible();

    const instagramLink = page.locator('footer a:has-text("Instagram")');
    await expect(instagramLink).toBeVisible();
    const href = await instagramLink.getAttribute("href");
    expect(href).toMatch(/instagram\.com/);
  });

  test("unauthenticated client is strictly forbidden from executing adjust_product_stock", async ({ request }) => {
    const res = await request.post(`${url}/rest/v1/rpc/adjust_product_stock`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        p_product_id: "a2799dd3-80a5-4cc4-b510-031678a2c1f7",
        p_quantity: 0,
        p_reason: "audit",
      },
    });

    // PostgREST returns 401 Unauthorized because EXECUTE privilege is revoked from anon
    expect(res.status()).toBe(401);
  });

  test("public get_public_store_settings RPC succeeds without exposing internal security parameters", async ({ request }) => {
    const res = await request.post(`${url}/rest/v1/rpc/get_public_store_settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {},
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("brand");
    expect(body).toHaveProperty("contact");
    expect(body).toHaveProperty("shipping");

    // Critical security assertion: sensitive security settings must NEVER be present
    expect(body).not.toHaveProperty("security");
    expect(body.security).toBeUndefined();
  });
});
