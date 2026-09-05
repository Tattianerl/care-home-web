import { useEffect, useMemo, useState, useCallback } from "react";
import { FileText, Loader2, ArrowLeft, Plus } from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";

import {
  deleteEvolution,
  getPatientEvolutions,
} from "../../services/evolutions";
import { api } from "../../services/api";

import type { Evolution } from "../../types/evolution";

import { EvolutionCard } from "../../components/evolutions/EvolutionCard";
import { EvolutionFilters } from "../../components/evolutions/EvolutionFilters";
import { EmptyEvolution } from "../../components/evolutions/EmptyEvolution";

// 👇 Importando autenticação e roles
import { useAuth } from "../../context/useAuth";
import { Roles } from "../../permissions/roles";

interface Professional {
  id: string;
  nome: string;
}

export function PatientEvolutions() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 👇 Apenas equipe clínica, coordenação e serviço social podem criar/excluir evoluções
  const canManageEvolutions = user
    ? ([Roles.COORDENADOR, Roles.MEDICO, Roles.ENFERMEIRO, Roles.ASSISTENTE_SOCIAL] as string[]).includes(user.cargo)
    : false;

  const [patientName, setPatientName] = useState("");
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [professionalsList, setProfessionalsList] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Filtros
  const [search, setSearch] = useState("");
  const [professional, setProfessional] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      // Busca paralela: Evoluções do Paciente + Lista de Usuários/Profissionais
      const [patientRes, usersRes] = await Promise.all([
        getPatientEvolutions(id),
        api.get("/users").catch(() => ({ data: [] })),
      ]);

      setPatientName(patientRes.patient.nome);
      setEvolutions(patientRes.evolutions || []);

      if (usersRes.data && usersRes.data.length > 0) {
        setProfessionalsList(usersRes.data);
      } else {
        const map = new Map<string, Professional>();
        (patientRes.evolutions || []).forEach((item) => {
          if (!map.has(item.user.id)) {
            map.set(item.user.id, { id: item.user.id, nome: item.user.nome });
          }
        });
        setProfessionalsList(Array.from(map.values()));
      }
    } catch (error) {
      console.error("Erro ao carregar dados das evoluções do residente:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleDelete(evolutionId: string) {
    if (!canManageEvolutions) return;

    const confirmed = window.confirm("Deseja excluir esta evolução?");
    if (!confirmed) return;

    try {
      await deleteEvolution(evolutionId);
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

  // Filtragem completa e em tempo real dos cards de evolução
  const filteredEvolutions = useMemo(() => {
    return evolutions.filter((item) => {
      // 1. Busca textual (Paciente, Descrição ou Profissional)
      const term = search.toLowerCase();
      const matchesSearch =
        !term ||
        item.patient.nome.toLowerCase().includes(term) ||
        item.descricao.toLowerCase().includes(term) ||
        item.user.nome.toLowerCase().includes(term);

      // 2. Filtro por Profissional
      const matchesProfessional =
        !professional || item.user.id === professional;

      // 3. Filtro por Período de Datas
      const itemDate = new Date(item.createdAt).getTime();
      const start = startDate ? new Date(`${startDate}T00:00:00`).getTime() : null;
      const end = endDate ? new Date(`${endDate}T23:59:59`).getTime() : null;

      const matchesStartDate = !start || itemDate >= start;
      const matchesEndDate = !end || itemDate <= end;

      return (
        matchesSearch &&
        matchesProfessional &&
        matchesStartDate &&
        matchesEndDate
      );
    });
  }, [evolutions, search, professional, startDate, endDate]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Cabeçalho com navegação e ação */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              {/* Ícone Roxo mantido para dar identidade ao módulo clínico/evoluções */}
              <FileText className="text-purple-600" />
              Evoluções do Residente
            </h1>
            <p className="text-sm text-gray-500">
              {patientName ? `Residente: ${patientName}` : "Carregando paciente..."}
            </p>
          </div>
        </div>

        {/* 👇 Botão de Nova Evolução exibido apenas para perfis autorizados */}
        {canManageEvolutions && (
          <Link
            to={`/patients/${id}/evolutions/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus size={18} />
            Nova Evolução
          </Link>
        )}
      </div>

      {/* Barra de Filtros Refinada */}
      <EvolutionFilters
        search={search}
        professional={professional}
        startDate={startDate}
        endDate={endDate}
        professionalsList={professionalsList}
        onSearchChange={setSearch}
        onProfessionalChange={setProfessional}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        onClear={clearFilters}
      />

      {/* Conteúdo da Lista */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="flex items-center gap-3 text-sm text-gray-500">
            <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
            Carregando evoluções...
          </div>
        </div>
      ) : filteredEvolutions.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-gray-100 text-gray-500">
          {evolutions.length === 0 ? (
            <EmptyEvolution />
          ) : (
            "Nenhuma evolução encontrada com os filtros selecionados."
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredEvolutions.map((evolution) => (
            <EvolutionCard
              key={evolution.id}
              evolution={evolution}
              deleting={false}
              onDelete={canManageEvolutions ? handleDelete : () => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
}