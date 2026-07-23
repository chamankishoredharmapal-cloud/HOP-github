import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchOrdersMetrics,
  fetchOrders,
  fetchOrder,
  updateOrderStatus,
  updateShipping,
  fetchOrdersSearch,
} from "../services/orderService";
import type { OrderStatus, OrderWithCustomer } from "../types/order";

export function useOrdersMetrics() {
  return useQuery({
    queryKey: ["studio", "orders", "metrics"],
    queryFn: fetchOrdersMetrics,
  });
}

export function useOrdersList(statusFilter?: OrderStatus | "all", enabled?: boolean) {
  return useQuery({
    queryKey: ["studio", "orders", { status: statusFilter ?? "all" }],
    queryFn: async () => {
      const orders = await fetchOrders();
      if (statusFilter && statusFilter !== "all") {
        return orders.filter((o) => o.status === statusFilter);
      }
      return orders;
    },
    enabled: enabled ?? true,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ["studio", "order", id],
    queryFn: () => fetchOrder(id!),
    enabled: !!id,
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      additional,
    }: {
      id: string;
      status: OrderStatus;
      additional?: Record<string, string | null>;
    }) => updateOrderStatus(id, status, additional),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["studio", "orders"] });
      qc.invalidateQueries({ queryKey: ["studio", "order", vars.id] });
      qc.invalidateQueries({ queryKey: ["studio", "orders", "metrics"] });
      toast.success(`Order status updated`);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update order");
    },
  });
}

export function useUpdateShipping() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      courier_name,
      tracking_number,
    }: {
      id: string;
      courier_name?: string;
      tracking_number?: string | null;
    }) => updateShipping(id, { courier_name, tracking_number }),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["studio", "order", vars.id] });
      qc.invalidateQueries({ queryKey: ["studio", "orders"] });
      toast.success("Shipping info updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update shipping");
    },
  });
}

export function useOrdersSearch(query: string) {
  return useQuery({
    queryKey: ["studio", "orders", "search", query],
    queryFn: () => fetchOrdersSearch(query),
    enabled: query.length > 0,
  });
}
