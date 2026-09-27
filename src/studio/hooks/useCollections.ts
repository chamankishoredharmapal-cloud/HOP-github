import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAllCollections,
  fetchCollectionById,
  createCollection,
  updateCollection,
  uploadCollectionFile,
  deleteCollectionFile,
} from "../services/collectionService";
import type { CollectionFormData } from "../services/collectionService";

export function useStudioCollections() {
  return useQuery({
    queryKey: ["studio", "collections"],
    queryFn: fetchAllCollections,
  });
}

export function useStudioCollection(id: string | undefined) {
  return useQuery({
    queryKey: ["studio", "collection", id],
    queryFn: () => fetchCollectionById(id!),
    enabled: !!id,
  });
}

export function useCreateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CollectionFormData) => createCollection(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "collections"] });
      qc.invalidateQueries({ queryKey: ["storefront", "collections"] });
      qc.invalidateQueries({ queryKey: ["storefront", "featuredCollection"] });
      toast.success("Collection created successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create collection");
    },
  });
}

export function useUpdateCollection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CollectionFormData> }) =>
      updateCollection(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["studio", "collections"] });
      qc.invalidateQueries({ queryKey: ["studio", "collection", vars.id] });
      qc.invalidateQueries({ queryKey: ["storefront", "collections"] });
      qc.invalidateQueries({ queryKey: ["storefront", "featuredCollection"] });
      toast.success("Collection saved");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update collection");
    },
  });
}

export function useUploadCollectionFile() {
  return useMutation({
    mutationFn: ({
      collectionId,
      file,
      type,
    }: {
      collectionId: string;
      file: File;
      type: "image" | "video";
    }) => uploadCollectionFile(collectionId, file, type),
    onSuccess: (_url, vars) => {
      toast.success(`${vars.type === "video" ? "Collection film" : "Image"} uploaded successfully`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to upload file");
    },
  });
}

export function useDeleteCollectionFile() {
  return useMutation({
    mutationFn: (url: string) => deleteCollectionFile(url),
    onSuccess: () => {
      toast.success("File removed from storage");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to remove file");
    },
  });
}
