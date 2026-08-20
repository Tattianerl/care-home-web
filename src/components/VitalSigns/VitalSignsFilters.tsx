import { Search, Filter } from "lucide-react";

import type { HealthStatus } from "../../types/vitalSigns";

type StatusFilter = HealthStatus | "all";

interface VitalSignsFiltersProps {
  search: string;
  status: StatusFilter;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
}

export function VitalSignsFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
}: VitalSignsFiltersProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      {/* Pesquisa */}
      <div className="relative w-full sm:max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <input
          type="text"
          placeholder="Buscar residente..."
          value={search}
          onChange={(event) =>
            onSearchChange(event.target.value)
          }
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Filtro */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-400" />

        <select
          value={status}
          onChange={(event) =>
            onStatusChange(
              event.target.value as StatusFilter
            )
          }
          className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        >
          <option value="all">Todos</option>
          <option value="normal">Normal</option>
          <option value="alerta">Alerta</option>
          <option value="critico">Crítico</option>
        </select>
      </div>
    </div>
  );
}