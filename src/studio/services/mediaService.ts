import { supabase } from "@/integrations/supabase/client";
import type { MediaItem, MediaListParams, MediaListResponse, MediaUsageCheck } from "../types/media";
import { activityService } from "./activityService";

const STORAGE_BUCKET = "product-images";

export async function checkMediaUsage(url: string): Promise<MediaUsageCheck> {
  const references: string[] = [];

  try {
    // 1. Check collections
    const { data: collections } = await supabase
      .from("collections")
      .select("name, hero_video_url, hero_image_url, featured_on_homepage");

    if (collections) {
      for (const c of collections) {
        if (c.hero_video_url === url) {
          references.push(
            `Collection "${c.name}" (Hero Film${c.featured_on_homepage ? " & Homepage Hero" : ""})`,
          );
        }
        if (c.hero_image_url === url) {
          references.push(`Collection "${c.name}" (Poster Still)`);
        }
      }
    }

    // 2. Check product images
    const { data: productImgs } = await supabase
      .from("product_images")
      .select("is_primary, products(name)")
      .eq("url", url);

    if (productImgs) {
      for (const p of productImgs) {
        const prodName = (p.products as { name: string } | null)?.name || "Unnamed Product";
        references.push(`Product "${prodName}" (${p.is_primary ? "Primary Image" : "Gallery Image"})`);
      }
    }

    // 3. Check settings for homepage cinematic video
    const { data: settings } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "store_settings")
      .maybeSingle();

    if (settings?.value) {
      const v = settings.value as Record<string, unknown>;
      const homepageVideo = v.homepage_cinematic_video as Record<string, string> | undefined;
      if (homepageVideo?.video_url === url) {
        references.push("Homepage Cinematic Video");
      }
      if (homepageVideo?.poster_url === url) {
        references.push("Homepage Cinematic Video Poster");
      }
    }
  } catch (err) {
    console.error("Failed to check media usage:", err);
  }

  return {
    inUse: references.length > 0,
    references,
  };
}

export async function fetchMediaList(
  params: MediaListParams,
): Promise<MediaListResponse> {
  const {
    search,
    type = "all",
    page = 1,
    perPage = 24,
  } = params;

  const items: MediaItem[] = [];

  // 1. Fetch product images
  try {
    const { data: pImages } = await supabase
      .from("product_images")
      .select("*, products!left(id, name)")
      .order("created_at", { ascending: false });

    interface ProductImageRow {
  id: string;
  url: string;
  alt_text: string | null;
  is_primary: boolean;
  created_at: string;
  products?: { id: string; name: string } | null;
}

if (pImages) {
      for (const r of pImages as ProductImageRow[]) {
        const isVideo = r.url.endsWith(".mp4") || r.url.endsWith(".webm");
        items.push({
          id: r.id,
          name: r.alt_text || `Product Image ${r.id.slice(0, 6)}`,
          url: r.url,
          type: isVideo ? "video" : "image",
          mime_type: isVideo ? "video/mp4" : "image/webp",
          file_size: 0,
          width: null,
          height: null,
          folder: "products",
          alt_text: r.alt_text,
          created_at: r.created_at,
          updated_at: r.created_at,
          product_id: r.products?.id ?? null,
          product_name: r.products?.name ?? null,
          usage_context: r.is_primary ? "Primary Product Image" : "Product Gallery",
          bucket: "product-images",
        });
      }
    }
  } catch (err) {
    console.error("Failed to fetch product images:", err);
  }

  // 2. Fetch collection media (films & stills)
  try {
    const { data: collections } = await supabase
      .from("collections")
      .select("id, name, slug, hero_video_url, hero_image_url, created_at, featured_on_homepage");

    if (collections) {
      for (const c of collections) {
        if (c.hero_video_url) {
          const exists = items.some((i) => i.url === c.hero_video_url);
          if (!exists) {
            items.push({
              id: `film-${c.id}`,
              name: `${c.name} Collection Film`,
              url: c.hero_video_url,
              type: "video",
              mime_type: "video/mp4",
              file_size: 0,
              width: 1920,
              height: 1080,
              folder: "films",
              alt_text: `${c.name} Collection Film`,
              created_at: c.created_at || new Date().toISOString(),
              updated_at: c.created_at || new Date().toISOString(),
              product_id: null,
              product_name: null,
              collection_id: c.id,
              collection_name: c.name,
              usage_context: c.featured_on_homepage
                ? "Homepage Hero & Collection Film"
                : "Collection Film",
              bucket: "HOP-films",
            });
          }
        }

        if (c.hero_image_url) {
          const exists = items.some((i) => i.url === c.hero_image_url);
          if (!exists) {
            items.push({
              id: `poster-${c.id}`,
              name: `${c.name} Poster Still`,
              url: c.hero_image_url,
              type: "image",
              mime_type: "image/jpeg",
              file_size: 0,
              width: null,
              height: null,
              folder: "collections",
              alt_text: `${c.name} Poster Still`,
              created_at: c.created_at || new Date().toISOString(),
              updated_at: c.created_at || new Date().toISOString(),
              product_id: null,
              product_name: null,
              collection_id: c.id,
              collection_name: c.name,
              usage_context: "Collection Poster Still",
              bucket: "HOP-films",
            });
          }
        }
      }
    }
  } catch (err) {
    console.error("Failed to fetch collection media:", err);
  }

  // Filter by media type
  let filtered = items;
  if (type !== "all") {
    filtered = filtered.filter((i) => i.type === type);
  }

  // Filter by search query
  if (search && search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        (i.alt_text && i.alt_text.toLowerCase().includes(q)) ||
        (i.product_name && i.product_name.toLowerCase().includes(q)) ||
        (i.collection_name && i.collection_name.toLowerCase().includes(q)) ||
        (i.usage_context && i.usage_context.toLowerCase().includes(q)),
    );
  }

  // Sort descending by date
  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const total = filtered.length;
  const from = (page - 1) * perPage;
  const pagedItems = filtered.slice(from, from + perPage);

  return {
    items: pagedItems,
    total,
    page,
    totalPages: Math.ceil(total / perPage) || 1,
    folders: ["all", "films", "products", "collections"],
  };
}

