export type OrderStatus = "pending_payment" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "partially_refunded";

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  shipping_address_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface OrderWithCustomer extends Order {
  customer: {
    id: string;
    full_name: string;
    email: string;
    phone: string | null;
  } | null;
}

export interface OrderWithRelations extends OrderWithCustomer {
  shipping_address: ShippingAddress | null;
  items: OrderItem[];
  payments: Payment[];
}

export interface ShippingAddress {
  id: string;
  customer_id: string;
  recipient_name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  landmark: string | null;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  image_url: string | null;
  created_at: string;
}

export interface Payment {
  id: string;
  order_id: string;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  amount: number;
  currency: string;
  status: string;
  created_at: string;
}

export interface OrdersMetrics {
  ordersToday: number;
  revenueToday: number;
  pendingCount: number;
  averageOrderValue: number;
}
