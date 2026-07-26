export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  type: EmailType;
}

export type EmailType =
  | "welcome"
  | "order_confirmation"
  | "payment_success"
  | "payment_failed"
  | "shipment"
  | "delivered"
  | "nurture"
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

export interface WelcomeData {
  customerName: string;
}

export interface NurtureData {
  customerName: string;
  title: string;
  summary: string;
  link: string;
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

export function buildWelcomeEmail(data: WelcomeData): EmailPayload {
  const body = htmlWrapper("A quiet welcome", `
    <p>Dear ${data.customerName},</p>
    <p>Welcome to House of Padmavati. We are glad you found your way to our atelier.</p>
    <p>Here, we weave slowly. Our collections are small, and our craft is measured in months, not days. We promise to only write to you when we have something beautiful to share.</p>
    <p>Take your time looking around.</p>
  `);
  return { to: "", subject: "A quiet welcome to the house", body, type: "welcome" };
}

export function buildOrderConfirmationEmail(data: OrderConfirmationData): EmailPayload {
  const itemsHtml = data.items.map((i) =>
    `<tr><td style="padding:6px 0">${i.name} × ${i.quantity}</td><td style="padding:6px 0;text-align:right">₹${(i.price / 100).toLocaleString("en-IN")}</td></tr>`
  ).join("");
  const body = htmlWrapper("Claimed", `
    <p>Dear ${data.customerName},</p>
    <p>Your piece has been claimed. Order <strong>${data.orderNumber}</strong> has been confirmed and is now resting in our atelier before its journey to you.</p>
    <table style="width:100%;border-collapse:collapse;margin:20px 0">${itemsHtml}
      <tr><td style="border-top:1px solid #E0D8CC;padding:8px 0;font-weight:bold">Total</td>
      <td style="border-top:1px solid #E0D8CC;padding:8px 0;text-align:right;font-weight:bold">₹${(data.total / 100).toLocaleString("en-IN")}</td></tr>
    </table>
    <p>Shipping to: ${data.shippingAddress}</p>
    <p>We will write to you again once the box leaves Pondicherry.</p>
  `);
  return { to: "", subject: `Your piece has been claimed — ${data.orderNumber}`, body, type: "order_confirmation" };
}

export function buildPaymentSuccessEmail(data: PaymentResultData): EmailPayload {
  const body = htmlWrapper("Secured", `
    <p>Dear ${data.customerName},</p>
    <p>We have successfully secured your payment of <strong>₹${(data.amount / 100).toLocaleString("en-IN")}</strong> for order <strong>${data.orderNumber}</strong>.</p>
    ${data.paymentId ? `<p style="font-size:12px;color:#8A8A8A">Transaction reference: ${data.paymentId}</p>` : ""}
  `);
  return { to: "", subject: `Payment secured — ${data.orderNumber}`, body, type: "payment_success" };
}

export function buildPaymentFailedEmail(data: PaymentResultData): EmailPayload {
  const body = htmlWrapper("A brief pause", `
    <p>Dear ${data.customerName},</p>
    <p>There was a gentle pause in processing your payment for order <strong>${data.orderNumber}</strong>.</p>
    <p>Your chosen piece remains reserved for you. Please return to the atelier to complete the transaction.</p>
  `);
  return { to: "", subject: `A pause in your order — ${data.orderNumber}`, body, type: "payment_failed" };
}

export function buildShipmentEmail(data: ShipmentData): EmailPayload {
  const trackingHtml = data.trackingUrl
    ? `<p>You may follow its journey here: <a href="${data.trackingUrl}" style="color:#3D5A5A;">${data.carrier || "Tracking"}</a></p>`
    : "";
  const body = htmlWrapper("In transit", `
    <p>Dear ${data.customerName},</p>
    <p>Your piece has left Pondicherry. Order <strong>${data.orderNumber}</strong> was folded in unbleached muslin, wrapped in jasmine tissue, and handed to our courier today.</p>
    ${trackingHtml}
    <p>It will be with you shortly.</p>
  `);
  return { to: "", subject: `From the atelier to your hands — ${data.orderNumber}`, body, type: "shipment" };
}

export function buildDeliveredEmail(data: ShipmentData): EmailPayload {
  const body = htmlWrapper("Arrived", `
    <p>Dear ${data.customerName},</p>
    <p>Your box (<strong>${data.orderNumber}</strong>) has arrived.</p>
    <p>We encourage you to open it in natural light, unwrap the muslin slowly, and feel the weight of the weave before you try it on.</p>
    <p>If anything is less than perfect, write to us at care@houseofpadmavati.com.</p>
  `);
  return { to: "", subject: `Your piece has arrived — ${data.orderNumber}`, body, type: "delivered" };
}

export function buildNurtureEmail(data: NurtureData): EmailPayload {
  const body = htmlWrapper("Notes from the loom", `
    <p>Dear ${data.customerName},</p>
    <p>We have published a new entry in our journal.</p>
    <p style="font-size:16px;font-style:italic;margin-top:24px;">${data.title}</p>
    <p>${data.summary}</p>
    <p style="margin-top:24px;"><a href="${data.link}" style="color:#3D5A5A;text-transform:uppercase;letter-spacing:0.1em;font-size:12px;text-decoration:none;border-bottom:1px solid #3D5A5A;padding-bottom:2px;">Read the full story</a></p>
  `);
  return { to: "", subject: "Notes from the loom", body, type: "nurture" };
}

export function buildPasswordResetEmail(data: { customerName: string; resetLink: string }): EmailPayload {
  const body = htmlWrapper("Access", `
    <p>Dear ${data.customerName},</p>
    <p>A request was made to gently reset the key to your account.</p>
    <p style="margin-top:24px;"><a href="${data.resetLink}" style="color:#3D5A5A;text-transform:uppercase;letter-spacing:0.1em;font-size:12px;text-decoration:none;border-bottom:1px solid #3D5A5A;padding-bottom:2px;">Reset your password</a></p>
  `);
  return { to: "", subject: "A key to your account", body, type: "password_reset" };
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
