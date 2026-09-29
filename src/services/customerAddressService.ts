import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Address = Tables<"shipping_addresses">;

// Phone normalization utility
function normalizePhone(phone: string): string {
  if (!phone) return phone;
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return `+91${digits.slice(1)}`;
  }
  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }
  return phone;
}

export async function fetchAddresses(customerId: string): Promise<Address[]> {
  const { data, error } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("customer_id", customerId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function createAddress(
  input: TablesInsert<"shipping_addresses">
): Promise<Address> {
  // Normalize phone if provided
  const normalizedInput = { ...input };
  if (input.phone !== undefined && input.phone !== null && input.phone !== "") {
    normalizedInput.phone = normalizePhone(input.phone);
  }
  
  const { data, error } = await supabase
    .from("shipping_addresses")
    .insert(normalizedInput)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAddress(
  id: string,
  updates: TablesUpdate<"shipping_addresses">,
  customerId: string
): Promise<Address> {
  // Normalize phone if provided
  const normalizedUpdates = { ...updates };
  if (updates.phone !== undefined && updates.phone !== null && updates.phone !== "") {
    normalizedUpdates.phone = normalizePhone(updates.phone);
  }
  
  const { data, error } = await supabase
    .from("shipping_addresses")
    .update(normalizedUpdates)
    .eq("id", id)
    .eq("customer_id", customerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id: string, customerId: string): Promise<void> {
  const { error } = await supabase
    .from("shipping_addresses")
    .delete()
    .eq("id", id)
    .eq("customer_id", customerId);
  if (error) throw error;
}

export async function setDefaultAddress(addressId: string): Promise<{ success: boolean; address_id: string }> {
  const { data, error } = await supabase.rpc("set_default_address", {
    p_address_id: addressId,
  });
  if (error) throw error;
  return data as { success: boolean; address_id: string };
}

export async function getDefaultAddress(customerId: string): Promise<{ success: boolean; address: Address | null }> {
  const { data, error } = await supabase.rpc("get_default_address", {
    p_customer_id: customerId,
  });
  if (error) throw error;
  return data as { success: boolean; address: Address | null };
}
