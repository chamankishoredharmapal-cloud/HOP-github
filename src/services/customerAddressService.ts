import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert, TablesUpdate } from "@/integrations/supabase/types";
import { normalizePhone } from "./customerProfileService";

type Address = Tables<"shipping_addresses">;

export interface SaveAddressInput {
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  landmark?: string | null;
  address_type?: string;
  is_default?: boolean;
  address_id?: string;
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

export async function saveCustomerAddress(
  input: SaveAddressInput,
  customerId?: string
): Promise<{ success: boolean; address_id: string; is_default: boolean }> {
  try {
    const { data, error } = await supabase.rpc("save_customer_address", {
      p_recipient_name: input.recipient_name.trim(),
      p_phone: normalizePhone(input.phone),
      p_address: input.address.trim(),
      p_city: input.city.trim(),
      p_state: input.state.trim(),
      p_postal_code: input.postal_code.trim(),
      p_country: input.country?.trim() || "India",
      p_landmark: input.landmark?.trim() || null,
      p_address_type: input.address_type?.trim() || "HOME",
      p_set_as_default: input.is_default ?? false,
      p_address_id: input.address_id || null,
    });
    if (!error && data) {
      return data as { success: boolean; address_id: string; is_default: boolean };
    }
  } catch (err) {
    console.warn("RPC save_customer_address unavailable, falling back:", err);
  }

  // Direct table operation fallback
  if (input.address_id && customerId) {
    const updated = await updateAddress(
      input.address_id,
      {
        recipient_name: input.recipient_name,
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        postal_code: input.postal_code,
        country: input.country || "India",
        landmark: input.landmark,
        address_type: input.address_type || "HOME",
        is_default: input.is_default,
      },
      customerId
    );
    if (input.is_default) {
      await setDefaultAddress(updated.id);
    }
    return { success: true, address_id: updated.id, is_default: !!input.is_default };
  } else if (customerId) {
    const created = await createAddress({
      customer_id: customerId,
      recipient_name: input.recipient_name,
      phone: input.phone,
      address: input.address,
      city: input.city,
      state: input.state,
      postal_code: input.postal_code,
      country: input.country || "India",
      landmark: input.landmark,
      address_type: input.address_type || "HOME",
      is_default: input.is_default,
    });
    if (input.is_default) {
      await setDefaultAddress(created.id);
    }
    return { success: true, address_id: created.id, is_default: !!input.is_default };
  }
  throw new Error("Unable to save address: missing customer identifier");
}

export async function createAddress(
  input: TablesInsert<"shipping_addresses">
): Promise<Address> {
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
