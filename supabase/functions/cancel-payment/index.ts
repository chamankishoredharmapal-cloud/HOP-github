import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
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

    const { data: isAdmin } = await supabaseAuth.rpc("is_admin", { user_id: user.id });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { order_id } = await req.json();

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "missing_order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { data: order } = await supabase
      .from("orders")
      .select("id, status, payment_status, customer_id, customers(email)")
      .eq("id", order_id)
      .single();

    if (!order) {
      return new Response(
        JSON.stringify({ error: "order_not_found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

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
        JSON.stringify({ cancelled: true, already_cancelled: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: releaseError } = await supabase.rpc("release_order_inventory", {
      p_order_id: order_id,
      p_reason: "payment_cancelled",
    });

    if (releaseError) {
      console.error("[cancel-payment] Inventory release RPC failed:", releaseError);
      return new Response(
        JSON.stringify({ error: "inventory_release_failed" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { error: orderUpdateError } = await supabase
      .from("orders")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", order_id);

    if (orderUpdateError) {
      console.error("[cancel-payment] Order update failed:", orderUpdateError);
    }

    const { error: paymentUpdateError } = await supabase
      .from("payments")
      .update({ status: "failed" })
      .eq("order_id", order_id);

    if (paymentUpdateError) {
      console.error("[cancel-payment] Payment update failed:", paymentUpdateError);
    }

    await supabase.from("order_events").insert({
      order_id,
      event_type: "cancelled",
      to_status: "cancelled",
      metadata: JSON.stringify({ type: "cancelled", reason: "payment_cancelled" }),
    }).maybeSingle();

    return new Response(
      JSON.stringify({ cancelled: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[cancel-payment] ERROR:", err);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
