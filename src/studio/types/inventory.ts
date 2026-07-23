export type AdjustmentReason =
  | "initial_stock"
  | "purchase"
  | "sale"
  | "return"
  | "damage"
  | "manual_adjustment"
  | "correction";

export const ADJUSTMENT_REASON_LABELS: Record<AdjustmentReason, string> = {
  initial_stock: "Initial Stock",
  purchase: "Purchase",
  sale: "Sale",
  return: "Return",
  damage: "Damage",
  manual_adjustment: "Manual Adjustment",
  correction: "Correction",
};

export const ADJUSTMENT_REASONS: AdjustmentReason[] = [
  "initial_stock",
  "purchase",
  "sale",
  "return",
  "damage",
  "manual_adjustment",
  "correction",
];

export type StockStatus = "healthy" | "low_stock" | "out_of_stock";

export interface InventoryMetrics {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  reservedStock: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  slug: string;
  collection_name: string | null;
  available_stock: number;
  low_stock_alert: number;
  status: StockStatus;
  image_url: string | null;
}

export interface InventoryHistoryEntry {
  id: string;
  product_id: string;
  change: number;
  previous_stock: number;
  new_stock: number;
  reason: AdjustmentReason;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface StockAdjustmentInput {
  product_id: string;
  quantity: number;
  reason: AdjustmentReason;
  notes?: string;
}

export function getStockStatus(stock: number, lowStockAlert: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= lowStockAlert) return "low_stock";
  return "healthy";
}

export const STOCK_STATUS_LABELS: Record<StockStatus, string> = {
  healthy: "Healthy",
  low_stock: "Low Stock",
  out_of_stock: "Out of Stock",
};

export const STOCK_STATUS_STYLES: Record<StockStatus, string> = {
  healthy: "bg-teal-deep/10 text-teal-deep",
  low_stock: "bg-sakura/20 text-ink",
  out_of_stock: "bg-muted text-muted-foreground",
};
