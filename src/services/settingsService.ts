import { supabase } from "@/integrations/supabase/client";

export interface PublicStoreSettings {
  brand: {
    store_name: string;
    tagline: string;
    business_email?: string;
    business_address?: string;
  };
  contact: {
    instagram_url: string;
    pinterest_url: string;
    support_email: string;
    support_phone?: string;
    whatsapp_number?: string;
    atelier_address?: string;
  };
  shipping: {
    free_shipping_threshold: number;
    currency: string;
  };
}

export const DEFAULT_PUBLIC_SETTINGS: PublicStoreSettings = {
  brand: {
    store_name: "House of Padmavati",
    tagline: "To the woman who wove my world.",
    business_email: "concierge@houseofpadmavati.com",
    business_address: "Bangalore, Karnataka",
  },
  contact: {
    instagram_url: "https://instagram.com/houseofpadmavati",
    pinterest_url: "https://pinterest.com/houseofpadmavati",
    support_email: "concierge@houseofpadmavati.com",
    support_phone: "",
    whatsapp_number: "",
    atelier_address: "Bangalore, Karnataka",
  },
  shipping: {
    free_shipping_threshold: 5000,
    currency: "INR",
  },
};

export async function fetchPublicStoreSettings(): Promise<PublicStoreSettings> {
  try {
    const { data, error } = await supabase.rpc("get_public_store_settings");
    if (error || !data) {
      if (error) {
        console.warn("Supabase public settings RPC failed:", error.message);
      }
      return DEFAULT_PUBLIC_SETTINGS;
    }
    const res = data as unknown as PublicStoreSettings;
    return {
      brand: {
        store_name: res.brand?.store_name || DEFAULT_PUBLIC_SETTINGS.brand.store_name,
        tagline: res.brand?.tagline || DEFAULT_PUBLIC_SETTINGS.brand.tagline,
        business_email: res.brand?.business_email || DEFAULT_PUBLIC_SETTINGS.brand.business_email,
        business_address: res.brand?.business_address || DEFAULT_PUBLIC_SETTINGS.brand.business_address,
      },
      contact: {
        instagram_url: res.contact?.instagram_url || DEFAULT_PUBLIC_SETTINGS.contact.instagram_url,
        pinterest_url: res.contact?.pinterest_url || DEFAULT_PUBLIC_SETTINGS.contact.pinterest_url,
        support_email: res.contact?.support_email || DEFAULT_PUBLIC_SETTINGS.contact.support_email,
        support_phone: res.contact?.support_phone || DEFAULT_PUBLIC_SETTINGS.contact.support_phone,
        whatsapp_number: res.contact?.whatsapp_number || DEFAULT_PUBLIC_SETTINGS.contact.whatsapp_number,
        atelier_address: res.contact?.atelier_address || DEFAULT_PUBLIC_SETTINGS.contact.atelier_address,
      },
      shipping: {
        free_shipping_threshold: res.shipping?.free_shipping_threshold || DEFAULT_PUBLIC_SETTINGS.shipping.free_shipping_threshold,
        currency: res.shipping?.currency || DEFAULT_PUBLIC_SETTINGS.shipping.currency,
      },
    };
  } catch (err) {
    console.warn("Exception fetching public store settings:", err);
    return DEFAULT_PUBLIC_SETTINGS;
  }
}
