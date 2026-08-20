import type { PatientSummary, UserSummary } from "./common";

export interface NutritionalAssessment {
  id: string;

  peso: number;
  altura: number;

  imc?: number | null;
  classificacaoImc?: string | null;
  observacoes?: string | null;

  createdAt: string;

  patientId: string;
  userId: string;

  patient?: PatientSummary;
  user?: UserSummary;
}

export interface CreateNutritionalAssessmentInput {
  patientId: string;
  peso: number;
  altura: number;
  observacoes?: string;
}

export interface UpdateNutritionalAssessmentInput {
  peso?: number;
  altura?: number;
  observacoes?: string;
}