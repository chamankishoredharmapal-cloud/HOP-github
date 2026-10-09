export type MediaType = "image" | "video";
export type MediaCategory = "general" | "product" | "film" | "editorial" | "craft" | "brand";
export type MediaStatus = "active" | "archived" | "trash";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  duration?: number | null;
  folder: string | null;
  alt_text: string | null;
  poster_url?: string | null;
  category?: MediaCategory;
  tags?: string[];
  status?: MediaStatus;
  created_at: string;
  updated_at: string;
  product_id?: string | null;
  product_name?: string | null;
  collection_id?: string | null;
  collection_name?: string | null;
  usage_context?: string | null;
  bucket?: "product-images" | "HOP-films" | "site-assets" | string;
}

export interface MediaListParams {
  search?: string;
  type?: MediaType | "all";
  category?: MediaCategory | "all";
  status?: MediaStatus | "all";
  folder?: string;
  sortBy?: "name" | "created_at" | "file_size";
  sortDir?: "asc" | "desc";
  page?: number;
  perPage?: number;
}

export interface MediaListResponse {
  items: MediaItem[];
  total: number;
  page: number;
  totalPages: number;
  folders: string[];
}

export interface MediaUsageCheck {
  inUse: boolean;
  references: string[];
}
