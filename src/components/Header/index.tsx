import { LogOut, User } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 sm:px-8 backdrop-blur-md transition-all">
      {/* TÍTULO / BRANDING */}
      <div className="flex items-center gap-2.5">
        <div>
          <h1 className="text-base font-bold tracking-tight text-slate-800">
            Care Home
          </h1>
          <p className="hidden text-[10px] font-medium text-slate-400 sm:block">
            Gestão de Saúde e Pacientes
          </p>
        </div>
      </div>

      {/* ÁREA DO USUÁRIO & AÇÕES */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* PERFIL */}
        <div className="flex items-center gap-3 border-r border-slate-200/80 pr-4 sm:pr-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-600 ring-2 ring-slate-200/60">
            <User className="h-5 w-5" />
          </div>

          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800">
              {user?.nome || "Usuário"}
            </span>

            {user?.cargo && (
              <span className="inline-flex w-max items-center rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                {user.cargo}
              </span>
            )}
          </div>
        </div>

        {/* BOTÃO DE LOGOUT */}
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 hover:text-rose-700 active:scale-95 transition-all cursor-pointer"
          title="Sair da conta"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Sair</span>
        </button>
      </div>
    </header>
  );
}