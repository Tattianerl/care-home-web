import { User, Stethoscope, FileText } from "lucide-react";

import type { Appointment } from "../../types/appointment";

import { AppointmentActions } from "./AppointmentActions";
import { AppointmentStatusBadge } from "./AppointmentStatusBadge";

interface Props {
  appointment: Appointment;

  onEdit(): void;

  onFinish(): void;

  onCancel(): void;
}

export function AppointmentCard({
  appointment,
  onEdit,
  onFinish,
  onCancel,
}: Props) {
  return (
    <div
      className="
        bg-white
        rounded-xl
        shadow
        border
        border-gray-100
        p-5
       hover:shadow-lg
        transition-shadow-sm
      "
    >
      {/* Cabeçalho */}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">
            {appointment.titulo}
          </h2>

          <p className="text-sm text-gray-500">
            {new Date(
              appointment.dataHora
            ).toLocaleString("pt-BR")}
          </p>
        </div>

        <AppointmentStatusBadge
          status={appointment.status}
        />
      </div>

      {/* Conteúdo */}

      <div className="space-y-5">

        <div className="flex items-center gap-2">
          <User
            size={18}
            className="text-gray-500"
          />

          <div>
          <p className="text-xs text-gray-500">
            Paciente
          </p>

          <p className="font-medium">
            {appointment.patient.nome}
          </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Stethoscope
            size={18}
            className="text-gray-500"
          />

              <div>
              <p className="text-xs text-gray-500">
                Profissional
              </p>

              <p className="font-medium">
                {appointment.user.nome}
              </p>

              <p className="text-sm text-gray-500 capitalize">
                {appointment.user.cargo}
              </p>
            </div>
        </div>

        {appointment.observacoes && (
          <div className="flex items-start gap-2">
            <FileText
              size={18}
              className="text-gray-500 mt-1"
            />

            <div>
              <p className="text-xs text-gray-500 mb-1">
                Observações
              </p>

              <p className="text-gray-700 leading-relaxed">
                {appointment.observacoes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé */}

      <div className="mt-5 pt-4 border-t flex justify-end">
        <AppointmentActions
          status={appointment.status}
          onEdit={onEdit}
          onFinish={onFinish}
          onCancel={onCancel}
        />
      </div>
    </div>
  );
}