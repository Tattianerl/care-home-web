export interface Evolution {
  id: string;
  descricao: string;
  assinatura: string;
  createdAt: string;

  user: {
    nome: string;
    cargo: string;
  };
}