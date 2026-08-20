import { Activity, AlertOctagon, AlertTriangle } from "lucide-react";
import type { HealthStatus } from "../../types/vitalSigns";

type StatusFilter = HealthStatus | "all";

interface VitalSignsCardsProps {
  total: number;
  alert: number;
  critical: number;
  selectedStatus?: StatusFilter;
  onSelectStatus?: (status: StatusFilter) => void;
}

export function VitalSignsCards({
  total,
  alert,
  critical,
  selectedStatus = "all",
  onSelectStatus,
}: VitalSignsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {/* Total */}
      <button
        type="button"
        onClick={() => onSelectStatus?.("all")}
        className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
          selectedStatus === "all"
            ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            Total de Aferições
          </p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{total}</p>
        </div>
        <div className="p-3 bg-emerald-100/60 rounded-xl text-emerald-600">
          <Activity className="h-6 w-6" />
        </div>
      </button>

      {/* Alerta */}
      <button
        type="button"
        onClick={() => onSelectStatus?.("alerta")}
        className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
          selectedStatus === "alerta"
            ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-500/20 shadow-sm"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div>
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
            Atenção / Alerta
          </p>
          <p className="text-2xl font-bold text-amber-700 mt-1">{alert}</p>
        </div>
        <div className="p-3 bg-amber-100 rounded-xl text-amber-600">
          <AlertTriangle className="h-6 w-6" />
        </div>
      </button>

      {/* Crítico */}
      <button
        type="button"
        onClick={() => onSelectStatus?.("critico")}
        className={`flex items-center justify-between p-5 rounded-2xl border transition-all text-left ${
          selectedStatus === "critico"
            ? "border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/20 shadow-sm"
            : "border-slate-200 bg-white hover:border-slate-300"
        }`}
      >
        <div>
          <p className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
            Casos Críticos
          </p>
          <p className="text-2xl font-bold text-rose-700 mt-1">{critical}</p>
        </div>
        <div className="p-3 bg-rose-100 rounded-xl text-rose-600">
          <AlertOctagon className="h-6 w-6" />
        </div>
      </button>
    </div>
  );
}