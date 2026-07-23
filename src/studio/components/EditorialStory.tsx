import type { ProductFormData } from "../types/product";

interface EditorialStoryProps {
  form: ProductFormData;
  onChange: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
}

export function EditorialStory({ form, onChange }: EditorialStoryProps) {
  return (
    <section className="space-y-6">
      <h3 className="font-serif text-lg font-light text-foreground tracking-tight">The Story</h3>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
          Editorial Story
        </label>
        <textarea
          value={form.story}
          onChange={(e) => onChange("story", e.target.value)}
          placeholder="Write the story of this saree — the inspiration, the craft, the emotion behind it..."
          rows={8}
          className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-y min-h-[180px]"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
          Short Description
        </label>
        <textarea
          value={form.short_description}
          onChange={(e) => onChange("short_description", e.target.value)}
          placeholder="A brief summary for collection pages and listings..."
          rows={3}
          className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
          Customer Description
        </label>
        <textarea
          value={form.customer_description}
          onChange={(e) => onChange("customer_description", e.target.value)}
          placeholder="Details shown to customers on the product page — fit, feel, occasion notes..."
          rows={4}
          className="w-full px-4 py-3 rounded-md border border-input bg-background text-foreground text-sm leading-relaxed placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>
    </section>
  );
}
