export type CustomerStatus = "active" | "vip" | "blocked";

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  status: CustomerStatus;
  notes: string | null;
  created_at: string;
}

export interface CustomerDetail extends Customer {
  order_count: number;
  total_spent: number;
  average_order_value: number;
  recent_orders: CustomerOrder[];
  addresses: CustomerAddress[];
}

export interface CustomerOrder {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  created_at: string;
}

export interface CustomerAddress {
  id: string;
  recipient_name: string;
  phone: string | null;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface CustomerListParams {
  search?: string;
  status?: CustomerStatus | "all";
  page?: number;
  perPage?: number;
  sortBy?: "name" | "email" | "created_at" | "total_spent";
  sortDir?: "asc" | "desc";
}

export interface CustomerListResponse {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
}
