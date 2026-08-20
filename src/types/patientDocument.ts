import type { DocumentType } from "./enums";
import type { PatientSummary, UserSummary } from "./common";

export interface PatientDocument {
  id: string;

  nome: string;
  arquivo: string;
  tipo: DocumentType;

  createdAt: string;

  deletedAt?: string | null;
  deletedBy?: string | null;
  deletedByUserId?: string | null;

  patientId: string;

  patient?: PatientSummary;
  deletedByUser?: UserSummary;
}