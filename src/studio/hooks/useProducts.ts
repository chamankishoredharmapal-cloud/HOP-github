import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchProducts,
  fetchProduct,
  createProduct,
  updateProduct,
  updateProductStatus,
  uploadImage,
  deleteImage,
  reorderImages,
  setPrimaryImage,
  fetchCollections,
} from "../services/productService";
import type { Product, ProductFormData, ProductStatus } from "../types/product";

export function useProductsList() {
  return useQuery({
    queryKey: ["studio", "products"],
    queryFn: fetchProducts,
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ["studio", "product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductFormData) => createProduct(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "products"] });
      toast.success("Product created");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to create product");
    },
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ProductFormData> }) => updateProduct(id, data),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["studio", "products"] });
      qc.invalidateQueries({ queryKey: ["studio", "product", vars.id] });
      toast.success("Changes saved");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to save changes");
    },
  });
}

export function useUpdateProductStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: ProductStatus }) => updateProductStatus(id, status),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["studio", "products"] });
      qc.invalidateQueries({ queryKey: ["studio", "product", vars.id] });
      const label = vars.status === "published" ? "published" : "updated";
      toast.success(`Product ${label}`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    },
  });
}

export function useUploadImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, file, isPrimary }: { productId: string; file: File; isPrimary: boolean }) =>
      uploadImage(productId, file, isPrimary),
    onSuccess: (data, vars) => {
      qc.setQueryData<Product>(["studio", "product", vars.productId], (old) => {
        if (!old) return old;
        return { ...old, images: [...old.images, data] };
      });
      qc.invalidateQueries({ queryKey: ["studio", "product", vars.productId] });
      toast.success("Image uploaded");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to upload image");
    },
  });
}

export function useDeleteImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, productId }: { imageId: string; productId: string }) => deleteImage(imageId),
    onSuccess: (_data, vars) => {
      qc.setQueryData<Product>(["studio", "product", vars.productId], (old) => {
        if (!old) return old;
        return { ...old, images: old.images.filter((img) => img.id !== vars.imageId) };
      });
      qc.invalidateQueries({ queryKey: ["studio", "product", vars.productId] });
      toast.success("Image deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete image");
    },
  });
}

export function useReorderImages() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, orderedIds }: { productId: string; orderedIds: string[] }) =>
      reorderImages(productId, orderedIds),
    onSuccess: (_data, vars) => {
      qc.setQueryData<Product>(["studio", "product", vars.productId], (old) => {
        if (!old) return old;
        const updated = old.images.map((img) => {
          const idx = vars.orderedIds.indexOf(img.id);
          return idx !== -1 ? { ...img, sort_order: idx } : img;
        });
        return { ...old, images: updated };
      });
      qc.invalidateQueries({ queryKey: ["studio", "product", vars.productId] });
      toast.success("Images reordered");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to reorder images");
    },
  });
}

export function useSetPrimaryImage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ imageId, productId }: { imageId: string; productId: string }) =>
      setPrimaryImage(imageId, productId),
    onSuccess: (_data, vars) => {
      qc.setQueryData<Product>(["studio", "product", vars.productId], (old) => {
        if (!old) return old;
        return {
          ...old,
          images: old.images.map((img) => ({
            ...img,
            is_primary: img.id === vars.imageId,
          })),
        };
      });
      qc.invalidateQueries({ queryKey: ["studio", "product", vars.productId] });
      toast.success("Hero image updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to set hero image");
    },
  });
}

export function useCollections() {
  return useQuery({
    queryKey: ["studio", "collections"],
    queryFn: fetchCollections,
  });
}
