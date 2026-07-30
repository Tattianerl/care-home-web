export interface Evolution {
  id: string;
  descricao: string;
  assinatura?: string | null;
  createdAt: string;

  patient: {
    id: string;
    nome: string;
  };

  user: {
    id?: string;
    nome: string;
    cargo: string;
  };
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