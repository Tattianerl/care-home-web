import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isAxiosError } from "axios";

import {
  ArrowLeft,
  Folder,
  FileText,
  Plus,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
} from "lucide-react";

import {
  deleteDocument,
  downloadDocument,
  getPatientDocuments,
} from "../../services/documents";

import type { PatientDocument } from "../../types/patientDocument";

interface Feedback {
  tipo: "sucesso" | "erro";
  texto: string;
}

const DOCUMENT_TYPE_LABELS: Record<
  PatientDocument["tipo"],
  string
> = {
  RECEITA: "Receita",
  EXAME: "Exame",
  CONTRATO: "Contrato",
  IDENTIDADE: "Documento de Identidade",
  FOTO: "Foto",
  EVOLUCAO: "Evolução",
  OUTRO: "Outro",
};

function formatDocumentDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Data não informada";
  }

  return parsedDate.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function PatientDocuments() {
  const { id } = useParams<{ id: string }>();

  const [documents, setDocuments] = useState<PatientDocument[]>([]);

  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [mensagem, setMensagem] = useState<Feedback | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      if (!id) {
        setLoading(false);

        setMensagem({
          tipo: "erro",
          texto: "Identificador do residente não encontrado.",
        });

        return;
      }

      try {
        setLoading(true);
        setMensagem(null);

        const data = await getPatientDocuments(id);

        setDocuments(data);
      } catch (error: unknown) {
        console.error("Erro ao carregar documentos:", error);

        const texto = isAxiosError(error)
          ? error.response?.data?.error ??
            error.response?.data?.message ??
            "Erro ao carregar a lista de documentos."
          : "Erro inesperado ao carregar os documentos.";

        setMensagem({
          tipo: "erro",
          texto,
        });
      } finally {
        setLoading(false);
      }
    }

    void loadDocuments();
  }, [id]);

  async function handleDownload(documentId: string) {
    try {
      setMensagem(null);
      setDownloadingId(documentId);

      await downloadDocument(documentId);
    } catch (error: unknown) {
      console.error("Erro ao baixar documento:", error);

      const texto = isAxiosError(error)
        ? error.response?.data?.error ??
          error.response?.data?.message ??
          "Não foi possível baixar o documento."
        : "Não foi possível baixar o documento.";

      setMensagem({
        tipo: "erro",
        texto,
      });
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(documentId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este documento? Esta ação não poderá ser desfeita."
    );

    if (!confirmed) {
      return;
    }

    try {
      setMensagem(null);
      setDeletingId(documentId);

      await deleteDocument(documentId);

      setDocuments((previous) =>
        previous.filter((document) => document.id !== documentId)
      );

      setMensagem({
        tipo: "sucesso",
        texto: "Documento excluído com sucesso.",
      });
    } catch (error: unknown) {
      console.error("Erro ao excluir documento:", error);

      const texto = isAxiosError(error)
        ? error.response?.data?.error ??
          error.response?.data?.message ??
          "Erro ao tentar excluir o documento."
        : "Erro inesperado ao excluir o documento.";

      setMensagem({
        tipo: "erro",
        texto,
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      {/* Cabeçalho */}
      <header className="space-y-3">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />

          <span>Voltar para perfil do residente</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
              <Folder className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                Documentos do Residente
              </h1>

              <p className="mt-0.5 text-xs font-medium text-slate-500">
                Gerencie exames, laudos e arquivos anexados ao prontuário.
              </p>
            </div>
          </div>

          <Link
            to={`/patients/${id}/documents/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Documento</span>
          </Link>
        </div>
      </header>

      {/* Feedback */}
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

      {/* Lista */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 p-12 text-slate-400">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />

            <p className="text-xs font-medium">
              Carregando documentos...
            </p>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FileText className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-bold text-slate-800">
              Nenhum documento encontrado
            </h3>

            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Ainda não existem arquivos anexados para este residente.
              Clique no botão acima para adicionar.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {documents.map((document) => {
              const isDownloading =
                downloadingId === document.id;

              const isDeleting =
                deletingId === document.id;

              return (
                <li
                  key={document.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Informações */}
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <FileText className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-sm font-bold text-slate-800">
                        {document.nome}
                      </h2>

                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                          {DOCUMENT_TYPE_LABELS[document.tipo]}
                        </span>

                        <span className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />

                          {formatDocumentDate(document.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleDownload(document.id)}
                      disabled={isDownloading || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-emerald-700 disabled:opacity-50"
                      title="Baixar arquivo"
                    >
                      {isDownloading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-slate-500" />
                      )}

                      <span>Download</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(document.id)}
                      disabled={isDownloading || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 px-3.5 py-2 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-100 disabled:opacity-50"
                      title="Excluir documento"
                    >
                      {isDeleting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-600" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}

                      <span>Excluir</span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}