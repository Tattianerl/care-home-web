import type { ReactNode } from "react";

import { Sidebar } from "../../components/Sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({
  children,
}: MainLayoutProps) {
  return (
    <div className="flex">

      <Sidebar />

      <main
        className="
          flex-1
          bg-slate-100
          min-h-screen
          p-8
        "
      >
        {children}
      </main>

    </div>
  );
}