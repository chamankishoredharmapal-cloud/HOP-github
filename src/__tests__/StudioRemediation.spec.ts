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

  test("Phase 1 Security Containment: update-admin-user Edge Function is deleted and returns 404", async ({ request }) => {
    const res = await request.post(`${url}/functions/v1/update-admin-user`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        email: "test@example.com",
        password: "Password123!",
      },
    });

    // The function was completely removed from the Supabase project gateway
    expect(res.status()).toBe(404);
  });

  test("Phase 1 Security Containment: unauthenticated/anon callers cannot read internal settings table via REST", async ({ request }) => {
    const res = await request.get(`${url}/rest/v1/settings?select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    // PostgREST with RLS returns 200 with empty array (zero rows leaked) to unprivileged callers
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  test("Phase 1 Security Containment: unauthenticated/anon callers cannot mutate settings table via REST", async ({ request }) => {
    const res = await request.post(`${url}/rest/v1/settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        key: "test_probe",
        value: { probe: true },
      },
    });

    // PostgREST returns 401 or 403 unauthorized mutation
    expect([401, 403]).toContain(res.status());
  });

  test("Phase 2 Content Pipeline: draft/unpublished journal articles are strictly inaccessible to anonymous callers", async ({ request }) => {
    const res = await request.get(`${url}/rest/v1/journal_articles?status=neq.published&select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    // RLS policy journal_articles_public_read strictly filters status = 'published'
    expect(body.length).toBe(0);
  });

  test("Phase 2 Settings Remediation: get_public_store_settings exposes standard_shipping_rate without internal config leaks", async ({ request }) => {
    const res = await request.post(`${url}/rest/v1/rpc/get_public_store_settings`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {},
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    
    // Shipping object must contain both threshold and rate
    expect(body.shipping).toBeDefined();
    expect(body.shipping.standard_shipping_rate).toBe(99);
    expect(body.shipping.free_shipping_threshold).toBe(5000);
    expect(body.shipping.currency).toBe("INR");

    // Brand and contact objects must be present
    expect(body.brand).toBeDefined();
    expect(body.brand.store_name).toBe("The House of Padmavati");
    expect(body.contact).toBeDefined();

    // Forbidden internal configurations must NEVER be exposed
    expect(body.security).toBeUndefined();
    expect(body.inventory).toBeUndefined();
    expect(body.seo).toBeUndefined();
  });

  test("Phase 2 Storefront: homepage displays database journal and dynamic brand footer", async ({ page }) => {
    await page.goto("/");

    // Homepage journal section should be visible with lead article
    const journalSection = page.locator("#journal");
    await expect(journalSection).toBeVisible();
    await expect(journalSection.locator(".hop-journal__lead")).toBeVisible();

    // Footer brand identity should dynamically render store name
    const footerBrand = page.locator("footer");
    await expect(footerBrand).toBeVisible();
    await expect(footerBrand).toContainText("The House of Padmavati");
  });

  test("Phase 3 Stage 1 Content Infrastructure: anonymous visitor can read published site sections via get_published_site_sections RPC", async ({ request }) => {
    const res = await request.post(`${url}/rest/v1/rpc/get_published_site_sections`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: { p_page: "home" },
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();

    // Must contain grounded baseline sections
    expect(body["home.hero"]).toBeDefined();
    expect(body["home.hero"].title).toBe("Saree. Time. You.");
    expect(body["home.craft"]).toBeDefined();
    expect(body["home.craft"].attribution).toBe("Gangamma");
    expect(body["home.philosophy"]).toBeDefined();
    expect(body["home.ownership"]).toBeDefined();
    expect(body["home.invitation"]).toBeDefined();

    // Critical security check: draft payloads and audit metadata must NOT be leaked
    expect(body["home.hero"].draft_payload).toBeUndefined();
    expect(body["home.hero"].version).toBeUndefined();
    expect(body["home.hero"].published_by).toBeUndefined();
  });

  test("Phase 3 Stage 1 Content Infrastructure: published_sections view exposes only published fields to anonymous visitors", async ({ request }) => {
    const res = await request.get(`${url}/rest/v1/published_sections?select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    expect(res.status()).toBe(200);
    const rows = await res.json();
    expect(Array.isArray(rows)).toBe(true);
    expect(rows.length).toBeGreaterThanOrEqual(5);

    for (const row of rows) {
      expect(row.key).toBeDefined();
      expect(row.page_name).toBeDefined();
      expect(row.section_type).toBeDefined();
      expect(row.display_name).toBeDefined();
      expect(row.published_payload).toBeDefined();
      expect(row.published_at).toBeDefined();

      // Ensure no draft or internal administrative metadata is exposed
      expect(row.draft_payload).toBeUndefined();
      expect(row.version).toBeUndefined();
      expect(row.has_unpublished_changes).toBeUndefined();
      expect(row.published_by).toBeUndefined();
      expect(row.updated_by).toBeUndefined();
    }
  });

  test("Phase 3 Stage 1 Content Infrastructure: direct table SELECT on site_sections is denied to anonymous callers by RLS", async ({ request }) => {
    const res = await request.get(`${url}/rest/v1/site_sections?select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    // RLS policy site_sections_admin_all restricts access exclusively to admins (returns 0 rows)
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  test("Phase 3 Stage 1 Content Infrastructure: direct table SELECT on site_section_revisions is denied to anonymous callers by RLS", async ({ request }) => {
    const res = await request.get(`${url}/rest/v1/site_section_revisions?select=*`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
    });

    // Revisions ledger must be completely invisible to anonymous callers
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(0);
  });

  test("Phase 3 Stage 1 Content Infrastructure: unauthorized callers cannot execute administrative mutation RPCs", async ({ request }) => {
    // 1. Attempt save_site_section_draft
    const saveRes = await request.post(`${url}/rest/v1/rpc/save_site_section_draft`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        p_key: "home.hero",
        p_expected_version: 1,
        p_draft_payload: { title: "Malicious" },
      },
    });
    expect(saveRes.status()).toBe(401);

    // 2. Attempt publish_site_section
    const pubRes = await request.post(`${url}/rest/v1/rpc/publish_site_section`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        p_key: "home.hero",
        p_expected_version: 1,
      },
    });
    expect(pubRes.status()).toBe(401);

    // 3. Attempt restore_site_section_revision
    const restRes = await request.post(`${url}/rest/v1/rpc/restore_site_section_revision`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        p_key: "home.hero",
        p_revision_number: 1,
        p_expected_version: 1,
      },
    });
    expect(restRes.status()).toBe(401);

    // 4. Attempt get_section_revisions
    const revRes = await request.post(`${url}/rest/v1/rpc/get_section_revisions`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        p_key: "home.hero",
      },
    });
    expect(revRes.status()).toBe(401);
  });

  test("Phase 3 Stage 1 Content Infrastructure: direct table mutation on site_sections is blocked for unprivileged callers", async ({ request }) => {
    const res = await request.post(`${url}/rest/v1/site_sections`, {
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${anonKey}`,
      },
      data: {
        key: "hack.section",
        page_name: "hack",
        section_type: "hero_banner",
        display_name: "Hacked",
        version: 1,
        draft_payload: { title: "Hacked", alt_text: "Hacked" },
        published_payload: { title: "Hacked", alt_text: "Hacked" },
      },
    });

    expect([401, 403]).toContain(res.status());
  });
});


