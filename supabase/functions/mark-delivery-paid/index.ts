import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

interface MarkDeliveryPaidRequest {
  order_id: string;
  payment_method?: 'cash_on_delivery' | 'upi' | 'card' | 'other';
  notes?: string;
  idempotency_key?: string;  // NEW: Client-provided idempotency key (required by RPC)
}

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
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    console.log("[mark-delivery-paid] Function invoked");

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

    // Verify admin role
    const { data: isAdmin } = await supabaseAuth.rpc("is_admin", { user_id: user.id });
    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: "forbidden", message: "Admin access required" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body: MarkDeliveryPaidRequest = await req.json();
    const { order_id, payment_method = 'cash_on_delivery', notes, idempotency_key } = body;

    if (!order_id) {
      return new Response(
        JSON.stringify({ error: "missing_order_id" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Require idempotency key for RPC (client must provide stable key for retries)
    if (!idempotency_key || idempotency_key.trim() === '') {
      return new Response(
        JSON.stringify({ 
          error: "idempotency_key_required", 
          message: "Client must provide a stable idempotency_key for this operation. Recommended format: 'mark_delivery_paid_<order_id>_<admin_user_id>'" 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("[mark-delivery-paid] Processing order:", order_id, "with idempotency_key:", idempotency_key);

    // Call atomic RPC - all validation, locking, and updates happen atomically in DB
    const { data: rpcResult, error: rpcError } = await supabase.rpc("mark_delivery_paid_rpc", {
      p_order_id: order_id,
      p_idempotency_key: idempotency_key,
      p_payment_method: payment_method,
      p_notes: notes,
    });

    if (rpcError) {
      console.error("[mark-delivery-paid] RPC error:", rpcError);
      return new Response(
        JSON.stringify({ error: "rpc_failed", message: rpcError.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const result = rpcResult as {
      success: boolean;
      already_processed?: boolean;
      order_id: string;
      order_number?: string;
      payment_id?: string;
      amount_settled?: number;
      new_payment_status?: string;
      new_order_status?: string;
      error?: string;
      message?: string;
    };

    if (!result.success) {
      console.error("[mark-delivery-paid] RPC returned error:", result);
      const status = result.error === 'idempotency_key_required' ? 400 : 
                     result.error === 'order_not_found' ? 404 :
                     result.error === 'invalid_order_state' ? 400 :
                     result.error === 'no_balance_due' ? 400 :
                     result.error === 'invalid_payment_method' ? 400 :
                     500;
      return new Response(
        JSON.stringify({ error: result.error, message: result.message }),
        { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    console.log("[mark-delivery-paid] Result:", {
      order_id: result.order_id,
      order_number: result.order_number,
      already_processed: result.already_processed,
      payment_id: result.payment_id,
      amount_settled: result.amount_settled,
    });

    return new Response(
      JSON.stringify({
        success: true,
        already_processed: result.already_processed ?? false,
        order_id: result.order_id,
        order_number: result.order_number,
        payment_id: result.payment_id,
        amount_settled: result.amount_settled,
        new_payment_status: result.new_payment_status,
        new_order_status: result.new_order_status,
        message: result.message,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("[mark-delivery-paid] ERROR:", error);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});