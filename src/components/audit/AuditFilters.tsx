import { useRef, type FormEvent } from "react";
import { Search, RotateCcw } from "lucide-react";

export interface AuditFilterParams {
  usuario?: string;
  acao?: string;
  entidade?: string;
  startDate?: string;
  endDate?: string;
}

interface Props {
  onSearch: (filters: AuditFilterParams) => void;
  onClear: () => void;
}

export function AuditFilters({ onSearch, onClear }: Props) {
  const formRef = useRef<HTMLFormElement>(null);

  // Auxiliar para pegar o valor limpo (retorna undefined se estiver vazio)
  function getCleanValue(formData: FormData, key: string): string | undefined {
    const val = formData.get(key) as string;
    return val && val.trim() !== "" ? val.trim() : undefined;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    onSearch({
      usuario: getCleanValue(form, "usuario"),
      acao: getCleanValue(form, "acao"),
      entidade: getCleanValue(form, "entidade"),
      startDate: getCleanValue(form, "startDate"),
      endDate: getCleanValue(form, "endDate"),
    });
  }

  function handleReset() {
    formRef.current?.reset();
    onClear();
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="mb-6 grid grid-cols-1 gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7"
    >
      {/* USUÁRIO */}
      <input
        type="text"
        name="usuario"
        placeholder="Usuário"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      />

      {/* AÇÃO */}
      <select
        name="acao"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      >
        <option value="">Todas ações</option>
        <option value="CREATE">Criação</option>
        <option value="UPDATE">Atualização</option>
        <option value="DELETE">Exclusão</option>
        <option value="DEACTIVATE">Desativação</option>
      </select>

      {/* ENTIDADE (AGORA EM PORTUGUÊS) */}
      <select
        name="entidade"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      >
        <option value="">Todas entidades</option>
        <option value="PATIENT">Paciente</option>
        <option value="APPOINTMENT">Agendamento</option>
        <option value="EVOLUTION">Evolução</option>
        <option value="MEDICATION">Medicação</option>
        <option value="DOCUMENT">Documento</option>
        <option value="USER">Funcionário / Usuário</option>
      </select>

      {/* DATA INICIAL */}
      <input
        type="date"
        name="startDate"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      />

      {/* DATA FINAL */}
      <input
        type="date"
        name="endDate"
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
      />

      {/* BOTÃO PESQUISAR */}
      <button
        type="submit"
        className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all active:scale-[0.98]"
      >
        <Search className="h-3.5 w-3.5" />
        <span>Pesquisar</span>
      </button>

      {/* BOTÃO LIMPAR */}
      <button
        type="button"
        onClick={handleReset}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all active:scale-[0.98]"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        <span>Limpar</span>
      </button>
    </form>
  );
}