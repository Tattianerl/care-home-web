import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, RefreshCw } from "lucide-react";

import { getVitalSigns } from "../../services/vitalSigns";

import type {
  HealthStatus,
  VitalSignsOverviewItem,
} from "../../types/vitalSigns";

import { VitalSignsCards } from "../../components/VitalSigns/VitalSignsCards";
import { VitalSignsFilters } from "../../components/VitalSigns/VitalSignsFilters";
import { VitalSignsTable } from "../../components/VitalSigns/VitalSignsTable";

type StatusFilter = HealthStatus | "all";

interface VitalSignsSummary {
  total: number;
  alert: number;
  critical: number;
}

export function VitalSignsOverview() {
  const [records, setRecords] = useState<VitalSignsOverviewItem[]>([]);

  const [summary, setSummary] = useState<VitalSignsSummary>({
    total: 0,
    alert: 0,
    critical: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filtros
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [status, setStatus] = useState<StatusFilter>("all");

  /*
   * Debounce da pesquisa.
   * Evita fazer uma requisição a cada tecla digitada.
   */
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  /*
   * Carrega o resumo geral dos sinais vitais.
   *
   * O resumo não respeita os filtros da tabela,
   * pois representa o panorama geral.
   */
  const loadSummary = useCallback(async () => {
    try {
      const data = await getVitalSigns();

      setSummary({
        total: data.length,
        alert: data.filter((item) => item.status === "alerta").length,
        critical: data.filter((item) => item.status === "critico").length,
      });
    } catch (error) {
      console.error(
        "Erro ao carregar o resumo dos sinais vitais:",
        error
      );
    }
  }, []);

  /*
   * Carrega os registros da tabela respeitando
   * os filtros atuais.
   */
  const loadVitalSigns = useCallback(
    async (initial = false) => {
      try {
        if (initial) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        const data = await getVitalSigns({
          search: debouncedSearch || undefined,
          status: status === "all" ? undefined : status,
        });

        setRecords(data);
      } catch (error) {
        console.error(
          "Erro ao carregar sinais vitais:",
          error
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [debouncedSearch, status]
  );

  /*
   * Carregamento inicial.
   */
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);

        await Promise.all([
          loadVitalSigns(true),
          loadSummary(),
        ]);
      } finally {
        setLoading(false);
      }
    }

    loadInitialData();
  }, [loadVitalSigns, loadSummary]);

  /*
   * Atualiza a tabela quando os filtros mudam.
   *
   * Não executamos essa busca durante o primeiro carregamento
   * porque loadInitialData já faz isso.
   */
  const [initialLoaded, setInitialLoaded] = useState(false);

  useEffect(() => {
    if (!initialLoaded) {
      return;
    }

    loadVitalSigns(false);
  }, [debouncedSearch, status, initialLoaded, loadVitalSigns]);

  /*
   * Marca que o primeiro carregamento terminou.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoaded(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  /*
   * Atualização manual.
   */
  const handleManualRefresh = async () => {
    try {
      setRefreshing(true);

      await Promise.all([
        loadVitalSigns(false),
        loadSummary(),
      ]);
    } catch (error) {
      console.error(
        "Erro ao atualizar sinais vitais:",
        error
      );
    } finally {
      setRefreshing(false);
    }
  };

  /*
   * Clique nos cards.
   */
  const handleCardClick = (selectedStatus: StatusFilter) => {
    if (selectedStatus === "all") {
      setStatus("all");
      return;
    }

    setStatus((current) =>
      current === selectedStatus
        ? "all"
        : selectedStatus
    );
  };

  /*
   * Carregamento inicial.
   */
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />

          <span>
            Carregando dados de sinais vitais...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Cabeçalho */}
      <header className="space-y-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />

          Voltar para Dashboard
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Monitoramento de Sinais Vitais
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Acompanhamento centralizado das aferições dos
              residentes.
            </p>
          </div>

          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:text-emerald-600 disabled:cursor-not-allowed disabled:opacity-50"
            title="Atualizar listagem"
          >
            <RefreshCw
              className={`h-4 w-4 ${
                refreshing
                  ? "animate-spin text-emerald-600"
                  : ""
              }`}
            />

            <span>
              {refreshing
                ? "Atualizando..."
                : "Atualizar"}
            </span>
          </button>
        </div>
      </header>

      {/* Cards */}
      <VitalSignsCards
        total={summary.total}
        alert={summary.alert}
        critical={summary.critical}
        selectedStatus={status}
        onSelectStatus={handleCardClick}
      />

      {/* Tabela */}
      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <VitalSignsFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        <VitalSignsTable records={records} />
      </section>
    </div>
  );
}