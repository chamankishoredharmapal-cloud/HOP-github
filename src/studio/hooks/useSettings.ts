import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchSettings, saveSettings } from "../services/settingsService";
import type { StoreSettings } from "../types/settings";

export function useSettings() {
  return useQuery({
    queryKey: ["studio", "settings"],
    queryFn: fetchSettings,
  });
}

export function useSaveSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (settings: StoreSettings) => saveSettings(settings),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["studio", "settings"] });
      toast.success("Settings saved");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Failed to save settings");
    },
  });
}
