import { useQuery } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { syncRoleFromMetadata, can, getUserRole } from "../services/permissionService";
import type { Permission, StudioRole } from "../types/permissions";

export function useStudioRole(): { role: StudioRole | null; isLoading: boolean } {
  const { data, isLoading } = useQuery({
    queryKey: ["studio", "role"],
    queryFn: async () => {
      const user = await authService.getUser();
      if (!user) return null;
      return syncRoleFromMetadata(user.app_metadata as Record<string, unknown>);
    },
  });

  return { role: data ?? getUserRole(), isLoading };
}

export function useCan(permission: Permission): boolean {
  return can(permission);
}

export function useHasPermission(permission: Permission): {
  allowed: boolean;
  isLoading: boolean;
} {
  const { role, isLoading } = useStudioRole();
  return { allowed: !!role && can(permission), isLoading };
}
