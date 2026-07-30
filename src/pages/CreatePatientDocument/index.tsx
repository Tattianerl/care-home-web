import { useState } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  FilePlus,
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";

import { createPatientDocument } from "../../services/documents";

export function CreatePatientDocument() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setArquivo(file);
    setMensagem(null);
  }

  function handleRemoveFile() {
    setArquivo(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    if (!id) {
      setMensagem({
        tipo: "erro",
        texto: "Identificador do residente não encontrado.",
      });
      return;
    }

    if (!arquivo) {
      setMensagem({
        tipo: "erro",
        texto: "Por favor, selecione um arquivo para enviar.",
      });
      return;
    }

    try {
      setLoading(true);

      await createPatientDocument(id, nome, arquivo);

      setMensagem({
        tipo: "sucesso",
        texto: "Documento enviado com sucesso! Redirecionando...",
      });

      // Aguarda 1.5s antes de retornar para a lista de documentos
      setTimeout(() => {
        navigate(`/patients/${id}/documents`);
      }, 1500);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof AxiosError) {
        const mensagemErro =
          error.response?.data?.error ||
          "Erro ao enviar o documento. Verifique o tamanho ou formato do arquivo.";
        setMensagem({ tipo: "erro", texto: mensagemErro });
      } else {
        setMensagem({
          tipo: "erro",
          texto: "Erro inesperado ao enviar o documento.",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* Botão de Voltar e Cabeçalho */}
      <header className="space-y-3">
        <Link
          to={`/patients/${id}/documents`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para documentos do residente</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <FilePlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Anexar Novo Documento
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Faça upload de laudos, exames ou documentos de identificação.
            </p>
          </div>
        </div>
      </header>

      {/* Formulário Principal */}
      <form onSubmit={handleSubmit} className="space-y-6">
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

        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8 space-y-6">
          {/* Campo: Nome do Documento */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Nome do Documento <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Hemograma Completo - Janeiro/2026"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Campo: Upload de Arquivo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Arquivo <span className="text-rose-500">*</span>
            </label>

            {!arquivo ? (
              <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-400 transition-all group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                  <div className="h-10 w-10 rounded-full bg-white shadow-xs flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all mb-3">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-medium text-slate-700 mb-1">
                    <span className="font-semibold text-emerald-600">
                      Clique para selecionar
                    </span>{" "}
                    ou arraste o arquivo até aqui
                  </p>
                  <p className="text-[11px] text-slate-400">
                    PDF, PNG, JPG ou DOCX (Tamanho máx.: 10MB)
                  </p>
                </div>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            ) : (
              /* Preview do Arquivo Selecionado */
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {arquivo.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {(arquivo.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRemoveFile}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-600 transition-colors"
                  title="Remover arquivo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Rodapé com Ações */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to={`/patients/${id}/documents`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <span>Enviar Documento</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}