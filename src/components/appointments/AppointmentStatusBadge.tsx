import { AppointmentStatus } from "../../constants/appointmentStatus";
import type { AppointmentStatusType } from "../../constants/appointmentStatus";


interface Props {
  status: AppointmentStatusType;
}


export function AppointmentStatusBadge({
  status,
}: Props) {

  const styles = {
    [AppointmentStatus.AGENDADO]:
      "bg-blue-100 text-blue-700",

    [AppointmentStatus.REALIZADO]:
      "bg-green-100 text-green-700",

    [AppointmentStatus.CANCELADO]:
      "bg-red-100 text-red-700",
  };


  const labels = {
    [AppointmentStatus.AGENDADO]:
      "Agendado",

    [AppointmentStatus.REALIZADO]:
      "Realizado",

    [AppointmentStatus.CANCELADO]:
      "Cancelado",
  };


  return (
    <span
      className={`
        px-3
        py-1
        rounded-full
        text-xs
        font-semibold
        ${styles[status]}
      `}
    >
      {labels[status]}
    </span>
  );
}