import { useQuery } from "@tanstack/react-query";
import { Package, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCustomerOrders } from "@/services/customerOrderService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetadata } from "@/hooks/useMetadata";

const statusLabel: Record<string, string> = {
  pending_payment: "Pending payment",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const statusColor: Record<string, string> = {
  pending_payment: "text-amber-600 bg-amber-50",
  confirmed: "text-teal-deep bg-teal-deep/10",
  processing: "text-blue-600 bg-blue-50",
  shipped: "text-purple-600 bg-purple-50",
  delivered: "text-green-600 bg-green-50",
  cancelled: "text-red-600 bg-red-50",
  returned: "text-ink-soft bg-ink/5",
};

export default function OrderHistory() {
  useMetadata({
    title: "Order History — House of Padmavati",
    description: "View your order history at House of Padmavati.",
    noIndex: true,
  });
  const { user } = useAuth();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: () => fetchCustomerOrders(user!.id),
    enabled: !!user,
  });

  return (
    <div>
      <h2 className="font-serif text-xl text-ink mb-6">Order history</h2>

      {isLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              to={`/account/orders/${order.id}`}
              className="block p-4 rounded-lg border border-border hover:border-teal-deep/30 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-ink/5 flex items-center justify-center">
                    <Package className="w-5 h-5 text-ink-soft" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">
                      #{order.orderNumber}
                    </p>
                    <p className="text-xs text-ink-soft">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {" · "}
                      {order.itemCount} item{order.itemCount !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                      statusColor[order.status] || "text-ink-soft bg-ink/5"
                    }`}
                  >
                    {statusLabel[order.status] || order.status}
                  </span>
                  <ChevronRight className="w-4 h-4 text-ink-soft opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-ink-soft">
          <Package className="w-10 h-10 mx-auto mb-4 opacity-30" />
          <p className="text-sm mb-1">No orders yet</p>
          <p className="text-xs">When you place an order, it will appear here.</p>
        </div>
      )}
    </div>
  );
}
