import { supabase } from "@/integrations/supabase/client";

export interface StockCheckItem {
  productId: string;
  quantity: number;
}

export interface StockCheckResult {
  productId: string;
  available: boolean;
  currentStock: number;
  requested: number;
  productName?: string;
}

export interface StockReservation {
  id: string;
  productId: string;
  quantity: number;
  expiresAt: string;
}

export async function checkStock(items: StockCheckItem[]): Promise<StockCheckResult[]> {
  const productIds = items.map((i) => i.productId);
  const { data: products, error } = await supabase
    .from("products")
    .select("id, name, stock")
    .in("id", productIds);

  if (error) throw error;

  const stockMap = new Map((products ?? []).map((p) => [p.id, p]));

  return items.map((item) => {
    const product = stockMap.get(item.productId);
    const currentStock = product?.stock ?? 0;
    return {
      productId: item.productId,
      available: currentStock >= item.quantity,
      currentStock,
      requested: item.quantity,
      productName: product?.name,
    };
  });
}

export async function validateInventoryForCheckout(
  items: StockCheckItem[]
): Promise<{ valid: boolean; errors: string[] }> {
  const results = await checkStock(items);
  const errors: string[] = [];

  for (const r of results) {
    if (!r.available) {
      const name = r.productName ?? r.productId;
      errors.push(`${name} — only ${r.currentStock} available, requested ${r.requested}`);
    }
  }

  return { valid: errors.length === 0, errors };
}
