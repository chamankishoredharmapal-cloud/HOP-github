export type StudioRole = "owner" | "admin" | "manager" | "editor" | "viewer";

export type Permission =
  | "dashboard.view"
  | "orders.view"
  | "orders.create"
  | "orders.update_status"
  | "orders.delete"
  | "products.view"
  | "products.create"
  | "products.update"
  | "products.delete"
  | "products.publish"
  | "collections.view"
  | "collections.create"
  | "collections.update"
  | "collections.delete"
  | "collections.publish"
  | "inventory.view"
  | "inventory.adjust"
  | "customers.view"
  | "customers.update"
  | "customers.delete"
  | "media.view"
  | "media.upload"
  | "media.delete"
  | "journal.view"
  | "journal.create"
  | "journal.update"
  | "journal.delete"
  | "settings.view"
  | "settings.update"
  | "users.manage";

export const ROLE_PERMISSIONS: Record<StudioRole, Permission[]> = {
  owner: [
    "dashboard.view", "orders.view", "orders.create", "orders.update_status", "orders.delete",
    "products.view", "products.create", "products.update", "products.delete", "products.publish",
    "collections.view", "collections.create", "collections.update", "collections.delete", "collections.publish",
    "inventory.view", "inventory.adjust",
    "customers.view", "customers.update", "customers.delete",
    "media.view", "media.upload", "media.delete",
    "journal.view", "journal.create", "journal.update", "journal.delete",
    "settings.view", "settings.update", "users.manage",
  ],
  admin: [
    "dashboard.view", "orders.view", "orders.create", "orders.update_status", "orders.delete",
    "products.view", "products.create", "products.update", "products.delete", "products.publish",
    "collections.view", "collections.create", "collections.update", "collections.delete", "collections.publish",
    "inventory.view", "inventory.adjust",
    "customers.view", "customers.update", "customers.delete",
    "media.view", "media.upload", "media.delete",
    "journal.view", "journal.create", "journal.update", "journal.delete",
    "settings.view", "settings.update",
  ],
  manager: [
    "dashboard.view", "orders.view", "orders.create", "orders.update_status",
    "products.view", "products.create", "products.update", "products.publish",
    "collections.view", "collections.create", "collections.update", "collections.publish",
    "inventory.view", "inventory.adjust",
    "customers.view", "customers.update",
    "media.view", "media.upload",
    "journal.view", "journal.create", "journal.update",
  ],
  editor: [
    "dashboard.view", "orders.view",
    "products.view", "products.create", "products.update",
    "collections.view", "collections.create", "collections.update",
    "inventory.view",
    "customers.view",
    "media.view", "media.upload",
    "journal.view", "journal.create", "journal.update",
  ],
  viewer: [
    "dashboard.view", "orders.view",
    "products.view",
    "collections.view",
    "inventory.view",
    "customers.view",
    "media.view",
    "journal.view",
  ],
};

export function hasPermission(userRole: StudioRole | null, permission: Permission): boolean {
  if (!userRole) return false;
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}
