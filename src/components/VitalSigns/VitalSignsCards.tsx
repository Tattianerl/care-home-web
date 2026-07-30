import {
  Activity,
  AlertTriangle,
} from "lucide-react";

interface VitalSignsCardsProps {
  total: number;
  alert: number;
  critical: number;
}

export function VitalSignsCards({
  total,
  alert,
  critical,
}: VitalSignsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Aferições
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <Activity className="h-4 w-4" />
          </div>
        </div>

        <p className="mt-2 text-2xl font-bold text-slate-900">
          {total}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          Registros encontrados
        </p>
      </div>

      {/* Alerta */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
            Em Alerta
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>

        <p className="mt-2 text-2xl font-bold text-amber-900">
          {alert}
        </p>

        <p className="mt-1 text-xs text-amber-700">
          Necessitam acompanhamento
        </p>
      </div>

      {/* Crítico */}
      <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-700">
            Crítico
          </span>

          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
            <AlertTriangle className="h-4 w-4" />
          </div>
        </div>

        <p className="mt-2 text-2xl font-bold text-rose-900">
          {critical}
        </p>

        <p className="mt-1 text-xs text-rose-700">
          Requer intervenção imediata
        </p>
      </div>
    </div>
  );
}