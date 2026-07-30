import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  FileText,
  Loader2,
} from "lucide-react";

import {
  deleteEvolution,
  getEvolutions,
} from "../../services/evolutions";

import type {
  Evolution,
} from "../../types/evolution";

import { EvolutionCard } from "../../components/evolutions/EvolutionCard";
import { EvolutionFilters } from "../../components/evolutions/EvolutionFilters";
import { EmptyEvolution } from "../../components/evolutions/EmptyEvolution";

export function EvolutionsToday() {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [professional, setProfessional] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadEvolutions = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getEvolutions({
        today: true,
        professional: professional || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      setEvolutions(response.evolutions);
    } catch (error) {
      console.error("Erro ao carregar evoluções:", error);
    } finally {
      setLoading(false);
    }
  }, [
    professional,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    void loadEvolutions();
  }, [loadEvolutions]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Deseja excluir esta evolução?"
    );

    if (!confirmed) return;

    try {
      await deleteEvolution(id);
      await loadEvolutions();
    } catch (error) {
      console.error(error);
    }
  }

  function clearFilters() {
    setSearch("");
    setProfessional("");
    setStartDate("");
    setEndDate("");
  }

  const filtered = useMemo(() => {
    const term = search.toLowerCase();

    return evolutions.filter((item) => {
      return (
        item.patient.nome
          .toLowerCase()
          .includes(term) ||

        item.descricao
          .toLowerCase()
          .includes(term) ||

        item.user.nome
          .toLowerCase()
          .includes(term)
      );
    });
  }, [
    evolutions,
    search,
  ]);

  return (
    <div className="space-y-6">

      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <FileText className="text-emerald-600" />
          Evoluções de Hoje
        </h1>

        <p className="mt-1 text-slate-500">
          Visualize todas as evoluções registradas hoje.
        </p>
      </div>

      <EvolutionFilters
        search={search}
        professional={professional}
        startDate={startDate}
        endDate={endDate}
        onSearchChange={setSearch}
        onProfessionalChange={setProfessional}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={clearFilters}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            Carregando evoluções...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyEvolution />
      ) : (
        <div className="space-y-4">
          {filtered.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              deleting={false}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

    </div>
  );
}