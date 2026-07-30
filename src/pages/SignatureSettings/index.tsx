import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileSignature,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";

import { useSignature } from "../../hooks/useSignature";

export function SignatureSettings() {
  const {
    file,
    setFile,

    loading,
    fetchingCurrent,

    message,

    currentSignatureUrl,

    uploadFile,
  } = useSignature();

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-10">
      <header className="space-y-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para a dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Assinatura Digital
          </h1>

          <p className="mt-1 text-xs text-slate-500">
            Faça o upload da sua assinatura para utilização em evoluções e documentos.
          </p>
        </div>
      </header>

      {message && (
        <div
          className={`flex items-center gap-3 rounded-xl border p-4 text-xs font-semibold ${
            message.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800"
              : "border-rose-200 bg-rose-50 text-rose-800"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600" />
          )}

          {message.text}
        </div>
      )}

      {/* Assinatura Atual */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wide">
          <FileSignature className="h-4 w-4 text-emerald-600" />
          Assinatura Atual
        </h2>

        {fetchingCurrent ? (
          <div className="flex h-24 items-center justify-center text-sm text-slate-400">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-emerald-600" />
            Carregando assinatura...
          </div>
        ) : currentSignatureUrl ? (
          <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div className="flex h-24 w-56 items-center justify-center rounded-lg border bg-white p-2">
              <img
                src={currentSignatureUrl}
                alt="Assinatura"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                Assinatura ativa
              </span>

              <p className="mt-2 text-xs text-slate-500">
                Esta assinatura será utilizada automaticamente em todos os documentos emitidos pelo sistema.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-700">
            Nenhuma assinatura cadastrada.
          </div>
        )}
      </section>

      {/* Upload */}

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
        <h2 className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wide">
          <Upload className="h-4 w-4 text-emerald-600" />
          Enviar nova assinatura
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            void uploadFile();
          }}
          className="space-y-5"
        >
          <div className="rounded-xl border-2 border-dashed border-slate-200 p-8 text-center">

            <ImageIcon className="mx-auto mb-4 h-8 w-8 text-slate-400" />

            <label className="cursor-pointer text-xs font-semibold text-emerald-600 hover:underline">

              Selecionar imagem

              <input
                type="file"
                accept="image/png,image/jpeg,image/jpg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setFile(e.target.files[0]);
                  }
                }}
              />
            </label>

            <p className="mt-2 text-[11px] text-slate-400">
              PNG ou JPG
            </p>

            {file && (
              <div className="mt-5 flex items-center justify-center gap-3 rounded-lg border bg-white px-4 py-2 text-xs">

                {file.name}

                <button
                  type="button"
                  onClick={() => setFile(null)}
                >
                  <Trash2 className="h-4 w-4 text-slate-400 hover:text-rose-600" />
                </button>

              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={!file || loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}

              Salvar assinatura
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}