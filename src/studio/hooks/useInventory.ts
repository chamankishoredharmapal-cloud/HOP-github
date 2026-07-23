import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchInventoryMetrics,
  fetchInventoryList,
  adjustStock,
  fetchInventoryHistory,
} from "../services/inventoryService";
import type {
  InventoryItem,
  InventoryMetrics,
  StockAdjustmentInput,
  InventoryHistoryEntry,
  StockStatus,
} from "../types/inventory";

export function useInventoryMetrics() {
  return useQuery<InventoryMetrics>({
    queryKey: ["studio", "inventory", "metrics"],
    queryFn: fetchInventoryMetrics,
  });
}

export function useInventoryList(
  search?: string,
  statusFilter?: StockStatus | "all",
  sortBy?: "name" | "stock" | "sku",
  sortDir?: "asc" | "desc",
) {
  return useQuery<InventoryItem[]>({
    queryKey: ["studio", "inventory", "list", search, statusFilter, sortBy, sortDir],
    queryFn: () => fetchInventoryList(search, statusFilter, sortBy, sortDir),
  });
}

export function useAdjustStock() {
  const qc = useQueryClient();
  return useMutation<void, Error, StockAdjustmentInput>({
    mutationFn: adjustStock,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "inventory"] });
      toast.success("Stock adjusted successfully");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to adjust stock");
    },
  });
}

export function useInventoryHistory(productId: string | null) {
  return useQuery<InventoryHistoryEntry[]>({
    queryKey: ["studio", "inventory", "history", productId],
    queryFn: () => fetchInventoryHistory(productId!),
    enabled: !!productId,
  });
}
