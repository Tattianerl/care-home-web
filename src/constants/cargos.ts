import { Roles } from "../permissions/roles";

export const cargos = [
  {
    value: Roles.ADMIN,
    label: "Administrador",
  },
  {
    value: Roles.COORDENADOR,
    label: "Coordenador",
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
    value: Roles.PSICOLOGO,
    label: "Psicólogo",
  },
  {
    value: Roles.ASSISTENTE_SOCIAL,
    label: "Assistente Social",
  },
  {
    value: Roles.TERAPEUTA_OCUPACIONAL,
    label: "Terapeuta Ocupacional",
  },
  {
    value: Roles.FONOAUDIOLOGO,
    label: "Fonoaudiólogo",
  },
  {
    value: Roles.RECEPCAO,
    label: "Recepção",
  },
];