import { useState, useCallback, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown, ExternalLink, Phone, Mail, MapPin } from "lucide-react";
import { useCustomers, useCustomer, useDeleteCustomer } from "../hooks/useCustomers";
import type { CustomerListParams } from "../types/customer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}

function orderStatusBadge(status: string) {
  const styles: Record<string, string> = {
    pending_payment: "bg-sakura/20 text-ink",
    confirmed: "bg-sand/30 text-ink",
    processing: "bg-sand/30 text-ink",
    shipped: "bg-teal/10 text-teal-deep",
    delivered: "bg-teal-deep/10 text-teal-deep",
    cancelled: "bg-muted text-muted-foreground",
    returned: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] ?? "bg-muted text-muted-foreground"}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function CustomerDetailDialog({
  customerId,
  open,
  onOpenChange,
}: {
  customerId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: customer, isLoading } = useCustomer(customerId ?? undefined);
  const deleteCustomer = useDeleteCustomer();
  const [notes, setNotes] = useState("");

  const handleDelete = useCallback(() => {
    if (!customerId) return;
    deleteCustomer.mutate(customerId, {
      onSuccess: () => onOpenChange(false),
    });
  }, [customerId, deleteCustomer, onOpenChange]);

  useEffect(() => {
    if (customer?.notes) setNotes(customer.notes);
    else setNotes("");
  }, [customer?.notes]);

  if (!customerId) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        {isLoading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : customer ? (
          <>
            <DialogHeader>
              <DialogTitle className="font-serif text-xl">{customer.full_name}</DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm">
                <Mail className="h-3.5 w-3.5" />
                {customer.email}
                {customer.phone && (
                  <>
                    <span className="text-muted-foreground">·</span>
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4">
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-serif font-light text-foreground">{customer.order_count}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Orders</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-serif font-light text-foreground">{formatCurrency(customer.total_spent)}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Spent</p>
                </CardContent>
              </Card>
              <Card className="border-border/50">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-serif font-light text-foreground">{formatCurrency(customer.average_order_value)}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Order</p>
                </CardContent>
              </Card>
            </div>

            {customer.addresses.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Addresses</h4>
                <div className="grid gap-2">
                  {customer.addresses.map((addr) => (
                    <div key={addr.id} className="rounded-lg border border-border/50 p-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <div>
                          <p className="font-medium text-foreground">{addr.recipient_name}</p>
                          <p>{addr.address}, {addr.city}, {addr.state} {addr.postal_code}</p>
                          <p>{addr.country}</p>
                          {addr.phone && <p className="text-xs mt-1">{addr.phone}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customer.recent_orders.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Recent Orders</h4>
                <div className="rounded-lg border border-border/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border/50 bg-muted/30">
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Order</th>
                        <th className="text-left p-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Status</th>
                        <th className="text-right p-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Total</th>
                        <th className="text-right p-3 text-xs font-medium text-muted-foreground uppercase tracking-wide">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customer.recent_orders.map((order) => (
                        <tr key={order.id} className="border-b border-border/30 last:border-0">
                          <td className="p-3 font-medium text-foreground">{order.order_number}</td>
                          <td className="p-3">{orderStatusBadge(order.status)}</td>
                          <td className="p-3 text-right text-foreground">{formatCurrency(order.total)}</td>
                          <td className="p-3 text-right text-muted-foreground">{formatDate(order.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <DialogFooter className="border-t border-border/50 pt-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">Delete Customer</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete this customer?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Their order history will remain but the customer profile will be removed.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DialogFooter>
          </>
        ) : (
          <p className="text-center text-muted-foreground py-8">Customer not found.</p>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function Customers() {
  const [params, setParams] = useState<CustomerListParams>({
    search: "",
    status: "all",
    page: 1,
    perPage: 20,
    sortBy: "created_at",
    sortDir: "desc",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, error } = useCustomers(params);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev) => ({ ...prev, search: searchInput, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSort = useCallback((column: string) => {
    setParams((prev) => ({
      ...prev,
      sortBy: column as "name" | "email" | "created_at",
      sortDir: prev.sortBy === column && prev.sortDir === "asc" ? "desc" : "asc",
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setParams((prev) => ({ ...prev, page }));
  }, []);

  const handleRowClick = useCallback((id: string) => {
    setSelectedId(id);
    setDetailOpen(true);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border border-border/50 bg-card">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500 text-sm">
              Failed to load customers. Please try again.
            </div>
          ) : !data || data.customers.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground text-sm">
              {params.search ? "No customers match your search." : "No customers yet."}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th
                      className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("name")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Name
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th
                      className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("email")}
                    >
                      <span className="inline-flex items-center gap-1">
                        Email
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="text-left p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                      Phone
                    </th>
                    <th
                      className="text-right p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort("created_at")}
                    >
                      <span className="inline-flex items-center gap-1 justify-end">
                        Joined
                        <ArrowUpDown className="h-3 w-3" />
                      </span>
                    </th>
                    <th className="p-4 w-10" />
                  </tr>
                </thead>
                <tbody>
                  {data.customers.map((customer) => (
                    <tr
                      key={customer.id}
                      className="border-b border-border/30 hover:bg-muted/20 cursor-pointer transition-colors"
                      onClick={() => handleRowClick(customer.id)}
                    >
                      <td className="p-4 font-medium text-foreground">{customer.full_name}</td>
                      <td className="p-4 text-muted-foreground">{customer.email}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">
                        {customer.phone ?? "—"}
                      </td>
                      <td className="p-4 text-right text-muted-foreground">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="p-4">
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Page {data.page} of {data.totalPages} ({data.total} customers)
          </p>
          <div className="flex gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={data.page <= 1}
              onClick={() => handlePageChange(data.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={data.page >= data.totalPages}
              onClick={() => handlePageChange(data.page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <CustomerDetailDialog
        customerId={selectedId}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
