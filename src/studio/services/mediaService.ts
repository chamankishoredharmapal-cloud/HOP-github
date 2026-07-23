import { supabase } from "@/integrations/supabase/client";
import type { MediaItem, MediaListParams, MediaListResponse } from "../types/media";

const STORAGE_BUCKET = "product-images";

export async function fetchMediaList(
  params: MediaListParams
): Promise<MediaListResponse> {
  const {
    search,
    type = "all",
    folder,
    sortBy = "created_at",
    sortDir = "desc",
    page = 1,
    perPage = 20,
  } = params;

  let query = supabase
    .from("product_images")
    .select("*, products!left(id, name)", { count: "exact" });

  query = query.order("created_at", { ascending: false });

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  query = query.range(from, to);

  const { data, error, count } = await query;
  if (error) throw error;

  const total = count ?? 0;

  const raw = (data ?? []) as Array<{
    id: string;
    url: string;
    alt_text: string | null;
    sort_order: number;
    created_at: string;
    products?: { id: string; name: string } | null;
  }>;

  const items: MediaItem[] = raw.map((r) => ({
    id: r.id,
    name: r.alt_text ?? `Image-${r.id.slice(0, 8)}`,
    url: r.url,
    type: "image" as const,
    mime_type: "image/webp",
    file_size: 0,
    width: null,
    height: null,
    folder: null,
    alt_text: r.alt_text,
    created_at: r.created_at,
    updated_at: r.created_at,
    product_id: r.products?.id ?? null,
    product_name: r.products?.name ?? null,
  }));

  return { items, total, page, totalPages: Math.ceil(total / perPage), folders: [] };
}

export async function uploadMedia(
  file: File,
  altText?: string
): Promise<MediaItem> {
  const filePath = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(filePath);

  const publicUrl = urlData?.publicUrl ?? "";

  const { data, error: dbError } = await supabase
    .from("product_images")
    .insert({
      url: publicUrl,
      alt_text: altText ?? null,
      sort_order: 0,
      is_primary: false,
    })
    .select("*, products!left(id, name)")
    .single();

  if (dbError) throw dbError;

  return {
    id: data.id,
    name: altText ?? file.name,
    url: data.url,
    type: "image",
    mime_type: file.type,
    file_size: file.size,
    width: null,
    height: null,
    folder: null,
    alt_text: data.alt_text,
    created_at: data.created_at,
    updated_at: data.created_at,
    product_id: null,
    product_name: null,
  };
}

export async function updateMedia(
  id: string,
  updates: { alt_text?: string | null }
): Promise<void> {
  const { error } = await supabase
    .from("product_images")
    .update(updates)
    .eq("id", id);
  if (error) throw error;
}

export async function deleteMedia(id: string): Promise<void> {
  const { data, error: fetchError } = await supabase
    .from("product_images")
    .select("url")
    .eq("id", id)
    .single();

  if (fetchError) throw fetchError;

  const { error } = await supabase.from("product_images").delete().eq("id", id);
  if (error) throw error;

  if (data?.url) {
    const path = data.url.split("/").pop();
    if (path) {
      await supabase.storage.from(STORAGE_BUCKET).remove([path]);
    }
  }
}

export async function fetchMediaFolders(): Promise<string[]> {
  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).list();
  if (error) throw error;
  return data.map((f) => f.name);
}
