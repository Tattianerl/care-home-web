import type { LucideIcon } from "lucide-react";
import type { UserRole } from "../types/enums";

export interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  roles: UserRole[];
  group: "Principal" | "Atendimento" | "Administração";
}