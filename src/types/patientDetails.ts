export interface Evolution {
  id: string;
  descricao: string;
  createdAt: string;

  user: {
    id: string;
    nome: string;
    email: string;
    cargo: string;
  };
}

export interface PatientDetails {
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

  evolutions: Evolution[];
}