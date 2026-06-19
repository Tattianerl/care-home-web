export interface Patient {
  id: string;
  nome: string;
  dataNascimento: string;
  responsavel: string;
  telefone: string;
  historicoMedico: string | null;
  medicamentos: string | null;
  alergias: string | null;
  diagnosticos: string | null;
  observacoes: string | null;
  ativo: boolean;
  createdAt: string;
}

export interface PatientsResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: Patient[];
}