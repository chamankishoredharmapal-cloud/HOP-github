import { useState, useEffect, type ComponentType, type ReactNode } from "react";
import { Save, Store, Phone, Truck, Search, Shield } from "lucide-react";
import { useSettings, useSaveSettings } from "../hooks/useSettings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import type { StoreSettings } from "../types/settings";

const CURRENCIES = ["INR", "USD", "EUR", "GBP"];
const ORIGIN_COUNTRIES = ["IN", "US", "UK", "CN", "BD"];
const STOCK_BEHAVIOURS = ["hide", "show", "backorder"] as const;

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <Card className="border-border/50 bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-base font-light text-foreground flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">{children}</CardContent>
    </Card>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

export default function Settings() {
  const { data: settings, isLoading, error } = useSettings();
  const saveSettings = useSaveSettings();
  const [form, setForm] = useState<StoreSettings | null>(null);
  const [activeTab, setActiveTab] = useState("brand");

  useEffect(() => {
    if (settings) {
      setForm(JSON.parse(JSON.stringify(settings)));
    }
  }, [settings]);

  const update = <K extends keyof StoreSettings>(
    section: K,
    field: keyof StoreSettings[K],
    value: string | number | boolean | string[],
  ) => {
    if (!form) return;
    setForm({
      ...form,
      [section]: { ...form[section], [field]: value },
    });
  };

  const handleSave = () => {
    if (!form) return;
    saveSettings.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-24" />
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 text-sm py-12">
        Failed to load settings. Please try again.
      </div>
    );
  }

  if (!form) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Configure your store settings. Changes are saved locally and synced when possible.
        </p>
        <Button onClick={handleSave} disabled={saveSettings.isPending}>
          <Save className="h-4 w-4 mr-2" />
          {saveSettings.isPending ? "Saving..." : "Save Settings"}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="brand"><Store className="h-4 w-4 mr-1.5" />Brand</TabsTrigger>
          <TabsTrigger value="contact"><Phone className="h-4 w-4 mr-1.5" />Contact</TabsTrigger>
          <TabsTrigger value="shipping"><Truck className="h-4 w-4 mr-1.5" />Shipping</TabsTrigger>
          <TabsTrigger value="seo"><Search className="h-4 w-4 mr-1.5" />SEO</TabsTrigger>
          <TabsTrigger value="security"><Shield className="h-4 w-4 mr-1.5" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="mt-6 space-y-6">
          <SectionCard title="Brand Identity" icon={Store}>
            <Field label="Store Name">
              <Input
                value={form.brand.store_name}
                onChange={(e) => update("brand", "store_name", e.target.value)}
              />
            </Field>
            <Field label="Tagline">
              <Input
                value={form.brand.tagline}
                onChange={(e) => update("brand", "tagline", e.target.value)}
              />
            </Field>
            <Field label="Business Email">
              <Input
                type="email"
                value={form.brand.business_email}
                onChange={(e) => update("brand", "business_email", e.target.value)}
              />
            </Field>
            <Field label="Business Phone">
              <Input
                value={form.brand.business_phone}
                onChange={(e) => update("brand", "business_phone", e.target.value)}
              />
            </Field>
            <Field label="Business Address">
              <Textarea
                value={form.brand.business_address}
                onChange={(e) => update("brand", "business_address", e.target.value)}
                rows={3}
              />
            </Field>
          </SectionCard>
        </TabsContent>

        <TabsContent value="contact" className="mt-6 space-y-6">
          <SectionCard title="Contact & Social" icon={Phone}>
            <Field label="Support Email">
              <Input
                type="email"
                value={form.contact.support_email}
                onChange={(e) => update("contact", "support_email", e.target.value)}
              />
            </Field>
            <Field label="Support Phone">
              <Input
                value={form.contact.support_phone}
                onChange={(e) => update("contact", "support_phone", e.target.value)}
              />
            </Field>
            <Field label="WhatsApp Number">
              <Input
                value={form.contact.whatsapp_number}
                onChange={(e) => update("contact", "whatsapp_number", e.target.value)}
              />
            </Field>
            <Field label="Instagram URL">
              <Input
                value={form.contact.instagram_url}
                onChange={(e) => update("contact", "instagram_url", e.target.value)}
              />
            </Field>
            <Field label="Pinterest URL">
              <Input
                value={form.contact.pinterest_url}
                onChange={(e) => update("contact", "pinterest_url", e.target.value)}
              />
            </Field>
            <Field label="Atelier Address">
              <Textarea
                value={form.contact.atelier_address}
                onChange={(e) => update("contact", "atelier_address", e.target.value)}
                rows={3}
              />
            </Field>
          </SectionCard>
        </TabsContent>

        <TabsContent value="shipping" className="mt-6 space-y-6">
          <SectionCard title="Shipping & Tax" icon={Truck}>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Origin Country">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.shipping.default_origin_country}
                  onChange={(e) => update("shipping", "default_origin_country", e.target.value)}
                >
                  {ORIGIN_COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
              <Field label="Currency">
                <select
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={form.shipping.currency}
                  onChange={(e) => update("shipping", "currency", e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </Field>
            </div>
            <Field label="Free Shipping Threshold (in paise)">
              <Input
                type="number"
                value={form.shipping.free_shipping_threshold}
                onChange={(e) => update("shipping", "free_shipping_threshold", Number(e.target.value))}
              />
            </Field>
            <div className="grid grid-cols-3 gap-4">
              <Field label="Standard Rate">
                <Input
                  type="number"
                  value={form.shipping.standard_rate}
                  onChange={(e) => update("shipping", "standard_rate", Number(e.target.value))}
                />
              </Field>
              <Field label="Express Rate">
                <Input
                  type="number"
                  value={form.shipping.express_rate}
                  onChange={(e) => update("shipping", "express_rate", Number(e.target.value))}
                />
              </Field>
              <Field label="Overnight Rate">
                <Input
                  type="number"
                  value={form.shipping.overnight_rate}
                  onChange={(e) => update("shipping", "overnight_rate", Number(e.target.value))}
                />
              </Field>
            </div>
            <Field label="Tax Rate (%)">
              <Input
                type="number"
                step="0.1"
                value={form.shipping.tax_rate}
                onChange={(e) => update("shipping", "tax_rate", Number(e.target.value))}
              />
            </Field>
            <Field label="Low Stock Threshold">
              <Input
                type="number"
                value={form.inventory.low_stock_threshold}
                onChange={(e) => update("inventory", "low_stock_threshold", Number(e.target.value))}
              />
            </Field>
            <Field label="Out of Stock Behaviour">
              <select
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={form.inventory.out_of_stock_behaviour}
                onChange={(e) => update("inventory", "out_of_stock_behaviour", e.target.value)}
              >
                {STOCK_BEHAVIOURS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.inventory.allow_negative_stock}
                onChange={(e) => update("inventory", "allow_negative_stock", e.target.checked)}
                className="rounded border-input"
              />
              Allow negative stock
            </label>
          </SectionCard>
        </TabsContent>

        <TabsContent value="seo" className="mt-6 space-y-6">
          <SectionCard title="SEO & Analytics" icon={Search}>
            <Field label="Default Meta Title">
              <Input
                value={form.seo.default_title}
                onChange={(e) => update("seo", "default_title", e.target.value)}
              />
            </Field>
            <Field label="Default Meta Description">
              <Textarea
                value={form.seo.default_description}
                onChange={(e) => update("seo", "default_description", e.target.value)}
                rows={3}
              />
            </Field>
            <Field label="Google Analytics ID">
              <Input
                value={form.seo.google_analytics_id}
                onChange={(e) => update("seo", "google_analytics_id", e.target.value)}
                placeholder="G-XXXXXXXXXX"
              />
            </Field>
            <Field label="Google Tag Manager ID">
              <Input
                value={form.seo.google_tag_manager_id}
                onChange={(e) => update("seo", "google_tag_manager_id", e.target.value)}
                placeholder="GTM-XXXXXXX"
              />
            </Field>
            <Field label="Facebook Pixel ID">
              <Input
                value={form.seo.facebook_pixel_id}
                onChange={(e) => update("seo", "facebook_pixel_id", e.target.value)}
                placeholder="XXXXXXXXXXXXXXX"
              />
            </Field>
          </SectionCard>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <SectionCard title="Security & Access" icon={Shield}>
            <Field label="Session Timeout (minutes)">
              <Input
                type="number"
                value={form.security.session_timeout_minutes}
                onChange={(e) => update("security", "session_timeout_minutes", Number(e.target.value))}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.security.require_2fa}
                onChange={(e) => update("security", "require_2fa", e.target.checked)}
                className="rounded border-input"
              />
              Require two-factor authentication
            </label>
            <Field label="Allowed Studio Roles">
              <div className="flex flex-wrap gap-2">
                {["admin", "manager", "editor", "viewer"].map((role) => (
                  <label
                    key={role}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer border transition-colors ${
                      form.security.allowed_roles.includes(role)
                        ? "bg-teal/10 text-teal-deep border-teal/30"
                        : "bg-muted/30 text-muted-foreground border-border/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.security.allowed_roles.includes(role)}
                      onChange={(e) => {
                        const current = form.security.allowed_roles;
                        const next = e.target.checked
                          ? [...current, role]
                          : current.filter((r) => r !== role);
                        update("security", "allowed_roles", next);
                      }}
                      className="hidden"
                    />
                    {role}
                  </label>
                ))}
              </div>
            </Field>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
