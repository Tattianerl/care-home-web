import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AxiosError } from "axios";
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
import type { Document } from "../../types/document";

export function PatientDocuments() {
  const { id } = useParams();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  useEffect(() => {
    async function loadDocuments() {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getPatientDocuments(id);
        setDocuments(data || []);
      } catch (error: unknown) {
        console.error(error);
        setMensagem({
          tipo: "erro",
          texto: "Erro ao carregar a lista de documentos.",
        });
      } finally {
        setLoading(false);
      }
    }

    loadDocuments();
  }, [id]);

  async function handleDownload(documentId: string) {
    setMensagem(null);
    try {
      setDownloadingId(documentId);
      await downloadDocument(documentId);
    } catch (error: unknown) {
      console.error(error);
      setMensagem({
        tipo: "erro",
        texto: "Não foi possível baixar o documento.",
      });
    } finally {
      setDownloadingId(null);
    }
  }

  async function handleDelete(documentId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este documento? Esta ação não poderá ser desfeita."
    );

    if (!confirmed) return;

    setMensagem(null);
    try {
      setDeletingId(documentId);
      await deleteDocument(documentId);

      setDocuments((previous) =>
        previous.filter((doc) => doc.id !== documentId)
      );

      setMensagem({
        tipo: "sucesso",
        texto: "Documento excluído com sucesso.",
      });
    } catch (error: unknown) {
      console.error(error);
      if (error instanceof AxiosError) {
        setMensagem({
          tipo: "erro",
          texto:
            error.response?.data?.error ||
            "Erro ao tentar excluir o documento.",
        });
      } else {
        setMensagem({
          tipo: "erro",
          texto: "Erro inesperado ao excluir o documento.",
        });
      }
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      {/* Cabeçalho e Navegação */}
      <header className="space-y-3">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
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
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Novo Documento</span>
          </Link>
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

      {/* Lista de Documentos */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Carregando documentos...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Nenhum documento encontrado
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              Ainda não existem arquivos anexados para este residente. Clique no botão acima para adicionar.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {documents.map((doc) => {
              const isDownloading = downloadingId === doc.id;
              const isDeleting = deletingId === doc.id;

              return (
                <li
                  key={doc.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Informações do Arquivo */}
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <h2 className="text-sm font-bold text-slate-800 truncate">
                        {doc.nome}
                      </h2>
                      <div className="mt-1 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span>
                          {new Date(doc.createdAt).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.id)}
                      disabled={isDownloading || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-emerald-700 transition-colors disabled:opacity-50"
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
                      onClick={() => handleDelete(doc.id)}
                      disabled={isDownloading || isDeleting}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50/50 px-3.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50"
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