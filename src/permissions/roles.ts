export const Roles = {
  ADMIN: "admin",

  ENFERMEIRO: "enfermeiro",

  TECNICO_ENFERMAGEM: "tecnico_enfermagem",

  MEDICO: "medico",

  FISIOTERAPEUTA: "fisioterapeuta",

  NUTRICIONISTA: "nutricionista",

  ASSISTENTE_SOCIAL: "assistente_social",

  RECEPCAO: "recepcao",

} as const;


export type Role = typeof Roles[keyof typeof Roles];

export const AdminRoles = [
  Roles.ADMIN,
] as const;


export const ClinicalRoles = [
  Roles.ENFERMEIRO,
  Roles.TECNICO_ENFERMAGEM,
  Roles.MEDICO,
  Roles.FISIOTERAPEUTA,
  Roles.NUTRICIONISTA,
  Roles.ASSISTENTE_SOCIAL,
] as const;



export const AllRoles = Object.values(Roles);