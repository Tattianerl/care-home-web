import { Link, useNavigate } from "react-router-dom";
import { Compass, ArrowLeft, Home } from "lucide-react";

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      {/* Ícone Ilustrativo */}
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-xs mb-6 border border-emerald-100">
        <Compass className="h-10 w-10 animate-spin-slow" />
      </div>

      {/* Código e Título */}
      <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase mb-2">
        Erro 404
      </span>
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
        Página não encontrada
      </h1>

      {/* Descrição */}
      <p className="mt-3 max-w-md text-sm text-slate-500 leading-relaxed">
        O endereço que você tentou acessar não existe, foi removido ou mudou de local no sistema.
      </p>

      {/* Ações / Botões */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar à página anterior</span>
        </button>

        <Link
          to="/dashboard"
          className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
        >
          <Home className="h-4 w-4" />
          <span>Ir para o Início</span>
        </Link>
      </div>
    </div>
  );
}