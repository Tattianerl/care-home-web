import { api } from "./api";

import type {
  Evolution,
  EvolutionListResponse,
  PatientEvolutionResponse,
} from "../types/evolution";

export interface EvolutionFiltersParams {
  today?: boolean;
  patientId?: string;
  professional?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateEvolutionInput {
  descricao: string;
  assinatura?: string;
  patientId: string;
}

export interface UpdateEvolutionInput {
  descricao: string;
  assinatura?: string;
}

export async function getPatientEvolutions(
  patientId: string
): Promise<PatientEvolutionResponse> {
  const { data } = await api.get<PatientEvolutionResponse>(
    `/patients/${patientId}/evolutions`
  );

  return data;
}

export async function getEvolutions(
  params?: EvolutionFiltersParams
): Promise<EvolutionListResponse> {
  const { data } = await api.get<EvolutionListResponse>("/evolutions", {
    params,
  });

  return data;
}

export async function createEvolution(
  data: CreateEvolutionInput
): Promise<Evolution> {
  const response = await api.post<Evolution>("/evolutions", data);

  return response.data;
}

export async function updateEvolution(
  id: string,
  data: UpdateEvolutionInput
): Promise<Evolution> {
  const response = await api.put<Evolution>(
    `/evolutions/${id}`,
    data
  );

  return response.data;
}

export async function deleteEvolution(id: string): Promise<void> {
  await api.delete(`/evolutions/${id}`);
}