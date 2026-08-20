import { api } from "./api";

import type { Appointment, TodayAppointment } from "../types/appointment";
import type { AppointmentStatus } from "../types/enums";

export interface AppointmentFilters {
  status?: AppointmentStatus;
  patientId?: string;
  userId?: string;
  startDate?: string;
  endDate?: string;
}

export interface CreateAppointmentInput {
  titulo: string;
  dataHora: string;
  local?: string;
  observacoes?: string;
  patientId: string;
}

export interface UpdateAppointmentInput {
  titulo: string;
  dataHora: string;
  local?: string;
  observacoes?: string;
}

// Listar agendamentos
export async function getAppointments(
  params?: AppointmentFilters
): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>("/appointments", {
    params,
  });

  return data;
}

// Buscar por ID
export async function getAppointmentById(
  id: string
): Promise<Appointment> {
  const { data } = await api.get<Appointment>(
    `/appointments/${id}`
  );

  return data;
}

// Criar agendamento
export async function createAppointment(
  data: CreateAppointmentInput
): Promise<Appointment> {
  const response = await api.post<Appointment>(
    "/appointments",
    data
  );

  return response.data;
}

// Atualizar agendamento
export async function updateAppointment(
  id: string,
  data: UpdateAppointmentInput
): Promise<Appointment> {
  const response = await api.put<Appointment>(
    `/appointments/${id}`,
    data
  );

  return response.data;
}

// Atualizar status
export async function updateAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<Appointment> {
  const response = await api.patch<Appointment>(
    `/appointments/${id}/status`,
    { status }
  );

  return response.data;
}

// Agendamentos de hoje
export async function getTodayAppointments(): Promise<TodayAppointment[]> {
  const { data } = await api.get<TodayAppointment[]>(
    "/appointments/today"
  );

  return data;
}

// Próximos agendamentos
export async function getUpcomingAppointments(): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>(
    "/appointments/upcoming"
  );

  return data;
}