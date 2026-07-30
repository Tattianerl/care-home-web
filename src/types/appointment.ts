import type { AppointmentStatusType } from "../constants/appointmentStatus";


export interface Appointment {

  id: string;

  titulo: string;

  dataHora: string;

  observacoes?: string;

  status: AppointmentStatusType;

  patient: {
    id: string;
    nome: string;
  };

  user: {
    id: string;
    nome: string;
    cargo: string;
  };

}