import { Roles, type Role } from "./roles";

export const Permissions = {
  // =========================
  // PACIENTES
  // =========================
  VIEW_PATIENTS: "view_patients",
  CREATE_PATIENT: "create_patient",
  EDIT_PATIENT: "edit_patient",
  DELETE_PATIENT: "delete_patient",

  // Status institucional do paciente
  MANAGE_PATIENT_STATUS: "manage_patient_status",

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
  // =====================================================
  [Roles.ADMIN]: [
    Permissions.MANAGE_USERS,
    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // COORDENADOR
  // =====================================================
  [Roles.COORDENADOR]: [
    // Pacientes
    Permissions.CREATE_PATIENT,
    Permissions.VIEW_PATIENTS,
    Permissions.DELETE_PATIENT,
    Permissions.MANAGE_PATIENT_STATUS,

    // Evoluções
    Permissions.VIEW_EVOLUTIONS,

    // Sinais vitais
    Permissions.VIEW_VITAL_SIGNS,

    // Medicamentos
    Permissions.VIEW_MEDICATIONS,

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

    // Relatórios
    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // ENFERMEIRO
  // =====================================================
  [Roles.ENFERMEIRO]: [
    // Pacientes
    Permissions.VIEW_PATIENTS,
    Permissions.EDIT_PATIENT,

    // Evoluções
    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    // Sinais vitais
    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,
    Permissions.EDIT_VITAL_SIGNS,

    // Medicamentos
    Permissions.VIEW_MEDICATIONS,
    Permissions.CREATE_MEDICATION,
    Permissions.EDIT_MEDICATION,

    // Documentos
    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    // Agenda
    Permissions.VIEW_APPOINTMENTS,

    // Nutrição
    Permissions.VIEW_NUTRITION_ASSESSMENT,

    // Relatórios
    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // TÉCNICO DE ENFERMAGEM
  // =====================================================
  [Roles.TECNICO_ENFERMAGEM]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,
    Permissions.EDIT_VITAL_SIGNS,

    Permissions.VIEW_MEDICATIONS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_APPOINTMENTS,

    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // MÉDICO
  // =====================================================
  [Roles.MEDICO]: [
    // Pacientes
    Permissions.VIEW_PATIENTS,
    Permissions.EDIT_PATIENT,

    // Evoluções
    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    // Sinais vitais
    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,
    Permissions.EDIT_VITAL_SIGNS,

    // Medicamentos
    Permissions.VIEW_MEDICATIONS,
    Permissions.CREATE_MEDICATION,
    Permissions.EDIT_MEDICATION,

    // Documentos
    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    // Agenda
    Permissions.VIEW_APPOINTMENTS,

    // Nutrição
    // Médico pode consultar, mas não criar, editar ou excluir.
    Permissions.VIEW_NUTRITION_ASSESSMENT,

    // Relatórios
    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // FISIOTERAPEUTA
  // =====================================================
  [Roles.FISIOTERAPEUTA]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.VIEW_MEDICATIONS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_APPOINTMENTS,
    Permissions.VIEW_NUTRITION_ASSESSMENT,

    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // NUTRICIONISTA
  // =====================================================
  [Roles.NUTRICIONISTA]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.VIEW_MEDICATIONS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_APPOINTMENTS,

    // Nutrição — competência exclusiva do nutricionista
    Permissions.VIEW_NUTRITION_ASSESSMENT,
    Permissions.CREATE_NUTRITION_ASSESSMENT,
    Permissions.EDIT_NUTRITION_ASSESSMENT,
    Permissions.DELETE_NUTRITION_ASSESSMENT,

    Permissions.VIEW_REPORTS,
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

    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // ASSISTENTE SOCIAL
  // =====================================================
  [Roles.ASSISTENTE_SOCIAL]: [
    Permissions.VIEW_PATIENTS,
    Permissions.CREATE_PATIENT,
    Permissions.EDIT_PATIENT,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.VIEW_MEDICATIONS,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,
    Permissions.CREATE_APPOINTMENTS,
    Permissions.EDIT_APPOINTMENTS,
    Permissions.DELETE_APPOINTMENTS,
    Permissions.CANCEL_APPOINTMENTS,

    Permissions.VIEW_NUTRITION_ASSESSMENT,

    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // TERAPEUTA OCUPACIONAL
  // =====================================================
  [Roles.TERAPEUTA_OCUPACIONAL]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.VIEW_MEDICATIONS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_APPOINTMENTS,
    Permissions.VIEW_NUTRITION_ASSESSMENT,

    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // FONOAUDIÓLOGO
  // =====================================================
  [Roles.FONOAUDIOLOGO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.VIEW_MEDICATIONS,
    Permissions.VIEW_DOCUMENTS,
    Permissions.VIEW_APPOINTMENTS,
    Permissions.VIEW_NUTRITION_ASSESSMENT,

    Permissions.VIEW_REPORTS,
  ],

  // =====================================================
  // RECEPÇÃO
  // =====================================================
  [Roles.RECEPCAO]: [
    // Pacientes
    Permissions.VIEW_PATIENTS,
    Permissions.CREATE_PATIENT,
    Permissions.EDIT_PATIENT,

    // Agenda
    Permissions.VIEW_APPOINTMENTS,
    Permissions.CREATE_APPOINTMENTS,
    Permissions.EDIT_APPOINTMENTS,
    Permissions.CANCEL_APPOINTMENTS,

    // Documentos
    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,
  ],
};