export async function uploadMedia(
  file: File,
  altText?: string,
  targetBucket: "product-images" | "HOP-films" = "product-images",
): Promise<MediaItem> {
  const isVideo = file.type.startsWith("video/") || file.name.match(/\.(mp4|webm)$/i);
  const bucket = isVideo ? "HOP-films" : targetBucket;
  const filePath = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  const publicUrl = urlData?.publicUrl ?? "";

  // If image, register in product_images table for queryability
  let id = filePath;
  if (!isVideo) {
    const { data: dbData } = await supabase
      .from("product_images")
      .insert({
        url: publicUrl,
        alt_text: altText ?? null,
        sort_order: 0,
        is_primary: false,
      })
      .select("id")
      .single();
    if (dbData) id = dbData.id;
  }

  await activityService.log({
    action: isVideo ? "film_uploaded" : "image_uploaded",
    entityType: "media",
    entityName: file.name,
    details: { publicUrl, bucket, sizeBytes: file.size },
  });

  return {
    id,
    name: altText ?? file.name,
    url: publicUrl,
    type: isVideo ? "video" : "image",
    mime_type: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
    file_size: file.size,
    width: null,
    height: null,
    folder: isVideo ? "films" : "products",
    alt_text: altText ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    product_id: null,
    product_name: null,
    bucket,
  };
}

export async function updateMediaAlt(
  id: string,
  altText: string | null,
): Promise<void> {
  const { error } = await supabase
    .from("product_images")
    .update({ alt_text: altText })
    .eq("id", id);

  if (error) {
    // If not in product_images, it may be a collection asset; non-fatal
    console.warn("Could not update alt_text in product_images:", error.message);
  }
}

export async function deleteMedia(item: MediaItem): Promise<void> {
  // 1. Remove from database if in product_images
  if (item.bucket === "product-images" || !item.id.startsWith("film-")) {
    await supabase.from("product_images").delete().eq("id", item.id);
  }

  // 2. Remove from Supabase Storage bucket
  const bucket = item.bucket || (item.type === "video" ? "HOP-films" : "product-images");
  const bucketBase = `/storage/v1/object/public/${bucket}/`;
  const idx = item.url.indexOf(bucketBase);
  if (idx !== -1) {
    const storagePath = item.url.substring(idx + bucketBase.length);
    if (storagePath) {
      await supabase.storage.from(bucket).remove([storagePath]);
    }
  }

  await activityService.log({
    action: "media_deleted",
    entityType: "media",
    entityName: item.name,
    details: { url: item.url, bucket },
  });
}
