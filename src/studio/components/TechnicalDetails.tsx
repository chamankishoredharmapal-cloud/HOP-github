import type { ProductFormData } from "../types/product";

interface TechnicalDetailsProps {
  form: ProductFormData;
  onChange: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
}

export function TechnicalDetails({ form, onChange }: TechnicalDetailsProps) {
  return (
    <section className="space-y-5">
      <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Technical Details</h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Fabric">
          <input
            type="text"
            value={form.fabric}
            onChange={(e) => onChange("fabric", e.target.value)}
            placeholder="Pure Kanchipuram Silk"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Weave">
          <input
            type="text"
            value={form.weave}
            onChange={(e) => onChange("weave", e.target.value)}
            placeholder="Korvai"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Occasion">
          <input
            type="text"
            value={form.occasion}
            onChange={(e) => onChange("occasion", e.target.value)}
            placeholder="Wedding / Reception / Festive"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Length">
          <input
            type="text"
            value={form.length}
            onChange={(e) => onChange("length", e.target.value)}
            placeholder="5.5 m"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Weight">
          <input
            type="text"
            value={form.weight}
            onChange={(e) => onChange("weight", e.target.value)}
            placeholder="750 g"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Dispatch Days">
          <input
            type="number"
            min={0}
            value={form.estimated_dispatch_days}
            onChange={(e) => onChange("estimated_dispatch_days", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Blouse Included">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.blouse_included}
              onChange={(e) => onChange("blouse_included", e.target.checked)}
              className="h-4 w-4 rounded border-input text-teal-deep focus:ring-ring"
            />
            <span className="text-sm text-muted-foreground">Blouse piece included</span>
          </label>
        </Field>

        <Field label="Country of Origin">
          <input
            type="text"
            value={form.country_of_origin}
            onChange={(e) => onChange("country_of_origin", e.target.value)}
            placeholder="India"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
          Care Instructions
        </label>
        <textarea
          value={form.care_instructions}
          onChange={(e) => onChange("care_instructions", e.target.value)}
          placeholder="Dry clean only. Store in a muslin cloth. Keep away from direct sunlight..."
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
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
