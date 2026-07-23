import { supabase } from "@/integrations/supabase/client";
import type { RecentOrder, RecentCustomer } from "../types/dashboard";

interface DashboardOrderRow {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
  customers: { full_name: string };
  [others: string]: unknown;
}

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

export async function fetchRevenueToday(): Promise<number> {
  const { start, end } = todayRange();
  const { data, error } = await supabase
    .from("orders")
    .select("total")
    .eq("payment_status", "paid")
    .gte("created_at", start)
    .lt("created_at", end);
  if (error) throw error;
  return (data ?? []).reduce((sum, row) => sum + row.total, 0);
}

export async function fetchOrdersToday(): Promise<number> {
  const { start, end } = todayRange();
  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .gte("created_at", start)
    .lt("created_at", end);
  if (error) throw error;
  return count ?? 0;
}

export async function fetchPendingPayments(): Promise<number> {
  const { count, error } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending_payment");
  if (error) throw error;
  return count ?? 0;
}

export async function fetchCustomerCount(): Promise<number> {
  const { count, error } = await supabase
    .from("customers")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}

export async function fetchRecentOrders(): Promise<RecentOrder[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      total,
      created_at,
      customers!inner(full_name)
    `)
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return ((data ?? []) as DashboardOrderRow[]).map((r) => ({
    id: r.id,
    order_number: r.order_number,
    customer_name: r.customers?.full_name ?? "Unknown",
    status: r.status,
    payment_status: r.payment_status,
    total: r.total,
    created_at: r.created_at,
  }));
}

export async function fetchRecentCustomers(): Promise<RecentCustomer[]> {
  const { data, error } = await supabase
    .from("customers")
    .select("id, full_name, email, created_at")
    .order("created_at", { ascending: false })
    .limit(10);
  if (error) throw error;
  return data ?? [];
}
