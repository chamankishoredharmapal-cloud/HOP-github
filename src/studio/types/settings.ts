export interface StoreSettings {
  brand: BrandSettings;
  contact: ContactSettings;
  shipping: ShippingSettings;
  seo: SeoSettings;
  inventory: InventorySettings;
  security: SecuritySettings;
}

export interface BrandSettings {
  store_name: string;
  tagline: string;
  logo_url: string | null;
  favicon_url: string | null;
  business_address: string;
  business_email: string;
  business_phone: string;
}

export interface ContactSettings {
  support_email: string;
  support_phone: string;
  whatsapp_number: string;
  instagram_url: string;
  pinterest_url: string;
  atelier_address: string;
}

export interface ShippingSettings {
  default_origin_country: string;
  free_shipping_threshold: number;
  standard_rate: number;
  express_rate: number;
  overnight_rate: number;
  currency: string;
  tax_rate: number;
}

export interface SeoSettings {
  default_title: string;
  default_description: string;
  default_og_image: string | null;
  google_analytics_id: string;
  google_tag_manager_id: string;
  facebook_pixel_id: string;
}

export interface InventorySettings {
  low_stock_threshold: number;
  allow_negative_stock: boolean;
  out_of_stock_behaviour: "hide" | "show" | "backorder";
}

export interface SecuritySettings {
  allowed_roles: string[];
  require_2fa: boolean;
  session_timeout_minutes: number;
}
