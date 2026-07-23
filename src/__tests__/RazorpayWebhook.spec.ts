/**
 * Razorpay Webhook Integration Tests
 *
 * These tests verify the `razorpay-webhook` Supabase Edge Function.
 * They are BACKEND integration tests, not UI tests. They require:
 *
 * 1. The `razorpay-webhook` Edge Function deployed to Supabase
 * 2. `RAZORPAY_WEBHOOK_SECRET_TEST` env var matching the deployed function's secret
 *
 * Setup:
 *   - Deploy: `supabase functions deploy razorpay-webhook`
 *   - Set secret: `supabase secrets set RAZORPAY_WEBHOOK_SECRET=your_secret`
 *   - Set env: `RAZORPAY_WEBHOOK_SECRET_TEST=your_secret`
 *
 * These tests are skipped by default unless REQUIRES_DEPLOYED_SUPABASE=true.
 */

import { test, expect } from "@playwright/test";
import { createHmac } from "node:crypto";

const SUPABASE_URL = "https://kbvjmcnaaogkbnerjcoc.supabase.co";
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/razorpay-webhook`;
const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET_TEST || "";
const RUN_INTEGRATION = process.env.REQUIRES_DEPLOYED_SUPABASE === "true";

const sampleEvent = {
  event: "payment.captured",
  payload: {
    payment: {
      entity: {
        id: "pay_test_dup_check",
        order_id: "order_test_dup_check",
        status: "captured",
        amount: 50000,
        currency: "INR",
      },
    },
  },
  created_at: 1700000000,
};

function computeSignature(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body).digest("hex");
}

test.describe("Razorpay webhook signature verification (fail-closed)", () => {
  test("missing signature header returns 400 invalid_signature", async ({ page }) => {
    test.skip(!RUN_INTEGRATION, "Skipped: REQUIRES_DEPLOYED_SUPABASE not set to true");
    const response = await page.request.post(WEBHOOK_URL, {
      data: sampleEvent,
      headers: { "Content-Type": "application/json" },
    });

    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.error).toBe("invalid_signature");
  });

  test("invalid signature returns 400 invalid_signature", async ({ page }) => {
    test.skip(!RUN_INTEGRATION, "Skipped: REQUIRES_DEPLOYED_SUPABASE not set to true");
    const response = await page.request.post(WEBHOOK_URL, {
      data: sampleEvent,
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": "this_is_an_invalid_signature",
      },
    });

    const body = await response.json();
    expect(response.status()).toBe(400);
    expect(body.error).toBe("invalid_signature");
  });

  test("valid signature accepts webhook event", async ({ page }) => {
    test.skip(!WEBHOOK_SECRET, "Skipped: RAZORPAY_WEBHOOK_SECRET_TEST not set");
    test.skip(!RUN_INTEGRATION, "Skipped: REQUIRES_DEPLOYED_SUPABASE not set to true");

    const rawBody = JSON.stringify(sampleEvent);
    const signature = computeSignature(rawBody, WEBHOOK_SECRET);

    const response = await page.request.post(WEBHOOK_URL, {
      data: sampleEvent,
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": signature,
      },
    });

    const body = await response.json();
    expect(response.status()).toBe(200);
    expect(body.received).toBe(true);
  });
});

test.describe("Razorpay webhook duplicate events (idempotency)", () => {
  test("sending the same event twice skips the second", async ({ page }) => {
    test.skip(!WEBHOOK_SECRET, "Skipped: RAZORPAY_WEBHOOK_SECRET_TEST not set");
    test.skip(!RUN_INTEGRATION, "Skipped: REQUIRES_DEPLOYED_SUPABASE not set to true");

    const rawBody = JSON.stringify(sampleEvent);
    const signature = computeSignature(rawBody, WEBHOOK_SECRET);
    const headers = {
      "Content-Type": "application/json",
      "x-razorpay-signature": signature,
    };

    const firstResponse = await page.request.post(WEBHOOK_URL, {
      data: sampleEvent,
      headers,
    });
    const firstBody = await firstResponse.json();
    expect(firstResponse.status()).toBe(200);

    const secondResponse = await page.request.post(WEBHOOK_URL, {
      data: sampleEvent,
      headers,
    });
    const secondBody = await secondResponse.json();
    expect(secondResponse.status()).toBe(200);
    expect(secondBody.already_processed).toBe(true);
  });
});
