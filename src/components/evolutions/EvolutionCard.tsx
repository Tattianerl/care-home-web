import {
  Calendar,
  Briefcase,
  UserCheck,
  PenTool,
  User,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { EvolutionActions } from "./EvolutionActions";

import type { Evolution } from "../../types/evolution";

interface Props {
  evolution: Evolution;
  deleting: boolean;
  showPatient?: boolean;
  onDelete(id: string): void;
}

export function EvolutionCard({
  evolution,
  deleting,
  showPatient = true,
  onDelete,
}: Props) {
  const navigate = useNavigate();

  return (
    <div
      className="
        flex
        flex-col
        gap-4
        rounded-xl
        border
        border-slate-200
        bg-slate-50/50
        p-5
        transition-all
        hover:bg-white
        hover:shadow-sm
        sm:flex-row
        sm:justify-between
      "
    >
      <div className="flex-1 space-y-4">
        {showPatient && (
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100">
            <User className="h-5 w-5 text-emerald-600" />
          </div>

          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Paciente
            </p>
            <h3 className="text-sm font-semibold text-slate-900">
              {evolution.patient.nome}
            </h3>
          </div>
        </div>
      )}

        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
          {evolution.descricao}
        </p>

        <div className="grid grid-cols-1 gap-2 border-t border-slate-200 pt-3 text-xs text-slate-500 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2">
            <PenTool
              size={14}
              className="text-slate-400"
            />

            <span>
              <strong className="text-slate-700">
                Assinatura:
              </strong>{" "}
              {evolution.assinatura || "Sem assinatura"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <UserCheck
              size={14}
              className="text-slate-400"
            />

            <span>
              <strong className="text-slate-700">
                Profissional:
              </strong>{" "}
              {evolution.user.nome}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Briefcase
              size={14}
              className="text-slate-400"
            />

            <span>
              <strong className="text-slate-700">
                Cargo:
              </strong>{" "}
              {evolution.user.cargo}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Calendar
              size={14}
              className="text-slate-400"
            />

            <span>
              <strong className="text-slate-700">
                Data:
              </strong>{" "}
              {new Date(
                evolution.createdAt
              ).toLocaleString("pt-BR")}
            </span>
          </div>
        </div>
      </div>

      <EvolutionActions
        deleting={deleting}
        onEdit={() =>
          navigate(
            `/evolutions/${evolution.id}/edit`,
            {
              state: {
                evolution,
              },
            }
          )
        }
        onDelete={() =>
          onDelete(evolution.id)
        }
      />
    </div>
  );
}