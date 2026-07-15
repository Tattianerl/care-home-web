import {
  LayoutDashboard,
  Users,
  CalendarDays,
  User,
  UserCog,
  FileBarChart,
  ClipboardCheck,
} from "lucide-react";

import { Roles } from "../../permissions/roles";
import type { MenuItem } from "../../types/menu";

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    group: "Principal",
    roles: [
      Roles.ADMIN,
      Roles.ENFERMEIRO,
      Roles.TECNICO_ENFERMAGEM,
      Roles.MEDICO,
      Roles.FISIOTERAPEUTA,
      Roles.NUTRICIONISTA,
      Roles.ASSISTENTE_SOCIAL,
      Roles.RECEPCAO,
    ],
  },
  {
    title: "Pacientes",
    path: "/patients",
    icon: Users,
    group: "Atendimento",
    roles: [
      Roles.ADMIN,
      Roles.ENFERMEIRO,
      Roles.TECNICO_ENFERMAGEM,
      Roles.MEDICO,
      Roles.FISIOTERAPEUTA,
      Roles.NUTRICIONISTA,
      Roles.ASSISTENTE_SOCIAL,
  ],
  },
  {
    title: "Agendamentos",
    path: "/appointments",
    icon: CalendarDays,
    group:"Atendimento",
    roles: [
      Roles.ADMIN,
      Roles.ENFERMEIRO,
      Roles.TECNICO_ENFERMAGEM,
      Roles.MEDICO,
      Roles.FISIOTERAPEUTA,
      Roles.NUTRICIONISTA,
      Roles.ASSISTENTE_SOCIAL,
      Roles.RECEPCAO,
    ],
  },
  {
    title: "Meu Perfil",
    path: "/perfil",
    icon: User,
    group: "Principal",
    roles: [
      Roles.ADMIN,
      Roles.ENFERMEIRO,
      Roles.TECNICO_ENFERMAGEM,
      Roles.MEDICO,
      Roles.FISIOTERAPEUTA,
      Roles.NUTRICIONISTA,
      Roles.ASSISTENTE_SOCIAL,
     
    ],
  },
  {
    title: "Funcionários",
    path: "/funcionarios",
    icon: UserCog,
    group: "Administração",
    roles: [Roles.ADMIN],
  },
  {
    title: "Relatórios",
    path: "/relatorios",
    icon: FileBarChart,
    group: "Administração",
    roles: [Roles.ADMIN],
  },
  {
    title: "Auditoria",
    path: "/audit",
    icon: ClipboardCheck,
    group: "Administração",
    roles: [Roles.ADMIN],
  },
];

