import { supabase } from "@/integrations/supabase/client";

interface ProductRow {
  id: string;
  name: string;
  slug: string;
  story: string | null;
  short_description: string | null;
  customer_description?: string | null;
  selling_price: number;
  mrp: number;
  stock?: number;
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
  status: string;
  collections: { name: string } | null;
}

interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface StorefrontProductImage {
  id: string;
  url: string;
  alt_text: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface StorefrontProduct {
  id: string;
  name: string;
  slug: string;
  story: string;
  short_description: string;
  customer_description?: string;
  selling_price: number;
  mrp: number;
  stock?: number;
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
  collection_name: string | null;
  featured: boolean;
  images: StorefrontProductImage[];
}

function mapImages(rows: ProductImageRow[]): StorefrontProductImage[] {
  const sorted = [...rows].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  return sorted.map((r) => ({
    id: r.id,
    url: r.url,
    alt_text: r.alt_text,
    sort_order: r.sort_order,
    is_primary: r.is_primary,
  }));
}

function mapProduct(d: ProductRow, images: StorefrontProductImage[]): StorefrontProduct {
  return {
    id: d.id,
    name: d.name,
    slug: d.slug,
    story: d.story ?? "",
    short_description: d.short_description ?? "",
    customer_description: d.customer_description ?? d.short_description ?? "",
    selling_price: d.selling_price,
    mrp: d.mrp,
    stock: d.stock ?? 10,
    fabric: d.fabric ?? "",
    weave: d.weave ?? "",
    colour: d.colour ?? "",
    occasion: d.occasion ?? "",
    length: d.length ?? "",
    weight: d.weight ?? "",
    blouse_included: d.blouse_included,
    care_instructions: d.care_instructions ?? "",
    country_of_origin: d.country_of_origin ?? "India",
    estimated_dispatch_days: d.estimated_dispatch_days,
    collection_id: d.collection_id,
    collection_name: d.collections?.name ?? null,
    featured: d.featured,
    images,
  };
}

export async function fetchProductById(id: string): Promise<StorefrontProduct | null> {
  const { data, error } = await supabase
    .from("products")
    .select(`*, collections!left(name)`)
    .eq("id", id)
    .eq("status", "published")
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  const { data: imageRows } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("sort_order", { ascending: true });

  const images = mapImages((imageRows ?? []) as ProductImageRow[]);
  return mapProduct(data as unknown as ProductRow, images);
}

interface RelatedProductRow {
  id: string;
  name: string;
  slug: string;
  selling_price: number;
  [others: string]: unknown;
}

interface BatchedImageRow {
  product_id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  sort_order: number;
  [others: string]: unknown;
}

function selectHero(imgs: BatchedImageRow[]): BatchedImageRow | undefined {
  return imgs.find((i) => i.is_primary) ?? imgs[0];
}

export async function fetchRelatedProducts(
  collectionId: string,
  excludeProductId: string,
  limit = 4,
): Promise<Pick<StorefrontProduct, "id" | "name" | "slug" | "selling_price" | "images">[]> {
  const { data } = await supabase
    .from("products")
    .select(`id, name, slug, selling_price`)
    .eq("collection_id", collectionId)
    .eq("status", "published")
    .neq("id", excludeProductId)
    .order("created_at", { ascending: false })
    .limit(limit);
  const rows = (data ?? []) as RelatedProductRow[];
  if (rows.length === 0) return [];

  const productIds = rows.map((r) => r.id);
  const { data: allImages } = await supabase
    .from("product_images")
    .select("product_id, url, alt_text, is_primary, sort_order")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  const imagesByProduct: Record<string, BatchedImageRow[]> = {};
  for (const img of (allImages ?? []) as BatchedImageRow[]) {
    const pid = img.product_id;
    if (!imagesByProduct[pid]) imagesByProduct[pid] = [];
    imagesByProduct[pid].push(img);
  }

  return rows.map((r) => {
    const hero = selectHero(imagesByProduct[r.id] ?? []);
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      selling_price: r.selling_price,
      images: hero
        ? [{ id: "", url: hero.url, alt_text: hero.alt_text, sort_order: 0, is_primary: true }]
        : [],
    };
  });
}

interface CollectionProductRow {
  id: string;
  name: string;
  slug: string;
  selling_price: number;
  collections: { slug: string; name: string } | null;
  [others: string]: unknown;
}

export interface CollectionProductsResult {
  collectionName: string;
  collectionSlug: string;
  products: Pick<StorefrontProduct, "id" | "name" | "slug" | "selling_price" | "images">[];
}

export async function fetchProductsByCollection(
  collectionSlug?: string,
): Promise<CollectionProductsResult> {
  let query = supabase
    .from("products")
    .select(`id, name, slug, selling_price, collections!inner(slug, name)`)
    .eq("status", "published");

  if (collectionSlug && collectionSlug !== "all") {
    query = query.eq("collections.slug", collectionSlug);
  }

  const { data } = await query.order("created_at", { ascending: false });

  const rows = (data ?? []) as CollectionProductRow[];
  if (rows.length === 0) {
    return { collectionName: "The Atelier", collectionSlug: collectionSlug ?? "all", products: [] };
  }

  const productIds = rows.map((r) => r.id);
  const { data: allImages } = await supabase
    .from("product_images")
    .select("product_id, url, alt_text, is_primary, sort_order")
    .in("product_id", productIds)
    .order("sort_order", { ascending: true });

  const imagesByProduct: Record<string, BatchedImageRow[]> = {};
  for (const img of (allImages ?? []) as BatchedImageRow[]) {
    const pid = img.product_id;
    if (!imagesByProduct[pid]) imagesByProduct[pid] = [];
    imagesByProduct[pid].push(img);
  }

  let collectionName = "The Atelier";

  const products = rows.map((r) => {
    if (r.collections && collectionSlug !== "all") {
      collectionName = r.collections.name;
    }

    const hero = selectHero(imagesByProduct[r.id] ?? []);
    return {
      id: r.id,
      name: r.name,
      slug: r.slug,
      selling_price: r.selling_price,
      images: hero
        ? [{ id: "", url: hero.url, alt_text: hero.alt_text, sort_order: 0, is_primary: true }]
        : [],
    };
  });

  return { collectionName, collectionSlug: collectionSlug ?? "all", products };
}
