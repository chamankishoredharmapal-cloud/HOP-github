import { useParams, Link } from "react-router-dom";
import { Check, Clock, AlertCircle, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { useMetadata } from "@/hooks/useMetadata";
import { fetchOrderConfirmation } from "@/services/orderService";

function formatPrice(paise: number): string {
  return `₹ ${(paise / 100).toLocaleString("en-IN")}`;
}

function PaymentStatusBadge({ status }: { status: string }) {
  if (status === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-teal-deep font-medium">
        <Check className="h-3.5 w-3.5" /> Paid
      </span>
    );
  }
  if (status === "pending" || status === "pending_payment") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
        <Clock className="h-3.5 w-3.5" /> Payment pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-ink-soft font-medium">
      <AlertCircle className="h-3.5 w-3.5" /> {status}
    </span>
  );
}

export default function OrderConfirmation() {
  const { orderNumber } = useParams<{ orderNumber: string }>();

  const { data: detail, isLoading } = useQuery({
    queryKey: ["order-confirmation", orderNumber],
    queryFn: async () => {
      return await fetchOrderConfirmation(orderNumber!);
    },
    enabled: !!orderNumber,
    retry: false,
  });

  useMetadata({
    title: detail ? `Order ${detail.orderNumber} — House of Padmavati` : "Order Confirmation — House of Padmavati",
    description: detail
      ? `Thank you for your order ${detail.orderNumber}.`
      : "Your order confirmation from House of Padmavati.",
  });

  return (
    <PageLayout>
      <main className="container pt-28 pb-24">
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <div className="mx-auto w-16 h-16 rounded-full bg-teal-deep/10 flex items-center justify-center mb-6">
              {detail?.paymentStatus === "paid" || !detail ? (
                <Check className="h-8 w-8 text-teal-deep" />
              ) : (
                <Clock className="h-8 w-8 text-amber-600" />
              )}
            </div>
            <h1 className="font-serif text-3xl md:text-4xl text-ink mb-2">
              {detail?.paymentStatus === "paid" ? "Order confirmed" : "Order placed"}
            </h1>
            {orderNumber && (
              <p className="text-sm text-ink-soft font-light">
                Order <span className="font-medium text-ink">{orderNumber}</span>
              </p>
            )}
            <p className="text-ink-soft font-light mt-3">
              {detail?.paymentStatus === "paid"
                ? "Thank you for your order. A confirmation will be sent to your email."
                : detail?.paymentStatus === "pending" || detail?.paymentStatus === "pending_payment"
                ? "Your order has been placed. We are awaiting payment confirmation."
                : "Thank you for your order."}
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="w-5 h-5 border-2 border-teal-deep/30 border-t-teal-deep rounded-full animate-spin" />
            </div>
          )}

          {detail && (
            <div className="space-y-10 mt-8">
              <div className="border border-border/60 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium">Payment</h2>
                  <PaymentStatusBadge status={detail.paymentStatus} />
                </div>
                <p className="text-xs text-ink-soft/70 font-light">
                  Total charged: <span className="text-ink font-medium">{formatPrice(detail.total)}</span>
                </p>
              </div>

              {detail.items.length > 0 && (
                <div className="border border-border/60 p-6">
                  <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-5">Items</h2>
                  <div className="space-y-4">
                    {detail.items.map((item, i) => (
                      <div key={i} className="flex gap-4">
                        <div className="w-14 h-16 shrink-0 bg-jasmine-deep rounded overflow-hidden">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-ink-soft/30" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-ink">{item.productName}</p>
                          <p className="text-xs text-ink-soft mt-0.5">Qty {item.quantity}</p>
                          {item.estimatedDeliveryDays && (
                            <p className="text-xs text-ink-soft/60 mt-0.5">
                              Est. dispatch: {item.estimatedDeliveryDays} business days
                            </p>
                          )}
                        </div>
                        <p className="text-sm text-ink font-light">{formatPrice(item.price)}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/60 space-y-1 text-sm text-ink-soft font-light">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="text-ink">{formatPrice(detail.subtotal)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-ink">{formatPrice(detail.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between font-medium text-ink border-t border-border/60 pt-2 mt-2">
                      <span>Total</span>
                      <span>{formatPrice(detail.total)}</span>
                    </div>
                  </div>
                </div>
              )}

              {detail.shipping && (
                <div className="border border-border/60 p-6">
                  <h2 className="text-sm tracking-[0.2em] uppercase text-ink font-medium mb-3">Shipping to</h2>
                  <p className="text-sm text-ink-soft font-light leading-relaxed">
                    {detail.shipping.city}
                    {detail.shipping.state ? `, ${detail.shipping.state}` : ""}
                    {" "}{detail.shipping.postalCode}
                  </p>
                </div>
              )}
            </div>
          )}

          {detail === null && !isLoading && (
            <p className="text-center text-sm text-ink-soft font-light pt-8">
              We were unable to load your order details. A confirmation email will be sent to you.
            </p>
          )}

          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/collections">Continue browsing</Link>
            </Button>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}
