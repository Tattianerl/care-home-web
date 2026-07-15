import type { ReactNode } from "react";

interface DashboardItemProps {
  children: ReactNode;
}

export function DashboardItem({
  children,
}: DashboardItemProps) {
  return (
    <div
      className="
        border-b
        last:border-b-0
        border-slate-200
        py-3
      "
    >
      {children}
    </div>
  );
}