import { api } from "./api";

import type { MedicationStatus } from "../types/enums";
import type { Medication } from "../types/medication";

export interface CreateMedicationInput {
  nome: string;
  dosagem: string;
  frequencia: string;
  viaAdministracao: string;
  horarios?: string[] | null;
  inicioTratamento?: string | null;
  fimTratamento?: string | null;
  status?: MedicationStatus;
  controlado?: boolean;
  usoContinuo?: boolean;
  observacoes?: string | null;
  prescritoPorId?: string | null;
}

export type UpdateMedicationInput = Partial<CreateMedicationInput>;

export async function getPatientMedications(
  patientId: string
): Promise<Medication[]> {
  const { data } = await api.get<Medication[]>(
    `/patients/${patientId}/medications`
  );

  return data;
}

export async function createMedication(
  patientId: string,
  data: CreateMedicationInput
): Promise<Medication> {
  const response = await api.post<Medication>(
    `/patients/${patientId}/medications`,
    data
  );

  return response.data;
}

export async function getMedication(
  id: string
): Promise<Medication> {
  const response = await api.get<Medication>(
    `/medications/${id}`
  );

  return response.data;
}

export async function updateMedication(
  id: string,
  data: UpdateMedicationInput
): Promise<Medication> {
  const response = await api.put<Medication>(
    `/medications/${id}`,
    data
  );

  return response.data;
}