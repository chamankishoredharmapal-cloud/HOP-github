import { supabase } from "@/integrations/supabase/client";
import type {
  CustomerDetail,
  CustomerListParams,
  CustomerListResponse,
  CustomerOrder,
  CustomerAddress,
} from "../types/customer";

export async function fetchCustomers(
  params: CustomerListParams
): Promise<CustomerListResponse> {
  const {
    search,
    status = "all",
    page = 1,
    perPage = 20,
    sortBy = "created_at",
    sortDir = "desc",
  } = params;

  let query = supabase.from("customers").select("*", { count: "exact" });

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(
      `full_name.ilike.${pattern},email.ilike.${pattern},phone.ilike.${pattern}`
    );
  }

  const sortColumn =
    sortBy === "name" ? "full_name"
    : sortBy === "total_spent" ? "created_at"
    : sortBy;
  query = query.order(sortColumn, { ascending: sortDir === "asc" });

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const total = count ?? 0;

  return {
    customers: (data ?? []).map((r) => ({
      id: r.id,
      email: r.email,
      full_name: r.full_name,
      phone: r.phone,
      status: "active" as const,
      notes: null,
      created_at: r.created_at,
    })),
    total,
    page,
    totalPages: Math.ceil(total / perPage),
  };
}

export async function fetchCustomer(id: string): Promise<CustomerDetail> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Customer not found");

  const [ordersRes, addressesRes] = await Promise.all([
    supabase
      .from("orders")
      .select("id, order_number, status, payment_status, total, created_at")
      .eq("customer_id", id)
      .order("created_at", { ascending: false })
      .limit(20),
    supabase
      .from("shipping_addresses")
      .select("*")
      .eq("customer_id", id),
  ]);

  if (ordersRes.error) throw ordersRes.error;
  if (addressesRes.error) throw addressesRes.error;

  const orders = (ordersRes.data ?? []) as CustomerOrder[];
  const totalSpent = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = orders.length > 0 ? Math.round(totalSpent / orders.length) : 0;

  return {
    id: data.id,
    email: data.email,
    full_name: data.full_name,
    phone: data.phone,
    status: "active" as const,
    notes: null,
    created_at: data.created_at,
    order_count: orders.length,
    total_spent: totalSpent,
    average_order_value: avgOrderValue,
    recent_orders: orders,
    addresses: (addressesRes.data ?? []) as CustomerAddress[],
  };
}

export async function updateCustomer(
  id: string,
  updates: { full_name?: string; email?: string; phone?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from("customers").delete().eq("id", id);
  if (error) throw error;
}
