import type { DashboardToday } from "../../types/dashboard";

interface DashboardActivityProps {
  atividadeRecente: DashboardToday["atividadeRecente"];
}

export function DashboardActivity({
  atividadeRecente,
}: DashboardActivityProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Atividade Recente
      </h2>

      <div className="space-y-4">
        {atividadeRecente.length === 0 && (
          <p className="text-sm text-gray-500">
            Nenhuma atividade registrada.
          </p>
        )}

        {atividadeRecente.map((atividade) => (
          <div
            key={atividade.id}
            className="border-b pb-3 last:border-b-0"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-800">
                  {atividade.user.nome}
                </p>

                <p className="text-sm text-gray-500">
                  {atividade.user.cargo}
                </p>
              </div>

              <span className="text-xs text-gray-400">
                {new Date(
                  atividade.createdAt
                ).toLocaleString("pt-BR")}
              </span>
            </div>

            <p className="text-sm mt-2 text-gray-700">
              <span className="font-semibold">
                {atividade.acao}
              </span>{" "}
              - {atividade.entidade}
            </p>

            {atividade.descricao && (
              <p className="text-sm text-gray-500 mt-1">
                {atividade.descricao}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}