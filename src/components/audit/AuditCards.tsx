import type { AuditSummary } from "../../types/audit";


interface Props {
  summary: AuditSummary;
}

export function AuditCards({ summary }: Props) {
  const cards = [
    {
      title: "Total de ações",
      value: summary.total ?? 0,
    },
    {
      title: "Criações",
      value: summary.CREATE ?? 0,
    },
    {
      title: "Atualizações",
      value: summary.UPDATE ?? 0,
    },
    {
      title: "Exclusões",
      value: summary.DELETE ?? 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-4 mb-6">

      {cards.map((card) => (
        <div
          key={card.title}
          className="
            bg-white
            rounded-xl
            shadow-sm
            p-5
            border
            border-gray-100
          "
        >

          <p className="text-sm text-gray-500">
            {card.title}
          </p>

          <strong className="text-3xl font-bold text-gray-800">
            {card.value}
          </strong>

        </div>
      ))}

    </div>
  );
}