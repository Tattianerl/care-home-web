export interface Appointment {
  id: string;
  titulo: string;
  dataHora: string;
  observacoes: string;

  patient: {
    nome: string;
  };
}