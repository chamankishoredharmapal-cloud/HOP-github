import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchAllCollections,
  fetchCollectionById,
  createCollection,
  updateCollection,
  uploadCollectionFile,
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
      toast.success("Collection created");
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
      toast.success("Collection updated");
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
    onSuccess: () => {
      toast.success("File uploaded");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to upload file");
    },
  });
}
