export type ProductStatus = "draft" | "review" | "published" | "archived";

export interface Collection {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  story: string;
  short_description: string;
  customer_description: string;
  selling_price: number;
  mrp: number;
  cost_price: number;
  stock: number;
  low_stock_alert: number;
  fabric: string;
  weave: string;
  colour: string;
  occasion: string;
  length: string;
  weight: string;
  blouse_included: boolean;
  care_instructions: string;
  country_of_origin: string;
  estimated_dispatch_days: number;
  collection_id: string | null;
  collection_name?: string;
  featured: boolean;
  status: ProductStatus;
  meta_title: string;
  meta_description: string;
  og_image_url: string | null;
  images: ProductImage[];
  created_at: string;
  updated_at: string;
}

export type ProductFormData = Omit<Product, "id" | "created_at" | "updated_at" | "images" | "collection_name">;

export interface EditorialChecklistItem {
  label: string;
  key: string;
  done: boolean;
}

export interface ProductsListResponse {
  id: string;
  sku: string;
  name: string;
  slug: string;
  status: ProductStatus;
  selling_price: number;
  stock: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  collection_name?: string;
  hero_image_url?: string;
}
