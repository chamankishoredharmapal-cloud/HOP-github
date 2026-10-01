import { supabase } from "@/integrations/supabase/client";
import { LEGACY_COLLECTION_SLUGS } from "@/data/collectionWorlds";
import type { CollectionDetail } from "@/types/collection";

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
    editorial_story: r.editorial_story,
    tagline: r.tagline,
    description: r.description,
    display_order: r.display_order,
    featured_on_homepage: r.featured_on_homepage,
    status: r.status ?? "published",
  };
}

export async function fetchCollections(): Promise<CollectionDetail[]> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("status", "published")
    .order("display_order", { ascending: true });
  if (error) throw error;
  return ((data ?? []) as CollectionRow[]).map(mapRow);
}

export async function fetchFeaturedCollection(): Promise<CollectionDetail | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("featured_on_homepage", true)
    .eq("status", "published")
    .order("display_order", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as CollectionRow) : null;
}

export async function fetchCollectionBySlug(slug: string): Promise<CollectionDetail | null> {
  const { data, error } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  if (error) throw error;
  return data ? mapRow(data as CollectionRow) : null;
}

/**
 * Canonical-aware fetch: exact slug first, then legacy database slugs.
 * Renders the canonical room from the legacy row until the rename
 * migration has renamed it. Never creates a second collection.
 */
export async function fetchCollectionBySlugWithLegacyFallback(slug: string): Promise<CollectionDetail | null> {
  const direct = await fetchCollectionBySlug(slug);
  if (direct) return direct;
  const legacy = LEGACY_COLLECTION_SLUGS[slug.toLowerCase()] ?? [];
  for (const legacySlug of legacy) {
    const row = await fetchCollectionBySlug(legacySlug);
    if (row) return row;
  }
  return null;
}
