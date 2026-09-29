import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

/*
 * Razorpay Webhook Handler
 *
 * Receives events from Razorpay's webhook system.
 * Configure in Razorpay Dashboard → Settings → Webhooks:
 *   URL: https://{project-ref}.supabase.co/functions/v1/razorpay-webhook
 *   Events: payment.captured, payment.failed, order.paid
 *
 * Security:
 *   - RAZORPAY_WEBHOOK_SECRET is REQUIRED; function returns 500 if missing (fail-closed)
 *   - Verifies x-razorpay-signature before any business logic
 *   - At-most-once processing via payment_events table
 */

interface WebhookEvent {
  event: string;
  payload: {
    payment?: {
      entity: {
        id: string;
        order_id: string;
        status: string;
        amount: number;
        currency: string;
      };
    };
    order?: {
      entity: {
        id: string;
        status: string;
        amount: number;
        currency: string;
      };
    };
  };
  created_at: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") ?? "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function verifyWebhookSignature(
  body: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time comparison to prevent timing attacks (SOP mandate)
  if (expected.length !== signature.length) return false;
  const a = encoder.encode(expected);
  const b = encoder.encode(signature);
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a[i] ^ b[i];
  }
  return result === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const webhookSecret = Deno.env.get("RAZORPAY_WEBHOOK_SECRET");
    console.log("[razorpay-webhook] Function invoked. Webhook secret configured:", !!webhookSecret);

