import { api } from "./api";

import type { Patient, PatientsResponse } from "../types/patient";
import type { PatientDetails } from "../types/patientDetails";

export type PatientData = Omit<
  Patient,
  "id" | "createdAt" | "ativo"
>;

/**
 * Lista pacientes.
 *
 * A API retorna um objeto paginado:
 *
 * {
 *   page,
 *   limit,
 *   total,
 *   totalPages,
 *   data: Patient[]
 * }
 */
export async function getPatients(
  page = 1,
  limit = 10
): Promise<PatientsResponse> {
  const { data } = await api.get<PatientsResponse>("/patients", {
    params: {
      page,
      limit,
    },
  });

  return data;
}

/**
 * Busca os detalhes completos de um paciente.
 */
export async function getPatient(
  id: string
): Promise<PatientDetails> {
  const { data } = await api.get<PatientDetails>(
    `/patients/${id}`
  );

  return data;
}

/**
 * Cria um novo paciente.
 */
export async function createPatient(
  patient: PatientData
): Promise<Patient> {
  const { data } = await api.post<Patient>(
    "/patients",
    patient
  );

  return data;
}

/**
 * Atualiza os dados de um paciente.
 */
export async function updatePatient(
  id: string,
  patient: Partial<PatientData>
): Promise<Patient> {
  const { data } = await api.put<Patient>(
    `/patients/${id}`,
    patient
  );

  return data;
}

/**
 * Exclui um paciente.
 */
export async function deletePatient(
  id: string
): Promise<void> {
  await api.delete(`/patients/${id}`);
}
