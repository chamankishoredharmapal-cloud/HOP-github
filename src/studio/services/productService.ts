import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Product, ProductFormData, ProductImage, ProductStatus, Collection, ProductsListResponse } from "../types/product";

interface ProductRow {
  id: string;
  sku: string;
  name: string;
  slug: string;
  story: string | null;
  short_description: string | null;
  customer_description: string | null;
  selling_price: number;
  mrp: number;
  cost_price: number;
  stock: number;
  low_stock_alert: number;
  fabric: string | null;
  weave: string | null;
  colour: string | null;
  occasion: string | null;
  length: string | null;
  weight: string | null;
  blouse_included: boolean;
  care_instructions: string | null;
  country_of_origin: string | null;
  estimated_dispatch_days: number;
  collection_id: string | null;
  featured: boolean;
  status: ProductStatus;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  collections?: { name: string } | null;
  created_at: string;
  updated_at: string;
  [others: string]: unknown;
}

interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
  [others: string]: unknown;
}

function mapRow(row: ProductRow): Product {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    slug: row.slug,
    story: row.story ?? "",
    short_description: row.short_description ?? "",
    customer_description: row.customer_description ?? "",
    selling_price: row.selling_price,
    mrp: row.mrp,
    cost_price: row.cost_price,
    stock: row.stock,
    low_stock_alert: row.low_stock_alert,
    fabric: row.fabric ?? "",
    weave: row.weave ?? "",
    colour: row.colour ?? "",
    occasion: row.occasion ?? "",
    length: row.length ?? "",
    weight: row.weight ?? "",
    blouse_included: row.blouse_included,
    care_instructions: row.care_instructions ?? "",
    country_of_origin: row.country_of_origin ?? "India",
    estimated_dispatch_days: row.estimated_dispatch_days,
    collection_id: row.collection_id,
    featured: row.featured,
    status: row.status,
    meta_title: row.meta_title ?? "",
    meta_description: row.meta_description ?? "",
    og_image_url: row.og_image_url,
    images: [],
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

function mapImages(r: ProductImageRow): ProductImage {
  return {
    id: r.id,
    product_id: r.product_id,
    url: r.url,
    alt_text: r.alt_text,
    sort_order: r.sort_order,
    is_primary: r.is_primary,
  };
}

export async function fetchProducts(): Promise<ProductsListResponse[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id, sku, name, slug, status, selling_price, stock, featured, created_at, updated_at,
      collections!left(name)
    `)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data as ProductRow[]) ?? []).map((r) => ({
    id: r.id,
    sku: r.sku,
    name: r.name,
    slug: r.slug,
    status: r.status,
    selling_price: r.selling_price,
    stock: r.stock,
    featured: r.featured,
    created_at: r.created_at,
    updated_at: r.updated_at,
    collection_name: r.collections?.name ?? undefined,
  }));
}

export async function fetchProduct(id: string): Promise<Product> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;

  const product = mapRow(data as unknown as ProductRow);

  const { data: images, error: imgErr } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });
  if (!imgErr) {
    product.images = (images as ProductImageRow[] ?? []).map(mapImages);
  }
  return product;
}

export async function createProduct(data: ProductFormData): Promise<Product> {
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const { data: row, error } = await supabase
    .from("products")
    .insert({
      title: data.name,
      sku: data.sku,
      name: data.name,
      slug,
      story: data.story,
      short_description: data.short_description,
      customer_description: data.customer_description,
      selling_price: data.selling_price,
      mrp: data.mrp,
      cost_price: data.cost_price,
      stock: data.stock,
      low_stock_alert: data.low_stock_alert,
      fabric: data.fabric,
      weave: data.weave,
      colour: data.colour,
      occasion: data.occasion,
      length: data.length,
      weight: data.weight,
      blouse_included: data.blouse_included,
      care_instructions: data.care_instructions,
      country_of_origin: data.country_of_origin,
      estimated_dispatch_days: data.estimated_dispatch_days,
      collection_id: data.collection_id,
      featured: data.featured,
      status: data.status,
      meta_title: data.meta_title,
      meta_description: data.meta_description,
      og_image_url: data.og_image_url,
    } as unknown as Database["public"]["Tables"]["products"]["Insert"])
    .select()
    .single();
  if (error) throw error;
  return mapRow(row as unknown as ProductRow);
}

export async function updateProduct(id: string, data: Partial<ProductFormData>): Promise<void> {
  const payload: Record<string, unknown> = {};
  const fields: (keyof ProductFormData)[] = [
    "sku", "name", "slug", "story", "short_description", "customer_description",
    "selling_price", "mrp", "cost_price", "stock", "low_stock_alert",
    "fabric", "weave", "colour", "occasion", "length", "weight",
    "blouse_included", "care_instructions", "country_of_origin",
    "estimated_dispatch_days", "collection_id", "featured", "status",
    "meta_title", "meta_description", "og_image_url",
  ];
  for (const f of fields) {
    if (f in data) payload[f] = data[f as keyof typeof data];
  }
  const { error } = await supabase.from("products").update(payload as unknown as Database["public"]["Tables"]["products"]["Update"]).eq("id", id);
  if (error) throw error;
}

export async function updateProductStatus(id: string, status: ProductStatus): Promise<void> {
  const { error } = await supabase.from("products").update({ status }).eq("id", id);
  if (error) throw error;
}

export async function uploadImage(
  productId: string,
  file: File,
  isPrimary: boolean,
): Promise<ProductImage> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const filePath = `${productId}/${uuidv4()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("product-images")
    .upload(filePath, file);
  if (uploadErr) throw uploadErr;

  const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath);
  const url = urlData.publicUrl;

  const { data: maxRow } = await supabase
    .from("product_images")
    .select("sort_order")
    .eq("product_id", productId)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextOrder = ((maxRow as unknown as { sort_order: number }[])?.[0]?.sort_order ?? -1) + 1;

  if (isPrimary) {
    await supabase
      .from("product_images")
      .update({ is_primary: false })
      .eq("product_id", productId);
  }

  const { data: img, error: insErr } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url, alt_text: null, sort_order: nextOrder, is_primary: isPrimary })
    .select()
    .single();
  if (insErr) throw insErr;

  return mapImages(img as ProductImageRow);
}

export async function deleteImage(imageId: string): Promise<void> {
  const { data: img } = await supabase
    .from("product_images")
    .select("url")
    .eq("id", imageId)
    .single();
  if (!img) return;

  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;

  const url = (img as { url: string }).url;
  const bucketBase = "/storage/v1/object/public/product-images/";
  const idx = url.indexOf(bucketBase);
  if (idx !== -1) {
    const storagePath = url.substring(idx + bucketBase.length);
    if (storagePath) {
      await supabase.storage.from("product-images").remove([storagePath]);
    }
  }
}

export async function reorderImages(productId: string, orderedIds: string[]): Promise<void> {
  const updates = orderedIds.map((id, idx) =>
    supabase.from("product_images").update({ sort_order: idx }).eq("id", id),
  );
  await Promise.all(updates);
}

export async function setPrimaryImage(imageId: string, productId: string): Promise<void> {
  await supabase
    .from("product_images")
    .update({ is_primary: false })
    .eq("product_id", productId);
  const { error } = await supabase
    .from("product_images")
    .update({ is_primary: true })
    .eq("id", imageId);
  if (error) throw error;
}

export async function fetchCollections(): Promise<Collection[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return (data ?? []) as Collection[];
}
