import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardList } from "lucide-react";

import {
  deleteEvolution,
  getEvolutions,
} from "../../services/evolutions";

import type { Evolution } from "../../types/evolution";

import { EvolutionCard } from "../../components/evolutions/EvolutionCard";
import { EvolutionFilters } from "../../components/evolutions/EvolutionFilters";
import { EmptyEvolution } from "../../components/evolutions/EmptyEvolution";

import { useAuth } from "../../context/useAuth";
import { can } from "../../permissions/can";
import { Permissions } from "../../permissions/permissions";

export function EvolutionsToday() {
  const { user } = useAuth();

  const canDeleteEvolution = user
    ? can(user.cargo, Permissions.DELETE_EVOLUTION)
    : false;

  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        const data = await getEvolutions({
          today: true,
        });

        setEvolutions(data.evolutions || []);
      } catch (error) {
        console.error("Erro ao carregar evoluções de hoje:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadData();
  }, []);

  async function handleDelete(id: string) {
    if (!canDeleteEvolution) return;

    const confirmed = window.confirm(
      "Deseja realmente excluir esta evolução?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);

      await deleteEvolution(id);

      setEvolutions((current) =>
        current.filter((evolution) => evolution.id !== id)
      );
    } catch (error) {
      console.error("Erro ao excluir evolução:", error);
    } finally {
      setDeletingId(null);
    }
  }

  const filteredEvolutions = useMemo(() => {
    const term = search.toLowerCase().trim();

    if (!term) {
      return evolutions;
    }

    return evolutions.filter((item) => {
      return (
        item.patient.nome.toLowerCase().includes(term) ||
        item.user.nome.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term)
      );
    });
  }, [evolutions, search]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-purple-600" size={28} />

          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Evoluções de Hoje
            </h1>

            <p className="text-sm text-gray-500">
              Acompanhe as evoluções registradas hoje.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ClipboardList size={18} />
          <span>
            {filteredEvolutions.length}{" "}
            {filteredEvolutions.length === 1
              ? "evolução"
              : "evoluções"}
          </span>
        </div>
      </div>

      <EvolutionFilters
        search={search}
        professional=""
        startDate=""
        endDate=""
        professionalsList={[]}
        onSearchChange={setSearch}
        onProfessionalChange={() => {}}
        onStartDateChange={() => {}}
        onEndDateChange={() => {}}
        onClear={() => setSearch("")}
      />

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <div className="h-5 w-5 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
            Carregando evoluções...
          </div>
        </div>
      ) : filteredEvolutions.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 text-gray-500">
          <EmptyEvolution />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvolutions.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              deleting={deletingId === evolution.id}
              onDelete={
                canDeleteEvolution
                  ? handleDelete
                  : () => {}
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
