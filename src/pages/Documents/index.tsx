import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import {
  Folder,
  FileText,
  Download,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Search,
  User,
} from "lucide-react";

import {
  deleteDocument,
  downloadDocument,
  getAllDocuments,
} from "../../services/documents";
import type { PatientDocument } from "../../types/document";

export function Documents() {
  const [documents, setDocuments] = useState<PatientDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDocuments() {
      try {
        setLoading(true);
        const data = await getAllDocuments();

        if (isMounted) {
          const loadedDocs = Array.isArray(data) ? data : [];
          setDocuments(loadedDocs);
        }
      } catch (error: unknown) {
        console.error(error);
        if (isMounted) {
          setMensagem({
            tipo: "erro",
            texto: "Erro ao carregar a lista geral de documentos.",
          });
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

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

  // Busca por nome do documento ou nome do residente
  const filteredDocuments = documents.filter((doc) => {
    const query = searchQuery.toLowerCase();
    const docName = doc.nome?.toLowerCase() || "";
    const patientName = doc.patient?.nome?.toLowerCase() || "";
    return docName.includes(query) || patientName.includes(query);
  });

  return (
    <div className="max-w-5xl space-y-8 pb-10">
      {/* Cabeçalho */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <Folder className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Documentos do Sistema
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Gerencie e consulte todos os exames, laudos e arquivos anexados.
            </p>
          </div>
        </div>

       
      </header>

      {/* Banner de Feedback */}
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

      {/* Campo de Busca */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por nome do documento ou residente..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10"
        />
      </div>

      {/* Lista de Documentos */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 text-slate-400 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Carregando documentos...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-3">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">
              Nenhum documento encontrado
            </h3>
            <p className="mt-1 text-xs text-slate-500 max-w-sm">
              {searchQuery
                ? "Nenhum resultado corresponde à sua busca."
                : "Ainda não existem documentos cadastrados no sistema."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {filteredDocuments.map((doc) => {
              const isDownloading = downloadingId === doc.id;
              const isDeleting = deletingId === doc.id;

              return (
                <li
                  key={doc.id}
                  className="flex flex-col gap-4 p-5 transition-colors hover:bg-slate-50/60 sm:flex-row sm:items-center sm:justify-between"
                >
                  {/* Detalhes do Arquivo */}
                  <div className="flex items-start gap-3 overflow-hidden">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="truncate">
                      <h2 className="text-sm font-bold text-slate-800 truncate">
                        {doc.nome}
                      </h2>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-medium text-slate-500">
                        {doc.patient?.nome && (
                          <div className="flex items-center gap-1">
                            <User className="h-3.5 w-3.5 text-slate-400" />
                            <span className="text-slate-700 font-semibold">
                              {doc.patient.nome}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>
                            {doc.createdAt
                              ? new Date(doc.createdAt).toLocaleString("pt-BR", {
                                  dateStyle: "short",
                                  timeStyle: "short",
                                })
                              : "Data não informada"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleDownload(doc.id)}
                      disabled={isDownloading || isDeleting}
                      aria-label={`Baixar documento ${doc.nome}`}
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
                      aria-label={`Excluir documento ${doc.nome}`}
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