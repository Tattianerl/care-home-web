import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/useAuth";

import { menuItems } from "./sidebarMenu";
import type { MenuItem } from "../../types/menu";

const groups = [
  "Principal",
  "Atendimento",
  "Administração",
] as const;

export function Sidebar() {
  const { user } = useAuth();
  const cargo = user?.cargo;

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
            `
            flex
            items-center
            gap-3
            px-3
            py-2
            rounded-lg
            ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:text-blue-400"
            }
            `
          }
        >
          <Icon size={20} />

          <span>{item.title}</span>
        </NavLink>
      );
    });
  }

  return (
    <aside
      className="
        w-64
        min-h-screen
        bg-slate-900
        text-white
        p-6
        flex
        flex-col
      "
    >
      <h1 className="text-2xl font-bold mb-8">
        🏥 Care Home
      </h1>

      <nav className="flex flex-col gap-3">
        <NavLink
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
        </NavLink>
        {
          groups.map((group) => {

            const items = visibleMenu.filter(
              (item) => item.group === group
            );


            if (items.length === 0) {
              return null;
            }


            return (
              <div
                key={group}
                className="mb-4"
              >

                {
                  group !== "Principal" && (
                    <h2
                      className="
                        text-xs
                        uppercase
                        text-slate-400
                        mb-2
                      "
                    >
                      {
                        group === "Administração"
                          ? "⚙ Administração"
                          : group
                      }
                    </h2>
                  )
                }


                <div
                  className="
                    flex
                    flex-col
                    gap-2
                  "
                >
               {renderMenu(items)}
                </div>


              </div>
            );
          })
        }


      </nav>


      <footer
        className="
          mt-auto
          text-sm
          text-slate-400
          text-center
        "
      >
        Versão 1.0
      </footer>


    </aside>

  );
}