import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/services/customerAddressService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetadata } from "@/hooks/useMetadata";
import type { TablesInsert, TablesUpdate } from "@/integrations/supabase/types";

type AddressForm = {
  recipient_name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark: string;
};

const emptyForm: AddressForm = {
  recipient_name: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "India",
  landmark: "",
};

export default function Addresses() {
  useMetadata({
    title: "Addresses — House of Padmavati",
    description: "Manage your shipping addresses.",
    noIndex: true,
  });
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AddressForm>(emptyForm);
  const [error, setError] = useState("");

  const { data: addresses, isLoading } = useQuery({
    queryKey: ["customer-addresses", user?.id],
    queryFn: () => fetchAddresses(user!.id),
    enabled: !!user,
  });

  const createMutation = useMutation({
    mutationFn: (input: TablesInsert<"shipping_addresses">) => createAddress(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses", user?.id] });
      resetForm();
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Failed to save"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: TablesUpdate<"shipping_addresses"> }) =>
      updateAddress(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses", user?.id] });
      resetForm();
    },
    onError: (err) => setError(err instanceof Error ? err.message : "Failed to update"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-addresses", user?.id] });
    },
  });

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setOpen(false);
    setError("");
  };

  const openEdit = (addr: TablesInsert<"shipping_addresses"> & { id: string }) => {
    setForm({
      recipient_name: addr.recipient_name,
      phone: addr.phone ?? "",
      address: addr.address,
      city: addr.city,
      state: addr.state,
      postal_code: addr.postal_code,
      country: addr.country ?? "India",
      landmark: addr.landmark ?? "",
    });
    setEditingId(addr.id);
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const payload = {
      customer_id: user!.id,
      ...form,
      phone: form.phone || null,
      landmark: form.landmark || null,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, updates: payload });
    } else {
      createMutation.mutate(payload as TablesInsert<"shipping_addresses">);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif text-xl text-ink">Addresses</h2>
        <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); setOpen(v); }}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4" />
              Add address
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit address" : "Add address"}</DialogTitle>
            </DialogHeader>
            {error && (
              <Alert variant="destructive" className="mb-2">
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="recipient">Recipient name</Label>
                  <Input id="recipient" value={form.recipient_name} onChange={(e) => setForm({ ...form, recipient_name: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Address</Label>
                <Input id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="landmark">Landmark (optional)</Label>
                <Input id="landmark" value={form.landmark} onChange={(e) => setForm({ ...form, landmark: e.target.value })} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="city">City</Label>
                  <Input id="city" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State</Label>
                  <Input id="state" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="postal">PIN code</Label>
                  <Input id="postal" value={form.postal_code} onChange={(e) => setForm({ ...form, postal_code: e.target.value })} required />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editingId ? "Update" : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
      ) : addresses && addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-lg border border-border relative group"
            >
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-teal-deep shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ink">{addr.recipient_name}</p>
                  <p className="text-sm text-ink-soft">{addr.address}</p>
                  <p className="text-sm text-ink-soft">
                    {addr.city}, {addr.state} &ndash; {addr.postal_code}
                  </p>
                  {addr.phone && (
                    <p className="text-xs text-ink-soft mt-1">Phone: {addr.phone}</p>
                  )}
                  {addr.landmark && (
                    <p className="text-xs text-ink-soft">Landmark: {addr.landmark}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(addr as TablesInsert<"shipping_addresses"> & { id: string })}
                    className="p-1.5 rounded-md text-ink-soft hover:text-ink hover:bg-ink/5"
                    aria-label="Edit address"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this address?")) deleteMutation.mutate(addr.id);
                    }}
                    className="p-1.5 rounded-md text-ink-soft hover:text-red-600 hover:bg-red-50"
                    aria-label="Delete address"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-ink-soft">
          <MapPin className="w-8 h-8 mx-auto mb-3 opacity-40" />
          <p className="text-sm">No addresses saved yet.</p>
        </div>
      )}
    </div>
  );
}
