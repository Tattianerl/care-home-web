import { useEffect, useState } from "react";
import {
  Download,
  Loader2,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import {
  getAuditLogs,
  getAuditSummary,
  exportAuditLogs,
} from "../../services/audit";

import type { AuditLog, AuditSummary } from "../../types/audit";

import { AuditCards } from "../../components/audit/AuditCards";
import { AuditFilters } from "../../components/audit/AuditFilters";
import { AuditTable } from "../../components/audit/AuditTable";

interface AuditFiltersState {
  usuario?: string;
  acao?: string;
  entidade?: string;
  startDate?: string;
  endDate?: string;
}

export function Audit() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [summary, setSummary] = useState<AuditSummary>({ total: 0 });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

  const [filters, setFilters] = useState<AuditFiltersState>({});
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchAuditData() {
      try {
        setLoading(true);
        setMensagem(null);

        const [response, summaryData] = await Promise.all([
          getAuditLogs({
            page,
            limit: 10,
            ...filters,
          }),
          getAuditSummary(),
        ]);

        if (isMounted) {
          setLogs(response.data || []);
          setTotalPages(response.totalPages || 1);
          setSummary(summaryData);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Erro ao carregar auditoria:", error);
          setMensagem({
            tipo: "erro",
            texto: "Não foi possível carregar os registros de auditoria.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchAuditData();

    return () => {
      isMounted = false;
    };
  }, [page, filters]);

  function handleFilter(data: AuditFiltersState) {
    setPage(1);
    setFilters(data);
  }

  function handleClearFilters() {
    setPage(1);
    setFilters({});
  }

  async function handleExport() {
    try {
      setExporting(true);
      setMensagem(null);

      const blob = await exportAuditLogs();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `carehome_auditoria_${new Date().toISOString().slice(0, 10)}.csv`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMensagem({
        tipo: "sucesso",
        texto: "Relatório de auditoria exportado com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao exportar auditoria:", error);
      setMensagem({
        tipo: "erro",
        texto: "Erro ao gerar arquivo CSV de auditoria.",
      });
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="max-w-7xl space-y-8 pb-10">
      {/* Cabeçalho da Página */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Auditoria do Sistema
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Rastreamento de ações, registros de segurança e histórico de alterações.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Exportando...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Exportar CSV</span>
            </>
          )}
        </button>
      </header>

      {/* Banner de Mensagens e Alertas */}
      {mensagem && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 text-xs font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
              : "border-rose-200 bg-rose-50/70 text-rose-800"
          }`}
        >
          {mensagem.tipo === "sucesso" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
          )}
          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Cards de Resumo */}
      <AuditCards summary={summary} />

      {/* Filtros de Pesquisa */}
      <AuditFilters onSearch={handleFilter} onClear={handleClearFilters} />

      {/* Tabela ou Indicador de Carregamento */}
      <div className="space-y-4">
        {loading && logs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200/80 bg-white p-12 text-slate-400 gap-3 shadow-xs">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Carregando registros de auditoria...</p>
          </div>
        ) : (
          <AuditTable logs={logs} />
        )}

        {/* Paginação */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200/80 pt-4">
            <span className="text-xs font-medium text-slate-500">
              Página <strong className="text-slate-800">{page}</strong> de{" "}
              <strong className="text-slate-800">{totalPages}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page === 1 || loading}
                onClick={() => setPage((prev) => prev - 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Anterior</span>
              </button>

              <button
                type="button"
                disabled={page === totalPages || loading}
                onClick={() => setPage((prev) => prev + 1)}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 transition-colors"
              >
                <span>Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}