import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Shield, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import icon from "../../assets/icon.png";
import { useAuth } from "../../context/useAuth";
import { menuItems } from "./sidebarMenu";
import type { MenuItem } from "../../types/menu";

const groups = ["Principal", "Atendimento", "Administração"] as const;

export function Sidebar() {
  const { user } = useAuth();
  const cargo = user?.cargo;
  const [isCollapsed, setIsCollapsed] = useState(false);

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
          title={isCollapsed ? item.title : undefined} // Tooltip nativo quando fechada
          className={({ isActive }) =>
            `group relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-150 ${
              isCollapsed ? "justify-center px-2" : ""
            } ${
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
              
              {/* Oculta o texto se a sidebar estiver recolhida */}
              {!isCollapsed && <span className="truncate">{item.title}</span>}

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
    <aside
      className={`sticky top-0 flex h-screen flex-col border-r border-slate-800 bg-slate-900 text-slate-100 shrink-0 select-none transition-all duration-300 ${
        isCollapsed ? "w-20 p-3" : "w-64 p-5"
      }`}
    >
      {/* TOPO: LOGO E BOTÃO DE RECOLHER */}
      <div className={`mb-6 flex items-center ${isCollapsed ? "justify-center flex-col gap-2" : "justify-between px-2"}`}>
        <div className={`flex items-center gap-3 ${isCollapsed ? "justify-center" : ""}`}>
          <img
            src={icon}
            alt="Care Home"
            className={`${isCollapsed ? "h-10 w-10" : "h-12 w-12"} shrink-0 object-contain transition-all`}
          />

          {!isCollapsed && (
            <div className="flex flex-col justify-center">
              <h1 className="text-base font-bold leading-none text-white">
                Care Home
              </h1>
              <p className="mt-1 text-[11px] font-medium text-emerald-400">
                Sistema de Gestão
              </p>
            </div>
          )}
        </div>

        {/* Botão de Fechar / Abrir */}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors ${
            isCollapsed ? "mt-2" : ""
          }`}
          title={isCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* MENU DE NAVEGAÇÃO */}
      <nav className="flex-1 space-y-6 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {groups.map((group) => {
          const items = visibleMenu.filter((item) => item.group === group);

          if (items.length === 0) return null;

          return (
            <div key={group} className="space-y-1.5">
              {!isCollapsed && group !== "Principal" && (
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
        {!isCollapsed ? (
          <span className="text-[11px] font-medium text-slate-500">
            Versão 1.0.0
          </span>
        ) : (
          <span className="text-[9px] font-medium text-slate-500 block">
            v1.0
          </span>
        )}
      </div>
    </aside>
  );
}