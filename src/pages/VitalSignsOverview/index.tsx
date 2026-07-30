import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
  Plus,
} from "lucide-react";

import { getVitalSigns } from "../../services/vitalSigns";

import type {
  VitalSignsOverviewItem,
} from "../../types/vitalSigns";

import { VitalSignsCards } from "../../components/VitalSigns/VitalSignsCards";
import { VitalSignsFilters } from "../../components/VitalSigns/VitalSignsFilters";
import { VitalSignsTable } from "../../components/VitalSigns/VitalSignsTable";

export function VitalSignsOverview() {
  const [records, setRecords] = useState<VitalSignsOverviewItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");


  const loadVitalSigns = useCallback(async () => {
  try {
    setLoading(true);

    const data = await getVitalSigns({
      search: search || undefined,
      status: status === "all" ? undefined : status,
    });

    setRecords(data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
}, [search, status]);

  useEffect(() => {
    loadVitalSigns();
  }, [loadVitalSigns]);

  const indicators = useMemo(() => {
    return {
      total: records.length,

      alert: records.filter(
        (record) => record.status === "alerta"
      ).length,

      critical: records.filter(
        (record) => record.status === "critico"
      ).length,
    };
  }, [records]);

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando sinais vitais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">

      {/* Cabeçalho */}

      <header className="space-y-3">

        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para Dashboard</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Monitoramento de Sinais Vitais
            </h1>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Acompanhamento geral das aferições registradas.
            </p>

          </div>

          <Link
            to="/patients"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Registro</span>
          </Link>

        </div>

      </header>

      {/* Cards */}

      <VitalSignsCards
        total={indicators.total}
        alert={indicators.alert}
        critical={indicators.critical}
      />

      {/* Conteúdo */}

      <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">

        <VitalSignsFilters
          search={search}
          status={status}
          onSearchChange={setSearch}
          onStatusChange={setStatus}
        />

        <VitalSignsTable
          records={records}
        />

      </section>
          </div>
  );
}