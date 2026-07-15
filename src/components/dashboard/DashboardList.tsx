import type { ReactNode } from "react";

interface DashboardListProps {
  title: string;
  children: ReactNode;
}

export function DashboardList({
  title,
  children,
}: DashboardListProps) {
  return (
    <section
      className="
        bg-white
        rounded-xl
        shadow-sm
        border
        border-slate-100
        p-4
      "
    >
      <h2
        className="
          text-lg
          font-semibold
          text-slate-800
          mb-4
        "
      >
        {title}
      </h2>

      <div className="space-y-3">
        {children}
      </div>
    </section>
  );
}