import { useNavigate } from "react-router-dom";

import type { Appointment } from "../../types/appointment";

import { AppointmentCard } from "./AppointmentCard";

interface Props {
  appointments: Appointment[];

  loading?: boolean;

  onFinish?(id: string): void;

  onCancel?(id: string): void;
}

export function AppointmentTable({
  appointments,
  loading = false,
  onFinish,
  onCancel,
}: Props) {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
        Carregando agendamentos...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
        Nenhum agendamento encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {appointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onEdit={() =>
            navigate(`/appointments/${appointment.id}/edit`)
          }
          onFinish={() =>
            onFinish?.(appointment.id)
          }
          onCancel={() =>
            onCancel?.(appointment.id)
          }
        />
      ))}
    </div>
  );
}