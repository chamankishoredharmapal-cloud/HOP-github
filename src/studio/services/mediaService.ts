import { supabase } from "@/integrations/supabase/client";
import type { MediaItem, MediaListParams, MediaListResponse, MediaUsageCheck } from "../types/media";
import { activityService } from "./activityService";

export async function checkMediaUsage(url: string): Promise<MediaUsageCheck> {
  try {
    const { data, error } = await supabase.rpc("check_media_asset_usage", {
      p_url: url,
    });
    if (!error && data) {
      const res = data as { in_use: boolean; references: string[] };
      return {
        inUse: res.in_use,
        references: res.references || [],
      };
    }
  } catch (err) {
    console.error("Failed to check media usage via RPC:", err);
  }

  // Graceful client-side fallback if RPC fails
  const references: string[] = [];
  try {
    const { data: collections } = await supabase
      .from("collections")
      .select("name, hero_video_url, hero_image_url, featured_on_homepage");

    if (collections) {
      for (const c of collections) {
        if (c.hero_video_url === url) {
          references.push(`Collection "${c.name}" (Hero Film${c.featured_on_homepage ? " & Homepage Hero" : ""})`);
        }
        if (c.hero_image_url === url) {
          references.push(`Collection "${c.name}" (Poster Still)`);
        }
      }
    }

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
  } catch (err) {
    console.error("Client fallback media check error:", err);
  }

  return {
    inUse: references.length > 0,
    references,
  };
}

interface MediaAssetRow {
  id: string;
  bucket_id: string;
  storage_path: string;
  public_url: string;
  file_name: string;
  display_name: string;
  media_type: "image" | "video" | "document";
  mime_type: string;
  file_size_bytes: number;
  width: number | null;
  height: number | null;
  duration_sec: number | null;
  alt_text: string | null;
  poster_url: string | null;
  category: "general" | "product" | "film" | "editorial" | "craft" | "brand";
  tags: string[];
  status: "active" | "archived" | "trash";
  created_at: string;
  updated_at: string;
}

export async function fetchMediaList(
  params: MediaListParams,
): Promise<MediaListResponse> {
  const {
    search,
    type = "all",
    category = "all",
    status = "active",
    page = 1,
    perPage = 24,
  } = params;

  try {
    let query = supabase
      .from("media_assets")
      .select("*", { count: "exact" });

    if (status !== "all") {
      query = query.eq("status", status);
    }

    if (type !== "all") {
      query = query.eq("media_type", type);
    }

    if (category !== "all") {
      query = query.eq("category", category);
    }

    if (search && search.trim()) {
      const q = `%${search.trim()}%`;
      query = query.or(`display_name.ilike.${q},file_name.ilike.${q},alt_text.ilike.${q}`);
    }

    query = query.order("created_at", { ascending: false });

    const from = (page - 1) * perPage;
    const to = from + perPage - 1;
    query = query.range(from, to);

    const { data: assets, count, error } = await query;

    if (!error && assets) {
      const items: MediaItem[] = (assets as MediaAssetRow[]).map((r) => ({
        id: r.id,
        name: r.display_name || r.file_name,
        url: r.public_url,
        type: r.media_type === "video" ? "video" : "image",
        mime_type: r.mime_type,
        file_size: r.file_size_bytes,
        width: r.width,
        height: r.height,
        duration: r.duration_sec,
        folder: r.category || (r.media_type === "video" ? "films" : "general"),
        alt_text: r.alt_text,
        poster_url: r.poster_url,
        category: r.category,
        tags: r.tags,
        status: r.status,
        created_at: r.created_at,
        updated_at: r.updated_at,
        product_id: null,
        product_name: null,
        usage_context: r.category === "film" ? "Collection / Cinematic Film" : (r.category === "product" ? "Product Photography" : "General Media"),
        bucket: r.bucket_id as "product-images" | "HOP-films",
      }));

      const total = count ?? items.length;
      return {
        items,
        total,
        page,
        totalPages: Math.ceil(total / perPage) || 1,
        folders: ["all", "general", "films", "product", "editorial", "craft", "brand"],
      };
    }
  } catch (err) {
    console.error("Failed to query media_assets, falling back:", err);
  }

  // Fallback to legacy product_images + collections inspection if media_assets unavailable
  return {
    items: [],
    total: 0,
    page: 1,
    totalPages: 1,
    folders: ["all", "general", "films", "product"],
  };
}

