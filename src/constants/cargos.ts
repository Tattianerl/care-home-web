import { Roles } from "../permissions/roles";

export const cargos = [
  {
    value: Roles.ADMIN,
    label: "Administrador",
  },
  {
    value: Roles.ENFERMEIRO,
    label: "Enfermeiro",
  },
  {
    value: Roles.TECNICO_ENFERMAGEM,
    label: "Técnico de Enfermagem",
  },
  {
    value: Roles.MEDICO,
    label: "Médico",
  },
  {
    value: Roles.FISIOTERAPEUTA,
    label: "Fisioterapeuta",
  },
  {
    value: Roles.NUTRICIONISTA,
    label: "Nutricionista",
  },
  {
    value: Roles.ASSISTENTE_SOCIAL,
    label: "Assistente Social",
  },
  {
    value: Roles.RECEPCAO,
    label: "Recepção",
  },
];