export interface DashboardPatient {
  id: string;
  nome: string;
  createdAt?: string;
}


export interface DashboardEvolution {
  id: string;
  descricao: string;
  createdAt: string;

  patient: {
    nome: string;
  };

  user?: {
    nome: string;
    cargo: string;
  };
}


export interface DashboardAppointment {
  id: string;
  titulo: string;
  dataHora: string;
  status: string;

  patient: {
    nome: string;
  };
}


export interface DashboardPending {
  tipo: "EVOLUTION" | "VITAL_SIGN";
  mensagem: string;
}


export interface DashboardAudit {
  id: string;

  acao: string;
  entidade: string;
  descricao?: string;

  createdAt: string;

  user: {
    nome: string;
    cargo: string;
  };
}



export interface DashboardToday {

  // Cards principais

  pacientesAtivos: number;

  profissionaisAtivos: number;

  atendimentosHoje: number;

  proximosAtendimentos: number;

  evolucoesHoje: number;

  documentosHoje: number;

  sinaisVitaisHoje: number;



  // Listas

  ultimosPacientes: DashboardPatient[];


  ultimasEvolucoes: DashboardEvolution[];


  proximosAtendimentosDetalhados: DashboardAppointment[];

  // Alertas

  pendencias: DashboardPending[];

  // Auditoria

  atividadeRecente: DashboardAudit[];

  // Data referência

  dataReferencia: string;
}