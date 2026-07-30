export const AppointmentStatus = {
  AGENDADO: "AGENDADO",
  REALIZADO: "REALIZADO",
  CANCELADO: "CANCELADO",
} as const;


export type AppointmentStatusType =
  typeof AppointmentStatus[keyof typeof AppointmentStatus];