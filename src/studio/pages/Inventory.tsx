import { useState, useEffect, useCallback } from "react";
import {
  Package, CheckCircle2, AlertTriangle, XCircle, ShoppingCart,
  Search, ArrowUpDown, Plus, Minus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DashboardCard } from "../components/DashboardCard";
import {
  useInventoryMetrics,
  useInventoryList,
  useAdjustStock,
  useInventoryHistory,
} from "../hooks/useInventory";
import type { InventoryItem, StockStatus, AdjustmentReason } from "../types/inventory";
import {
  ADJUSTMENT_REASON_LABELS,
  ADJUSTMENT_REASONS,
  STOCK_STATUS_LABELS,
  STOCK_STATUS_STYLES,
} from "../types/inventory";

const statusFilters: { label: string; value: StockStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Healthy", value: "healthy" },
  { label: "Low Stock", value: "low_stock" },
  { label: "Out of Stock", value: "out_of_stock" },
];

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export default function Inventory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StockStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"name" | "stock" | "sku">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [adjustTarget, setAdjustTarget] = useState<InventoryItem | null>(null);
  const [adjustMode, setAdjustMode] = useState<"add" | "remove">("add");
  const [adjustQty, setAdjustQty] = useState(1);
  const [adjustReason, setAdjustReason] = useState<AdjustmentReason>("manual_adjustment");
  const [adjustNotes, setAdjustNotes] = useState("");

  const [historyTarget, setHistoryTarget] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const metrics = useInventoryMetrics();
  const list = useInventoryList(debouncedQuery || undefined, statusFilter, sortBy, sortDir);
  const adjust = useAdjustStock();
  const history = useInventoryHistory(historyTarget);

  const toggleSort = useCallback((col: "name" | "stock" | "sku") => {
    if (sortBy === col) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(col);
      setSortDir("asc");
    }
  }, [sortBy]);

  const openAdjust = useCallback((item: InventoryItem, mode: "add" | "remove") => {
    setAdjustTarget(item);
    setAdjustMode(mode);
    setAdjustQty(1);
    setAdjustReason("manual_adjustment");
    setAdjustNotes("");
  }, []);

  const handleAdjust = useCallback(async () => {
    if (!adjustTarget) return;
    const qty = adjustMode === "remove" ? -adjustQty : adjustQty;
    await adjust.mutateAsync({
      product_id: adjustTarget.id,
      quantity: qty,
      reason: adjustReason,
      notes: adjustNotes || undefined,
    });
    setAdjustTarget(null);
  }, [adjustTarget, adjustMode, adjustQty, adjustReason, adjustNotes, adjust]);

  const openHistory = useCallback((productId: string) => {
    setHistoryTarget((prev) => (prev === productId ? null : productId));
  }, []);

  const isLoading = list.isLoading || metrics.isLoading;
  const error = list.error || metrics.error;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <DashboardCard
          label="Total Products"
          value={metrics.data ? String(metrics.data.totalProducts) : "0"}
          icon={Package}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="In Stock"
          value={metrics.data ? String(metrics.data.inStock) : "0"}
          icon={CheckCircle2}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="Low Stock"
          value={metrics.data ? String(metrics.data.lowStock) : "0"}
          icon={AlertTriangle}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="Out of Stock"
          value={metrics.data ? String(metrics.data.outOfStock) : "0"}
          icon={XCircle}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="Reserved"
          value={metrics.data ? String(metrics.data.reservedStock) : "0"}
          icon={ShoppingCart}
          loading={metrics.isLoading}
        />
      </div>

      <Card className="border border-border/50 bg-card">
        <CardContent className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm bg-jasmine-deep/50 border-border/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(v: "name" | "stock" | "sku") => setSortBy(v)}>
                <SelectTrigger className="w-[130px] h-8 text-xs border-border/50 bg-jasmine-deep/50">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="sku">SKU</SelectItem>
                  <SelectItem value="stock">Stock</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
                className="border-border/50 text-muted-foreground"
              >
                <ArrowUpDown className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {statusFilters.map((f) => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === f.value
                    ? "bg-teal-deep text-jasmine"
                    : "bg-jasmine-deep/50 text-muted-foreground hover:bg-jasmine-deep"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive">Failed to load inventory.</p>
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : !list.data || list.data.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {debouncedQuery ? "No products match your search." : "No products in inventory."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left pb-3 pr-3 w-12" />
                    <th className="text-left pb-3 pr-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Product
                    </th>
                    <th className="text-left pb-3 pr-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] hidden sm:table-cell">
                      SKU
                    </th>
                    <th className="text-left pb-3 pr-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] hidden md:table-cell">
                      Collection
                    </th>
                    <th
                      className="text-right pb-3 pr-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] cursor-pointer hover:text-foreground"
                      onClick={() => toggleSort("stock")}
                    >
                      Stock {sortBy === "stock" && (sortDir === "asc" ? "↑" : "↓")}
                    </th>
                    <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Status
                    </th>
                    <th className="text-right pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.data.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border/30 last:border-0 hover:bg-jasmine-deep/30 transition-colors"
                    >
                      <td className="py-3 pr-3">
                        <div className="w-10 h-10 rounded-md bg-jasmine-deep overflow-hidden flex-shrink-0">
                          {item.image_url ? (
                            <img
                              src={item.image_url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-3">
                        <button
                          onClick={() => openHistory(item.id)}
                          className="text-foreground font-medium text-sm hover:text-teal-deep transition-colors"
                        >
                          {item.name}
                        </button>
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground text-xs hidden sm:table-cell font-mono">
                        {item.sku}
                      </td>
                      <td className="py-3 pr-3 text-muted-foreground text-xs hidden md:table-cell">
                        {item.collection_name ?? "—"}
                      </td>
                      <td className="py-3 pr-3 text-right font-medium tabular-nums">
                        {item.available_stock}
                      </td>
                      <td className="py-3 pr-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            STOCK_STATUS_STYLES[item.status]
                          }`}
                        >
                          {STOCK_STATUS_LABELS[item.status]}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAdjust(item, "add")}
                            className="h-7 w-7 p-0 text-teal-deep hover:text-teal hover:bg-teal/10"
                            title="Add Stock"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openAdjust(item, "remove")}
                            className="h-7 w-7 p-0 text-sakura hover:text-sakura hover:bg-sakura/10"
                            title="Remove Stock"
                            disabled={item.available_stock <= 0}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {historyTarget && (
        <Card className="border border-border/50 bg-card">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-base font-light text-foreground tracking-tight">
                Adjustment History
              </h3>
              <button
                onClick={() => setHistoryTarget(null)}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
            </div>
            {history.isLoading ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-10 rounded bg-muted animate-pulse" />
                ))}
              </div>
            ) : history.error ? (
              <p className="text-sm text-destructive">Failed to load history.</p>
            ) : !history.data || history.data.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">No adjustments recorded yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left pb-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">Date</th>
                      <th className="text-right pb-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">Change</th>
                      <th className="text-right pb-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">Previous</th>
                      <th className="text-right pb-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">New</th>
                      <th className="text-left pb-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] hidden sm:table-cell">Reason</th>
                      <th className="text-left pb-2 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] hidden lg:table-cell">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.data.map((entry) => (
                      <tr key={entry.id} className="border-b border-border/30 last:border-0">
                        <td className="py-2 pr-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(entry.created_at)}</td>
                        <td className={`py-2 pr-3 text-right text-xs font-medium tabular-nums ${
                          entry.change > 0 ? "text-teal-deep" : "text-sakura"
                        }`}>
                          {entry.change > 0 ? `+${entry.change}` : entry.change}
                        </td>
                        <td className="py-2 pr-3 text-right text-xs text-muted-foreground tabular-nums">{entry.previous_stock}</td>
                        <td className="py-2 pr-3 text-right text-xs font-medium tabular-nums">{entry.new_stock}</td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground hidden sm:table-cell">{ADJUSTMENT_REASON_LABELS[entry.reason] ?? entry.reason}</td>
                        <td className="py-2 pr-3 text-xs text-muted-foreground hidden lg:table-cell max-w-[200px] truncate">{entry.notes ?? "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Dialog open={!!adjustTarget} onOpenChange={(open) => { if (!open) setAdjustTarget(null); }}>
        <DialogContent className="sm:max-w-[420px]">
          <DialogHeader>
            <DialogTitle className="font-serif text-lg font-light">
              {adjustMode === "add" ? "Add Stock" : "Remove Stock"}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              {adjustTarget?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="flex items-center justify-between text-sm bg-jasmine-deep/50 rounded-lg px-3 py-2">
              <span className="text-muted-foreground">Current Stock</span>
              <span className="font-medium tabular-nums">{adjustTarget?.available_stock ?? 0}</span>
            </div>

            <div className="flex gap-2">
              <Button
                variant={adjustMode === "add" ? "default" : "outline"}
                size="sm"
                onClick={() => setAdjustMode("add")}
                className={adjustMode === "add" ? "bg-teal-deep text-jasmine" : "border-border/50"}
              >
                <Plus className="h-3.5 w-3.5 mr-1" /> Add
              </Button>
              <Button
                variant={adjustMode === "remove" ? "default" : "outline"}
                size="sm"
                onClick={() => setAdjustMode("remove")}
                className={adjustMode === "remove" ? "bg-sakura text-ink" : "border-border/50"}
                disabled={!adjustTarget || adjustTarget.available_stock <= 0}
              >
                <Minus className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                Quantity
              </Label>
              <Input
                type="number"
                min={1}
                max={adjustMode === "remove" ? (adjustTarget?.available_stock ?? 0) : undefined}
                value={adjustQty}
                onChange={(e) => setAdjustQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="text-sm bg-jasmine-deep/50 border-border/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                Reason
              </Label>
              <Select value={adjustReason} onValueChange={(v: AdjustmentReason) => setAdjustReason(v)}>
                <SelectTrigger className="text-sm bg-jasmine-deep/50 border-border/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ADJUSTMENT_REASONS.map((r) => (
                    <SelectItem key={r} value={r}>{ADJUSTMENT_REASON_LABELS[r]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                Notes
              </Label>
              <Textarea
                value={adjustNotes}
                onChange={(e) => setAdjustNotes(e.target.value)}
                placeholder="Optional notes about this adjustment..."
                className="text-sm bg-jasmine-deep/50 border-border/50 min-h-[60px] resize-y"
              />
            </div>

            <div className="flex items-center justify-between text-sm bg-jasmine-deep/50 rounded-lg px-3 py-2">
              <span className="text-muted-foreground">Resulting Stock</span>
              <span className="font-medium tabular-nums">
                {Math.max(
                  0,
                  (adjustTarget?.available_stock ?? 0) +
                    (adjustMode === "add" ? adjustQty : -adjustQty),
                )}
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setAdjustTarget(null)}
              className="border-border/50"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={adjust.isPending}
              onClick={handleAdjust}
              className={adjustMode === "add" ? "bg-teal-deep text-jasmine" : "bg-sakura text-ink"}
            >
              {adjust.isPending ? "Adjusting..." : adjustMode === "add" ? "Add Stock" : "Remove Stock"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
