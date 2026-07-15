import {
  rolePermissions,
  type Permission,
} from "./permissions";

import type { Role } from "./roles";


export function can(
  role: Role,
  permission: Permission
) {

  return rolePermissions[role]
    .includes(permission);

}