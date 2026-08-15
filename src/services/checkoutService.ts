import { supabase } from "@/integrations/supabase/client";
import type { CartItem } from "@/contexts/CartContext";
import { validateInventoryForCheckout } from "./inventoryService";

export interface CheckoutValidationResult {
  valid: boolean;
  errors: string[];
  serverTotal?: number;
  serverSubtotal?: number;
  serverShipping?: number;
}

const SHIPPING_COST: Record<string, number> = {
  standard: 0,
  express: 800,
  overnight: 2400,
};

export async function validateCheckout(
  items: CartItem[],
  shippingOption: string
): Promise<CheckoutValidationResult> {
  const errors: string[] = [];

  if (!items || items.length === 0) {
    return { valid: false, errors: ["Your bag is empty"] };
  }

  for (const item of items) {
    if (item.quantity <= 0) {
      errors.push("Invalid quantity detected in your bag");
    }
    if (!item.productId) {
      errors.push("Invalid product in your bag");
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const { valid: stockValid, errors: stockErrors } = await validateInventoryForCheckout(
    items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
  );

  if (!stockValid) {
    errors.push(...stockErrors);
  }

  if (!(shippingOption in SHIPPING_COST)) {
    errors.push("Invalid shipping option");
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  const productIds = items.map((i) => i.productId);
  const { data: products } = await supabase
    .from("products")
    .select("id, selling_price")
    .in("id", productIds);

  if (!products || products.length !== productIds.length) {
    errors.push("Some products could not be verified");
    return { valid: false, errors };
  }

  const priceMap = new Map(products.map((p) => [p.id, p.selling_price]));
  let serverSubtotal = 0;

  for (const item of items) {
    const serverPrice = priceMap.get(item.productId);
    if (!serverPrice) {
      errors.push(`Product ${item.name} is no longer available`);
      continue;
    }
    const clientPrice = item.price;
    if (Math.abs(clientPrice - serverPrice) > 1) {
      errors.push(`Pricing error for ${item.name}. Please refresh your bag.`);
    }
    serverSubtotal += serverPrice * item.quantity;
  }

  const serverShipping = SHIPPING_COST[shippingOption] ?? 0;

  return {
    valid: errors.length === 0,
    errors,
    serverTotal: serverSubtotal + serverShipping,
    serverSubtotal,
    serverShipping,
  };
}


