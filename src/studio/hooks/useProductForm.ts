import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import type { Product, ProductFormData, ProductStatus } from "../types/product";

const emptyForm: ProductFormData = {
  sku: "", name: "", slug: "", story: "", short_description: "", customer_description: "",
  selling_price: 0, mrp: 0, cost_price: 0, stock: 0, low_stock_alert: 5,
  fabric: "", weave: "", colour: "", occasion: "", length: "", weight: "",
  blouse_included: false, care_instructions: "", country_of_origin: "India",
  estimated_dispatch_days: 3, collection_id: null, featured: false, status: "draft",
  meta_title: "", meta_description: "", og_image_url: null,
};

export function useProductForm(existing?: Product | null) {
  const [form, setForm] = useState<ProductFormData>(emptyForm);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const initialisedRef = useRef(false);

  useEffect(() => {
    initialisedRef.current = false;
  }, [existing?.id]);

  useEffect(() => {
    if (existing && !initialisedRef.current) {
      setForm(existing);
      setDirty(new Set());
      initialisedRef.current = true;
    }
  }, [existing]);

  const updateField = useCallback(<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setDirty((prev) => new Set(prev).add(key));
  }, []);

  const isDirty = dirty.size > 0;

  const checklist = useMemo(() => {
    const checks: { label: string; key: string; done: boolean }[] = [
      { label: "Hero Image", key: "hero", done: false },
      { label: "Product Name", key: "name", done: form.name.trim().length > 0 },
      { label: "Story", key: "story", done: form.story.trim().length > 0 },
      { label: "Collection", key: "collection", done: !!form.collection_id },
      { label: "Price", key: "price", done: form.selling_price > 0 },
      { label: "Inventory", key: "inventory", done: form.stock > 0 },
      { label: "SEO", key: "seo", done: form.meta_title.trim().length > 0 },
    ];
    return checks;
  }, [form]);

  const progress = useMemo(() => {
    const done = checklist.filter((c) => c.done).length;
    return Math.round((done / checklist.length) * 100);
  }, [checklist]);

  const resetDirty = useCallback(() => {
    setDirty(new Set());
  }, []);

  const toPayload = useCallback((): ProductFormData => form, [form]);

  return {
    form, updateField, isDirty, resetDirty, checklist, progress, toPayload,
  };
}
