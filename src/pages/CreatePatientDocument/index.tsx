
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { isAxiosError } from "axios";

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
import type { DocumentType } from "../../types/enums";

interface Feedback {
  tipo: "sucesso" | "erro";
  texto: string;
}

const DOCUMENT_TYPES: {
  value: DocumentType;
  label: string;
}[] = [
  {
    value: "RECEITA",
    label: "Receita",
  },
  {
    value: "EXAME",
    label: "Exame",
  },
  {
    value: "CONTRATO",
    label: "Contrato",
  },
  {
    value: "IDENTIDADE",
    label: "Documento de Identidade",
  },
  {
    value: "FOTO",
    label: "Foto",
  },
  {
    value: "EVOLUCAO",
    label: "EvoluÃ§Ã£o",
  },
  {
    value: "OUTRO",
    label: "Outro",
  },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;

export function CreatePatientDocument() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [tipo, setTipo] = useState<DocumentType>("OUTRO");
  const [arquivo, setArquivo] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState<Feedback | null>(null);

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0] ?? null;

    setMensagem(null);

    if (!file) {
      setArquivo(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setArquivo(null);

      setMensagem({
        tipo: "erro",
        texto: "O arquivo nÃ£o pode ultrapassar 10 MB.",
      });

      event.target.value = "";
      return;
    }

    setArquivo(file);
  }

  function handleRemoveFile() {
    setArquivo(null);
    setMensagem(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMensagem(null);

    if (!id) {
      setMensagem({
        tipo: "erro",
        texto: "Identificador do residente nÃ£o encontrado.",
      });

      return;
    }

    if (!nome.trim()) {
      setMensagem({
        tipo: "erro",
        texto: "Informe o nome do documento.",
      });

      return;
    }

    if (!arquivo) {
      setMensagem({
        tipo: "erro",
        texto: "Selecione um arquivo para enviar.",
      });

      return;
    }

    try {
      setLoading(true);

      await createPatientDocument(
        id,
        nome.trim(),
        arquivo,
        tipo
      );

      setMensagem({
        tipo: "sucesso",
        texto: "Documento enviado com sucesso! Redirecionando...",
      });

      setTimeout(() => {
        navigate(`/patients/${id}/documents`);
      }, 1200);
    } catch (error: unknown) {
      console.error("Erro ao enviar documento:", error);

      const mensagemErro = isAxiosError(error)
        ? error.response?.data?.error ??
          error.response?.data?.message ??
          "Erro ao enviar o documento."
        : "Erro inesperado ao enviar o documento.";

      setMensagem({
        tipo: "erro",
        texto: mensagemErro,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      <header className="space-y-3">
        <Link
          to={`/patients/${id}/documents`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
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
              FaÃ§a upload de laudos, exames ou documentos de identificaÃ§Ã£o.
            </p>
          </div>
        </div>
      </header>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
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

        <div className="space-y-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
          <div>
            <label
              htmlFor="nome"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Nome do Documento{" "}
              <span className="text-rose-500">*</span>
            </label>

            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                id="nome"
                type="text"
                required
                value={nome}
                onChange={(event) =>
                  setNome(event.target.value)
                }
                placeholder="Ex.: Hemograma Completo - Janeiro/2026"
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="tipo"
              className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Tipo de Documento{" "}
              <span className="text-rose-500">*</span>
            </label>

            <select
              id="tipo"
              value={tipo}
              onChange={(event) =>
                setTipo(event.target.value as DocumentType)
              }
              disabled={loading}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:bg-slate-50"
            >
              {DOCUMENT_TYPES.map((documentType) => (
                <option
                  key={documentType.value}
                  value={documentType.value}
                >
                  {documentType.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-600">
              Arquivo{" "}
              <span className="text-rose-500">*</span>
            </label>

            {!arquivo ? (
              <label className="group flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 transition-all hover:border-emerald-400 hover:bg-slate-50">
                <div className="flex flex-col items-center justify-center px-4 pb-6 pt-5 text-center">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-400 shadow-xs transition-all group-hover:scale-110 group-hover:text-emerald-600">
                    <UploadCloud className="h-5 w-5" />
                  </div>

                  <p className="mb-1 text-xs font-medium text-slate-700">
                    <span className="font-semibold text-emerald-600">
                      Clique para selecionar
                    </span>{" "}
                    ou arraste o arquivo atÃ© aqui
                  </p>

                  <p className="text-[11px] text-slate-400">
                    PDF, PNG, JPG ou DOCX â€” mÃ¡ximo 10 MB
                  </p>
                </div>

                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                  accept=".pdf,.png,.jpg,.jpeg,.doc,.docx"
                />
              </label>
            ) : (
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <FileText className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-xs font-semibold text-slate-800">
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
                  disabled={loading}
                  className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200/60 hover:text-slate-600 disabled:opacity-50"
                  title="Remover arquivo"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            to={`/patients/${id}/documents`}
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
