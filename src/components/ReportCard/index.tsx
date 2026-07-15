import type { LucideIcon } from "lucide-react";
import { Download } from "lucide-react";

interface ReportCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  iconColor: string;
  loading: boolean;
  onExport: () => void;
}

export function ReportCard({
  title,
  description,
  icon: Icon,
  iconBgColor,
  iconColor,
  loading,
  onExport,
}: ReportCardProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgColor}`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>

        <h2 className="mt-4 text-lg font-semibold text-slate-800">
          {title}
        </h2>

        <p className="mt-2 text-sm text-slate-500 leading-relaxed">
          {description}
        </p>
      </div>

      <button
        onClick={onExport}
        disabled={loading}
        className="
          mt-6
          flex
          items-center
          justify-center
          gap-2
          rounded-lg
          bg-blue-600
          px-4
          py-3
          text-white
          font-medium
          transition-colors
          hover:bg-blue-700
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        <Download size={18} />

        {loading ? "Gerando relatório..." : "Exportar PDF"}
      </button>
    </div>
  );
}