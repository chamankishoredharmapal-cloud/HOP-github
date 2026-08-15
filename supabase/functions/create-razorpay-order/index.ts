import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";
import Razorpay from "npm:razorpay@2.9.5";

interface OrderItemInput {
  product_id: string;
  quantity: number;
}

interface CreateOrderRequest {
  order_id?: string;
  receipt?: string;
  customer_email?: string;
  customer_full_name?: string;
  customer_phone?: string;
  shipping_recipient_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  shipping_landmark?: string;
  shipping_option?: string;
  notes?: string;
  items?: OrderItemInput[];
}

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") ?? "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

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
    console.log("[create-razorpay-order] Function invoked");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();

    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const keyId = Deno.env.get("RAZORPAY_KEY_ID");
    const keySecret = Deno.env.get("RAZORPAY_KEY_SECRET");
    console.log("[create-razorpay-order] RAZORPAY_KEY_ID available:", !!keyId);
    console.log("[create-razorpay-order] RAZORPAY_KEY_SECRET available:", !!keySecret);

    const razorpay = new Razorpay({
      key_id: keyId!,
      key_secret: keySecret!,
    });

    const body: CreateOrderRequest = await req.json();
    console.log("[create-razorpay-order] Request body keys:", Object.keys(body));
    console.log("[create-razorpay-order] order_id from body:", body.order_id);

    let orderId = body.order_id;
    let orderNumber: string | undefined;
    let orderTotal: number;

    // --- Step 1: Create or resolve the DB order ---

    if (orderId) {
      console.log("[create-razorpay-order] RETRY path — order exists in DB:", orderId);

      const { data: isAdmin } = await supabaseAuth.rpc("is_admin", { user_id: user.id });

      // Retry path — order already exists in the DB
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, total, order_number, payment_status, status, customers(email)")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        return new Response(
          JSON.stringify({ error: "order_not_found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // IDOR prevention: verify the authenticated user owns this order
      if (!isAdmin && (order.customers as unknown as { email: string })?.email !== user.email) {
        return new Response(
          JSON.stringify({ error: "forbidden" }),
          { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (order.payment_status === "paid") {
        return new Response(
          JSON.stringify({ error: "order_already_paid" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (order.status === "cancelled") {
        return new Response(
          JSON.stringify({ error: "order_cancelled" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      if (order.total <= 0) {
        return new Response(
          JSON.stringify({ error: "order_zero_total" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      orderTotal = order.total;
      orderNumber = order.order_number;
      console.log("[create-razorpay-order] Retry — order total:", orderTotal, "order_number:", orderNumber);
    } else {
      console.log("[create-razorpay-order] NEW order path — creating DB order via RPC");
      const {
        customer_email,
        customer_full_name,
        customer_phone,
        shipping_recipient_name,
        shipping_phone,
        shipping_address,
        shipping_city,
        shipping_state,
        shipping_postal_code,
        shipping_country = "India",
        shipping_landmark,
        shipping_option = "standard",
        notes,
        items,
      } = body;

      if (!customer_email || !customer_full_name || !items || items.length === 0) {
        return new Response(
          JSON.stringify({ error: "missing_required_fields" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      const { data: rpcData, error: rpcError } = await supabase.rpc("create_order", {
        p_customer_email: customer_email,
        p_customer_full_name: customer_full_name,
        p_customer_phone: customer_phone ?? null,
        p_shipping_recipient_name: shipping_recipient_name ?? customer_full_name,
        p_shipping_phone: shipping_phone ?? "",
        p_shipping_address: shipping_address,
        p_shipping_city: shipping_city,
        p_shipping_state: shipping_state ?? "",
        p_shipping_postal_code: shipping_postal_code,
        p_shipping_country: shipping_country,
        p_shipping_landmark: shipping_landmark ?? null,
        p_shipping_option: shipping_option,
        p_notes: notes ?? null,
        p_items: items,
      });

      if (rpcError || !rpcData) {
        console.error("Failed to create order via RPC:", rpcError);
        // Fallback error parsing if it throws an exception (which it does using RAISE EXCEPTION)
        const errorMsg = rpcError?.message || "order_creation_failed";
        return new Response(
          JSON.stringify({ error: errorMsg }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      orderId = rpcData.order_id;
      orderNumber = rpcData.order_number;
      orderTotal = rpcData.total;
    }

    // --- Step 2: Create Razorpay order ---
    console.log("[create-razorpay-order] Step 2 — Creating Razorpay order");
    console.log("[create-razorpay-order] orderId:", orderId, "orderNumber:", orderNumber, "orderTotal (paise):", orderTotal);

    // Check for existing pending Razorpay order
    const { data: existingPayment } = await supabase
      .from("payments")
      .select("id, razorpay_order_id, status")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (existingPayment?.razorpay_order_id && existingPayment.status === "pending") {
      console.log("[create-razorpay-order] Reusing existing pending Razorpay order:", existingPayment.razorpay_order_id);
      return new Response(
        JSON.stringify({
          order_id: orderId,
          order_number: orderNumber,
          razorpay_order_id: existingPayment.razorpay_order_id,
          razorpay_key_id: Deno.env.get("RAZORPAY_KEY_ID")!,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const order_receipt = body.receipt || orderNumber || orderId;
    const razorpayPayload = {
      amount: orderTotal,
      currency: "INR",
      receipt: order_receipt,
      payment_capture: 1,
    };
    console.log("[create-razorpay-order] Calling Razorpay API to create order...");
    console.log("[create-razorpay-order] Razorpay payload:", JSON.stringify(razorpayPayload));

    const razorpayOrder = await razorpay.orders.create(razorpayPayload);
    console.log("[create-razorpay-order] Razorpay order created:", razorpayOrder.id);

    console.log("[create-razorpay-order] Inserting payment record into DB...");
    const { error: insertErr } = await supabase.from("payments").insert({
      order_id: orderId,
      razorpay_order_id: razorpayOrder.id,
      amount: orderTotal,
      currency: "INR",
      status: "pending",
    });

    if (insertErr) {
      console.error("[create-razorpay-order] Failed to insert payment record:", insertErr);
      return new Response(
        JSON.stringify({ error: "payment_creation_failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    console.log("[create-razorpay-order] Payment record inserted successfully");

    console.log("[create-razorpay-order] Returning success response");
    return new Response(
      JSON.stringify({
        order_id: orderId,
        order_number: orderNumber,
        razorpay_order_id: razorpayOrder.id,
        razorpay_key_id: Deno.env.get("RAZORPAY_KEY_ID")!,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[create-razorpay-order] ERROR:", error);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
