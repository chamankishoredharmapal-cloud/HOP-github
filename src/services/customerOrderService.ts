import { supabase } from "@/integrations/supabase/client";

export interface CustomerOrderSummary {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

export interface CustomerOrderDetail extends CustomerOrderSummary {
  subtotal: number;
  shippingCost: number;
  shippingAddress: {
    recipientName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    phone: string | null;
  } | null;
  items: Array<{
    productName: string;
    productPrice: number;
    quantity: number;
    imageUrl: string | null;
  }>;
}

export async function fetchCustomerOrders(
  customerId: string
): Promise<CustomerOrderSummary[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("id, order_number, status, payment_status, total, created_at")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;

  const summaries: CustomerOrderSummary[] = [];
  for (const row of data ?? []) {
    const { data: items } = await supabase
      .from("order_items")
      .select("id")
      .eq("order_id", row.id);
    summaries.push({
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      paymentStatus: row.payment_status,
      total: row.total,
      itemCount: items?.length ?? 0,
      createdAt: row.created_at,
    });
  }
  return summaries;
}

export async function fetchCustomerOrderDetail(
  orderId: string
): Promise<CustomerOrderDetail | null> {
  const { data: order, error } = await supabase
    .from("orders")
    .select("*, shipping_addresses(*)")
    .eq("id", orderId)
    .single();
  if (error) throw error;
  if (!order) return null;

  const { data: items } = await supabase
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
    total: order.total,
    subtotal: order.subtotal,
    shippingCost: order.shipping_cost,
    itemCount: items?.length ?? 0,
    createdAt: order.created_at,
    shippingAddress: order.shipping_addresses
      ? {
          recipientName: order.shipping_addresses.recipient_name,
          address: order.shipping_addresses.address,
          city: order.shipping_addresses.city,
          state: order.shipping_addresses.state,
          postalCode: order.shipping_addresses.postal_code,
          phone: order.shipping_addresses.phone,
        }
      : null,
    items:
      items?.map((i) => ({
        productName: i.product_name,
        productPrice: i.product_price,
        quantity: i.quantity,
        imageUrl: i.image_url,
      })) ?? [],
  };
}
