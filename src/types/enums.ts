// Usuários
export const UserRole = {
  ADMIN: "ADMIN",
  COORDENADOR: "COORDENADOR",
  ENFERMEIRO: "ENFERMEIRO",
  TECNICO_ENFERMAGEM: "TECNICO_ENFERMAGEM",
  MEDICO: "MEDICO",
  FISIOTERAPEUTA: "FISIOTERAPEUTA",
  NUTRICIONISTA: "NUTRICIONISTA",
  PSICOLOGO: "PSICOLOGO",
  ASSISTENTE_SOCIAL: "ASSISTENTE_SOCIAL",
  TERAPEUTA_OCUPACIONAL: "TERAPEUTA_OCUPACIONAL",
  FONOAUDIOLOGO: "FONOAUDIOLOGO",
  RECEPCAO: "RECEPCAO",
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

// Agenda
export const AppointmentStatus = {
  AGENDADO: "AGENDADO",
  REALIZADO: "REALIZADO",
  CANCELADO: "CANCELADO",
} as const;

export type AppointmentStatus =
  typeof AppointmentStatus[keyof typeof AppointmentStatus];

// Medicamentos
export const MedicationStatus = {
  ATIVO: "ATIVO",
  SUSPENSO: "SUSPENSO",
  FINALIZADO: "FINALIZADO",
} as const;

export type MedicationStatus =
  typeof MedicationStatus[keyof typeof MedicationStatus];

// Documentos
export const DocumentType = {
  RECEITA: "RECEITA",
  EXAME: "EXAME",
  CONTRATO: "CONTRATO",
  IDENTIDADE: "IDENTIDADE",
  FOTO: "FOTO",
  EVOLUCAO: "EVOLUCAO",
  OUTRO: "OUTRO",
} as const;

export type DocumentType =
  typeof DocumentType[keyof typeof DocumentType];

// Dependência
export const DependencyLevel = {
  INDEPENDENTE: "INDEPENDENTE",
  PARCIAL: "PARCIAL",
  TOTAL: "TOTAL",
} as const;

export type DependencyLevel =
  typeof DependencyLevel[keyof typeof DependencyLevel];

// Gênero
export const Gender = {
  MASCULINO: "MASCULINO",
  FEMININO: "FEMININO",
  OUTRO: "OUTRO",
} as const;

export type Gender =
  typeof Gender[keyof typeof Gender];

// Tipo sanguíneo
export const BloodType = {
  A_POSITIVO: "A_POSITIVO",
  A_NEGATIVO: "A_NEGATIVO",
  B_POSITIVO: "B_POSITIVO",
  B_NEGATIVO: "B_NEGATIVO",
  AB_POSITIVO: "AB_POSITIVO",
  AB_NEGATIVO: "AB_NEGATIVO",
  O_POSITIVO: "O_POSITIVO",
  O_NEGATIVO: "O_NEGATIVO",
} as const;

export type BloodType =
  typeof BloodType[keyof typeof BloodType];

// Estado civil
export const MaritalStatus = {
  SOLTEIRO: "SOLTEIRO",
  CASADO: "CASADO",
  DIVORCIADO: "DIVORCIADO",
  VIUVO: "VIUVO",
  UNIAO_ESTAVEL: "UNIAO_ESTAVEL",
} as const;

export type MaritalStatus =
  typeof MaritalStatus[keyof typeof MaritalStatus];