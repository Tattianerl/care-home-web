import type { UserRole } from "../types";


export interface User {
  id: string;

  nome: string;
  cpf: string;
  email: string;
  telefone?: string;

  senha?: string;

  cargo: UserRole;

  registroProfissional?: string;
  fotoUrl?: string;
  assinatura?: string;

  dataAdmissao?: string;

  observacoes?: string;

  ativo: boolean;

  ultimoLogin?: string;

  createdAt: string;
}