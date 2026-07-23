import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { RecentOrder } from "../types/dashboard";

interface RecentOrdersProps {
  data: RecentOrder[] | undefined;
  loading: boolean;
}

const statusStyles: Record<string, string> = {
  pending_payment: "bg-sakura/20 text-ink",
  confirmed: "bg-sand/30 text-ink",
  processing: "bg-sand/30 text-ink",
  shipped: "bg-teal/10 text-teal-deep",
  delivered: "bg-teal-deep/10 text-teal-deep",
  cancelled: "bg-muted text-muted-foreground",
  returned: "bg-muted text-muted-foreground",
};

function formatCurrency(paise: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(paise / 100);
}

export function RecentOrders({ data, loading }: RecentOrdersProps) {
  return (
    <Card className="border border-border/50 bg-card">
      <CardHeader>
        <CardTitle className="font-serif text-lg font-light text-foreground">
          Recent Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 rounded bg-muted animate-pulse" />
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No orders yet.
          </p>
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
                  <th className="text-left pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                    Status
                  </th>
                  <th className="text-right pb-3 text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((order) => (
                  <tr key={order.id} className="border-b border-border/30 last:border-0">
                    <td className="py-3 text-foreground font-medium">{order.order_number}</td>
                    <td className="py-3 text-muted-foreground">{order.customer_name}</td>
                    <td className="py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          statusStyles[order.status] || "bg-muted text-muted-foreground"
                        }`}
                      >
                        {order.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3 text-right text-foreground font-medium">
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
  );
}
