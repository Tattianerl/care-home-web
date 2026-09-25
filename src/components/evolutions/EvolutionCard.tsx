import { useNavigate } from "react-router-dom";

import type { Evolution } from "../../types/evolution";

import { useAuth } from "../../context/useAuth";
import { can } from "../../permissions/can";
import { Permissions } from "../../permissions/permissions";

import { EvolutionActions } from "./EvolutionActions";

interface Props {
  evolution: Evolution;
  deleting: boolean;
  onDelete: (id: string) => void;
}

export function EvolutionCard({
  evolution,
  deleting,
  onDelete,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();

  const canEditEvolution = user
    ? can(user.cargo, Permissions.EDIT_EVOLUTION) &&
      evolution.user?.id === user.id
    : false;

  const canDeleteEvolution = user
    ? can(user.cargo, Permissions.DELETE_EVOLUTION)
    : false;

  function handleEdit() {
    navigate(`/evolutions/${evolution.id}/edit`, {
      state: { evolution },
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h3 className="font-semibold text-gray-800">
            {evolution.patient.nome}
          </h3>

          <p className="text-sm text-gray-500">
            {new Date(evolution.createdAt).toLocaleString("pt-BR")}
          </p>
        </div>

        {user && (canEditEvolution || canDeleteEvolution) && (
          <EvolutionActions
            deleting={deleting}
            onEdit={canEditEvolution ? handleEdit : undefined}
            onDelete={
              canDeleteEvolution
                ? () => onDelete(evolution.id)
                : undefined
            }
          />
        )}
      </div>

      <div>
        <p className="text-sm text-gray-700 whitespace-pre-wrap">
          {evolution.descricao}
        </p>
      </div>

      <div className="border-t border-gray-100 pt-3">
        <p className="text-xs text-gray-500">
          Registrado por{" "}
          <span className="font-medium text-gray-700">
            {evolution.user.nome}
          </span>
        </p>
      </div>
    </div>
  );
}

