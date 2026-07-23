export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  type: EmailType;
}

export type EmailType =
  | "order_confirmation"
  | "payment_success"
  | "payment_failed"
  | "shipment"
  | "delivered"
  | "password_reset";

export interface OrderConfirmationData {
  orderNumber: string;
  customerName: string;
  items: Array<{ name: string; quantity: number; price: number }>;
  total: number;
  shippingAddress: string;
}

export interface PaymentResultData {
  orderNumber: string;
  customerName: string;
  amount: number;
  paymentId?: string;
}

export interface ShipmentData {
  orderNumber: string;
  customerName: string;
  trackingUrl?: string;
  carrier?: string;
}

function htmlWrapper(title: string, bodyHtml: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  body { font-family: 'Georgia', serif; color: #2D2D2D; background: #F7F4EE; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 24px; }
  .header { text-align: center; border-bottom: 1px solid #E0D8CC; padding-bottom: 24px; margin-bottom: 24px; }
  .header h1 { font-size: 18px; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 400; color: #3D5A5A; }
  .content { font-size: 15px; line-height: 1.7; color: #4A4A4A; }
  .footer { text-align: center; font-size: 11px; color: #8A8A8A; border-top: 1px solid #E0D8CC; padding-top: 20px; margin-top: 32px; }
</style>
</head>
<body>
<div class="container">
  <div class="header"><h1>House of Padmavati</h1></div>
  <div class="content">${bodyHtml}</div>
  <div class="footer"><p>House of Padmavati &middot; Pondicherry, India</p></div>
</div>
</body>
</html>`.trim();
}

export function buildOrderConfirmationEmail(data: OrderConfirmationData): EmailPayload {
  const itemsHtml = data.items.map((i) =>
    `<tr><td style="padding:6px 0">${i.name} × ${i.quantity}</td><td style="padding:6px 0;text-align:right">₹${(i.price / 100).toLocaleString("en-IN")}</td></tr>`
  ).join("");
  const body = htmlWrapper("Order Confirmed", `
    <p>Thank you, ${data.customerName}.</p>
    <p>Your order <strong>${data.orderNumber}</strong> has been confirmed.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">${itemsHtml}
      <tr><td style="border-top:1px solid #E0D8CC;padding:8px 0;font-weight:bold">Total</td>
      <td style="border-top:1px solid #E0D8CC;padding:8px 0;text-align:right;font-weight:bold">₹${(data.total / 100).toLocaleString("en-IN")}</td></tr>
    </table>
    <p>Shipping to: ${data.shippingAddress}</p>
  `);
  return { to: "", subject: `Order Confirmed — ${data.orderNumber}`, body, type: "order_confirmation" };
}

export function buildPaymentSuccessEmail(data: PaymentResultData): EmailPayload {
  const body = htmlWrapper("Payment Received", `
    <p>Dear ${data.customerName},</p>
    <p>Payment of <strong>₹${(data.amount / 100).toLocaleString("en-IN")}</strong> for order <strong>${data.orderNumber}</strong> was successful.</p>
    ${data.paymentId ? `<p>Transaction ID: ${data.paymentId}</p>` : ""}
    <p>We will notify you when your order ships.</p>
  `);
  return { to: "", subject: `Payment Received — ${data.orderNumber}`, body, type: "payment_success" };
}

export function buildPaymentFailedEmail(data: PaymentResultData): EmailPayload {
  const body = htmlWrapper("Payment Failed", `
    <p>Dear ${data.customerName},</p>
    <p>Payment for order <strong>${data.orderNumber}</strong> failed.</p>
    <p>Please return to your order page to try again. Your items are still reserved.</p>
  `);
  return { to: "", subject: `Payment Failed — ${data.orderNumber}`, body, type: "payment_failed" };
}

export function buildShipmentEmail(data: ShipmentData): EmailPayload {
  const trackingHtml = data.trackingUrl
    ? `<p>Track your shipment: <a href="${data.trackingUrl}">${data.carrier || "Tracking"}</a></p>`
    : "";
  const body = htmlWrapper("Shipped", `
    <p>Dear ${data.customerName},</p>
    <p>Your order <strong>${data.orderNumber}</strong> is on its way.</p>
    ${trackingHtml}
    <p>Hand-wrapped in jasmine paper with care.</p>
  `);
  return { to: "", subject: `Your Order Has Shipped — ${data.orderNumber}`, body, type: "shipment" };
}

export function buildDeliveredEmail(data: ShipmentData): EmailPayload {
  const body = htmlWrapper("Delivered", `
    <p>Dear ${data.customerName},</p>
    <p>Your order <strong>${data.orderNumber}</strong> has been delivered.</p>
    <p>We hope it brings you joy. If something is not right, write to us at care@houseofpadmavati.com.</p>
  `);
  return { to: "", subject: `Delivered — ${data.orderNumber}`, body, type: "delivered" };
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  const { to, subject, body, type } = payload;
  if (!to) return;

  try {
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.functions.invoke("send-email", {
      body: { to, subject, body, type },
    });
    if (error) throw error;
  } catch {
    console.error("Email sending failed for", type, to);
  }
}
