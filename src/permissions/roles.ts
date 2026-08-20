import { UserRole } from "../types/enums";

export const Roles = UserRole;

export type Role = UserRole;

export const AdminRoles = [
  Roles.ADMIN,
] as const;

export const ClinicalRoles = [
  Roles.ADMIN,
  Roles.COORDENADOR,
  Roles.ENFERMEIRO,
  Roles.TECNICO_ENFERMAGEM,
  Roles.MEDICO,
  Roles.FISIOTERAPEUTA,
  Roles.NUTRICIONISTA,
  Roles.PSICOLOGO,
  Roles.ASSISTENTE_SOCIAL,
  Roles.TERAPEUTA_OCUPACIONAL,
  Roles.FONOAUDIOLOGO,
  Roles.RECEPCAO,
] as const;

export const AllRoles = Object.values(Roles);