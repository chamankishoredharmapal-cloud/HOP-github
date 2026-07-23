import type { ProductFormData } from "../types/product";

interface ProductPricingProps {
  form: ProductFormData;
  onChange: <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => void;
}

function formatPaise(paise: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
}

function parseRupees(val: string): number {
  const cleaned = val.replace(/[₹\s,]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : Math.round(num * 100);
}

function displayPrice(paise: number): string {
  if (paise === 0) return "";
  return formatPaise(paise);
}

export function ProductPricing({ form, onChange }: ProductPricingProps) {
  const margin = form.selling_price > 0 && form.cost_price > 0
    ? ((form.selling_price - form.cost_price) / form.selling_price) * 100
    : null;

  const lowStock = form.stock > 0 && form.stock <= form.low_stock_alert;

  return (
    <section className="space-y-5">
      <h3 className="font-serif text-lg font-light text-foreground tracking-tight">Pricing</h3>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Selling Price">
          <input
            type="text"
            value={form.selling_price > 0 ? formatPaise(form.selling_price) : ""}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d,]/g, "");
              onChange("selling_price", parseRupees(val));
            }}
            placeholder="₹ 48,000"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="MRP">
          <input
            type="text"
            value={form.mrp > 0 ? formatPaise(form.mrp) : ""}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d,]/g, "");
              onChange("mrp", parseRupees(val));
            }}
            placeholder="₹ 52,000"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>

        <Field label="Cost Price">
          <input
            type="text"
            value={form.cost_price > 0 ? formatPaise(form.cost_price) : ""}
            onChange={(e) => {
              const val = e.target.value.replace(/[^\d,]/g, "");
              onChange("cost_price", parseRupees(val));
            }}
            placeholder="₹ 32,000"
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </Field>
      </div>

      {margin !== null && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">Margin:</span>
          <span className={`font-medium ${margin >= 30 ? "text-teal-deep" : margin >= 15 ? "text-sand" : "text-sakura"}`}>
            {margin.toFixed(1)}%
          </span>
          <span className="text-xs text-muted-foreground">({displayPrice(form.selling_price - form.cost_price)} per unit)</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Stock">
          <input
            type="number"
            min={0}
            value={form.stock}
            onChange={(e) => onChange("stock", parseInt(e.target.value) || 0)}
            className={`w-full px-3 py-2 rounded-md border text-sm focus:outline-none focus:ring-2 focus:ring-ring ${
              lowStock ? "border-sakura bg-sakura/5" : "border-input bg-background"
            } text-foreground`}
          />
          {lowStock && (
            <p className="text-xs text-sakura mt-1">Low stock alert — {form.stock} remaining</p>
          )}
        </Field>

        <Field label="Low Stock Alert">
          <input
            type="number"
            min={0}
            value={form.low_stock_alert}
            onChange={(e) => onChange("low_stock_alert", parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
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
