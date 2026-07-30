import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { Outlet } from "react-router-dom";

export function MainLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50/50">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}