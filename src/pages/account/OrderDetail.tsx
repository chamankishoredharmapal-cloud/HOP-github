import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Package } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/useMetadata";
import { fetchCustomerOrderDetail } from "@/services/customerOrderService";

const statusLabel: Record<string, string> = {
  pending_payment: "Pending payment",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

function formatPrice(paise: number): string {
  return `₹ ${(paise / 100).toLocaleString("en-IN")}`;
}

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  useMetadata({
    title: "Order Detail — House of Padmavati",
    description: "View your order details.",
    noIndex: true,
  });

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["customer-order-detail", id],
    queryFn: () => fetchCustomerOrderDetail(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <Package className="w-10 h-10 mx-auto mb-3 text-ink-soft/40" />
        <p className="text-sm text-ink-soft">Order not found</p>
        <Button variant="outline" size="sm" className="mt-4" asChild>
          <Link to="/account/orders">Back to orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Link
        to="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to orders
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-serif text-xl text-ink">#{order.orderNumber}</h2>
          <p className="text-xs text-ink-soft">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`text-xs px-3 py-1 rounded-full capitalize ${
            order.status === "delivered"
              ? "text-green-600 bg-green-50"
              : order.status === "cancelled"
              ? "text-red-600 bg-red-50"
              : "text-teal-deep bg-teal-deep/10"
          }`}
        >
          {statusLabel[order.status] || order.status}
        </span>
      </div>

      {order.shippingAddress && (
        <section className="mb-6 p-4 rounded-lg border border-border">
          <h3 className="text-sm font-medium text-ink mb-2">Shipping address</h3>
          <p className="text-sm text-ink-soft">{order.shippingAddress.recipientName}</p>
          <p className="text-sm text-ink-soft">{order.shippingAddress.address}</p>
          <p className="text-sm text-ink-soft">
            {order.shippingAddress.city}, {order.shippingAddress.state} &ndash;{" "}
            {order.shippingAddress.postalCode}
          </p>
          {order.shippingAddress.phone && (
            <p className="text-sm text-ink-soft">Phone: {order.shippingAddress.phone}</p>
          )}
        </section>
      )}

      <section className="mb-6">
        <h3 className="text-sm font-medium text-ink mb-3">Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-4 p-3 rounded-lg border border-border"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-16 h-16 rounded-md object-cover bg-ink/5"
                />
              ) : (
                <div className="w-16 h-16 rounded-md bg-ink/5 flex items-center justify-center">
                  <Package className="w-6 h-6 text-ink-soft/40" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{item.productName}</p>
                <p className="text-xs text-ink-soft">
                  Qty: {item.quantity} &times; {formatPrice(item.productPrice)}
                </p>
              </div>
              <p className="text-sm font-medium text-ink">
                {formatPrice(item.productPrice * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="p-4 rounded-lg border border-border">
        <h3 className="text-sm font-medium text-ink mb-3">Order summary</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>Shipping</span>
            <span>{order.shippingCost > 0 ? formatPrice(order.shippingCost) : "Free"}</span>
          </div>
          <div className="flex justify-between font-medium text-ink pt-2 border-t border-border">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </section>
    </div>
  );
}
