import { supabase } from "@/integrations/supabase/client"
import type { Database } from "@/integrations/supabase/types";
import type { OrderConfirmationDetail } from "@/types/order"

export const ORDER_STATUS_FLOW = [
  "pending_payment",
  "confirmed",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
  "refunded",
] as const;

export type OrderStatus = typeof ORDER_STATUS_FLOW[number];

const FORWARD_TRANSITIONS: Record<string, string[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["packed", "cancelled"],
  packed: ["shipped"],
  shipped: ["delivered"],
  delivered: ["returned"],
  cancelled: [],
  returned: ["refunded"],
  refunded: [],
};

export function isValidTransition(from: string, to: string): boolean {
  if (from === to) return true;
  return FORWARD_TRANSITIONS[from]?.includes(to) ?? false;
}

export type OrderStatusEvent =
  | { type: "created" }
  | { type: "paid" }
  | { type: "cancelled"; reason?: string }
  | { type: "returned"; reason?: string }
  | { type: "refunded" }
  | { type: "status_changed"; from: string; to: string };

export async function transitionOrderStatus(
  orderId: string,
  newStatus: string,
  event?: OrderStatusEvent
): Promise<void> {
  const { data: order } = await supabase
    .from("orders")
    .select("status, payment_status")
    .eq("id", orderId)
    .single();

  if (!order) throw new Error("Order not found");

  if (!isValidTransition(order.status, newStatus)) {
    throw new Error(`Cannot transition from ${order.status} to ${newStatus}`);
  }

  const updates: Record<string, string> = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  if (newStatus === "delivered" && order.payment_status !== "paid") {
    updates.payment_status = "paid";
  }

  const { error } = await supabase
    .from("orders")
    .update(updates as unknown as Database["public"]["Tables"]["orders"]["Update"])
    .eq("id", orderId);

  if (error) throw error;

  const validTypes = ["status_changed", "paid", "cancelled", "returned", "refunded"];
  const eventType = event?.type && validTypes.includes(event.type) ? event.type : "status_changed";

  const meta = JSON.stringify(event ?? { type: eventType, from: order.status, to: newStatus });

  await supabase.from("order_events").insert({
    order_id: orderId,
    event_type: eventType,
    from_status: order.status,
    to_status: newStatus,
    metadata: meta,
  }).maybeSingle();
}

export async function fetchOrderConfirmation(
  orderNumber: string
): Promise<OrderConfirmationDetail | null> {
  const { data, error } = await supabase.functions.invoke(
    "get-order-confirmation",
    {
      body: { order_number: orderNumber },
    }
  );

  if (error || !data) return null;
  if (data.error) return null;

  return {
    orderNumber: data.order_number,
    status: data.status,
    paymentStatus: data.payment_status,
    total: data.total,
    subtotal: data.subtotal,
    shippingCost: data.shipping_cost,
    shipping: data.shipping
      ? {
          city: data.shipping.city,
          state: data.shipping.state,
          postalCode: data.shipping.postal_code,
        }
      : null,
    items: (data.items ?? []).map((item: Record<string, unknown>) => ({
      productName: item.product_name as string,
      quantity: item.quantity as number,
      price: item.price as number,
      imageUrl: (item.primary_image as string) ?? null,
      estimatedDeliveryDays: (item.estimated_delivery_days as number) ?? null,
    })),
  };
}
