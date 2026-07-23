import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

type CustomerProfile = Tables<"customers">;

export async function fetchProfile(customerId: string): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(
  input: TablesInsert<"customers">
): Promise<CustomerProfile> {
  const { data, error } = await supabase
    .from("customers")
    .upsert(input, { onConflict: "id" })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile(
  customerId: string,
  updates: Partial<Pick<CustomerProfile, "full_name" | "phone">>
): Promise<CustomerProfile> {
  const { data, error } = await supabase
    .from("customers")
    .update(updates)
    .eq("id", customerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}
