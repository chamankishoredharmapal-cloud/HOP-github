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

export async function upsertCustomerProfile(
  email: string,
  fullName: string,
  phone?: string | null
): Promise<{ success: boolean; id: string }> {
  const { data, error } = await supabase.rpc("upsert_customer_profile", {
    p_email: email,
    p_full_name: fullName,
  });
  if (error) throw error;
  return data as { success: boolean; id: string };
}

export async function updateProfile(
  customerId: string,
  updates: Partial<Pick<CustomerProfile, "full_name" | "phone">>
): Promise<CustomerProfile> {
  // Normalize phone if provided
  const normalizedUpdates = { ...updates };
  if (updates.phone !== undefined && updates.phone !== null && updates.phone !== "") {
    normalizedUpdates.phone = normalizePhone(updates.phone);
  }
  
  const { data, error } = await supabase
    .from("customers")
    .update(normalizedUpdates)
    .eq("id", customerId)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateEmail(
  customerId: string,
  newEmail: string
): Promise<void> {
  const { error } = await supabase.auth.updateUser({
    email: newEmail,
  });
  if (error) throw error;
  
  // Also update the email in the customers table
  const { error: profileError } = await supabase
    .from("customers")
    .update({ email: newEmail.toLowerCase() })
    .eq("id", customerId);
  if (profileError) throw profileError;
}

export async function deleteAccount(customerId: string): Promise<void> {
  // Delete the user from Supabase Auth (this will cascade to related data via RLS policies)
  const { error } = await supabase.auth.admin.deleteUser(customerId);
  if (error) throw error;
}

// Phone normalization utility
export function normalizePhone(phone: string): string {
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