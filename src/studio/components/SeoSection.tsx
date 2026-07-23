import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { ProductFormData } from "../types/product";

interface SeoSectionProps {
  form: ProductFormData;
  onChange: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
}

export function SeoSection({ form, onChange }: SeoSectionProps) {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        <h3 className="font-serif text-lg font-light text-foreground tracking-tight">SEO</h3>
      </button>

      {open && (
        <div className="space-y-4 pl-6 border-l-2 border-border/40">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Slug">
              <input
                type="text"
                value={form.slug}
                onChange={(e) => onChange("slug", e.target.value)}
                placeholder="padmini-coastal-pattu"
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>

            <Field label="OG Image URL">
              <input
                type="text"
                value={form.og_image_url ?? ""}
                onChange={(e) => onChange("og_image_url", e.target.value || null)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </Field>
          </div>

          <Field label="Meta Title">
            <input
              type="text"
              value={form.meta_title}
              onChange={(e) => onChange("meta_title", e.target.value)}
              placeholder="Padmini · Coastal Pattu | House of Padmavati"
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </Field>

          <Field label="Meta Description">
            <textarea
              value={form.meta_description}
              onChange={(e) => onChange("meta_description", e.target.value)}
              placeholder="Discover the Padmini Coastal Pattu — a handwoven Kanchipuram silk saree..."
              rows={3}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            />
          </Field>
        </div>
      )}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
        {label}
      </label>
      {children}
    </div>
  );
}
