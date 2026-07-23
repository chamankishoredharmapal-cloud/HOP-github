import { supabase } from "@/integrations/supabase/client";

export interface SearchResult {
  id: string;
  name: string;
  slug: string;
  type: "product" | "collection";
  image: string | null;
  price?: number;
}

export async function searchAll(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  const trimmed = query.trim();

  const [productData, collectionData] = await Promise.all([
    searchProducts(trimmed),
    searchCollections(trimmed),
  ]);

  return [...productData, ...collectionData];
}

async function searchProducts(query: string): Promise<SearchResult[]> {
  const like = `%${query}%`;

  const { data, error } = await supabase
    .from("products")
    .select(`
      id, name, slug, selling_price,
      product_images!left(url, is_primary, sort_order)
    `)
    .or(`name.ilike.${like},sku.ilike.${like},colour.ilike.${like},weave.ilike.${like},fabric.ilike.${like},occasion.ilike.${like},short_description.ilike.${like}`)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) return [];

  return ((data ?? []) as Array<Record<string, unknown>>).map((row: Record<string, unknown>) => {
    const images = (row.product_images as Array<Record<string, unknown>> | undefined) ?? [];
    const hero = images.find((i: Record<string, unknown>) => i.is_primary) ?? images[0];

    return {
      id: row.id as string,
      name: row.name as string,
      slug: row.slug as string,
      type: "product" as const,
      image: (hero?.url as string) ?? null,
      price: row.selling_price as number,
    };
  });
}

async function searchCollections(query: string): Promise<SearchResult[]> {
  const like = `%${query}%`;

  const { data, error } = await supabase
    .from("collections")
    .select("id, name, slug, hero_image_url")
    .or(`name.ilike.${like},tagline.ilike.${like},description.ilike.${like},editorial_story.ilike.${like}`)
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .limit(6);

  if (error) return [];

  return ((data ?? []) as Array<Record<string, string | null>>).map((row) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    type: "collection" as const,
    image: row.hero_image_url,
  }));
}
