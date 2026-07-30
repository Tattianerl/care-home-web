import {
  RotateCcw,
  Search,
} from "lucide-react";

interface Props {
  search: string;
  professional: string;
  startDate: string;
  endDate: string;

  onSearchChange(value: string): void;
  onProfessionalChange(value: string): void;
  onStartDateChange(value: string): void;
  onEndDateChange(value: string): void;
  onClear(): void;
}

export function EvolutionFilters({
  search,
  professional,
  startDate,
  endDate,
  onSearchChange,
  onProfessionalChange,
  onStartDateChange,
  onEndDateChange,
  onClear,
}: Props) {
  return (
    <div className="rounded-xl bg-white p-4 shadow">

      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">

        {/* Pesquisa */}

        <div className="relative md:col-span-2">

          <Search
            size={18}
            className="
              absolute
              left-3
              top-1/2
              -translate-y-1/2
              text-gray-400
            "
          />

          <input
            type="text"
            placeholder="Pesquisar evolução ou residente..."
            value={search}
            onChange={(e) =>
              onSearchChange(e.target.value)
            }
            className="
              w-full
              rounded-lg
              border
              border-gray-300
              py-2
              pl-10
              pr-4
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />

        </div>

        {/* Profissional */}

        <input
          type="text"
          placeholder="Profissional"
          value={professional}
          onChange={(e) =>
            onProfessionalChange(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            border-gray-300
            px-3
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
          "
        />

        {/* Data Inicial */}

        <input
          type="date"
          value={startDate}
          onChange={(e) =>
            onStartDateChange(
              e.target.value
            )
          }
          className="
            rounded-lg
            border
            border-gray-300
            px-3
            py-2
            focus:outline-none
            focus:ring-2
            focus:ring-emerald-500
          "
        />

        {/* Data Final + Limpar */}

        <div className="flex gap-2">

          <input
            type="date"
            value={endDate}
            onChange={(e) =>
              onEndDateChange(
                e.target.value
              )
            }
            className="
              flex-1
              rounded-lg
              border
              border-gray-300
              px-3
              py-2
              focus:outline-none
              focus:ring-2
              focus:ring-emerald-500
            "
          />

          <button
            type="button"
            onClick={onClear}
            title="Limpar filtros"
            className="
              rounded-lg
              border
              border-gray-300
              px-3
              hover:bg-gray-100
            "
          >
            <RotateCcw size={18} />
          </button>

        </div>

      </div>

    </div>
  );
}