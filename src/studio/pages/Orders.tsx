import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ShoppingBag, DollarSign, Clock, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "../components/DashboardCard";
import { useOrdersList, useOrdersMetrics, useOrdersSearch } from "../hooks/useOrders";
import type { OrderWithCustomer, OrderStatus } from "../types/order";

type StatusTab = OrderStatus | "all";

const statusTabs: { label: string; value: StatusTab }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending_payment" },
  { label: "Confirmed", value: "confirmed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
  { label: "Returned", value: "returned" },
];

const paymentFilterOptions: { label: string; value: "all" | "paid" | "cod" }[] = [
  { label: "All", value: "all" },
  { label: "Paid", value: "paid" },
  { label: "COD", value: "cod" },
];

const statusStyles: Record<string, string> = {
  pending_payment: "bg-sakura/20 text-ink",
  confirmed: "bg-sand/30 text-ink",
  processing: "bg-sand/30 text-ink",
  shipped: "bg-teal/10 text-teal-deep",
  delivered: "bg-teal-deep/10 text-teal-deep",
  cancelled: "bg-muted text-muted-foreground",
  returned: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  pending_payment: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

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

export default function Orders() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<StatusTab>("all");
  const [paymentFilter, setPaymentFilter] = useState<"all" | "paid" | "cod">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const metrics = useOrdersMetrics();
  const allOrders = useOrdersList(statusFilter, !debouncedQuery);
  const searchResults = useOrdersSearch(debouncedQuery);

  const isLoading = (debouncedQuery ? searchResults.isLoading : allOrders.isLoading) || metrics.isLoading;
  const error = (debouncedQuery ? searchResults.error : allOrders.error) || metrics.error;

  let displayOrders: OrderWithCustomer[] | undefined;
  if (debouncedQuery) {
    displayOrders = searchResults.data;
  } else {
    displayOrders = allOrders.data;
  }

  const filteredOrders = (displayOrders ?? []).filter((o) => {
    if (paymentFilter === "paid") return o.payment_status === "paid";
    if (paymentFilter === "cod") return false;
    if (debouncedQuery && statusFilter !== "all") return o.status === statusFilter;
    return true;
  });

  const searching = debouncedQuery.length > 0 && searchResults.isLoading;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Orders Today"
          value={metrics.data ? String(metrics.data.ordersToday) : "0"}
          icon={ShoppingBag}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="Revenue Today"
          value={metrics.data ? formatCurrency(metrics.data.revenueToday) : "₹0"}
          icon={DollarSign}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="Pending Orders"
          value={metrics.data ? String(metrics.data.pendingCount) : "0"}
          icon={Clock}
          loading={metrics.isLoading}
        />
        <DashboardCard
          label="Avg Order Value"
          value={metrics.data ? formatCurrency(metrics.data.averageOrderValue) : "₹0"}
          icon={TrendingUp}
          loading={metrics.isLoading}
        />
      </div>

      <Card className="border border-border/50 bg-card">
        <CardContent className="p-4 sm:p-6 space-y-5">
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order ID, customer, email, phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 text-sm bg-jasmine-deep/50 border-border/50"
              />
            </div>
            <div className="flex gap-2">
              {paymentFilterOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={paymentFilter === opt.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPaymentFilter(opt.value)}
                  className={
                    paymentFilter === opt.value
                      ? "bg-teal-deep text-jasmine hover:bg-teal"
                      : "border-border/50 text-muted-foreground"
                  }
                >
                  {opt.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex gap-1.5 flex-wrap">
            {statusTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  statusFilter === tab.value
                    ? "bg-teal-deep text-jasmine"
                    : "bg-jasmine-deep/50 text-muted-foreground hover:bg-jasmine-deep"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {error ? (
            <div className="py-12 text-center">
              <p className="text-sm text-destructive">Failed to load orders.</p>
            </div>
          ) : isLoading || searching ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
              ))}
            </div>
          ) : !filteredOrders || filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm text-muted-foreground">
                {debouncedQuery ? "No orders match your search." : "No orders yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Order
                    </th>
                    <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Customer
                    </th>
                    <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] hidden sm:table-cell">
                      Date
                    </th>
                    <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Status
                    </th>
                    <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em] hidden md:table-cell">
                      Payment
                    </th>
                    <th className="text-right pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => navigate(`/studio/orders/${order.id}`)}
                      className="border-b border-border/30 last:border-0 cursor-pointer hover:bg-jasmine-deep/30 transition-colors"
                    >
                      <td className="py-3.5 pr-3">
                        <span className="text-foreground font-medium text-xs">
                          {order.order_number}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div>
                          <p className="text-foreground text-sm font-medium">
                            {order.customer?.full_name ?? "Unknown"}
                          </p>
                          <p className="text-muted-foreground text-xs mt-0.5 hidden sm:block">
                            {order.customer?.email}
                          </p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3 text-muted-foreground text-xs hidden sm:table-cell">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="py-3.5 pr-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            statusStyles[order.status] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </td>
                      <td className="py-3.5 pr-3 hidden md:table-cell">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            order.payment_status === "paid"
                              ? "bg-teal-deep/10 text-teal-deep"
                              : order.payment_status === "pending"
                                ? "bg-sakura/20 text-ink"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {order.payment_status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 text-right text-foreground font-medium whitespace-nowrap">
                        {formatCurrency(order.total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
