import { Search, RotateCcw } from "lucide-react";

import { AppointmentStatus } from "../../constants/appointmentStatus";

interface Props {
  search: string;
  status: string;
  startDate: string;
  endDate: string;

  onSearchChange(value: string): void;
  onStatusChange(value: string): void;
  onStartDateChange(value: string): void;
  onEndDateChange(value: string): void;
  onClear(): void;
}

export function AppointmentFilters({
  search,
  status,
  startDate,
  endDate,
  onSearchChange,
  onStatusChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-5 shadow">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {/* Pesquisa */}
        <div className="relative xl:col-span-2">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Pesquisar por título..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Todos os status</option>
          <option value={AppointmentStatus.AGENDADO}>Agendado</option>
          <option value={AppointmentStatus.REALIZADO}>Realizado</option>
          <option value={AppointmentStatus.CANCELADO}>Cancelado</option>
        </select>

        {/* Data inicial */}
        <input
          type="date"
          value={startDate}
          onChange={(e) => onStartDateChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Data final */}
        <input
          type="date"
          value={endDate}
          onChange={(e) => onEndDateChange(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Botão */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
        >
          <RotateCcw size={16} />
          Limpar filtros
        </button>
      </div>
    </div>
  );
}