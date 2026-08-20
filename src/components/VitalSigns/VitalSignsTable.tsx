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
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "--";
  }

  return parsedDate.toLocaleString("pt-BR", {
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
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-sm text-slate-500">
        Nenhum registro encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[1000px] text-left text-sm">
        <thead className="border-b border-slate-200 bg-slate-50 text-xs font-semibold text-slate-500">
          <tr>
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
              {/* Residente */}
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
                <span className="font-medium text-slate-700">
                  {record.pressaoSistolica}/
                  {record.pressaoDiastolica}
                </span>

                <span className="ml-1 text-xs text-slate-400">
                  mmHg
                </span>
              </td>

              {/* Frequência cardíaca */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4 text-rose-500" />

                  <span>
                    {record.frequenciaCardiaca ?? "--"}
                  </span>

                  {record.frequenciaCardiaca !== null && (
                    <span className="text-xs text-slate-400">
                      bpm
                    </span>
                  )}
                </div>
              </td>

              {/* Saturação */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <Wind className="h-4 w-4 text-sky-500" />

                  <span
                    className={
                      record.saturacao !== null &&
                      record.saturacao < 90
                        ? "font-bold text-rose-600"
                        : ""
                    }
                  >
                    {record.saturacao ?? "--"}
                    {record.saturacao !== null && "%"}
                  </span>
                </div>
              </td>

              {/* Temperatura */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <Thermometer className="h-4 w-4 text-orange-500" />

                  <span>
                    {record.temperatura.toFixed(1)}°C
                  </span>
                </div>
              </td>

              {/* Glicemia */}
              <td className="px-4 py-4">
                <div className="flex items-center gap-1">
                  <Droplet className="h-4 w-4 text-indigo-500" />

                  <span>
                    {record.glicemia ?? "--"}
                  </span>

                  {record.glicemia !== null && (
                    <span className="text-xs text-slate-400">
                      mg/dL
                    </span>
                  )}
                </div>
              </td>

              {/* Profissional */}
              <td className="px-4 py-4">
                <div>
                  <p className="font-semibold text-slate-700">
                    {record.user.nome}
                  </p>

                  <p className="text-xs text-slate-400">
                    {record.user.cargo}
                  </p>
                </div>
              </td>

              {/* Ação */}
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