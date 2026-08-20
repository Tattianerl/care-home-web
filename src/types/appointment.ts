import type { AppointmentStatus, UserRole } from "./enums";
import type { Patient } from "./patient";
import type { User } from "./user";

export interface Appointment {
  id: string;
  titulo: string;
  dataHora: string;
  local?: string;
  observacoes?: string;
  status: AppointmentStatus;
  createdAt: string;
  patientId: string;
  userId: string;
  patient: Patient;
  user: User;
}

export interface TodayAppointment {
  id: string;
  titulo: string;
  dataHora: string;
  observacoes?: string | null;
  status: AppointmentStatus;

  paciente: {
    id: string;
    nome: string;
  };

  profissional: {
    id: string;
    nome: string;
    cargo: UserRole;
  };
}