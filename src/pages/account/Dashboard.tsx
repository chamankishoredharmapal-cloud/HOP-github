import { useQuery } from "@tanstack/react-query";
import { Package, Heart, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { fetchCustomerOrders } from "@/services/customerOrderService";
import { fetchAddresses } from "@/services/customerAddressService";
import { fetchWishlistProductIds } from "@/services/customerWishlistService";
import { Skeleton } from "@/components/ui/skeleton";
import { useMetadata } from "@/hooks/useMetadata";

const statusOrder = ["pending_payment", "confirmed", "processing", "shipped"];
const statusLabel: Record<string, string> = {
  pending_payment: "Pending",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export default function Dashboard() {
  useMetadata({
    title: "My Account — House of Padmavati",
    description: "Your account dashboard at House of Padmavati.",
    noIndex: true,
  });
  const { user } = useAuth();

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["customer-orders", user?.id],
    queryFn: () => fetchCustomerOrders(user!.id),
    enabled: !!user,
  });

  const { data: addresses } = useQuery({
    queryKey: ["customer-addresses", user?.id],
    queryFn: () => fetchAddresses(user!.id),
    enabled: !!user,
  });

  const { data: wishlistIds } = useQuery({
    queryKey: ["customer-wishlist-ids", user?.id],
    queryFn: () => fetchWishlistProductIds(user!.id),
    enabled: !!user,
  });

  const activeOrders = orders?.filter((o) => statusOrder.includes(o.status)) ?? [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-serif text-xl md:text-2xl text-ink mb-1">
          Hello, {user?.user_metadata?.full_name || "there"}
        </h2>
        <p className="text-sm text-ink-soft">{user?.email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/account/orders"
          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-teal-deep/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5 text-teal-deep" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-ink">
              {ordersLoading ? <Skeleton className="w-8 h-5" /> : orders?.length ?? 0}
            </p>
            <p className="text-xs text-ink-soft truncate">Orders</p>
          </div>
          <ChevronRight className="w-4 h-4 text-ink-soft shrink-0" />
        </Link>

        <Link
          to="/account/wishlist"
          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-teal-deep/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center shrink-0">
            <Heart className="w-5 h-5 text-teal-deep" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-ink">
              {wishlistIds?.length ?? 0}
            </p>
            <p className="text-xs text-ink-soft truncate">Wishlist</p>
          </div>
          <ChevronRight className="w-4 h-4 text-ink-soft shrink-0" />
        </Link>

        <Link
          to="/account/addresses"
          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-teal-deep/30 transition-colors"
        >
          <div className="w-10 h-10 rounded-full bg-teal-deep/10 flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-teal-deep" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-lg font-semibold text-ink">
              {addresses?.length ?? 0}
            </p>
            <p className="text-xs text-ink-soft truncate">Addresses</p>
          </div>
          <ChevronRight className="w-4 h-4 text-ink-soft shrink-0" />
        </Link>
      </div>

      {ordersLoading ? (
        <div className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : activeOrders.length > 0 ? (
        <section>
          <h3 className="font-serif text-lg text-ink mb-3">Active orders</h3>
          <div className="space-y-3">
            {activeOrders.slice(0, 3).map((order) => (
              <Link
                key={order.id}
                to={`/account/orders/${order.id}`}
                className="block p-4 rounded-lg border border-border hover:border-teal-deep/30 transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-ink">
                    #{order.orderNumber}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-ink/5 text-ink-soft capitalize">
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
                <p className="text-xs text-ink-soft">
                  {order.itemCount} item{order.itemCount !== 1 ? "s" : ""} &middot;{" "}
                  {new Date(order.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
