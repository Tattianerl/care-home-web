import type { LucideIcon } from "lucide-react";
import type { Role } from "../permissions/roles";

export interface MenuItem{
    title: string;
    path: string;
    icon: LucideIcon;
    roles: Role[];
    group: "Principal" | "Atendimento" | "Administração";
}