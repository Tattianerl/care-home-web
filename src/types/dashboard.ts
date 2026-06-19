export interface DashboardToday {
  pacientesAtivos: number;
  atendimentosHoje: number;
  proximosAtendimentos: number;
  evolucoesHoje: number;
  documentosHoje: number;
  sinaisVitaisHoje: number;

  ultimosPacientes: {
    id: string;
    nome: string;
  }[];

  ultimasEvolucoes: {
    id: string;
    descricao: string;
    patient: {
      nome: string;
    };
  }[];

  proximosAtendimentosDetalhados: {
    id: string;
    titulo: string;
    dataHora: string;
    patient: {
      nome: string;
    };
  }[];

  dataReferencia: string;
}