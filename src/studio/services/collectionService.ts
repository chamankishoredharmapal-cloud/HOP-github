import { v4 as uuidv4 } from "uuid";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { CollectionDetail } from "@/types/collection";

export type CollectionFormData = {
  name: string;
  slug: string;
  hero_image_url: string | null;
  hero_video_url: string | null;
  editorial_story: string;
  tagline: string;
  description: string;
  display_order: number;
  featured_on_homepage: boolean;
  status: string;
};

interface CollectionRow {
  id: string;
  name: string;
  slug: string;
  hero_image_url: string | null;
  hero_video_url: string | null;
  editorial_story: string | null;
  tagline: string | null;
  description: string | null;
  display_order: number;
  featured_on_homepage: boolean;
  status: string;
  [others: string]: unknown;
}

function mapRow(r: CollectionRow): CollectionDetail {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    hero_image_url: r.hero_image_url,
    hero_video_url: r.hero_video_url,
    editorial_story: r.editorial_story ?? null,
    tagline: r.tagline ?? null,
    description: r.description ?? null,
    display_order: r.display_order,
    featured_on_homepage: r.featured_on_homepage,
    status: r.status ?? "published",
  };
}

export async function fetchAllCollections(): Promise<CollectionDetail[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as CollectionRow[]).map(mapRow);
}

export async function fetchCollectionById(id: string): Promise<CollectionDetail | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return mapRow(data as CollectionRow);
}

export async function createCollection(data: CollectionFormData): Promise<CollectionDetail> {
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  const { data: row, error } = await supabase
    .from("collections")
    .insert({
      name: data.name,
      slug,
      hero_image_url: data.hero_image_url,
      hero_video_url: data.hero_video_url,
      editorial_story: data.editorial_story,
      tagline: data.tagline,
      description: data.description,
      display_order: data.display_order,
      featured_on_homepage: data.featured_on_homepage,
      status: data.status,
    })
    .select()
    .single();
  if (error) throw error;
  return mapRow(row as CollectionRow);
}

export async function updateCollection(id: string, data: Partial<CollectionFormData>): Promise<void> {
  const payload: Record<string, unknown> = {};
  const fields: (keyof CollectionFormData)[] = [
    "name", "slug", "hero_image_url", "hero_video_url", "editorial_story",
    "tagline", "description", "display_order", "featured_on_homepage", "status",
  ];
  for (const f of fields) {
    if (f in data) payload[f] = data[f as keyof typeof data];
  }
  const { error } = await supabase.from("collections").update(payload as unknown as Database["public"]["Tables"]["collections"]["Update"]).eq("id", id);
  if (error) throw error;
}

export async function uploadCollectionFile(
  collectionId: string,
  file: File,
  type: "image" | "video",
): Promise<string> {
  const ext = file.name.split(".").pop() ?? (type === "image" ? "jpg" : "mp4");
  const filePath = `${collectionId}/${type}/${uuidv4()}.${ext}`;

  const { error: uploadErr } = await supabase.storage
    .from("HOP-films")
    .upload(filePath, file);
  if (uploadErr) throw uploadErr;

  const { data: urlData } = supabase.storage.from("HOP-films").getPublicUrl(filePath);
  return urlData.publicUrl;
}

export async function deleteCollectionFile(url: string): Promise<void> {
  const bucketBase = "/storage/v1/object/public/HOP-films/";
  const idx = url.indexOf(bucketBase);
  if (idx !== -1) {
    const storagePath = url.substring(idx + bucketBase.length);
    if (storagePath) {
      await supabase.storage.from("HOP-films").remove([storagePath]);
    }
  }
}
