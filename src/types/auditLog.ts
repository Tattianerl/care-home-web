import type { User } from "./user";

export interface AuditLog {
  id: string;

  acao: string;

  entidade: string;

  entidadeId: string;

  ip?: string;

  descricao?: string;

  createdAt: string;

  userId: string;

  user: User;
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