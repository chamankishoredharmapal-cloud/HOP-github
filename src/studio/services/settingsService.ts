import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import type { StoreSettings } from "../types/settings";

const SETTINGS_KEY = "store_settings";

const DEFAULT_SETTINGS: StoreSettings = {
  brand: {
    store_name: "The House of Padmavati",
    tagline: "To the woman who wove my world.",
    logo_url: null,
    favicon_url: null,
    business_address: "",
    business_email: "concierge@houseofpadmavati.com",
    business_phone: "",
  },
  contact: {
    support_email: "concierge@houseofpadmavati.com",
    support_phone: "",
    whatsapp_number: "",
    instagram_url: "https://instagram.com/houseofpadmavati",
    pinterest_url: "https://pinterest.com/houseofpadmavati",
    atelier_address: "",
  },
  shipping: {
    default_origin_country: "IN",
    free_shipping_threshold: 5000,
    standard_rate: 99,
    express_rate: 500,
    overnight_rate: 1000,
    currency: "INR",
    tax_rate: 18,
  },
  seo: {
    default_title: "House of Padmavati",
    default_description: "A digital fashion house for Indian sarees.",
    default_og_image: null,
    google_analytics_id: "",
    google_tag_manager_id: "",
    facebook_pixel_id: "",
  },
  inventory: {
    low_stock_threshold: 5,
    allow_negative_stock: false,
    out_of_stock_behaviour: "hide",
  },
  security: {
    allowed_roles: ["admin", "manager", "editor", "viewer"],
    require_2fa: false,
    session_timeout_minutes: 120,
  },
  homepage_cinematic_video: {
    video_url: "",
    poster_url: "",
    alt_text: "House of Padmavati — Homepage cinematic film",
  },
};

export async function fetchSettings(): Promise<StoreSettings> {
  const { data, error } = await supabase
    .from("settings")
    .select("key, value")
    .eq("key", SETTINGS_KEY)
    .maybeSingle();

  if (error) throw error;

  if (data?.value) {
    return { ...DEFAULT_SETTINGS, ...(data.value as Partial<StoreSettings>) };
  }

  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: StoreSettings): Promise<void> {
  const { error } = await supabase.from("settings").upsert(
    { key: SETTINGS_KEY, value: settings as unknown as Json, updated_at: new Date().toISOString() },
    { onConflict: "key" }
  );
  if (error) throw error;
}
