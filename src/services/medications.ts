import { api } from "./api";

import type { MedicationStatus } from "../types/enums";
import type { Medication } from "../types/medication";

export interface MedicationFiltersParams {
  patientId?: string;
  status?: MedicationStatus;
  search?: string;
}

export interface CreateMedicationInput {
  nome: string;
  dosagem: string;
  frequencia: string;
  viaAdministracao: string;
  horarios?: unknown;
  inicioTratamento?: string;
  fimTratamento?: string;
  status?: MedicationStatus;
  controlado?: boolean;
  usoContinuo?: boolean;
  observacoes?: string;
  patientId: string;
  prescritoPorId?: string;
}

export type UpdateMedicationInput =
  Partial<CreateMedicationInput>;

export async function getMedications(
  params?: MedicationFiltersParams
): Promise<Medication[]> {
  const { data } = await api.get<Medication[]>("/medications", {
    params,
  });

  return data;
}

export async function getPatientMedications(
  patientId: string
): Promise<Medication[]> {
  const { data } = await api.get<Medication[]>(
    `/patients/${patientId}/medications`
  );

  return data;
}

export async function createMedication(
  data: CreateMedicationInput
): Promise<Medication> {
  const response = await api.post<Medication>(
    "/medications",
    data
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

export async function updateMedicationStatus(
  id: string,
  status: MedicationStatus
): Promise<Medication> {
  const response = await api.patch<Medication>(
    `/medications/${id}/status`,
    { status }
  );

  return response.data;
}

export async function deleteMedication(
  id: string
): Promise<void> {
  await api.delete(`/medications/${id}`);
}