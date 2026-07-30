import {
  AlertCircle,
  CheckCircle2,
  FileSignature,
  Loader2,
} from "lucide-react";

interface CurrentSignatureCardProps {
  loading: boolean;
  signatureUrl: string | null;
}

export function CurrentSignatureCard({
  loading,
  signatureUrl,
}: CurrentSignatureCardProps) {
  return (
    <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">

      <header className="border-b border-slate-100 pb-3">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
          <FileSignature className="h-4 w-4 text-emerald-600" />
          Assinatura Atual
        </h2>

        <p className="mt-1 text-xs text-slate-500">
          Assinatura utilizada automaticamente em evoluções,
          documentos e relatórios emitidos pelo sistema.
        </p>
      </header>

      {loading ? (
        <div className="flex h-32 items-center justify-center gap-2 text-xs text-slate-400">
          <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
          Carregando assinatura...
        </div>
      ) : signatureUrl ? (
        <div className="flex flex-col gap-5 rounded-xl border border-slate-200 bg-slate-50/50 p-5 lg:flex-row lg:items-center lg:justify-between">

          <div className="flex items-center gap-5">

            <div className="flex h-28 w-56 items-center justify-center rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
              <img
                src={signatureUrl}
                alt="Assinatura Digital"
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="space-y-2">

              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Assinatura ativa
              </span>

              <p className="max-w-sm text-xs leading-relaxed text-slate-500">
                Sempre que você registrar uma evolução ou gerar
                documentos em PDF, esta assinatura será utilizada
                automaticamente.
              </p>

            </div>

          </div>

        </div>
      ) : (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-5">

          <div className="flex items-start gap-3">

            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

            <div>

              <h3 className="text-xs font-bold uppercase tracking-wide text-amber-800">
                Nenhuma assinatura cadastrada
              </h3>

              <p className="mt-1 text-xs leading-relaxed text-amber-700">
                Cadastre sua assinatura digital para que ela seja
                inserida automaticamente nas evoluções clínicas,
                prontuários e documentos emitidos pelo sistema.
              </p>

            </div>

          </div>

        </div>
      )}
    </section>
  );
}