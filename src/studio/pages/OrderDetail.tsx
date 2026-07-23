import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Edit3, Save, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  useOrder,
  useUpdateOrderStatus,
  useUpdateShipping,
} from "../hooks/useOrders";
import type { OrderStatus } from "../types/order";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  pending_payment: "Pending Payment",
  confirmed: "Confirmed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const paymentStatusStyles: Record<string, string> = {
  pending: "bg-sakura/20 text-ink",
  paid: "bg-teal-deep/10 text-teal-deep",
  failed: "bg-muted text-destructive",
  refunded: "bg-muted text-muted-foreground",
  partially_refunded: "bg-sand/30 text-ink",
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
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

const statusFlow: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  returned: [],
};

const flowLabels: Record<string, string> = {
  confirmed: "Confirm Order",
  processing: "Mark Packed",
  shipped: "Mark Shipped",
  delivered: "Mark Delivered",
  cancelled: "Cancel Order",
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading, error } = useOrder(id);
  const updateStatus = useUpdateOrderStatus();
  const updateShipping = useUpdateShipping();

  const [confirmAction, setConfirmAction] = useState<OrderStatus | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const [editShipping, setEditShipping] = useState(false);
  const [courierName, setCourierName] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const handleStatusAction = () => {
    if (!confirmAction || !id) return;
    const additional: Record<string, string | null> = {};
    if (confirmAction === "cancelled" && cancelReason) {
      additional.cancelled_reason = cancelReason;
    }
    if (confirmAction === "shipped" && courierName) {
      additional.courier_name = courierName;
    }
    if (confirmAction === "shipped" && trackingNumber) {
      additional.tracking_number = trackingNumber;
    }
    updateStatus.mutate(
      { id, status: confirmAction, additional },
      { onSuccess: () => setConfirmAction(null) }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 w-48 rounded bg-muted" />
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            <div className="h-48 rounded-lg bg-muted" />
            <div className="h-64 rounded-lg bg-muted" />
          </div>
          <div className="space-y-6">
            <div className="h-48 rounded-lg bg-muted" />
            <div className="h-48 rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-destructive">Failed to load order.</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <p className="text-sm text-muted-foreground">Order not found.</p>
      </div>
    );
  }

  const address = order.shipping_address;
  const availableActions = statusFlow[order.status] ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/studio/orders")}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="font-serif text-xl font-light text-foreground tracking-tight">
            {order.order_number}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Created {formatDate(order.created_at)}
          </p>
        </div>
        <span
          className={`ml-auto inline-block px-3 py-1 rounded-full text-xs font-medium ${
            statusStyles[order.status] || "bg-muted text-muted-foreground"
          }`}
        >
          {statusLabels[order.status] || order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-base font-light text-foreground">
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {order.customer ? (
                <>
                  <p className="text-foreground font-medium">{order.customer.full_name}</p>
                  <p className="text-muted-foreground">{order.customer.email}</p>
                  {order.customer.phone && (
                    <p className="text-muted-foreground">{order.customer.phone}</p>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground">No customer information.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-base font-light text-foreground">
                Ordered Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              {order.items.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">No items in this order.</p>
              ) : (
                <div className="divide-y divide-border/30">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.product_name}
                          className="h-16 w-16 rounded-md object-cover bg-jasmine-deep"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-md bg-jasmine-deep flex items-center justify-center">
                          <Package className="h-6 w-6 text-muted-foreground/40" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground font-medium truncate">
                          {item.product_name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {formatCurrency(item.product_price)} × {item.quantity}
                        </p>
                      </div>
                      <p className="text-sm text-foreground font-medium whitespace-nowrap">
                        {formatCurrency(item.product_price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border/50 mt-4 pt-4 space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-foreground">
                    {order.shipping_cost > 0 ? formatCurrency(order.shipping_cost) : "Free"}
                  </span>
                </div>
                <div className="flex justify-between text-base font-medium pt-1.5 border-t border-border/30">
                  <span className="text-foreground">Total</span>
                  <span className="text-foreground">{formatCurrency(order.total)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {order.notes && (
            <Card className="border border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-base font-light text-foreground">
                  Order Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-ink-soft whitespace-pre-wrap">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-base font-light text-foreground">
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              {address ? (
                <div className="text-sm space-y-1">
                  <p className="text-foreground font-medium">{address.recipient_name}</p>
                  {address.phone && <p className="text-muted-foreground">{address.phone}</p>}
                  <p className="text-muted-foreground">{address.address}</p>
                  <p className="text-muted-foreground">
                    {address.city}, {address.state} — {address.postal_code}
                  </p>
                  <p className="text-muted-foreground">{address.country}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No shipping address on file.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <CardTitle className="font-serif text-base font-light text-foreground">
                Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    paymentStatusStyles[order.payment_status] || "bg-muted text-muted-foreground"
                  }`}
                >
                  {order.payment_status.replace(/_/g, " ")}
                </span>
              </div>
              {order.payments.length > 0 ? (
                <div className="divide-y divide-border/30">
                  {order.payments.map((p) => (
                    <div key={p.id} className="py-2 first:pt-0 last:pb-0 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="text-foreground">
                          {formatCurrency(p.amount)}
                        </span>
                      </div>
                      {p.razorpay_payment_id && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Payment ID</span>
                          <span className="text-foreground text-xs font-mono">
                            {p.razorpay_payment_id}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status</span>
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            paymentStatusStyles[p.status] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No payment records.</p>
              )}
            </CardContent>
          </Card>

          <Card className="border border-border/50 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-serif text-base font-light text-foreground">
                  Shipping Info
                </CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => {
                    setEditShipping(!editShipping);
                    if (!editShipping) {
                      setCourierName("");
                      setTrackingNumber("");
                    }
                  }}
                >
                  {editShipping ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editShipping ? (
                <>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Courier</label>
                    <Input
                      value={courierName}
                      onChange={(e) => setCourierName(e.target.value)}
                      placeholder="e.g. Delhivery, Blue Dart"
                      className="text-sm bg-jasmine-deep/50 border-border/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Tracking Number</label>
                    <Input
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="Tracking ID"
                      className="text-sm bg-jasmine-deep/50 border-border/50"
                    />
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!id) return;
                      updateShipping.mutate(
                        { id, courier_name: courierName || undefined, tracking_number: trackingNumber || null },
                        { onSuccess: () => setEditShipping(false) }
                      );
                    }}
                    className="bg-teal-deep text-jasmine hover:bg-teal w-full"
                  >
                    Save Shipping Info
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No shipping information recorded. Click the edit button to add courier and tracking details.
                </p>
              )}
            </CardContent>
          </Card>

          {availableActions.length > 0 && (
            <Card className="border border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="font-serif text-base font-light text-foreground">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {availableActions.map((action) => (
                  <Button
                    key={action}
                    onClick={() => {
                      if (action === "cancelled") {
                        setConfirmAction(action);
                      } else {
                        setConfirmAction(action);
                      }
                    }}
                    className={`w-full gap-2 ${
                      action === "cancelled"
                        ? "bg-destructive/10 text-destructive hover:bg-destructive/20 border border-destructive/30"
                        : "bg-teal-deep text-jasmine hover:bg-teal"
                    }`}
                    size="sm"
                    disabled={updateStatus.isPending}
                  >
                    {action === "cancelled" ? (
                      <XCircle className="h-4 w-4" />
                    ) : action === "delivered" || action === "shipped" ? (
                      <Truck className="h-4 w-4" />
                    ) : action === "confirmed" ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Package className="h-4 w-4" />
                    )}
                    {flowLabels[action] || action}
                  </Button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AlertDialog open={confirmAction !== null} onOpenChange={(open) => !open && setConfirmAction(null)}>
        <AlertDialogContent className="bg-card border border-border/50">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-serif text-lg font-light text-foreground">
              {confirmAction === "cancelled" ? "Cancel Order" : flowLabels[confirmAction ?? ""] || "Update Status"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-muted-foreground">
              {confirmAction === "cancelled"
                ? "This will cancel the order. The customer will be notified."
                : confirmAction === "shipped"
                  ? "Mark this order as shipped. Add shipping details below."
                  : `Mark this order as "${statusLabels[confirmAction ?? ""] || confirmAction}".`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {confirmAction === "cancelled" && (
            <div className="py-2">
              <label className="text-xs text-muted-foreground block mb-1">Reason for cancellation (optional)</label>
              <Textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Customer request, out of stock, etc."
                className="text-sm bg-jasmine-deep/50 border-border/50 min-h-[80px]"
              />
            </div>
          )}

          {confirmAction === "shipped" && (
            <div className="space-y-3 py-2">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Courier (optional)</label>
                <Input
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. Delhivery, Blue Dart"
                  className="text-sm bg-jasmine-deep/50 border-border/50"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Tracking Number (optional)</label>
                <Input
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Tracking ID"
                  className="text-sm bg-jasmine-deep/50 border-border/50"
                />
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50 text-muted-foreground">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleStatusAction}
              className={`${
                confirmAction === "cancelled"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-teal-deep text-jasmine hover:bg-teal"
              }`}
            >
              {confirmAction === "cancelled" ? "Cancel Order" : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
