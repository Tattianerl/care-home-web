import {  useEffect, useMemo, useState } from "react";
import { FileText, Loader2 } from "lucide-react";
import { EvolutionCard } from "../../components/evolutions/EvolutionCard";
import { EvolutionFilters } from "../../components/evolutions/EvolutionFilters";
import { EmptyEvolution } from "../../components/evolutions/EmptyEvolution";

import {
  deleteEvolution,
  getEvolutions,
} from "../../services/evolutions";

import type { Evolution } from "../../types/evolution";

export function Evolutions() {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [professional, setProfessional] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  

  useEffect(() => {
  let cancelled = false;

  async function load() {
    try {
      setLoading(true);

      const response = await getEvolutions({
        professional: professional || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      if (cancelled) return;

      setEvolutions(response.evolutions);
    } catch (error) {
      console.error(error);
    } finally {
      if (!cancelled) {
        setLoading(false);
      }
    }
  }

  void load();

  return () => {
    cancelled = true;
  };
}, [professional, startDate, endDate]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Deseja excluir esta evolução?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteEvolution(id);

      setEvolutions((old) =>
        old.filter((item) => item.id !== id)
      );
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir evolução.");
    } finally {
      setDeletingId(null);
    }
  }

  function clearFilters() {
    setSearch("");
    setProfessional("");
    setStartDate("");
    setEndDate("");
  }

  const filteredEvolutions = useMemo(() => {
    const term = search.toLowerCase();

    return evolutions.filter(
      (item) =>
        item.patient.nome
          .toLowerCase()
          .includes(term) ||
        item.descricao
          .toLowerCase()
          .includes(term)
    );
  }, [evolutions, search]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
  <FileText className="h-7 w-7 text-emerald-600" />

  <div>
    <h1 className="text-3xl font-bold">
      Todas as Evoluções
    </h1>

    <p className="mt-1 text-sm text-slate-500">
      Histórico completo das evoluções registradas.
    </p>
  </div>
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
        <div className="flex justify-center py-10">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : filteredEvolutions.length === 0 ? (
        <EmptyEvolution />
      ) : (
        <div className="space-y-4">
          {filteredEvolutions.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              deleting={deletingId === evolution.id}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}