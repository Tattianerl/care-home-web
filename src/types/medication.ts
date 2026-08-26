import type { MedicationStatus } from "./enums";
import type { PatientSummary, UserSummary } from "./common";

export interface Medication {
  id: string;

  nome: string;
  dosagem: string;
  frequencia: string;
  viaAdministracao: string;

  horarios?: string[] | null;

  inicioTratamento?: string | null;
  fimTratamento?: string | null;

  status: MedicationStatus;

  controlado: boolean;
  usoContinuo: boolean;

  observacoes?: string | null;

  createdAt: string;

  patientId: string;
  userId: string;

  prescritoPorId?: string | null;

  patient?: PatientSummary;
  user?: UserSummary;
  prescritoPor?: UserSummary;
}