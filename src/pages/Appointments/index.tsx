import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getUpcomingAppointments }
from "../../services/upcomingAppointments";

import type { Appointment }
from "../../types/appointment";

export function Appointments() {

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  useEffect(() => {

    async function loadAppointments() {

      try {

        const data =
          await getUpcomingAppointments();

        setAppointments(data);

      } catch (error) {

        console.error(error);
      }
    }

    loadAppointments();

  }, []);

  return (
    <div>

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Agendamentos
        </h1>

        <Link
          to="/appointments/new"
          className="
            bg-blue-600
            text-white
            px-4
            py-2
            rounded-lg
          "
        >
          Novo Agendamento
        </Link>

      </div>

      <div className="space-y-4">

        {appointments.map(
          (appointment) => (

            <div
              key={appointment.id}
              className="
                bg-white
                rounded-xl
                shadow
                p-4
              "
            >

              <h2 className="font-bold text-lg">
                {appointment.titulo}
              </h2>

              <p className="text-gray-600">
                Paciente:
                {" "}
                {appointment.patient.nome}
              </p>

              <p className="text-gray-600">
                Data:
                {" "}
                {new Date(
                  appointment.dataHora
                ).toLocaleString("pt-BR")}
              </p>

              {appointment.observacoes && (
                <p className="mt-2 text-sm">
                  {appointment.observacoes}
                </p>
              )}

            </div>
          )
        )}

      </div>

    </div>
  );
}