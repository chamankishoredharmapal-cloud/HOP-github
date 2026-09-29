import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") ?? "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/*
 * Email Sending Edge Function
 *
 * Architecture: This function provides the email sending abstraction.
 * When a third-party provider (Resend, SendGrid, SMTP) is configured,
 * implement the provider-specific logic here.
 *
 * Current: Logs emails to console (no-op sending).
 * To enable: Add provider env vars and implement the send() call.
 * 
 * Security: 
 * - Requires authentication via Authorization header (JWT)
 * - Only admins can send to arbitrary addresses
 * - Customers can only email themselves
 * - Service-role calls are accepted (bypass admin check)
 */

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
  type: string;
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
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2.106.2");
    
    // Try to validate with ANON key first (for user JWTs)
    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: userError } = await supabaseAuth.auth.getUser();

    let isAdmin = false;
    let isServiceRole = false;
    let userEmail: string | null = null;

    if (!userError && user) {
      userEmail = user.email;
      const { data: adminCheck } = await supabaseAuth.rpc("is_admin", { user_id: user.id });
      isAdmin = adminCheck === true;
    } else {
      // Try validating with service role key (for service-role JWTs)
      const supabaseService = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
        { global: { headers: { Authorization: authHeader } } }
      );
      const { data: { user: serviceUser }, error: serviceError } = await supabaseService.auth.getUser();
      
      if (!serviceError && serviceUser) {
        // Check if it's a service role JWT
        try {
          const payload = JSON.parse(atob(authHeader.split('.')[1]));
          if (payload.role === 'service_role') {
            isServiceRole = true;
          }
        } catch {
          // Ignore parsing errors
        }
      }
    }

    const body: EmailRequest = await req.json();

    if (!body.to || !body.subject || !body.body) {
      return new Response(
        JSON.stringify({ error: "missing_required_fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Security: 
    // - Service role calls bypass all checks
    // - Only admins can send to arbitrary addresses
    // - Customers can only email themselves
    if (!isServiceRole && !isAdmin && body.to !== userEmail) {
      return new Response(
        JSON.stringify({ error: "forbidden_recipient" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }


    console.log("[send-email] Email payload:", {
      to: body.to,
      subject: body.subject,
      type: body.type,
      body_length: body.body.length,
    });

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (apiKey) {
      const isHtml = body.body.trim().startsWith("<!DOCTYPE");
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: Deno.env.get("EMAIL_FROM") ?? "House of Padmavati <orders@houseofpadmavati.com>",
          to: [body.to],
          subject: body.subject,
          [isHtml ? "html" : "text"]: body.body,
        }),
      });

      if (!res.ok) {
        const errBody = await res.text();
        console.error("[send-email] Resend API error:", errBody);
        return new Response(
          JSON.stringify({ sent: false, error: "resend_api_error" }),
          { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
      console.log("[send-email] Email sent via Resend");
    } else {
      console.log("[send-email] No email provider configured. Email logged only.");
    }

    return new Response(
      JSON.stringify({ sent: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[send-email] ERROR:", err);
    return new Response(
      JSON.stringify({ error: "internal_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});