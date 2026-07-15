import { Sidebar } from "../../components/Sidebar";
import { Header } from "../../components/Header";
import { Outlet } from "react-router-dom";


export function MainLayout() {

  return (
    <div className="flex min-h-screen bg-slate-100">

      <Sidebar />


      <div className="flex flex-1 flex-col">

        <Header />


        <main className="flex-1 p-8 overflow-y-auto">

          <Outlet />

        </main>


      </div>

    </div>
  );
}