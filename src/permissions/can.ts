import type { Permission } from "./permissions";
import { rolePermissions } from "./permissions";

import type { UserRole } from "../types/enums";

export function can(
  role: UserRole,
  permission: Permission
) {
  return rolePermissions[role]?.includes(permission) ?? false;
}