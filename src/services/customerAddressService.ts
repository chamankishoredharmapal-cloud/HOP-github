import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type Address = Tables<"shipping_addresses">;

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
  const { data, error } = await supabase
    .from("shipping_addresses")
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateAddress(
  id: string,
  updates: TablesUpdate<"shipping_addresses">
): Promise<Address> {
  const { data, error } = await supabase
    .from("shipping_addresses")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id: string): Promise<void> {
  const { error } = await supabase.from("shipping_addresses").delete().eq("id", id);
  if (error) throw error;
}
