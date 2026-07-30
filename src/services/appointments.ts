import { api } from "./api";

import type { Appointment } from "../types/appointment";
import type { AppointmentStatusType } from "../constants/appointmentStatus";

interface AppointmentFilters {
  status?: string;
  patientId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

// =========================
// Listar agendamentos
// =========================
export async function getAppointments(
  params?: AppointmentFilters
): Promise<Appointment[]> {

  const response = await api.get(
    "/appointments",
    {
      params,
    }
  );

  return response.data;
}

// =========================
// Buscar por ID
// =========================
export async function getAppointmentById(
  id: string
): Promise<Appointment> {

  const response = await api.get(
    `/appointments/${id}`
  );

  return response.data;
}

// =========================
// Criar agendamento
// =========================
export async function createAppointment(
  data: {
    titulo: string;
    dataHora: string;
    observacoes?: string;
    patientId: string;
  }
): Promise<Appointment> {

  const response = await api.post(
    "/appointments",
    data
  );

  return response.data;
}

// =========================
// Atualizar agendamento
// =========================
export async function updateAppointment(
  id: string,
  data: {
    titulo: string;
    dataHora: string;
    observacoes?: string;
  }
): Promise<Appointment> {

  const response = await api.put(
    `/appointments/${id}`,
    data
  );

  return response.data;
}

// =========================
// Atualizar status
// =========================
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatusType
): Promise<Appointment> {

  const response = await api.patch(
    `/appointments/${id}/status`,
    {
       status ,
    }
  );

  return response.data;
}

// =========================
// Agendamentos de hoje
// =========================
export async function getTodayAppointments(): Promise<Appointment[]> {

  const response = await api.get(
    "/appointments/today"
  );

  return response.data;
}

// =========================
// Próximos agendamentos
// =========================
export async function getUpcomingAppointments(): Promise<Appointment[]> {

  const response = await api.get(
    "/appointments/upcoming"
  );

  return response.data;
}