export type MediaType = "image" | "video";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: MediaType;
  mime_type: string;
  file_size: number;
  width: number | null;
  height: number | null;
  folder: string | null;
  alt_text: string | null;
  created_at: string;
  updated_at: string;
  product_id: string | null;
  product_name: string | null;
}

export interface MediaListParams {
  search?: string;
  type?: MediaType | "all";
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
