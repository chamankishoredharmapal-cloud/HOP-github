import type { ProductFormData, Collection } from "../types/product";

interface ProductIdentityProps {
  form: ProductFormData;
  collections: Collection[] | undefined;
  onChange: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
}

const statusOptions = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "Ready for Review" },
  { value: "published", label: "Published" },
  { value: "archived", label: "Archived" },
] as const;

export function ProductIdentity({ form, collections, onChange }: ProductIdentityProps) {
  return (
    <section className="space-y-5">
      <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Identity</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Product Name">
          <input
            type="text"
            value={form.name}
            onChange={(e) => {
              onChange("name", e.target.value);
              if (!form.slug || form.slug === form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")) {
                const slug = e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
                onChange("slug", slug);
              }
            }}
            placeholder="Padmini · Coastal Pattu"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Slug">
          <input
            type="text"
            value={form.slug}
            onChange={(e) => onChange("slug", e.target.value)}
            placeholder="padmini-coastal-pattu"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Collection">
          {collections && collections.length === 0 ? (
            <p className="text-sm text-muted-foreground py-2">No collections found.</p>
          ) : (
            <select
              value={form.collection_id ?? ""}
              onChange={(e) => onChange("collection_id", e.target.value || null)}
              className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select collection</option>
              {collections?.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          )}
        </Field>

        <Field label="SKU">
          <input
            type="text"
            value={form.sku}
            onChange={(e) => onChange("sku", e.target.value)}
            placeholder="HOP-001"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Status">
          <select
            value={form.status}
            onChange={(e) => onChange("status", e.target.value as ProductFormData["status"])}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </Field>

        <Field label="Featured">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => onChange("featured", e.target.checked)}
              className="h-4 w-4 rounded border-input text-teal-deep focus:ring-ring"
            />
            <span className="text-sm text-muted-foreground">Show on homepage</span>
          </label>
        </Field>
      </div>
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