    // Fail-closed: secret is required
    if (!webhookSecret) {
      console.error("[razorpay-webhook] RAZORPAY_WEBHOOK_SECRET is not configured");
      return new Response(JSON.stringify({ error: "configuration_error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature") ?? "";
    console.log("[razorpay-webhook] Received webhook. Signature present:", !!signature);

    // Verify signature before any business logic
    const valid = await verifyWebhookSignature(rawBody, signature, webhookSecret);
    console.log("[razorpay-webhook] Webhook signature valid:", valid);

    if (!valid) {
      return new Response(JSON.stringify({ error: "invalid_signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const event: WebhookEvent = JSON.parse(rawBody);
    console.log("[razorpay-webhook] Event type:", event.event);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Build unique event id for idempotency
    const paymentId = event.payload.payment?.entity?.id;
    const orderId = event.payload.order?.entity?.id;
    const eventId = `${event.event}_${paymentId ?? orderId ?? "unknown"}`;
    console.log("[razorpay-webhook] eventId:", eventId);

    // At-most-once: skip if already processed
    const { data: existingEvent } = await supabase
      .from("payment_events")
      .select("id")
      .eq("event_id", eventId)
      .maybeSingle();

    if (existingEvent) {
      console.log("[razorpay-webhook] Skipping already-processed event:", eventId);
      return new Response(JSON.stringify({ received: true, already_processed: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    switch (event.event) {
      case "payment.captured": {
        const payment = event.payload.payment?.entity;
        if (!payment) {
          console.log("[razorpay-webhook] payment.captured — no payment entity found");
          break;
        }
        console.log("[razorpay-webhook] payment.captured — payment.order_id:", payment.order_id, "payment.id:", payment.id);

        // Use atomic confirm_paid_order RPC
        console.log("[razorpay-webhook] Calling confirm_paid_order RPC...");
        const { data: confirmResult, error: confirmErr } = await supabase.rpc("confirm_paid_order", {
          p_razorpay_order_id: payment.order_id,
          p_razorpay_payment_id: payment.id,
          p_razorpay_signature: null,
        });

        if (confirmErr) {
          console.error("[razorpay-webhook] confirm_paid_order failed:", confirmErr);
          break;
        }
        console.log("[razorpay-webhook] confirm_paid_order result:", JSON.stringify(confirmResult));

        // Record event as processed only on success
        if (confirmResult?.success) {
          console.log("[razorpay-webhook] Recording payment_events entry...");
          await supabase.from("payment_events").insert({
            event_id: eventId,
            event_type: event.event,
            razorpay_order_id: payment.order_id,
            razorpay_payment_id: payment.id,
          }).maybeSingle();
          console.log("[razorpay-webhook] payment_events entry recorded");

          // Send order confirmation email
          try {
            console.log("[razorpay-webhook] Sending order confirmation email...");
            const { data: orderData } = await supabase
              .from("orders")
              .select("id, order_number, customer_id, total, shipping_address_id")
              .eq("id", (confirmResult as Record<string, unknown>).order_id)
              .maybeSingle();

            if (orderData) {
              const { data: customerData } = await supabase
                .from("customers")
                .select("email, full_name")
                .eq("id", orderData.customer_id)
                .maybeSingle();

              if (customerData?.email) {
                const { data: itemsData } = await supabase
                  .from("order_items")
                  .select("product_name, quantity, product_price")
                  .eq("order_id", orderData.id);

                const { data: shippingAddr } = await supabase
                  .from("shipping_addresses")
                  .select("address, city, state, postal_code, country")
                  .eq("id", orderData.shipping_address_id)
                  .maybeSingle();

                const itemsHtml = (itemsData ?? []).map((i) =>
                  `<tr><td style="padding:6px 0">${i.product_name} × ${i.quantity}</td><td style="padding:6px 0;text-align:right">₹${(i.product_price / 100).toLocaleString("en-IN")}</td></tr>`
                ).join("");

                const shippingAddress = shippingAddr
                  ? `${shippingAddr.address}, ${shippingAddr.city}, ${shippingAddr.state} ${shippingAddr.postal_code}, ${shippingAddr.country}`
                  : "";

                const emailBody = `
                  <!DOCTYPE html>
                  <html>
                  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>
                    body { font-family: 'Georgia', serif; color: #2D2D2D; background: #F7F4EE; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
                    .header { text-align: center; border-bottom: 1px solid #E0D8CC; padding-bottom: 24px; margin-bottom: 24px; }
                    .header h1 { font-size: 18px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 400; color: #3D5A5A; }
                    .content { font-size: 15px; line-height: 1.7; color: #4A4A4A; }
                    .footer { text-align: center; font-size: 11px; color: #8A8A8A; border-top: 1px solid #E0D8CC; padding-top: 20px; margin-top: 32px; }
                    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                    td { padding: 6px 0; }
                    tr:last-child td { border-top: 1px solid #E0D8CC; font-weight: bold; }
                  </style></head>
                  <body>
                  <div class="container">
                    <div class="header"><h1>House of Padmavati</h1></div>
                    <div class="content">
                      <p>Dear ${customerData.full_name || "valued customer"},</p>
                      <p>Your piece has been claimed. Order <strong>${confirmResult.order_number}</strong> has been confirmed and is now resting in our atelier before its journey to you.</p>
                      <table style="width:100%;border-collapse:collapse;margin:20px 0">
                        ${(await supabase.from("order_items").select("product_name, quantity, product_price").eq("order_id", confirmResult.order_id)).data?.map(i =>
                          `<tr><td style="padding:6px 0">${i.product_name} × ${i.quantity}</td><td style="padding:6px 0;text-align:right">₹${(i.product_price / 100).toLocaleString("en-IN")}</td></tr>`
                        ).join("") || ""}
                        <tr><td style="border-top:1px solid #E0D8CC;padding:8px 0;font-weight:bold">Total</td>
                        <td style="border-top:1px solid #E0D8CC;padding:8px 0;text-align:right;font-weight:bold">₹${(((confirmResult as Record<string, unknown>).amount as number) || 0 / 100).toLocaleString("en-IN")}</td></tr>
                      </table>
                      <p>Shipping to: ${shippingAddress || "N/A"}</p>
                      <p>We will write to you again once the box leaves Pondicherry.</p>
                    </div>
                    <div class="footer"><p>House of Padmavati &middot; Pondicherry, India</p></div>
                  </body>
                  </html>
                `;

                const { error: emailError } = await supabase.functions.invoke("send-email", {
                  body: {
                    to: customerData.email,
                    subject: `Your piece has been claimed — ${confirmResult.order_number}`,
                    body: "",
                    type: "order_confirmation"
                  }
                });

                if (emailError) {
                  console.error("[razorpay-webhook] Failed to send order confirmation email:", emailError);
                } else {
                  console.log("[razorpay-webhook] Order confirmation email sent successfully");
                }
              }
            }
          } catch (emailErr) {
            console.error("[razorpay-webhook] Failed to send order confirmation email:", emailErr);
          }
        }

        break;
      }

      case "payment.failed": {
        const failedPayment = event.payload.payment?.entity;
        if (!failedPayment) {
          console.log("[razorpay-webhook] payment.failed — no payment entity found");
          break;
        }
        console.log("[razorpay-webhook] payment.failed — order_id:", failedPayment.order_id, "payment_id:", failedPayment.id);

        const { error: insertEventError } = await supabase.from("payment_events").insert({
          event_id: eventId,
          event_type: event.event,
          razorpay_order_id: failedPayment.order_id,
          razorpay_payment_id: failedPayment.id,
        });

        if (insertEventError?.code === "23505") {
          console.log("[razorpay-webhook] payment.failed — already processed, skipping");
          break;
        }

        if (insertEventError) {
          console.error("[razorpay-webhook] payment.failed — event insert failed:", insertEventError);
          break;
        }

        await supabase
          .from("payments")
          .update({ status: "failed" })
          .eq("razorpay_order_id", failedPayment.order_id);

        const { data: orderData } = await supabase
          .from("payments")
          .select("order_id")
          .eq("razorpay_order_id", failedPayment.order_id)
          .maybeSingle();

        if (orderData?.order_id) {
          await supabase.rpc("release_order_inventory", {
            p_order_id: orderData.order_id,
            p_reason: "payment_failed",
          });
        }

        console.log("[razorpay-webhook] Payment marked as failed, inventory released");
        break;
      }

      default:
        console.log("[razorpay-webhook] Unhandled webhook event:", event.event);
    }

    console.log("[razorpay-webhook] Returning success");
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[razorpay-webhook] ERROR:", err);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
