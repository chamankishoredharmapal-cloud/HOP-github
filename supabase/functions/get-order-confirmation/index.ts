import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

interface OrderConfirmationItem {
  product_name: string;
  quantity: number;
  price: number;
  primary_image: string | null;
  estimated_delivery_days: number | null;
}

interface OrderConfirmationResponse {
  order_number: string;
  status: string;
  payment_status: string;
  created_at: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  items: OrderConfirmationItem[];
  shipping: {
    city: string;
    state: string;
    postal_code: string;
  } | null;
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
    return new Response(JSON.stringify({ error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
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

    let orderNumber: string;
    try {
      const body = await req.json();
      orderNumber = body.order_number;
    } catch {
      return new Response(
        JSON.stringify({ error: "invalid_json" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!orderNumber || typeof orderNumber !== "string" || orderNumber.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "missing_order_number" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    orderNumber = orderNumber.trim();

    if (!/^HOP-\d{8}-\d{6}$/.test(orderNumber)) {
      return new Response(
        JSON.stringify({ error: "invalid_order_number_format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, status, payment_status, created_at, subtotal, shipping_cost, total, shipping_address_id")
      .eq("order_number", orderNumber)
      .maybeSingle();

    if (orderError) {
      console.error("[get-order-confirmation] DB error:", orderError);
      return new Response(
        JSON.stringify({ error: "internal_error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (!order) {
      return new Response(
        JSON.stringify({ error: "order_not_found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: address } = await supabase
      .from("shipping_addresses")
      .select("city, state, postal_code")
      .eq("id", order.shipping_address_id)
      .maybeSingle();

    const { data: items } = await supabase
      .from("order_items")
      .select("product_name, quantity, product_price, image_url, product_id")
      .eq("order_id", order.id);

    const productEstimates: Map<string, number | null> = new Map();
    if (items && items.length > 0) {
      const productIds = items
        .map((i) => i.product_id)
        .filter((id): id is string => id != null && id.length > 0);

      if (productIds.length > 0) {
        const { data: products } = await supabase
          .from("products")
          .select("id, estimated_dispatch_days")
          .in("id", productIds);

        if (products) {
          for (const p of products) {
            productEstimates.set(p.id, p.estimated_dispatch_days ?? null);
          }
        }
      }
    }

    const responseItems: OrderConfirmationItem[] = (items ?? []).map((item) => ({
      product_name: item.product_name,
      quantity: item.quantity,
      price: item.product_price,
      primary_image: item.image_url,
      estimated_delivery_days: item.product_id
        ? (productEstimates.get(item.product_id) ?? null)
        : null,
    }));

    const response: OrderConfirmationResponse = {
      order_number: order.order_number,
      status: order.status,
      payment_status: order.payment_status,
      created_at: order.created_at,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      total: order.total,
      items: responseItems,
      shipping: address
        ? {
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
          }
        : null,
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[get-order-confirmation] ERROR:", err);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
