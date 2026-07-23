import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Tables } from "@/integrations/supabase/types";
import type {
  OrderStatus,
  OrderWithCustomer,
  OrderWithRelations,
  ShippingAddress,
  OrderItem,
  Payment,
  OrdersMetrics,
} from "../types/order";

type OrdersRow = Tables<"orders">;
type CustomersRow = Tables<"customers">;

interface OrderRowWithCustomer extends OrdersRow {
  customers?: CustomersRow | null;
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function fetchOrdersMetrics(): Promise<OrdersMetrics> {
  const { start, end } = todayRange();

  const [ordersTodayRes, revenueTodayRes, pendingRes, aovRes] = await Promise.all([
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", start)
      .lt("created_at", end),
    supabase
      .from("orders")
      .select("total")
      .eq("payment_status", "paid")
      .gte("created_at", start)
      .lt("created_at", end),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending_payment"),
    supabase
      .from("orders")
      .select("total"),
  ]);

  if (ordersTodayRes.error) throw ordersTodayRes.error;
  if (revenueTodayRes.error) throw revenueTodayRes.error;
  if (pendingRes.error) throw pendingRes.error;
  if (aovRes.error) throw aovRes.error;

  const revenueToday = (revenueTodayRes.data ?? []).reduce((sum, r) => sum + r.total, 0);
  const allTotals = (aovRes.data ?? []).map((r) => r.total);
  const averageOrderValue = allTotals.length > 0
    ? Math.round(allTotals.reduce((a, b) => a + b) / allTotals.length)
    : 0;

  return {
    ordersToday: ordersTodayRes.count ?? 0,
    revenueToday,
    pendingCount: pendingRes.count ?? 0,
    averageOrderValue,
  };
}

export async function fetchOrders(): Promise<OrderWithCustomer[]> {
  const { data, error } = await supabase
    .from("orders")
    .select("*");

  if (error) throw error;
  return ((data ?? []) as OrderRowWithCustomer[]).map(mapOrderRow);
}

function mapOrderRow(r: OrderRowWithCustomer): OrderWithCustomer {
  return {
    id: r.id,
    order_number: r.order_number,
    customer_id: r.customer_id,
    shipping_address_id: r.shipping_address_id,
    status: r.status,
    payment_status: r.payment_status,
    subtotal: r.subtotal,
    shipping_cost: r.shipping_cost,
    total: r.total,
    notes: r.notes,
    created_at: r.created_at,
    updated_at: r.updated_at,
    customer: r.customers ?? null,
  };
}

export async function fetchOrder(id: string): Promise<OrderWithRelations> {
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .select(`*,customers!inner(id,full_name,email,phone)`)
    .eq("id", id)
    .single();

  if (orderError) throw orderError;
  if (!orderData) throw new Error("Order not found");

  const [addressRes, itemsRes, paymentsRes] = await Promise.all([
    supabase
      .from("shipping_addresses")
      .select("*")
      .eq("id", orderData.shipping_address_id)
      .maybeSingle(),
    supabase
      .from("order_items")
      .select("*")
      .eq("order_id", id),
    supabase
      .from("payments")
      .select("*")
      .eq("order_id", id),
  ]);

  if (addressRes.error) throw addressRes.error;
  if (itemsRes.error) throw itemsRes.error;
  if (paymentsRes.error) throw paymentsRes.error;

  const r = orderData as OrderRowWithCustomer;

  return {
    id: r.id,
    order_number: r.order_number,
    customer_id: r.customer_id,
    shipping_address_id: r.shipping_address_id,
    status: r.status,
    payment_status: r.payment_status,
    subtotal: r.subtotal,
    shipping_cost: r.shipping_cost,
    total: r.total,
    notes: r.notes,
    created_at: r.created_at,
    updated_at: r.updated_at,
    customer: r.customers ?? null,
    shipping_address: (addressRes.data as ShippingAddress | null) ?? null,
    items: (itemsRes.data ?? []) as OrderItem[],
    payments: (paymentsRes.data ?? []) as Payment[],
  };
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus,
  additional?: Record<string, unknown>
): Promise<void> {
  const updateData: Record<string, unknown> = { status };
  if (additional) {
    Object.assign(updateData, additional);
  }
  const { error } = await supabase
    .from("orders")
    .update(updateData as Database["public"]["Tables"]["orders"]["Update"])
    .eq("id", id);
  if (error) throw error;
}

export async function updateShipping(
  id: string,
  shipping: {
    courier_name?: string;
    tracking_number?: string | null;
  }
): Promise<void> {
  const { error } = await supabase
    .from("orders")
    .update(shipping as Database["public"]["Tables"]["orders"]["Update"])
    .eq("id", id);
  if (error) throw error;
}

export async function fetchOrdersSearch(query: string): Promise<OrderWithCustomer[]> {
  const searchPattern = `%${query}%`;
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      customer_id,
      shipping_address_id,
      status,
      payment_status,
      subtotal,
      shipping_cost,
      total,
      notes,
      created_at,
      updated_at,
      customers!inner(id,full_name,email,phone,created_at)
    `)
    .or(
      `order_number.ilike.${searchPattern},customers.full_name.ilike.${searchPattern},customers.email.ilike.${searchPattern},customers.phone.ilike.${searchPattern}`
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map(mapOrderRow);
}

/* ───── Export Architecture ─────
 *
 * Invoice PDF:
 *   Use fetchOrder(id) to get full order with items, customer, address.
 *   Generate PDF via a library (e.g. jsPDF + html2canvas or @react-pdf/renderer).
 *   Expose as: export async function generateInvoicePdf(id: string): Promise<Blob>
 *
 * Packing Slip:
 *   Same data as invoice but omit prices/payment details.
 *   Expose as: export async function generatePackingSlipPdf(id: string): Promise<Blob>
 *
 * CSV Export (orders list):
 *   Use fetchOrders() to get all orders with customer names.
 *   Map to CSV rows (order_number, customer_name, status, total, created_at).
 *   Expose as: export function exportOrdersCsv(orders: OrderWithCustomer[]): Blob
 */
