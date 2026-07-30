import { api } from "./api";

import type {
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

export async function getPatientEvolutions(
  patientId: string
): Promise<PatientEvolutionResponse> {
  const response = await api.get(
    `/patients/${patientId}/evolutions`
  );

  return response.data;
}

export async function getEvolutions(
  params?: EvolutionFiltersParams
): Promise<EvolutionListResponse> {
  const response = await api.get("/evolutions", {
    params,
  });

  return response.data;
}

export async function createEvolution(data: {
  descricao: string;
  assinatura?: string;
  patientId: string;
}) {
  const response = await api.post(
    "/evolutions",
    data
  );

  return response.data;
}

export async function updateEvolution(
  id: string,
  data: {
    descricao: string;
    assinatura?: string;
  }
) {
  const response = await api.put(
    `/evolutions/${id}`,
    data
  );

  return response.data;
}

export async function deleteEvolution(id: string) {
  const response = await api.delete(
    `/evolutions/${id}`
  );

  return response.data;
}