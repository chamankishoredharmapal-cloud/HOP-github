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
  "Access-Control-Allow-Origin": "*",
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
      // Retry path — order already exists in the DB
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("id, total, order_number, payment_status, status")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        return new Response(
          JSON.stringify({ error: "order_not_found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
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
      console.log("[create-razorpay-order] NEW order path — creating DB order");
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

      // Validate items and compute totals
      let subtotal = 0;
      for (const item of items) {
        if (item.quantity <= 0) {
          return new Response(
            JSON.stringify({ error: `Invalid quantity for product ${item.product_id}`, code: "invalid_quantity" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        const { data: product, error: productError } = await supabase
          .from("products")
          .select("id, selling_price, name, status, stock")
          .eq("id", item.product_id)
          .single();

        if (productError || !product) {
          return new Response(
            JSON.stringify({ error: `Product ${item.product_id} not found`, code: "product_not_found" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        if (product.status !== "active" && product.status !== "published") {
          return new Response(
            JSON.stringify({ error: `Product ${item.product_id} is not available`, code: "product_not_available" }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        if (product.stock < item.quantity) {
          return new Response(
            JSON.stringify({
              error: `Insufficient stock for ${product.name}`,
              code: "insufficient_stock",
              product_id: item.product_id,
              available: product.stock,
              requested: item.quantity,
            }),
            { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }

        subtotal += product.selling_price * item.quantity;
      }

      let shippingCost = 0;
      if (shipping_option === "express") shippingCost = 800;
      else if (shipping_option === "overnight") shippingCost = 2400;

      orderTotal = subtotal + shippingCost;

      // Upsert customer by email
      const { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("email", customer_email.toLowerCase())
        .maybeSingle();

      let customerId: string;
      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
          const { data: newCustomer, error: customerError } = await supabase
            .from("customers")
            .insert({ email: customer_email, full_name: customer_full_name, phone: customer_phone ?? null })
            .select("id")
            .single();

        if (customerError || !newCustomer) {
          console.error("Failed to create customer:", customerError);
          return new Response(
            JSON.stringify({ error: "customer_creation_failed" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        customerId = newCustomer.id;
      }

      // Insert shipping address
      const { data: address, error: addressError } = await supabase
        .from("shipping_addresses")
        .insert({
          customer_id: customerId,
          recipient_name: shipping_recipient_name ?? customer_full_name,
          phone: shipping_phone ?? "",
          address: shipping_address,
          city: shipping_city,
          state: shipping_state ?? "",
          postal_code: shipping_postal_code,
          country: shipping_country,
          landmark: shipping_landmark ?? null,
        })
        .select("id")
        .single();

      if (addressError || !address) {
        console.error("Failed to insert shipping address:", addressError);
        return new Response(
          JSON.stringify({ error: "address_creation_failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }

      // Generate order number
      const { data: orderNumResult, error: orderNumError } = await supabase
        .rpc("generate_order_number");

      if (orderNumError || !orderNumResult) {
        console.error("Failed to generate order number:", orderNumError);
        return new Response(
          JSON.stringify({ error: "order_number_failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      orderNumber = orderNumResult as string;

      // Insert order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          shipping_address_id: address.id,
          order_number: orderNumber,
          status: "pending_payment",
          payment_status: "pending",
          subtotal,
          shipping_cost: shippingCost,
          total: orderTotal,
          notes: notes ?? null,
        })
        .select("id")
        .single();

      if (orderError || !order) {
        console.error("Failed to insert order:", orderError);
        return new Response(
          JSON.stringify({ error: "order_creation_failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      orderId = order.id;

      // Insert order items with product info from DB
      const orderItems = [];
      for (const item of items) {
        const { data: product } = await supabase
          .from("products")
          .select("name, selling_price")
          .eq("id", item.product_id)
          .single();

        const { data: image } = await supabase
          .from("product_images")
          .select("url")
          .eq("product_id", item.product_id)
          .eq("is_primary", true)
          .limit(1)
          .maybeSingle();

        orderItems.push({
          order_id: orderId,
          product_id: item.product_id,
          product_name: product?.name ?? "",
          product_price: product?.selling_price ?? 0,
          quantity: item.quantity,
          image_url: image?.url ?? null,
        });
      }

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) {
        console.error("Failed to insert order items:", itemsError);
        return new Response(
          JSON.stringify({ error: "order_items_failed" }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
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