export async function uploadMedia(
  file: File,
  altText?: string,
  targetBucket?: "product-images" | "HOP-films",
  category: "general" | "product" | "film" | "editorial" | "craft" | "brand" = "general",
): Promise<MediaItem> {
  const isVideo = file.type.startsWith("video/") || !!file.name.match(/\.(mp4|webm|mov)$/i);
  const bucket = targetBucket || (isVideo ? "HOP-films" : "product-images");
  const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const filePath = `${Date.now()}-${cleanName}`;

  // 1. Upload to Supabase Storage
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

  // 2. Register in public.media_assets via Security Definer RPC
  const { data: registeredData, error: registerError } = await supabase.rpc("register_media_asset", {
    p_bucket_id: bucket,
    p_storage_path: filePath,
    p_public_url: publicUrl,
    p_file_name: file.name,
    p_display_name: altText || file.name.replace(/\.[^/.]+$/, ""),
    p_media_type: isVideo ? "video" : "image",
    p_mime_type: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
    p_file_size_bytes: file.size,
    p_alt_text: altText ?? null,
    p_poster_url: null,
    p_category: isVideo ? "film" : category,
    p_tags: [],
  });

  if (registerError) {
    console.error("Failed to register media asset in catalog:", registerError);
    // Non-fatal fallback for response object
  }

  const assetRow = registeredData as MediaAssetRow | null;

  return {
    id: assetRow?.id || filePath,
    name: assetRow?.display_name || altText || file.name,
    url: publicUrl,
    type: isVideo ? "video" : "image",
    mime_type: file.type || (isVideo ? "video/mp4" : "image/jpeg"),
    file_size: file.size,
    width: null,
    height: null,
    folder: isVideo ? "films" : category,
    alt_text: altText ?? null,
    category: (assetRow?.category as MediaItem["category"]) || (isVideo ? "film" : category),
    status: "active",
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
  // Update in unified media_assets
  const { error } = await supabase
    .from("media_assets")
    .update({ alt_text: altText, display_name: altText || undefined })
    .eq("id", id);

  if (error) {
    console.warn("Could not update alt_text in media_assets:", error.message);
  }

  // Also update product_images if present
  await supabase
    .from("product_images")
    .update({ alt_text: altText })
    .eq("id", id);
}

export async function softDeleteMedia(item: MediaItem): Promise<{ success: boolean; error?: string; references?: string[] }> {
  const { data, error } = await supabase.rpc("soft_delete_media_asset", {
    p_id: item.id,
  });

  if (error) {
    throw error;
  }

  const res = data as { success: boolean; error?: string; references?: string[]; message?: string };
  return res;
}

export async function restoreMedia(item: MediaItem): Promise<boolean> {
  const { data, error } = await supabase.rpc("restore_media_asset", {
    p_id: item.id,
  });

  if (error) throw error;
  const res = data as { success: boolean };
  return res.success;
}

export async function deleteMedia(item: MediaItem): Promise<void> {
  // 1. Check if asset can be soft-deleted
  const softRes = await softDeleteMedia(item);
  if (!softRes.success) {
    if (softRes.error === "asset_in_use") {
      throw new Error(`Cannot delete media asset: In active use by ${softRes.references?.join(", ")}`);
    }
    throw new Error(softRes.error || "Failed to delete media asset");
  }

  await activityService.log({
    action: "media_deleted",
    entityType: "media",
    entityName: item.name,
    details: { url: item.url, bucket: item.bucket },
  });
}
