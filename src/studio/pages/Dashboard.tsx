import { DollarSign, ShoppingBag, Clock, Users, Package, Layers, AlertTriangle, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DashboardCard } from "../components/DashboardCard";
import { RecentOrders } from "../components/RecentOrders";
import { RecentCustomers } from "../components/RecentCustomers";
import {
  useRevenueToday,
  useOrdersToday,
  usePendingPayments,
  useCustomerCount,
  useRecentOrders,
  useRecentCustomers,
} from "../hooks/useDashboard";
import { useOrdersMetrics } from "../hooks/useOrders";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

function formatCurrency(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

function formatCurrencyShort(paise: number): string {
  const rupees = paise / 100;
  if (rupees >= 100000) return `₹${(rupees / 100000).toFixed(1)}L`;
  if (rupees >= 1000) return `₹${(rupees / 1000).toFixed(1)}K`;
  return `₹${rupees.toFixed(0)}`;
}

export default function Dashboard() {
  const revenue = useRevenueToday();
  const orders = useOrdersToday();
  const pending = usePendingPayments();
  const customers = useCustomerCount();
  const recentOrders = useRecentOrders();
  const recentCustomers = useRecentCustomers();
  const metrics = useOrdersMetrics();
  const navigate = useNavigate();

  const quickActions = [
    { label: "New Product", path: "/studio/products/new", icon: Package },
    { label: "New Collection", path: "/studio/collections/new", icon: Layers },
    { label: "View Orders", path: "/studio/orders", icon: ShoppingBag },
    { label: "Inventory", path: "/studio/inventory", icon: AlertTriangle },
  ];

  const aov = metrics.data?.averageOrderValue ?? 0;
  const pendingCount = metrics.data?.pendingCount ?? 0;
  const ordersToday = metrics.data?.ordersToday ?? 0;
  const revToday = metrics.data?.revenueToday ?? 0;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          label="Revenue Today"
          value={revenue.data !== undefined ? formatCurrency(revenue.data) : "₹0"}
          icon={DollarSign}
          loading={revenue.isLoading}
        />
        <DashboardCard
          label="Orders Today"
          value={orders.data !== undefined ? String(orders.data) : "0"}
          icon={ShoppingBag}
          loading={orders.isLoading}
        />
        <DashboardCard
          label="Pending Payments"
          value={pending.data !== undefined ? String(pending.data) : "0"}
          icon={Clock}
          loading={pending.isLoading}
        />
        <DashboardCard
          label="Customers"
          value={customers.data !== undefined ? String(customers.data) : "0"}
          icon={Users}
          loading={customers.isLoading}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Avg Order Value</p>
              <TrendingUp className="h-4 w-4 text-teal-deep" />
            </div>
            {metrics.isLoading ? (
              <Skeleton className="h-7 w-24" />
            ) : (
              <p className="text-xl font-serif font-light text-foreground">{formatCurrencyShort(aov)}</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Pending Orders</p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            {metrics.isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-xl font-serif font-light text-foreground">{pendingCount}</p>
            )}
          </CardContent>
        </Card>
        <Card className="border-border/50 bg-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Orders Today</p>
              <ShoppingBag className="h-4 w-4 text-jasmine-deep" />
            </div>
            {metrics.isLoading ? (
              <Skeleton className="h-7 w-16" />
            ) : (
              <p className="text-xl font-serif font-light text-foreground">{ordersToday}</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentOrders data={recentOrders.data} loading={recentOrders.isLoading} />
        <RecentCustomers data={recentCustomers.data} loading={recentCustomers.isLoading} />
      </div>

      <Card className="border-border/50 bg-card">
        <CardHeader>
          <CardTitle className="font-serif text-lg font-light text-foreground">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.path}
                variant="outline"
                onClick={() => navigate(action.path)}
                className="gap-2"
              >
                <action.icon className="h-4 w-4" />
                {action.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {revToday > 0 && (
        <Card className="border-border/50 bg-card">
          <CardHeader>
            <CardTitle className="font-serif text-lg font-light text-foreground">
              Revenue Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Today's revenue vs daily target</span>
                <span className="text-foreground font-medium">{formatCurrencyShort(revToday)}</span>
              </div>
              <Progress value={Math.min((revToday / 200000) * 100, 100)} className="h-2" />
              <p className="text-xs text-muted-foreground text-right">
                Target: {formatCurrencyShort(200000)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
