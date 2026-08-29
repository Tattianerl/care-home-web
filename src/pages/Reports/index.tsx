
import { useState } from "react";
import {
  Users,
  ClipboardList,
  Pill,
  HeartPulse,
  FileText,
  ShieldCheck,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { AxiosError } from "axios";

import { ReportCard } from "../../components/reports/ReportCard";
import { exportReport } from "../../services/reports";

interface ReportItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  csvEndpoint: string;
  csvFilename: string;
  pdfEndpoint: string;
  pdfFilename: string;
}

export function Reports() {
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);

  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  async function handleExport(
    endpoint: string,
    filename: string,
  ) {
    setMensagem(null);
    setDownloadingKey(endpoint);

    try {
      const blob = await exportReport(endpoint);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMensagem({
        tipo: "sucesso",
        texto: `Relatório "${filename}" baixado com sucesso!`,
      });
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof AxiosError) {
        const mensagemErro =
          error.response?.data?.error ||
          "Erro ao gerar relatório. Tente novamente em instantes.";

        setMensagem({
          tipo: "erro",
          texto: mensagemErro,
        });
      } else {
        setMensagem({
          tipo: "erro",
          texto: "Erro inesperado ao exportar dados.",
        });
      }
    } finally {
      setDownloadingKey(null);
    }
  }

  const reports: ReportItem[] = [
    {
      title: "Residentes",
      description: "Lista completa dos residentes cadastrados no sistema.",
      icon: <Users className="h-5 w-5" />,
      csvEndpoint: "/reports/patients",
      csvFilename: "carehome_residentes.csv",
      pdfEndpoint: "/reports/patients/pdf",
      pdfFilename: "carehome_residentes.pdf",
    },
    {
      title: "Evoluções",
      description:
        "Histórico completo de evoluções e anotações de enfermagem.",
      icon: <ClipboardList className="h-5 w-5" />,
      csvEndpoint: "/reports/evolutions",
      csvFilename: "carehome_evolucoes.csv",
      pdfEndpoint: "/reports/evolutions/pdf",
      pdfFilename: "carehome_evolucoes.pdf",
    },
    {
      title: "Medicamentos",
      description:
        "Relação de medicamentos cadastrados e prescrições ativas.",
      icon: <Pill className="h-5 w-5" />,
      csvEndpoint: "/reports/medications",
      csvFilename: "carehome_medicamentos.csv",
      pdfEndpoint: "/reports/medications/pdf",
      pdfFilename: "carehome_medicamentos.pdf",
    },
    {
      title: "Sinais Vitais",
      description:
        "Registros de aferições e monitoramentos dos residentes.",
      icon: <HeartPulse className="h-5 w-5" />,
      csvEndpoint: "/reports/vital-signs",
      csvFilename: "carehome_sinais_vitais.csv",
      pdfEndpoint: "/reports/vitals/pdf",
      pdfFilename: "carehome_sinais_vitais.pdf",
    },
    {
      title: "Documentos",
      description:
        "Histórico de documentos e exames anexados ao prontuário.",
      icon: <FileText className="h-5 w-5" />,
      csvEndpoint: "/reports/documents",
      csvFilename: "carehome_documentos.csv",
      pdfEndpoint: "/reports/documents/pdf",
      pdfFilename: "carehome_documentos.pdf",
    },
    {
      title: "Auditoria",
      description:
        "Registro detalhado de acessos e modificações no sistema.",
      icon: <ShieldCheck className="h-5 w-5" />,
      csvEndpoint: "/reports/audit",
      csvFilename: "carehome_auditoria.csv",
      pdfEndpoint: "/reports/audit/pdf",
      pdfFilename: "carehome_auditoria.pdf",
    },
  ];

  return (
    <div className="max-w-7xl space-y-8 pb-10">
      {/* Cabeçalho da Página */}
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <FileSpreadsheet className="h-5 w-5" />
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Central de Relatórios
          </h1>

          <p className="mt-0.5 text-xs font-medium text-slate-500">
            Exporte os dados operacionais e clínicos em formato CSV ou
            relatório oficial.
          </p>
        </div>
      </header>

      {/* Banner de Feedback Visual */}
      {mensagem && (
        <div
          className={`flex items-start gap-3 rounded-xl border p-4 text-xs font-medium ${
            mensagem.tipo === "sucesso"
              ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
              : "border-rose-200 bg-rose-50/70 text-rose-800"
          }`}
        >
          {mensagem.tipo === "sucesso" ? (
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
          )}

          <span>{mensagem.texto}</span>
        </div>
      )}

      {/* Grid de Cards de Relatórios */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {reports.map((report) => (
          <ReportCard
            key={report.title}
            title={report.title}
            description={report.description}
            icon={report.icon}
            loadingCsv={downloadingKey === report.csvEndpoint}
            loadingPdf={downloadingKey === report.pdfEndpoint}
            onExportCsv={() =>
              handleExport(
                report.csvEndpoint,
                report.csvFilename,
              )
            }
            onExportPdf={() =>
              handleExport(
                report.pdfEndpoint,
                report.pdfFilename,
              )
            }
          />
        ))}
      </div>
    </div>
  );
}

