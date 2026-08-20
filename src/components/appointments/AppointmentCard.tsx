import { User, Stethoscope, FileText } from "lucide-react";

import type { Appointment } from "../../types/appointment";

import { getCargoLabel } from "../../utils/getCargoLabel";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      {/* Cabeçalho */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            {appointment.titulo}
          </h2>

          <p className="text-sm text-slate-500">
            {new Date(appointment.dataHora).toLocaleString("pt-BR")}
          </p>
        </div>

        <AppointmentStatusBadge
          status={appointment.status}
        />
      </div>

      {/* Conteúdo */}
      <div className="space-y-5">

        {/* Paciente */}
        <div className="flex items-center gap-2">
          <User
            size={18}
            className="text-gray-500"
          />

          <div>
            <p className="text-xs text-gray-500">
              Paciente
            </p>

            <p className="font-medium text-slate-800">
              {appointment.patient.nome}
            </p>
          </div>
        </div>

        {/* Profissional */}
        <div className="flex items-center gap-2">
          <Stethoscope
            size={18}
            className="text-gray-500"
          />

          <div>
            <p className="text-xs text-gray-500">
              Profissional
            </p>

            <p className="font-medium text-slate-800">
              {appointment.user.nome}
            </p>

            <p className="text-sm text-gray-500">
              {getCargoLabel(appointment.user.cargo)}
            </p>
          </div>
        </div>

        {/* Observações */}
        {appointment.observacoes && (
          <div className="flex items-start gap-2">
            <FileText
              size={18}
              className="mt-1 text-gray-500"
            />

            <div>
              <p className="mb-1 text-xs text-gray-500">
                Observações
              </p>

              <p className="leading-relaxed text-gray-700">
                {appointment.observacoes}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé */}
      <div className="mt-5 flex justify-end border-t pt-4">
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