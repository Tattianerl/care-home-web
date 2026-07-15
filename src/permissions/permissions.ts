import {
  Roles,
  type Role,
} from "./roles";


export const Permissions = {

  // Pacientes
  VIEW_PATIENTS: "view_patients",
  CREATE_PATIENT: "create_patient",
  EDIT_PATIENT: "edit_patient",


  // Evolução clínica
  VIEW_EVOLUTIONS: "view_evolutions",
  CREATE_EVOLUTION: "create_evolution",
  EDIT_EVOLUTION: "edit_evolution",


  // Sinais vitais
  VIEW_VITAL_SIGNS: "view_vital_signs",
  CREATE_VITAL_SIGNS: "create_vital_signs",


  // Documentos
  VIEW_DOCUMENTS: "view_documents",
  UPLOAD_DOCUMENTS: "upload_documents",


  // Agenda
  VIEW_APPOINTMENTS: "view_appointments",
  CREATE_APPOINTMENTS: "create_appointments",


  // Nutrição
  CREATE_NUTRITION_ASSESSMENT:
    "create_nutrition_assessment",


  // Administração
  MANAGE_USERS: "manage_users",
  VIEW_REPORTS: "view_reports",

} as const;


export type Permission =
  typeof Permissions[keyof typeof Permissions];



export const rolePermissions: Record<Role, Permission[]> = {

  [Roles.ADMIN]: [
    Permissions.VIEW_PATIENTS,
    Permissions.CREATE_PATIENT,
    Permissions.EDIT_PATIENT,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,
    Permissions.CREATE_APPOINTMENTS,

    Permissions.CREATE_NUTRITION_ASSESSMENT,

    Permissions.MANAGE_USERS,
    Permissions.VIEW_REPORTS,
  ],


  [Roles.ENFERMEIRO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,
  ],


  [Roles.TECNICO_ENFERMAGEM]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_VITAL_SIGNS,
    Permissions.CREATE_VITAL_SIGNS,

    Permissions.VIEW_DOCUMENTS,
  ],


  [Roles.MEDICO]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
    Permissions.EDIT_EVOLUTION,

    Permissions.VIEW_DOCUMENTS,

    Permissions.VIEW_APPOINTMENTS,
  ],


  [Roles.FISIOTERAPEUTA]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,

    Permissions.VIEW_DOCUMENTS,
  ],


  [Roles.NUTRICIONISTA]: [
    Permissions.VIEW_PATIENTS,

    Permissions.CREATE_NUTRITION_ASSESSMENT,

    Permissions.VIEW_DOCUMENTS,
  ],


  [Roles.ASSISTENTE_SOCIAL]: [
    Permissions.VIEW_PATIENTS,

    Permissions.VIEW_DOCUMENTS,
    Permissions.UPLOAD_DOCUMENTS,

    Permissions.VIEW_EVOLUTIONS,
    Permissions.CREATE_EVOLUTION,
  ],


  [Roles.RECEPCAO]: [
    Permissions.VIEW_PATIENTS,
    Permissions.CREATE_PATIENT,

    Permissions.VIEW_APPOINTMENTS,
    Permissions.CREATE_APPOINTMENTS,
  ],

};