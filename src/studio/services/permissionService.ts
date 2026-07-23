import type { StudioRole, Permission } from "../types/permissions";
import { hasPermission } from "../types/permissions";

export function getUserRole(): StudioRole | null {
  const stored = localStorage.getItem("hop_studio_role");
  if (!stored) return null;
  if (["owner", "admin", "manager", "editor", "viewer"].includes(stored)) {
    return stored as StudioRole;
  }
  return null;
}

export function setUserRole(role: StudioRole | null): void {
  if (role) {
    localStorage.setItem("hop_studio_role", role);
  } else {
    localStorage.removeItem("hop_studio_role");
  }
}

export function can(permission: Permission): boolean {
  const role = getUserRole();
  return hasPermission(role, permission);
}

export function syncRoleFromMetadata(metadata: Record<string, unknown>): StudioRole | null {
  const role = metadata.role as string | undefined;
  const roles = metadata.roles as string[] | undefined;

  if (role && ["owner", "admin", "manager", "editor", "viewer"].includes(role)) {
    setUserRole(role as StudioRole);
    return role as StudioRole;
  }
  if (Array.isArray(roles)) {
    const found = roles.find((r) =>
      ["owner", "admin", "manager", "editor", "viewer"].includes(r)
    );
    if (found) {
      setUserRole(found as StudioRole);
      return found as StudioRole;
    }
  }
  return null;
}
