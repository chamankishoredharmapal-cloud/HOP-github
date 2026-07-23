export interface DashboardMetrics {
  revenueToday: number;
  ordersToday: number;
  pendingPayments: number;
  customerCount: number;
}

export interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
}

export interface RecentCustomer {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
}
