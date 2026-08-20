import { Pencil, Check, X } from "lucide-react";

import { AppointmentStatus } from "../../types/enums";

interface Props {
  status: string;
  onEdit(): void;
  onFinish(): void;
  onCancel(): void;
}

export function AppointmentActions({
  status,
  onEdit,
  onFinish,
  onCancel,
}: Props) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        title="Editar"
        aria-label="Editar agendamento"
        onClick={onEdit}
        className="
          rounded
          p-1
          text-blue-600
          hover:text-blue-800
          hover:bg-blue-50
          focus:outline-none
          focus:ring-2
          focus:ring-blue-400
        "
      >
        <Pencil size={18} />
      </button>

      {status === AppointmentStatus.AGENDADO && (
        <>
          <button
            type="button"
            title="Marcar como realizado"
            aria-label="Marcar como realizado"
            onClick={onFinish}
            className="
              rounded
              p-1
              text-green-600
              hover:text-green-800
              hover:bg-green-50
              focus:outline-none
              focus:ring-2
              focus:ring-green-400
            "
          >
            <Check size={18} />
          </button>

          <button
            type="button"
            title="Cancelar agendamento"
            aria-label="Cancelar agendamento"
            onClick={onCancel}
            className="
              rounded
              p-1
              text-red-600
              hover:text-red-800
              hover:bg-red-50
              focus:outline-none
              focus:ring-2
              focus:ring-red-400
            "
          >
            <X size={18} />
          </button>
        </>
      )}
    </div>
  );
}