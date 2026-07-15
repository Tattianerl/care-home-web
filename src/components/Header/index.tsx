import { LogOut, UserCircle } from "lucide-react";
import { useAuth } from "../../context/useAuth";

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header
      className="
        h-16
        bg-white
        border-b
        px-8
        flex
        items-center
        justify-between
        shadow-sm
      "
    >
      {/* Título */}
      <div>
        <h1 className="text-lg font-bold text-slate-700">
          Sistema Care Home
        </h1>
      </div>

      {/* Usuário */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <UserCircle
            size={36}
            className="text-slate-500"
          />

          <div className="leading-tight">
            <p className="font-semibold text-slate-700">
              {user?.nome}
            </p>

            <small className="text-slate-500">
              {user?.cargo}
            </small>
          </div>
        </div>

        <button
          onClick={logout}
          className="
            flex
            items-center
            gap-2
            rounded-lg
            px-3
            py-2
            text-red-600
            hover:bg-red-50
            transition
          "
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </header>
  );
}