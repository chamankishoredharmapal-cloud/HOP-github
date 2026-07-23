import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  fetchCustomers,
  fetchCustomer,
  updateCustomer,
  deleteCustomer,
} from "../services/customerService";
import type { CustomerListParams } from "../types/customer";

export function useCustomers(params: CustomerListParams) {
  return useQuery({
    queryKey: ["studio", "customers", params],
    queryFn: () => fetchCustomers(params),
  });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ["studio", "customer", id],
    queryFn: () => fetchCustomer(id!),
    enabled: !!id,
  });
}

export function useUpdateCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...updates
    }: { id: string; full_name?: string; email?: string; phone?: string | null }) =>
      updateCustomer(id, updates),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: ["studio", "customers"] });
      qc.invalidateQueries({ queryKey: ["studio", "customer", vars.id] });
      toast.success("Customer updated");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to update customer");
    },
  });
}

export function useDeleteCustomer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteCustomer(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "customers"] });
      toast.success("Customer deleted");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to delete customer");
    },
  });
}
