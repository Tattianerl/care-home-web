import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  FileSignature,
} from "lucide-react";
import { AxiosError } from "axios";

import { ReportCard } from "../../components/reports/ReportCard";
import { exportReport } from "../../services/reports";
import { useAuth } from "../../context/useAuth";

interface ReportItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  csvEndpoint: string;
  csvFilename: string;
  pdfEndpoint: string;
  pdfFilename: string;
  requiresSignature?: boolean;
}

export function Reports() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  async function handleExport(
    endpoint: string,
    filename: string,
    requiresSignature = false,
    
  ) {
    setMensagem(null);

    // Validação de segurança para assinaturas em relatórios clínicos
    if (requiresSignature && !user?.assinatura) {
      setShowSignatureModal(true);
      return;
    }

    setDownloadingKey(endpoint);

    try {
      const blob = await exportReport(endpoint);

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Limpeza de recursos
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
        setMensagem({ tipo: "erro", texto: mensagemErro });
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
      requiresSignature: false,
    },
    {
      title: "Evoluções",
      description: "Histórico completo de evoluções e anotações de enfermagem.",
      icon: <ClipboardList className="h-5 w-5" />,
      csvEndpoint: "/reports/evolutions",
      csvFilename: "carehome_evolucoes.csv",
      pdfEndpoint: "/reports/evolutions/pdf",
      pdfFilename: "carehome_evolucoes.pdf",
      requiresSignature: true,
    },
    {
      title: "Medicamentos",
      description: "Relação de medicamentos cadastrados e prescrições ativas.",
      icon: <Pill className="h-5 w-5" />,
      csvEndpoint: "/reports/medications",
      csvFilename: "carehome_medicamentos.csv",
      pdfEndpoint: "/reports/medications/pdf",
      pdfFilename: "carehome_medicamentos.pdf",
      requiresSignature: false,
    },
    {
      title: "Sinais Vitais",
      description: "Registros de afeições e monitoramentos dos residentes.",
      icon: <HeartPulse className="h-5 w-5" />,
      csvEndpoint: "/reports/vital-signs",
      csvFilename: "carehome_sinais_vitais.csv",
      pdfEndpoint: "/reports/vitals/pdf",
      pdfFilename: "carehome_sinais_vitais.pdf",
      requiresSignature: false,
    },
    {
      title: "Documentos",
      description: "Histórico de documentos e exames anexados ao prontuário.",
      icon: <FileText className="h-5 w-5" />,
      csvEndpoint: "/reports/documents",
      csvFilename: "carehome_documentos.csv",
      pdfEndpoint: "/reports/documents/pdf",
      pdfFilename: "carehome_documentos.pdf",
      requiresSignature: false,
    },
    {
      title: "Auditoria",
      description: "Registro detalhado de acessos e modificações no sistema.",
      icon: <ShieldCheck className="h-5 w-5" />,
      csvEndpoint: "/reports/audit",
      csvFilename: "carehome_auditoria.csv",
      pdfEndpoint: "/reports/audit/pdf",
      pdfFilename: "carehome_auditoria.pdf",
      requiresSignature: false,
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
            Exporte os dados operacionais e clínicos em formato CSV ou relatório oficial.
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
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
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
                report.requiresSignature,
                
              )
            }
            onExportPdf={() =>
              handleExport(
                report.pdfEndpoint,
                report.pdfFilename,
                report.requiresSignature,
                
              )
            }
          />
        ))}
      </div>

      {/* Modal de Trava de Assinatura */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 shrink-0">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assinatura Digital Necessária
                </h3>
                <p className="text-xs text-slate-500">
                  Exportação de relatório clínico
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Para exportar o relatório de evoluções clínicas, você precisa ter uma assinatura digital/rubrica cadastrada no seu perfil.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSignatureModal(false);
                  navigate("/assinatura");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <FileSignature className="h-4 w-4" />
                <span>Cadastrar Assinatura</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}