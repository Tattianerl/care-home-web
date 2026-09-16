import {
  ClipboardList,
  PlusCircle,
  Pencil,
  Trash2,
} from "lucide-react";

import type { AuditSummary } from "../../types/auditLog";

interface Props {
  summary: AuditSummary;
}

export function AuditCards({ summary }: Props) {
  const cards = [
    {
      title: "Total de ações",
      value: summary.total ?? 0,
      subtitle: "Registros encontrados",
      icon: ClipboardList,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Criações",
      value: summary.CREATE ?? 0,
      subtitle: "Novos registros",
      icon: PlusCircle,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Atualizações",
      value: summary.UPDATE ?? 0,
      subtitle: "Alterações realizadas",
      icon: Pencil,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      title: "Exclusões",
      value: summary.DELETE ?? 0,
      subtitle: "Registros removidos",
      icon: Trash2,
      color: "bg-red-50 text-red-600",
    },
  ];

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  {card.title}
                </p>

                <h2 className="mt-2 text-3xl font-bold text-gray-800">
                  {card.value}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  {card.subtitle}
                </p>
              </div>

              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

