import type { PatientSummary, UserSummary } from "./common";

export interface Evolution {
  id: string;

  descricao: string;

  assinatura?: string;

  createdAt: string;

  patientId: string;
  userId: string;

  patient: PatientSummary;
  user: UserSummary;
}


export interface EvolutionListResponse {
  total: number;
  evolutions: Evolution[];
}


export interface PatientEvolutionResponse {
  patient: {
    id: string;
    nome: string;
  };

  total: number;

  evolutions: Evolution[];
}