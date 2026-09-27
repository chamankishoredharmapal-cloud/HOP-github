import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchMediaList,
  uploadMedia,
  updateMediaAlt,
  deleteMedia,
  checkMediaUsage,
} from "../services/mediaService";
import type { MediaItem, MediaListParams } from "../types/media";

export function useMediaList(params: MediaListParams) {
  return useQuery({
    queryKey: ["studio", "media", params],
    queryFn: () => fetchMediaList(params),
  });
}

export function useCheckMediaUsage(url: string | null) {
  return useQuery({
    queryKey: ["studio", "media-usage", url],
    queryFn: () => (url ? checkMediaUsage(url) : { inUse: false, references: [] }),
    enabled: !!url,
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      file,
      altText,
      targetBucket,
    }: {
      file: File;
      altText?: string;
      targetBucket?: "product-images" | "HOP-films";
    }) => uploadMedia(file, altText, targetBucket),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "media"] });
      toast.success("Media uploaded successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    },
  });
}

export function useUpdateMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, alt_text }: { id: string; alt_text?: string | null }) =>
      updateMediaAlt(id, alt_text ?? null),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "media"] });
      toast.success("Media details updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Update failed");
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (item: MediaItem) => deleteMedia(item),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "media"] });
      toast.success("Media deleted safely");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    },
  });
}
