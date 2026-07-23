import { useQuery } from "@tanstack/react-query";
import {
  fetchRevenueToday,
  fetchOrdersToday,
  fetchPendingPayments,
  fetchCustomerCount,
  fetchRecentOrders,
  fetchRecentCustomers,
} from "../services/dashboardService";

export function useRevenueToday() {
  return useQuery({
    queryKey: ["dashboard", "revenueToday"],
    queryFn: fetchRevenueToday,
  });
}

export function useOrdersToday() {
  return useQuery({
    queryKey: ["dashboard", "ordersToday"],
    queryFn: fetchOrdersToday,
  });
}

export function usePendingPayments() {
  return useQuery({
    queryKey: ["dashboard", "pendingPayments"],
    queryFn: fetchPendingPayments,
  });
}

export function useCustomerCount() {
  return useQuery({
    queryKey: ["dashboard", "customerCount"],
    queryFn: fetchCustomerCount,
  });
}

export function useRecentOrders() {
  return useQuery({
    queryKey: ["dashboard", "recentOrders"],
    queryFn: fetchRecentOrders,
  });
}

export function useRecentCustomers() {
  return useQuery({
    queryKey: ["dashboard", "recentCustomers"],
    queryFn: fetchRecentCustomers,
  });
}
