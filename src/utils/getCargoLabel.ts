import { cargos } from "../constants/cargos";
import type { UserRole } from "../types";

export function getCargoLabel(role: UserRole): string {
  return cargos.find((cargo) => cargo.value === role)?.label ?? role;
}
