import { useState } from "react";
import {
  Activity,
  ClipboardList,
  FileText,
  Pill,
  ShieldCheck,
  Users,
} from "lucide-react";

import { ReportCard } from "../../components/ReportCard";
import { exportReport } from "../../services/reports";


interface ReportItem {
  title: string;
  description: string;
  icon: typeof FileText;
  iconBgColor: string;
  iconColor: string;
  endpoint: string;
  fileName: string;
}

export function Relatorios() {
  const [loading, setLoading] = useState<string | null>(null);

  async function handleExport(
    endpoint: string,
    fileName: string
  ) {
    try {
      setLoading(fileName);

      await exportReport(endpoint, fileName);
    } catch (error) {
      console.error(error);
      alert("Não foi possível gerar o relatório.");
    } finally {
      setLoading(null);
    }
  }

  const reports: ReportItem[] = [
    {
      title: "Prontuário do Paciente",
      description:
        "Relatório completo contendo histórico clínico, documentos, medicações, sinais vitais e evoluções.",
      icon: FileText,
      iconBgColor: "bg-blue-100",
      iconColor: "text-blue-600",
      endpoint: "/patients/report",
      fileName: "Prontuario",
    },
    {
      title: "Pacientes",
      description:
        "Lista completa dos pacientes cadastrados.",
      icon: Users,
      iconBgColor: "bg-green-100",
      iconColor: "text-green-600",
      endpoint: "/reports/patients",
      fileName: "Pacientes",
    },
    {
      title: "Evoluções",
      description:
        "Histórico das evoluções realizadas pela equipe.",
      icon: ClipboardList,
      iconBgColor: "bg-purple-100",
      iconColor: "text-purple-600",
      endpoint: "/reports/evolutions",
      fileName: "Evolucoes",
    },
    {
      title: "Medicações",
      description:
        "Medicamentos prescritos e administrados.",
      icon: Pill,
      iconBgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      endpoint: "/reports/medications",
      fileName: "Medicacoes",
    },
    {
      title: "Sinais Vitais",
      description:
        "Pressão, temperatura, glicemia, frequência cardíaca e saturação.",
      icon: Activity,
      iconBgColor: "bg-red-100",
      iconColor: "text-red-600",
      endpoint: "/reports/vital-signs",
      fileName: "SinaisVitais",
    },
    {
      title: "Documentos",
      description:
        "Exportação dos documentos anexados aos pacientes.",
      icon: ShieldCheck,
      iconBgColor: "bg-cyan-100",
      iconColor: "text-cyan-600",
      endpoint: "/reports/documents",
      fileName: "Documentos",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Relatórios
        </h1>

        <p className="mt-2 text-slate-500">
          Gere e exporte relatórios em PDF para acompanhamento clínico,
          auditorias e gestão da instituição.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <ReportCard
            key={report.title}
            title={report.title}
            description={report.description}
            icon={report.icon}
            iconBgColor={report.iconBgColor}
            iconColor={report.iconColor}
            loading={loading === report.fileName}
            onExport={() =>
              handleExport(report.endpoint, report.fileName)
            }
          />
        ))}
      </div>
    </div>
  );
}