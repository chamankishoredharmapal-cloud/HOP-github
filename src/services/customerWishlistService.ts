import { supabase } from "@/integrations/supabase/client";

export async function fetchWishlistProductIds(customerId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from("customer_wishlists")
    .select("product_id")
    .eq("customer_id", customerId);
  if (error) throw error;
  return (data ?? []).map((r) => r.product_id);
}

export async function addToWishlist(
  customerId: string,
  productId: string
): Promise<void> {
  const { error } = await supabase
    .from("customer_wishlists")
    .upsert({ customer_id: customerId, product_id: productId }, { onConflict: "customer_id,product_id" });
  if (error) throw error;
}

export async function removeFromWishlist(
  customerId: string,
  productId: string
): Promise<void> {
  const { error } = await supabase
    .from("customer_wishlists")
    .delete()
    .eq("customer_id", customerId)
    .eq("product_id", productId);
  if (error) throw error;
}
