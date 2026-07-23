import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchMediaList,
  uploadMedia,
  updateMedia,
  deleteMedia,
} from "../services/mediaService";
import type { MediaListParams } from "../types/media";

export function useMediaList(params: MediaListParams) {
  return useQuery({
    queryKey: ["studio", "media", params],
    queryFn: () => fetchMediaList(params),
  });
}

export function useUploadMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      uploadMedia(file, altText),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "media"] });
      toast.success("Media uploaded");
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
      updateMedia(id, { alt_text }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "media"] });
      toast.success("Media updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Update failed");
    },
  });
}

export function useDeleteMedia() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMedia(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "media"] });
      toast.success("Media deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    },
  });
}
