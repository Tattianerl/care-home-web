import { useCallback, useEffect, useMemo, useState } from "react";
import { FileText, Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { deleteEvolution, getEvolutions } from "../../services/evolutions";
import { api } from "../../services/api";

import type { Evolution } from "../../types/evolution";

import { EvolutionCard } from "../../components/evolutions/EvolutionCard";
import { EvolutionFilters } from "../../components/evolutions/EvolutionFilters";
import { EmptyEvolution } from "../../components/evolutions/EmptyEvolution";

interface Professional {
  id: string;
  nome: string;
  cargo?: string;
}

export function EvolutionsToday() {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [search, setSearch] = useState("");
  const [professional, setProfessional] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const hasCustomDate = Boolean(startDate || endDate);

      // Busca evoluções respeitando apenas a data no backend (deixando a busca por usuário/cargo dinâmica)
      const evolutionsPromise = getEvolutions({
        today: hasCustomDate ? undefined : true,
        professional: professional || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      });

      const usersPromise = api.get("/users").catch((err) => {
        console.warn("Falha ao carregar lista de profissionais:", err);
        return { data: [] };
      });

      const [evolutionsRes, usersRes] = await Promise.all([
        evolutionsPromise,
        usersPromise,
      ]);

      const evolutionsData = Array.isArray(evolutionsRes)
        ? evolutionsRes
        : evolutionsRes?.evolutions || [];

      setEvolutions(evolutionsData);

      if (usersRes?.data && Array.isArray(usersRes.data)) {
        setProfessionals(usersRes.data);
      }
    } catch (error) {
      console.error("Erro ao carregar evoluções:", error);
    } finally {
      setLoading(false);
    }
  }, [professional, startDate, endDate]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Deseja excluir esta evolução?");
    if (!confirmed) return;

    try {
      await deleteEvolution(id);
      await loadData();
    } catch (error) {
      console.error("Erro ao excluir evolução:", error);
    }
  }

  function clearFilters() {
    setSearch("");
    setProfessional("");
    setStartDate("");
    setEndDate("");
  }

  // Filtragem local multi-critério (Paciente, Descrição, Usuário, ID e Cargo)
  const filtered = useMemo(() => {
    return evolutions.filter((item) => {
      const term = search.toLowerCase().trim();
      const selectedProf = professional.trim();

      const userName = item.user?.nome || "";
      const userCargo = item.user?.cargo || "";
      const patientName = item.patient?.nome || "";
      const description = item.descricao || "";
      const userId = String(item.user?.id || "");

      // 1. Busca por Texto Aberto (digitação no input search)
      const matchesSearch =
        !term ||
        patientName.toLowerCase().includes(term) ||
        description.toLowerCase().includes(term) ||
        userName.toLowerCase().includes(term) ||
        userCargo.toLowerCase().includes(term);

      // 2. Filtro de Profissional selecionado no Select (compara por ID, Nome ou Cargo)
      const matchesProfessional =
        !selectedProf ||
        userId === selectedProf ||
        userName.toLowerCase() === selectedProf.toLowerCase() ||
        userCargo.toLowerCase() === selectedProf.toLowerCase();

      return matchesSearch && matchesProfessional;
    });
  }, [evolutions, search, professional]);

  const isCustomPeriod = Boolean(startDate || endDate);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
            title="Voltar"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-purple-600" />
              {isCustomPeriod ? "Evoluções Registradas" : "Evoluções de Hoje"}
            </h1>
            <p className="text-sm text-gray-500">
              {isCustomPeriod
                ? "Exibindo evoluções filtradas pelo período selecionado."
                : "Visualize e gerencie todas as evoluções registradas na data de hoje."}
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Filtros */}
      <EvolutionFilters
        search={search}
        professional={professional}
        startDate={startDate}
        endDate={endDate}
        professionalsList={professionals}
        onSearchChange={setSearch}
        onProfessionalChange={setProfessional}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={clearFilters}
      />

      {/* Lista de Resultados */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            Carregando evoluções...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 text-gray-500">
          {evolutions.length === 0 ? (
            <EmptyEvolution />
          ) : (
            "Nenhum resultado encontrado para os filtros aplicados."
          )}
        </div>
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