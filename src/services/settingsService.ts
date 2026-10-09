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
    standard_shipping_rate: number;
    free_shipping_threshold: number;
    currency: string;
  };
  homepage_cinematic_video: {
    video_url: string;
    poster_url: string;
    alt_text: string;
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
    standard_shipping_rate: 99,
    free_shipping_threshold: 5000,
    currency: "INR",
  },
  homepage_cinematic_video: {
    video_url: "",
    poster_url: "",
    alt_text: "House of Padmavati — Homepage cinematic film",
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
        standard_shipping_rate: res.shipping?.standard_shipping_rate || DEFAULT_PUBLIC_SETTINGS.shipping.standard_shipping_rate,
        free_shipping_threshold: res.shipping?.free_shipping_threshold || DEFAULT_PUBLIC_SETTINGS.shipping.free_shipping_threshold,
        currency: res.shipping?.currency || DEFAULT_PUBLIC_SETTINGS.shipping.currency,
      },
      homepage_cinematic_video: {
        video_url: res.homepage_cinematic_video?.video_url || DEFAULT_PUBLIC_SETTINGS.homepage_cinematic_video.video_url,
        poster_url: res.homepage_cinematic_video?.poster_url || DEFAULT_PUBLIC_SETTINGS.homepage_cinematic_video.poster_url,
        alt_text: res.homepage_cinematic_video?.alt_text || DEFAULT_PUBLIC_SETTINGS.homepage_cinematic_video.alt_text,
      },
    };
  } catch (err) {
    console.warn("Exception fetching public store settings:", err);
    return DEFAULT_PUBLIC_SETTINGS;
  }
}
