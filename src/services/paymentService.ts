import { supabase } from "@/integrations/supabase/client";
import { FunctionsHttpError } from "@supabase/supabase-js";

export interface CreateRazorpayOrderResponse {
  order_id: string;
  order_number: string;
  razorpay_order_id: string;
  razorpay_key_id: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  order_id?: string;
  payment_id?: string;
  already_processed?: boolean;
  error?: string;
}

export interface PaymentStatusResponse {
  status: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  amount?: number;
}

export interface CreateOrderPaymentInput {
  order_id?: string;
  receipt?: string;
  customer_email?: string;
  customer_full_name?: string;
  customer_phone?: string;
  shipping_recipient_name?: string;
  shipping_phone?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_postal_code?: string;
  shipping_country?: string;
  shipping_landmark?: string;
  shipping_option?: string;
  notes?: string;
  items?: { product_id: string; quantity: number }[];
}

export async function createRazorpayOrder(
  input: CreateOrderPaymentInput,
): Promise<CreateRazorpayOrderResponse> {
  const { data, error } = await supabase.functions.invoke("create-razorpay-order", {
    body: JSON.stringify(input),
  });

  if (error) {
    if (error instanceof FunctionsHttpError) {
      const body = await error.context.json();
      const parsed = typeof body === "string" ? JSON.parse(body) : body;
      const code = parsed?.code || parsed?.error || "payment_creation_failed";
      throw new Error(JSON.stringify({ error: code, ...parsed }));
    }
    throw new Error(error.message ?? "Failed to create payment order");
  }

  return data as CreateRazorpayOrderResponse;
}

export async function verifyPayment(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string,
): Promise<VerifyPaymentResponse> {
  const { data, error } = await supabase.functions.invoke("verify-payment", {
    body: JSON.stringify({
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    }),
  });

  if (error) {
    throw new Error(error.message ?? "Payment verification failed");
  }

  return data as VerifyPaymentResponse;
}

export async function getPaymentStatus(
  orderId: string
): Promise<PaymentStatusResponse> {
  const { data, error } = await supabase
    .from("payments")
    .select("status, razorpay_order_id, razorpay_payment_id, amount")
    .eq("order_id", orderId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return { status: "not_found" };

  return {
    status: data.status,
    razorpayOrderId: data.razorpay_order_id ?? undefined,
    razorpayPaymentId: data.razorpay_payment_id ?? undefined,
    amount: data.amount,
  };
}

export async function cancelPayment(orderId: string): Promise<void> {
  await supabase.functions.invoke("cancel-payment", {
    body: JSON.stringify({ order_id: orderId }),
  });
}
