import { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Package, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TopActionBar } from "../components/TopActionBar";
import { ProductIdentity } from "../components/ProductIdentity";
import { EditorialStory } from "../components/EditorialStory";
import { TechnicalDetails } from "../components/TechnicalDetails";
import { ProductPricing } from "../components/ProductPricing";
import { SeoSection } from "../components/SeoSection";
import { EditorialChecklist } from "../components/EditorialChecklist";
import { MediaWorkspace } from "../components/MediaWorkspace";
import { useProductForm } from "../hooks/useProductForm";
import {
  useProduct, useCreateProduct, useUpdateProduct, useUpdateProductStatus,
  useUploadImage, useDeleteImage, useSetPrimaryImage, useReorderImages,
  useCollections,
} from "../hooks/useProducts";
import { getStockStatus, STOCK_STATUS_LABELS, STOCK_STATUS_STYLES } from "../types/inventory";

export default function ProductWorkspace() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isNew = !id || id === "new";

  const { data: existing, isLoading: productLoading } = useProduct(isNew ? undefined : id);
  const { data: collections } = useCollections();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const updateStatus = useUpdateProductStatus();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();
  const setPrimaryImage = useSetPrimaryImage();
  const reorderImages = useReorderImages();

  const { form, updateField, isDirty, resetDirty, checklist, progress } = useProductForm(existing ?? null);

  const [workspaceId, setWorkspaceId] = useState<string | null>(isNew ? null : (id ?? null));
  const [saving, setSaving] = useState(false);
  const [heroImageExists, setHeroImageExists] = useState(false);
  useEffect(() => {
    if (existing) {
      setWorkspaceId(existing.id);
      const hasHero = existing.images.some((img) => img.is_primary);
      setHeroImageExists(hasHero);
    }
  }, [existing]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      if (workspaceId) {
        await updateProduct.mutateAsync({ id: workspaceId, data: form });
        resetDirty();
      } else {
        const created = await createProduct.mutateAsync(form);
        setWorkspaceId(created.id);
        resetDirty();
        navigate(`/studio/products/${created.id}`, { replace: true });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }, [workspaceId, form, updateProduct, createProduct, navigate, resetDirty]);

  const handlePublish = useCallback(async () => {
    setSaving(true);
    try {
      if (workspaceId) {
        await updateProduct.mutateAsync({ id: workspaceId, data: form });
        await updateStatus.mutateAsync({ id: workspaceId, status: "published" });
        resetDirty();
      } else {
        const created = await createProduct.mutateAsync({ ...form, status: "published" });
        setWorkspaceId(created.id);
        resetDirty();
        navigate(`/studio/products/${created.id}`, { replace: true });
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setSaving(false);
    }
  }, [workspaceId, form, updateProduct, updateStatus, createProduct, navigate, resetDirty]);

  const handlePreview = useCallback(() => {
    if (!workspaceId) {
      toast.info("Save draft before preview.");
      return;
    }
    window.open(`/product/${workspaceId}`, "_blank");
  }, [workspaceId]);

  const handleUpload = useCallback(async (file: File) => {
    try {
      if (!workspaceId) {
        const created = await createProduct.mutateAsync(form);
        setWorkspaceId(created.id);
        resetDirty();
        navigate(`/studio/products/${created.id}`, { replace: true });
        const img = await uploadImage.mutateAsync({ productId: created.id, file, isPrimary: !heroImageExists });
        if (img.is_primary) setHeroImageExists(true);
      } else {
        const img = await uploadImage.mutateAsync({ productId: workspaceId, file, isPrimary: !heroImageExists });
        if (img.is_primary) setHeroImageExists(true);
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to upload image");
    }
  }, [workspaceId, form, createProduct, uploadImage, heroImageExists, navigate, resetDirty]);

  const handleDeleteImage = useCallback(async (imageId: string) => {
    if (!workspaceId) return;
    try {
      const img = existing?.images.find((i) => i.id === imageId);
      await deleteImage.mutateAsync({ imageId, productId: workspaceId });
      if (img?.is_primary) setHeroImageExists(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete image");
    }
  }, [workspaceId, existing, deleteImage]);

  const handleSetPrimary = useCallback(async (imageId: string) => {
    if (!workspaceId) return;
    try {
      await setPrimaryImage.mutateAsync({ imageId, productId: workspaceId });
      setHeroImageExists(true);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to set hero image");
    }
  }, [workspaceId, setPrimaryImage]);

  const handleReorder = useCallback(async (orderedIds: string[]) => {
    if (!workspaceId) return;
    try {
      await reorderImages.mutateAsync({ productId: workspaceId, orderedIds });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reorder images");
    }
  }, [workspaceId, reorderImages]);

  if (productLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-12 rounded bg-muted" />
        <div className="h-64 rounded bg-muted" />
      </div>
    );
  }

  if (!isNew && !existing) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-muted-foreground text-sm">Product not found.</p>
      </div>
    );
  }

  return (
    <div>
      <TopActionBar
        title={form.name}
        status={form.status}
        isDirty={isDirty}
        saving={saving}
        onSave={handleSave}
        onPublish={handlePublish}
        onPreview={handlePreview}
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-10 min-w-0">
          <ProductIdentity form={form} collections={collections} onChange={updateField} />
          <hr className="border-border/40" />
          <EditorialStory form={form} onChange={updateField} />
          <hr className="border-border/40" />
          <TechnicalDetails form={form} onChange={updateField} />
          <hr className="border-border/40" />
          <ProductPricing form={form} onChange={updateField} />
          <hr className="border-border/40" />
          <section className="space-y-3">
            <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Inventory</h3>
            <div className="flex items-center justify-between bg-jasmine-deep/50 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {form.stock} units available
                  </p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      STOCK_STATUS_STYLES[getStockStatus(form.stock, form.low_stock_alert)]
                    }`}
                  >
                    {STOCK_STATUS_LABELS[getStockStatus(form.stock, form.low_stock_alert)]}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/studio/inventory")}
                className="border-border/50 text-muted-foreground text-xs"
              >
                Manage in Inventory <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </section>
          <hr className="border-border/40" />
          <SeoSection form={form} onChange={updateField} />
          <hr className="border-border/40" />
          <EditorialChecklist items={checklist} progress={progress} heroImageExists={heroImageExists} />
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <MediaWorkspace
            images={existing?.images ?? []}
            uploading={uploadImage.isPending}
            onUpload={handleUpload}
            onDelete={handleDeleteImage}
            onSetPrimary={handleSetPrimary}
            onReorder={handleReorder}
          />
        </div>
      </div>
    </div>
  );
}
