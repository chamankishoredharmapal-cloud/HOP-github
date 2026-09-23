export type OrderStatus = "pending_payment" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned";

export type PaymentStatus = 
  | "pending"              // payment initiated, not yet verified
  | "deposit_pending"      // ₹200 deposit not yet verified via Razorpay
  | "deposit_paid"         // ₹200 deposit successfully verified, order confirmed
  | "partially_paid"       // Deposit paid, balance pending delivery
  | "fully_paid"           // Full amount (deposit + balance) paid
  | "paid"                 // Alias for fully_paid (existing behavior)
  | "failed"               // Payment failed
  | "refunded"             // Order refunded
  | "cancelled";           // Order cancelled;

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  shipping_address_id: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  shipping_cost: number;
  total: number;           // Display total in rupees (for UI)
  total_amount: number;    // Full order total in paise (internal)
  paid_amount: number;     // Amount paid so far in paise (internal)
  remaining_amount: number; // remaining_amount in paise (internal)
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
