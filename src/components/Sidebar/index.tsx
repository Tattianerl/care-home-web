import { NavLink } from "react-router-dom";
import { Shield, Layers } from "lucide-react";
import icon from "../../assets/icon.png";
import { useAuth } from "../../context/useAuth";
import { menuItems } from "./sidebarMenu";
import type { MenuItem } from "../../types/menu";

const groups = ["Principal", "Atendimento", "Administração"] as const;

export function Sidebar() {
  const { user } = useAuth();
  const cargo = user?.cargo;

  // Filtra apenas os itens permitidos para o cargo do usuário
  const visibleMenu = cargo
    ? menuItems.filter((item) => item.roles.includes(cargo))
    : [];

  function renderMenu(items: MenuItem[]) {
    return items.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
              isActive
                ? "bg-emerald-600 text-white shadow-xs"
                : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-200"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <Icon
                className={`h-4 w-4 shrink-0 transition-colors ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 group-hover:text-emerald-400"
                }`}
              />
              <span className="truncate">{item.title}</span>

              {/* Indicador lateral do item ativo */}
              {isActive && (
                <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-emerald-300" />
              )}
            </>
          )}
        </NavLink>
      );
    });
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900 p-5 text-slate-100 shrink-0 select-none">
           <div className="mb-8 flex items-center gap-3 px-2">
  <img
    src={icon}
    alt="Care Home"
    className="h-16 w-16 shrink-0 object-contain"
  />

  <div className="flex flex-col justify-center self-center">
    <h1 className="text-lg font-bold leading-none text-white">
      Care Home
    </h1>

    <p className="mt-1 text-xs font-medium text-emerald-400">
      Sistema de Gestão
    </p>
  </div>
</div>
      <nav className="flex-1 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {groups.map((group) => {
          const items = visibleMenu.filter((item) => item.group === group);

          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-1.5">
              {group !== "Principal" && (
                <div className="flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group === "Administração" ? (
                    <Shield className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Layers className="h-3 w-3 text-slate-500" />
                  )}
                  <span>{group}</span>
                </div>
              )}

              <div className="space-y-1">{renderMenu(items)}</div>
            </div>
          );
        })}
      </nav>

      {/* RODAPÉ */}
      <div className="mt-auto pt-4 border-t border-slate-800/80 text-center">
        <span className="text-[11px] font-medium text-slate-500">
          Versão 1.0.0
        </span>
      </div>
    </aside>
  );
}