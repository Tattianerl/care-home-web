// src/components/Sidebar/index.tsx

import { Link } from "react-router-dom";
import { handleLogout } from "../../services/auth";

export function Sidebar() {
  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-slate-900
        text-white
        p-6
      "
    >
      <h1
        className="
          text-2xl
          font-bold
          mb-8
        "
      >
        Care Home
      </h1>

      <nav
        className="
          flex
          flex-col
          gap-3
        "
      >
        <Link
            to="/patients/new"
            className="
              bg-blue-600
              text-white
              px-4
              py-3
              rounded-lg
              text-center
              mb-6
              hover:bg-blue-700
            "
          >
            + Novo Paciente
          </Link>
        <Link
          to="/dashboard"
          className="hover:text-blue-400"
        >
          Dashboard
        </Link>

        <Link
          to="/patients"
          className="hover:text-blue-400"
        >
          Pacientes
        </Link>
        <Link
          to="/appointments"
          className="hover:text-blue-400"
        >
          Agendamentos
        </Link>

        <Link
          to="/funcionarios"
          className="hover:text-blue-400"
        >
          Resetar Senha
        </Link>
        
      </nav>
      <button
        onClick={handleLogout} 
        className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium text-white"
      >
        <span>Sair do Sistema</span>
      </button>
    </aside>
  );
}