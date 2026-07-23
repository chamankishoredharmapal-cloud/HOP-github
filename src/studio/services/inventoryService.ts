import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type {
  InventoryMetrics,
  InventoryItem,
  InventoryHistoryEntry,
  StockAdjustmentInput,
  StockStatus,
  AdjustmentReason,
} from "../types/inventory";
import { getStockStatus } from "../types/inventory";

type OrdersRow = Tables<"orders">;

interface InventoryProductRow {
  id: string;
  name: string;
  sku: string;
  slug: string;
  stock: number;
  low_stock_alert: number;
  collections: { name: string } | null;
  product_images: { url: string; is_primary: boolean }[];
  [others: string]: unknown;
}

interface InventoryHistoryRow {
  id: string;
  product_id: string;
  change: number;
  previous_stock: number;
  new_stock: number;
  reason: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
  [others: string]: unknown;
}

interface AdjustStockResult {
  success: boolean;
  error?: string;
  available?: number;
}

export async function fetchInventoryMetrics(): Promise<InventoryMetrics> {
  const { data: products, error } = await supabase
    .from("products")
    .select("stock, low_stock_alert");

  if (error) throw error;

  const all = (products as { stock: number; low_stock_alert: number }[]) ?? [];

  let inStock = 0;
  let lowStock = 0;
  let outOfStock = 0;

  for (const p of all) {
    const status = getStockStatus(p.stock, p.low_stock_alert);
    if (status === "healthy") inStock++;
    else if (status === "low_stock") lowStock++;
    else outOfStock++;
  }

  let reservedStock = 0;
  try {
    const { data: activeOrders } = await supabase
      .from("orders")
      .select("id")
      .not("status", "in", '("cancelled","delivered","returned")');

    if (activeOrders && activeOrders.length > 0) {
      const ids = (activeOrders as Pick<OrdersRow, "id">[]).map((o) => o.id);
      const { data: reservedData } = await supabase
        .from("order_items")
        .select("quantity")
        .in("order_id", ids);

      if (reservedData) {
        reservedStock = (reservedData as { quantity: number }[]).reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
      }
    }
  } catch {
    reservedStock = 0;
  }

  return {
    totalProducts: all.length,
    inStock,
    lowStock,
    outOfStock,
    reservedStock,
  };
}

export async function fetchInventoryList(
  search?: string,
  statusFilter?: StockStatus | "all",
  sortBy?: "name" | "stock" | "sku",
  sortDir?: "asc" | "desc",
): Promise<InventoryItem[]> {
  let query = supabase
    .from("products")
    .select(`
      id, name, sku, slug, stock, low_stock_alert,
      collections!left(name),
      product_images(url, is_primary)
    `);

  if (search) {
    const pattern = `%${search}%`;
    query = query.or(`name.ilike.${pattern},sku.ilike.${pattern}`);
  }

  const sortColumn = sortBy === "name" ? "name" : sortBy === "sku" ? "sku" : "stock";
  const direction = sortDir === "asc" ? { ascending: true } : { ascending: false };
  query = query.order(sortColumn, direction);

  const { data, error } = await query;

  if (error) throw error;

  const rows = (data as InventoryProductRow[]) ?? [];

  let items: InventoryItem[] = rows.map((r) => {
    const primary = r.product_images.find((img) => img.is_primary);

    return {
      id: r.id,
      name: r.name,
      sku: r.sku,
      slug: r.slug,
      collection_name: r.collections?.name ?? null,
      available_stock: r.stock,
      low_stock_alert: r.low_stock_alert,
      status: getStockStatus(r.stock, r.low_stock_alert),
      image_url: primary?.url ?? r.product_images[0]?.url ?? null,
    };
  });

  if (statusFilter && statusFilter !== "all") {
    items = items.filter((item) => item.status === statusFilter);
  }

  return items;
}

export async function adjustStock(input: StockAdjustmentInput): Promise<void> {
  const { product_id, quantity, reason, notes } = input;

  const { data, error } = await supabase.rpc("adjust_product_stock", {
    p_product_id: product_id,
    p_quantity: quantity,
    p_reason: reason,
    p_notes: notes ?? null,
    p_allow_negative: false,
  });

  if (error) throw error;
  const result = (data as unknown) as AdjustStockResult;
  if (!result.success) {
    if (result.error === "product_not_found") {
      throw new Error("Product not found");
    }
    throw new Error(
      result.error === "insufficient_stock"
        ? `Insufficient stock. Available: ${result.available}, requested: ${-(quantity)}`
        : (result.error ?? "Stock adjustment failed"),
    );
  }
}

export async function fetchInventoryHistory(
  productId: string,
): Promise<InventoryHistoryEntry[]> {
  const { data, error } = await supabase
    .from("inventory_history")
    .select("*")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return ((data as InventoryHistoryRow[]) ?? []).map((r) => ({
    id: r.id,
    product_id: r.product_id,
    change: r.change,
    previous_stock: r.previous_stock,
    new_stock: r.new_stock,
    reason: r.reason as AdjustmentReason,
    notes: r.notes,
    created_by: r.created_by,
    created_at: r.created_at,
  }));
}
