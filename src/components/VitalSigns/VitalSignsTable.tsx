import { Link } from "react-router-dom";
import {
  User,
  Clock,
  Heart,
  Wind,
  Thermometer,
  Droplet,
  ChevronRight,
} from "lucide-react";

import type { VitalSignsOverviewItem } from "../../types/vitalSigns";

interface VitalSignsTableProps {
  records: VitalSignsOverviewItem[];
}

function formatDate(date: string) {
  return new Date(date).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function VitalSignsTable({
  records,
}: VitalSignsTableProps) {
  if (!records.length) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
        <p className="text-sm text-slate-500">
          Nenhum registro encontrado.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200">
      <table className="w-full border-collapse">
        <thead className="bg-slate-50">
          <tr className="text-left text-xs uppercase tracking-wider text-slate-500">

            <th className="px-4 py-3">
              Residente
            </th>

            <th className="px-4 py-3">
              Horário
            </th>

            <th className="px-4 py-3">
              Pressão
            </th>

            <th className="px-4 py-3">
              FC
            </th>

            <th className="px-4 py-3">
              Saturação
            </th>

            <th className="px-4 py-3">
              Temperatura
            </th>

            <th className="px-4 py-3">
              Glicemia
            </th>

            <th className="px-4 py-3">
              Profissional
            </th>

            <th className="px-4 py-3 text-right">
              Ação
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {records.map((record) => (
            <tr
              key={record.id}
              className={`
                transition-colors

                ${
                  record.status === "critico"
                    ? "bg-rose-50 hover:bg-rose-100"
                    : record.status === "alerta"
                    ? "bg-amber-50 hover:bg-amber-100"
                    : "hover:bg-slate-50"
                }
              `}
            >
              {/* Paciente */}

              <td className="px-4 py-4">
                <div className="flex items-center gap-2">

                  <User className="h-4 w-4 text-slate-400" />

                  <span className="font-semibold text-slate-800">
                    {record.patientName}
                  </span>

                </div>
              </td>

              {/* Data */}

              <td className="px-4 py-4 text-sm text-slate-600">

                <div className="flex items-center gap-2">

                  <Clock className="h-4 w-4 text-slate-400" />

                  {formatDate(record.createdAt)}

                </div>

              </td>

              {/* Pressão */}

              <td className="px-4 py-4">

                {record.pressao}

              </td>

              {/* FC */}

              <td className="px-4 py-4">

                <div className="flex items-center gap-1">

                  <Heart className="h-4 w-4 text-rose-500" />

                  {record.frequenciaCardiaca ?? "--"}

                </div>

              </td>

              {/* Saturação */}

              <td className="px-4 py-4">

                <div className="flex items-center gap-1">

                  <Wind className="h-4 w-4 text-sky-500" />

                  <span
                    className={
                     (record.saturacao ?? 100) < 90
                        ? "font-bold text-rose-600"
                        : ""
                    }
                  >
                    {record.saturacao ?? "--"}%
                  </span>

                </div>

              </td>

              {/* Temperatura */}

              <td className="px-4 py-4">

                <div className="flex items-center gap-1">

                  <Thermometer className="h-4 w-4 text-orange-500" />

                  {record.temperatura ?? "--"}°C

                </div>

              </td>

              {/* Glicemia */}

              <td className="px-4 py-4">

                <div className="flex items-center gap-1">

                  <Droplet className="h-4 w-4 text-indigo-500" />

                  {record.glicemia ?? "--"}

                </div>

              </td>

              {/* Profissional */}

              <td className="px-4 py-4">

                <div>

                  <p className="font-semibold">
                    {record.user.nome}
                  </p>

                  <p className="text-xs text-slate-400">
                    {record.user.cargo}
                  </p>

                </div>

              </td>

              {/* Link */}

              <td className="px-4 py-4 text-right">

                <Link
                  to={`/patients/${record.patientId}`}
                  className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600 hover:text-emerald-700"
                >
                  Prontuário

                  <ChevronRight className="h-4 w-4" />

                </Link>

              </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}