export interface AuditLog {
  id: string;

  acao: string;
  entidade: string;
  entidadeId: string;
  descricao?: string;

  createdAt: string;

  user: {
    nome: string;
    cargo: string;
  };
}

export interface AuditResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  data: AuditLog[];
}

export interface AuditSummary {
  total: number;

  [key: string]: number;
}