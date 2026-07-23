import { useHasPermission } from "../hooks/usePermissions";
import type { Permission } from "../types/permissions";

interface PermissionGuardProps {
  permission: Permission;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export function PermissionGuard({ permission, fallback, children }: PermissionGuardProps) {
  const { allowed, isLoading } = useHasPermission(permission);

  if (isLoading) return null;

  if (!allowed) {
    return fallback ? (
      <>{fallback}</>
    ) : null;
  }

  return <>{children}</>;
}
