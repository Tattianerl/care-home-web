import { Roles, type Role } from "./roles";

export const Permissions = {
  // =========================
  // PACIENTES
  // =========================
  VIEW_PATIENTS: "view_patients",
  CREATE_PATIENT: "create_patient",
  EDIT_PATIENT: "edit_patient",
  DELETE_PATIENT: "delete_patient",

  // =========================
  // EVOLUÇÕES
  // =========================
  VIEW_EVOLUTIONS: "view_evolutions",
  CREATE_EVOLUTION: "create_evolution",
  EDIT_EVOLUTION: "edit_evolution",
  DELETE_EVOLUTION: "delete_evolution",

  // =========================
  // SINAIS VITAIS
  // =========================
  VIEW_VITAL_SIGNS: "view_vital_signs",
  CREATE_VITAL_SIGNS: "create_vital_signs",
  EDIT_VITAL_SIGNS: "edit_vital_signs",
  DELETE_VITAL_SIGNS: "delete_vital_signs",

  // =========================
  // MEDICAMENTOS
  // =========================
  VIEW_MEDICATIONS: "view_medications",
  CREATE_MEDICATION: "create_medication",
  EDIT_MEDICATION: "edit_medication",
  DELETE_MEDICATION: "delete_medication",

  // =========================
  // DOCUMENTOS
  // =========================
  VIEW_DOCUMENTS: "view_documents",
  UPLOAD_DOCUMENTS: "upload_documents",
  DELETE_DOCUMENTS: "delete_documents",

  // =========================
  // AGENDA
  // =========================
  VIEW_APPOINTMENTS: "view_appointments",
  CREATE_APPOINTMENTS: "create_appointments",
  EDIT_APPOINTMENTS: "edit_appointments",
  DELETE_APPOINTMENTS: "delete_appointments",
  CANCEL_APPOINTMENTS: "cancel_appointments",

  // =========================
  // NUTRIÇÃO
  // =========================
  VIEW_NUTRITION_ASSESSMENT: "view_nutrition_assessment",
  CREATE_NUTRITION_ASSESSMENT: "create_nutrition_assessment",
  EDIT_NUTRITION_ASSESSMENT: "edit_nutrition_assessment",
  DELETE_NUTRITION_ASSESSMENT: "delete_nutrition_assessment",

  // =========================
  // ADMINISTRAÇÃO
  // =========================
  MANAGE_USERS: "manage_users",
  VIEW_REPORTS: "view_reports",
} as const;

export type Permission =
  (typeof Permissions)[keyof typeof Permissions];

export const rolePermissions: Record<Role, Permission[]> = {
  // =====================================================
  // ADMIN
  // Sistema / infraestrutura / administração
  // =====================================================
  [Roles.ADMIN]: [
    Permissions.MANAGE_USERS,
    Permissions.VIEW_REPORTS,

    // Acesso somente para consulta
    Permissions.VIEW_PATIENTS,
    Permissions.VIEW_EVOLUTIONS,
    Permissions.VIEW_VITAL_SIGNS,
    Permissions.VIEW_MEDICATIONS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_APPOINTMENTS,
    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // COORDENADOR
  // Operação completa da instituição
  // ÚNICO perfil com exclusão de registros
  // =====================================================
  [Roles.COORDENADOR]: [
    // Pacientes
    Permissions.VIEW_PATIENTS,
    Permissions.CREATE_PATIENT,
    Permissions.EDIT_PATIENT,
    Permissions.DELETE_PATIENT,

    // Evoluções
    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,
    Permissions.DELETE_EVOLUTION,

    // Sinais vitais
    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,
    Permissions.EDIT_VITAL_SIGNS,
    Permissions.DELETE_VITAL_SIGNS,

    // Medicamentos
    Permissions.VIEW_MEDICATIONS,
    Permissions.CREATE_MEDICATION,
    Permissions.EDIT_MEDICATION,
    Permissions.DELETE_MEDICATION,

    // Documentos
    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,
    Permissions.DELETE_DOCUMENTS,

    // Agenda
    Permissions.VIEW_APPOINTMENTS,
    Permissions.CREATE_APPOINTMENTS,
    Permissions.EDIT_APPOINTMENTS,
    Permissions.DELETE_APPOINTMENTS,
    Permissions.CANCEL_APPOINTMENTS,

    // Nutrição
    Permissions.VIEW_NUTRITION_ASSESSMENT,
    Permissions.CREATE_NUTRITION_ASSESSMENT,
    Permissions.EDIT_NUTRITION_ASSESSMENT,
    Permissions.DELETE_NUTRITION_ASSESSMENT,

    // Relatórios
    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // ENFERMEIRO
  // =====================================================
  [Roles.ENFERMEIRO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,
    Permissions.EDIT_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,
    Permissions.CREATE_MEDICATION,
    Permissions.EDIT_MEDICATION,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // TÉCNICO DE ENFERMAGEM
  // =====================================================
  [Roles.TECNICO_ENFERMAGEM]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,
  ],

  // =====================================================
  // MÉDICO
  // =====================================================
  [Roles.MEDICO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,
    Permissions.EDIT_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,
    Permissions.CREATE_MEDICATION,
    Permissions.EDIT_MEDICATION,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // FISIOTERAPEUTA
  // =====================================================
  [Roles.FISIOTERAPEUTA]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // NUTRICIONISTA
  // =====================================================
  [Roles.NUTRICIONISTA]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,

    Permissions.VIEW_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
    Permissions.CREATE_NUTRITION_ASSESSMENT,
    Permissions.EDIT_NUTRITION_ASSESSMENT,

    Permissions.VIEW_APPOINTMENTS,
  ],

  // =====================================================
  // PSICÓLOGO
  // =====================================================
  [Roles.PSICOLOGO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // ASSISTENTE SOCIAL
  // =====================================================
  [Roles.ASSISTENTE_SOCIAL]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // TERAPEUTA OCUPACIONAL
  // =====================================================
  [Roles.TERAPEUTA_OCUPACIONAL]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // FONOAUDIÓLOGO
  // =====================================================
  [Roles.FONOAUDIOLOGO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,
  ],

  // =====================================================
  // RECEPÇÃO
  // =====================================================
  [Roles.RECEPCAO]: [
    Permissions.VIEW_PATIENTS,
    Permissions.CREATE_PATIENT,

    Permissions.VIEW_APPOINTMENTS,
    Permissions.CREATE_APPOINTMENTS,
    Permissions.EDIT_APPOINTMENTS,
    Permissions.CANCEL_APPOINTMENTS,

    Permissions.VIEW_DOCUMENTS,
  ],
};