import type { ReactNode } from "react";
import { FileText, Table, Loader2 } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  loadingPdf?: boolean;
  loadingCsv?: boolean;
  onExportPdf: () => void;
  onExportCsv: () => void;
}

export function ReportCard({
  title,
  description,
  icon,
  loadingPdf = false,
  loadingCsv = false,
  onExportPdf,
  onExportCsv,
}: ReportCardProps) {
  const isAnyLoading = loadingPdf || loadingCsv;

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs transition-all hover:border-slate-300 hover:shadow-md">
      <div>
        {/* Cabeçalho do Card */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
            {icon}
          </div>
          <h2 className="text-base font-bold text-slate-900 leading-snug">
            {title}
          </h2>
        </div>

        {/* Descrição */}
        <p className="text-xs text-slate-500 leading-relaxed mb-6">
          {description}
        </p>
      </div>

      {/* Botões de Exportação (PDF e CSV) */}
      <div className="grid grid-cols-2 gap-2">
        {/* Botão PDF */}
        <button
          type="button"
          onClick={onExportPdf}
          disabled={isAnyLoading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3 py-2.5 text-xs font-semibold text-rose-700 transition-all hover:bg-rose-100 hover:border-rose-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingPdf ? (
            <Loader2 className="h-4 w-4 animate-spin text-rose-600" />
          ) : (
            <FileText className="h-4 w-4 text-rose-600" />
          )}
          <span>PDF</span>
        </button>

        {/* Botão CSV */}
        <button
          type="button"
          onClick={onExportCsv}
          disabled={isAnyLoading}
          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/50 px-3 py-2.5 text-xs font-semibold text-emerald-700 transition-all hover:bg-emerald-100 hover:border-emerald-300 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loadingCsv ? (
            <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          ) : (
            <Table className="h-4 w-4 text-emerald-600" />
          )}
          <span>CSV</span>
        </button>
      </div>
    </div>
  );
}