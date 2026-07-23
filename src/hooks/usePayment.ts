import { useState, useCallback } from "react";
import { loadRazorpayScript, openRazorpayCheckout } from "@/lib/razorpay";
import { createRazorpayOrder, verifyPayment } from "@/services/paymentService";
import type { CreateOrderPaymentInput } from "@/services/paymentService";
import type { RazorpayPaymentResponse } from "@/lib/razorpay";

export type PaymentState =
  | { status: "idle" }
  | { status: "creating_order" }
  | { status: "checkout_open" }
  | { status: "verifying" }
  | { status: "paid"; orderId: string }
  | { status: "failed"; error: string; phase: "creation" | "checkout" | "verification" };

export function usePayment() {
  const [state, setState] = useState<PaymentState>({ status: "idle" });

  const startPayment = useCallback(
    async (
      orderCreateInput: CreateOrderPaymentInput,
      amountPaise?: number,
      customerEmail?: string,
      customerPhone?: string,
      customerName?: string,
    ) => {
      setState({ status: "creating_order" });

      try {
        await loadRazorpayScript();

        const { order_id, order_number, razorpay_order_id, razorpay_key_id } =
          await createRazorpayOrder(orderCreateInput);

        setState({ status: "checkout_open" });

        openRazorpayCheckout({
          key: razorpay_key_id,
          amount: amountPaise ?? 0,
          currency: "INR",
          name: "House of Padmavati",
          description: `Order ${order_number}`,
          order_id: razorpay_order_id,
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: { color: "#3D5A5A" },
          handler: async (response: RazorpayPaymentResponse) => {
            setState({ status: "verifying" });

            try {
              const result = await verifyPayment(
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature,
              );

              if (result.success) {
                setState({ status: "paid", orderId: result.order_id ?? order_id });
              } else {
                setState({ status: "failed", error: result.error ?? "Payment verification failed", phase: "verification" });
              }
            } catch (err) {
              setState({ status: "failed", error: "Payment verification failed. Please contact support.", phase: "verification" });
            }
          },
          modal: {
            ondismiss: () => {
              setState({ status: "failed", error: "Payment cancelled", phase: "checkout" });
            },
          },
        });
      } catch (err) {
        setState({
          status: "failed",
          error: err instanceof Error ? err.message : "We couldn't reach our payment partner. Please try again.",
          phase: "creation",
        });
      }
    },
    [],
  );

  const reset = useCallback(() => {
    setState({ status: "idle" });
  }, []);

  return { state, startPayment, reset };
}
