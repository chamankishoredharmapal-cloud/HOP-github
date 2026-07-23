# Payment Security — House of Padmavati

## Overview

House of Padmavati uses Razorpay for payment processing. Razorpay is PCI DSS Level 1 compliant. The platform never handles raw card data directly.

## Payment Flow (Secure)

```
Client                          Server (Edge Function)           Razorpay
  │                                    │                           │
  │  1. Request order creation         │                           │
  │ ─────────────────────────────────► │                           │
  │                                    │ 2. Create Razorpay order  │
  │                                    │ ────────────────────────► │
  │                                    │ 3. Return order_id       │
  │                                    │ ◄──────────────────────── │
  │  4. Return order_id + amount      │                           │
  │ ◄───────────────────────────────── │                           │
  │                                    │                           │
  │  5. Open Razorpay checkout modal   │                           │
  │ ─────────────────────────────────────────────────────────────► │
  │                                    │                           │
  │  6. User completes payment         │                           │
  │ ◄───────────────────────────────────────────────────────────── │
  │                                    │                           │
  │  7. Send payment result            │                           │
  │ ─────────────────────────────────► │                           │
  │                                    │ 8. Verify signature       │
  │                                    │ 9. Create order in DB     │
  │  10. Return confirmation           │                           │
  │ ◄───────────────────────────────── │                           │
  │                                    │                           │
  │                                    │ 11. Webhook notification  │
  │                                    │ ◄──────────────────────── │
  │                                    │ 12. Update order status   │
```

## Edge Function: Create Razorpay Order

```typescript
// supabase/functions/create-razorpay-order/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Razorpay from "npm:razorpay";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { amount, currency = "INR", receipt } = await req.json();

    const razorpay = new Razorpay({
      key_id: Deno.env.get("RAZORPAY_KEY_ID"),
      key_secret: Deno.env.get("RAZORPAY_KEY_SECRET"),
    });

    const order = await razorpay.orders.create({
      amount, // in paise
      currency,
      receipt,
    });

    return new Response(
      JSON.stringify({ order_id: order.id, amount: order.amount }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
```

## Edge Function: Verify Payment

```typescript
// supabase/functions/verify-payment/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { validatePaymentVerification } from "npm:razorpay/dist/utils/razorpay-utils.js";

serve(async (req) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = await req.json();

    const isValid = validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      Deno.env.get("RAZORPAY_KEY_SECRET")!
    );

    if (!isValid) {
      throw new Error("Invalid payment signature");
    }

    // Create order in database
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        razorpay_order_id,
        razorpay_payment_id,
        status: "confirmed",
        // ... other order data
      })
      .select()
      .single();

    return new Response(
      JSON.stringify({ success: true, order }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: corsHeaders }
    );
  }
});
```

## Webhook: Razorpay Webhook

```typescript
// supabase/functions/razorpay-webhook/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "node:crypto";

function validateWebhook(body: string, signature: string, secret: string) {
  const expected = createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return crypto.timingSafeEqual(
    new TextEncoder().encode(expected),
    new TextEncoder().encode(signature)
  );
}

serve(async (req) => {
  const body = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";

  if (!validateWebhook(body, signature, Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!)) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(body);

  // Process webhook event
  if (event.event === "payment.captured") {
    // Update order status
  }

  return new Response("OK", { status: 200 });
});
```

## Security Measures

| Measure | Implementation |
|---------|---------------|
| No card data handling | Razorpay Checkout (hosted) |
| Payment verification | Server-side signature verification |
| Webhook validation | HMAC SHA256 signature check |
| Order integrity | Amount + currency verified on server |
| No client-side trust | All payment data confirmed server-side |
| Rate limiting | On order creation endpoint |
| Logging | All payment events logged |
| Audit trail | Razorpay dashboard + database records |

## PCI Compliance

- House of Padmavati never stores, processes, or transmits card data
- Razorpay Checkout handles all card entry (iframe, PCI DSS Level 1)
- We store: order_id, payment_id, amount, status, customer email
- We never store: card numbers, CVV, expiry dates
- Razorpay provides SAQ A (simplest PCI compliance path)
