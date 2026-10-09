import { useQuery } from "@tanstack/react-query";
import { fetchPublicStoreSettings, DEFAULT_PUBLIC_SETTINGS, type PublicStoreSettings } from "@/services/settingsService";

export function usePublicSettings() {
  return useQuery<PublicStoreSettings>({
    queryKey: ["public_store_settings"],
    queryFn: fetchPublicStoreSettings,
    placeholderData: DEFAULT_PUBLIC_SETTINGS,
    staleTime: 1000 * 60, // 1 minute
  });
}
