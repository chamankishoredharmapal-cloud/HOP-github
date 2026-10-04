import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type CustomerProfile = Tables<"customers">;
export type CustomerAddress = Tables<"shipping_addresses">;

export interface FullCustomerProfile {
  customer: CustomerProfile | null;
  addresses: CustomerAddress[];
  defaultAddress: CustomerAddress | null;
}

export async function fetchProfile(customerId: string): Promise<CustomerProfile | null> {
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", customerId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function fetchProfileByEmail(email: string): Promise<CustomerProfile | null> {
  if (!email) return null;
  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .ilike("email", email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * High-performance single roundtrip retrieval of customer profile,
 * saved addresses, and default address.
 */
export async function getCurrentCustomerProfile(): Promise<FullCustomerProfile> {
  try {
    const { data, error } = await supabase.rpc("get_current_customer_profile");
    if (!error && data && data.success) {
      return {
        customer: (data.customer as CustomerProfile) ?? null,
        addresses: (data.addresses as CustomerAddress[]) ?? [],
        defaultAddress: (data.default_address as CustomerAddress) ?? null,
      };
    }
  } catch (err) {
    console.warn("RPC get_current_customer_profile unavailable, falling back:", err);
  }

  // Graceful fallback if RPC is not yet migrated or mocked
  const { data: authData } = await supabase.auth.getUser();
  const user = authData?.user;
  if (!user || !user.email) {
    return { customer: null, addresses: [], defaultAddress: null };
  }

  const customer = await fetchProfileByEmail(user.email);
  if (!customer) {
    return { customer: null, addresses: [], defaultAddress: null };
  }

  const { data: addressesData, error: addrError } = await supabase
    .from("shipping_addresses")
    .select("*")
    .eq("customer_id", customer.id)
    .order("created_at", { ascending: false });

  if (addrError) throw addrError;
  const addresses = addressesData ?? [];
  const defaultAddress = addresses.find((a) => a.is_default) || addresses[0] || null;

  return { customer, addresses, defaultAddress };
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
  const normalizedPhone = phone ? normalizePhone(phone) : null;
  try {
    const { data, error } = await supabase.rpc("upsert_customer_profile", {
      p_email: email.trim().toLowerCase(),
      p_full_name: fullName.trim(),
      p_phone: normalizedPhone,
    });
    if (!error && data) {
      return data as { success: boolean; id: string };
    }
  } catch {
    // If 3-arg RPC fails, try 2-arg legacy RPC
    const { data, error } = await supabase.rpc("upsert_customer_profile", {
      p_email: email.trim().toLowerCase(),
      p_full_name: fullName.trim(),
    });
    if (error) throw error;
    return data as { success: boolean; id: string };
  }

  // Final fallback to direct upsert
  const { data: direct, error: directError } = await supabase
    .from("customers")
    .upsert(
      {
        email: email.trim().toLowerCase(),
        full_name: fullName.trim(),
        phone: normalizedPhone,
      },
      { onConflict: "email" }
    )
    .select("id")
    .single();

  if (directError) throw directError;
  return { success: true, id: direct.id };
}

export async function updateProfile(
  customerId: string,
  updates: Partial<Pick<CustomerProfile, "full_name" | "phone">>
): Promise<CustomerProfile> {
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

  const { error: profileError } = await supabase
    .from("customers")
    .update({ email: newEmail.toLowerCase() })
    .eq("id", customerId);
  if (profileError) throw profileError;
}

export async function deleteAccount(customerId: string): Promise<void> {
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