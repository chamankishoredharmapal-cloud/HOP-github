import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

async function verifySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secret: string,
): Promise<boolean> {
  const text = `${orderId}|${paymentId}`;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, encoder.encode(text));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expected === signature;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("[verify-payment] === STEP 1: Function invoked");

    // --- Step 1: Initialize clients ---
    try {
      const supabase = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      );

      const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;
      console.log("[verify-payment] RAZORPAY_KEY_SECRET available:", !!razorpaySecret);

      // --- Step 2: Parse request body ---
      let razorpay_order_id: string;
      let razorpay_payment_id: string;
      let razorpay_signature: string;
      try {
        const body: VerifyPaymentRequest = await req.json();
        razorpay_order_id = body.razorpay_order_id;
        razorpay_payment_id = body.razorpay_payment_id;
        razorpay_signature = body.razorpay_signature;
        console.log("[verify-payment] Request body received:", {
          razorpay_order_id,
          razorpay_payment_id,
          has_signature: !!razorpay_signature,
        });
      } catch (parseErr) {
        console.error("[verify-payment] STEP 2 FAILED — req.json() threw:", parseErr);
        throw new Error("body_parse_failed");
      }

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        console.log("[verify-payment] Missing verification fields");
        return new Response(
          JSON.stringify({ success: false, error: "Missing verification fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // --- Step 3: Signature verification ---
      let isValid: boolean;
      try {
        console.log("[verify-payment] STEP 3: Verifying signature...");
        isValid = await verifySignature(
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          razorpaySecret,
        );
        console.log("[verify-payment] Signature valid:", isValid);
      } catch (sigErr) {
        console.error("[verify-payment] STEP 3 FAILED — verifySignature threw:", sigErr);
        throw new Error("signature_verification_crashed");
      }

      if (!isValid) {
        console.log("[verify-payment] Invalid signature — marking payment as failed");
        try {
          await supabase
            .from("payments")
            .update({ status: "failed" })
            .eq("razorpay_order_id", razorpay_order_id);

          const { data: payData } = await supabase
            .from("payments")
            .select("order_id")
            .eq("razorpay_order_id", razorpay_order_id)
            .maybeSingle();

          if (payData?.order_id) {
            await supabase.rpc("release_order_inventory", {
              p_order_id: payData.order_id,
              p_reason: "invalid_signature",
            });
          }
        } catch (dbErr) {
          console.error("[verify-payment] Failed to update payment status to failed:", dbErr);
        }

        return new Response(
          JSON.stringify({ success: false, error: "Invalid payment signature" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // --- Step 4: Idempotency check via payment_events ---
      try {
        const eventId = `verify_${razorpay_order_id}_${razorpay_payment_id}`;
        console.log("[verify-payment] STEP 4: Checking idempotency — eventId:", eventId);
        const { data: existingEvent } = await supabase
          .from("payment_events")
          .select("id")
          .eq("event_id", eventId)
          .maybeSingle();

        if (existingEvent) {
          console.log("[verify-payment] Already processed — returning already_processed: true");
          return new Response(
            JSON.stringify({ success: true, already_processed: true }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
      } catch (idempErr) {
        console.error("[verify-payment] STEP 4 FAILED — idempotency check threw:", idempErr);
        throw new Error("idempotency_check_failed");
      }

      // --- Step 5: confirm_paid_order RPC ---
      let confirmResult: unknown;
      try {
        console.log("[verify-payment] STEP 5: Calling confirm_paid_order RPC...");
        const result = await supabase.rpc(
          "confirm_paid_order",
          {
            p_razorpay_order_id: razorpay_order_id,
            p_razorpay_payment_id: razorpay_payment_id,
            p_razorpay_signature: razorpay_signature,
          },
        );

        if (result.error) {
          console.error("[verify-payment] STEP 5 FAILED — confirm_paid_order RPC returned error:", result.error);
          throw result.error;
        }

        confirmResult = result.data;
        console.log("[verify-payment] confirm_paid_order result:", JSON.stringify(confirmResult));
      } catch (rpcErr) {
        console.error("[verify-payment] STEP 5 FAILED — confirm_paid_order RPC threw:", rpcErr);
        throw rpcErr;
      }

      // --- Step 6: Record payment_events entry ---
      if (confirmResult && typeof confirmResult === "object" && "success" in confirmResult && (confirmResult as Record<string, unknown>).success) {
        try {
          const eventId = `verify_${razorpay_order_id}_${razorpay_payment_id}`;
          console.log("[verify-payment] STEP 6: Recording payment_events entry...");
          await supabase.from("payment_events").insert({
            event_id: eventId,
            event_type: "verify_payment",
            razorpay_order_id: razorpay_order_id,
            razorpay_payment_id: razorpay_payment_id,
          }).maybeSingle();
          console.log("[verify-payment] payment_events entry recorded");
        } catch (recordErr) {
          console.error("[verify-payment] STEP 6 FAILED — recording payment_events threw:", recordErr);
        }
      }

      console.log("[verify-payment] Returning success response");
      return new Response(
        JSON.stringify(confirmResult ?? { success: false, error: "no_result" }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    } catch (innerErr) {
      console.error("[verify-payment] INNER CATCH — re-throwing to outer:", innerErr);
      throw innerErr;
    }
  } catch (err) {
    console.error("[verify-payment] OUTER CATCH — ERROR:", err);
    return new Response(
      JSON.stringify({ success: false, error: "verification_failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
