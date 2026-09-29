import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.106.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("FRONTEND_URL") ?? "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface ContactPayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  orderNumber?: string;
  message?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ success: false, error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }

  try {
    let body: ContactPayload;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid JSON body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const firstName = (body.firstName || "").trim();
    const lastName = (body.lastName || "").trim();
    const email = (body.email || "").trim().toLowerCase();
    const orderNumber = (body.orderNumber || "").trim();
    const message = (body.message || "").trim();

    if (!firstName || !lastName || !email || !message) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields (firstName, lastName, email, message)",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!email.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid email address" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Optional user email resolution if client sent user auth token
    let userEmail: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      try {
        const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || supabaseServiceKey;
        const authClient = createClient(supabaseUrl, anonKey, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: { user } } = await authClient.auth.getUser();
        if (user?.email) {
          userEmail = user.email;
        }
      } catch {
        // Non-blocking: proceed as anonymous contact message
      }
    }

    // Persist contact message in database
    const { error: insertError } = await supabase.from("contact_messages").insert({
      first_name: firstName,
      last_name: lastName,
      email: email,
      order_number: orderNumber || null,
      message: message,
      user_email: userEmail,
      status: "new",
    });

    if (insertError) {
      console.error("[send-contact-message] Database insert error:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to store contact message. Please try again.",
        }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Attempt to notify customer care team via email
    try {
      const careEmail = Deno.env.get("CARE_EMAIL") ?? "care@houseofpadmavati.com";
      await supabase.functions.invoke("send-email", {
        headers: {
          Authorization: `Bearer ${supabaseServiceKey}`,
        },
        body: {
          to: careEmail,
          subject: `Customer Contact: ${firstName} ${lastName} (${email})`,
          body: `
            <h2>New customer contact message received</h2>
            <p><strong>Name:</strong> ${firstName} ${lastName}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${orderNumber ? `<p><strong>Order Number:</strong> ${orderNumber}</p>` : ""}
            ${userEmail ? `<p><strong>Authenticated User:</strong> ${userEmail}</p>` : ""}
            <p><strong>Message:</strong></p>
            <blockquote style="background:#f4f4f4;padding:12px;border-left:4px solid #333;">${message}</blockquote>
          `,
          type: "contact_form",
        },
      });
    } catch (emailErr) {
      console.warn("[send-contact-message] Customer care email notification warning:", emailErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Thank you for reaching out. We have received your message.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error("[send-contact-message] Unhandled error:", err);
    return new Response(
      JSON.stringify({ success: false, error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});