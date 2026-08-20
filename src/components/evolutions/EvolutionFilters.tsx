
import { Search, RotateCcw } from "lucide-react";

interface Professional {
  id: string;
  nome: string;
}

interface EvolutionFiltersProps {
  search: string;
  professional: string;
  startDate: string;
  endDate: string;
  professionalsList: Professional[];
  onSearchChange: (value: string) => void;
  onProfessionalChange: (value: string) => void;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onClear: () => void;
}

export function EvolutionFilters({
  search,
  professional,
  startDate,
  endDate,
  professionalsList = [],
  onSearchChange,
  onProfessionalChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: EvolutionFiltersProps) {
  const hasActiveFilters = Boolean(
    search || professional || startDate || endDate
  );

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm space-y-3 lg:space-y-0 lg:flex lg:items-center lg:gap-3 flex-wrap">
      {/* Campo de Busca por Texto */}
      <div className="relative flex-1 min-w-[240px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Buscar por paciente, descrição..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
      </div>

      {/* Select de Profissional */}
      <div className="w-full sm:w-56">
        <select
          value={professional}
          onChange={(e) => onProfessionalChange(e.target.value)}
          className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Todos os profissionais</option>
          {professionalsList.map((prof) => (
            <option key={prof.id} value={prof.id}>
              {prof.nome}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs de Período de Datas */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="relative flex-1 sm:w-36">
          <input
            type="date"
            title="Data Início"
            value={startDate}
            onChange={(e) => onStartDateChange(e.target.value)}
            className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <span className="text-gray-400 text-xs font-medium">até</span>
        <div className="relative flex-1 sm:w-36">
          <input
            type="date"
            title="Data Fim"
            value={endDate}
            onChange={(e) => onEndDateChange(e.target.value)}
            className="w-full py-2 px-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Botão para Limpar Filtros */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 px-3 py-2 rounded-lg transition-colors border border-gray-200 hover:border-red-200 shrink-0"
          title="Limpar todos os filtros"
        >
          <RotateCcw size={14} />
          Limpar
        </button>
      )}
    </div>
  );
}