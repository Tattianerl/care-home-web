import {
  Calendar,
  Briefcase,
  UserCheck,
  PenTool,
  User,
  CheckCircle2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { EvolutionActions } from "./EvolutionActions";

import type { Evolution } from "../../types/evolution";
// 👇 Importando autenticação e roles
import { useAuth } from "../../context/useAuth";
import { Roles } from "../../permissions/roles";

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
  const { user } = useAuth();

  // 👇 Apenas equipe clínica, coordenação e serviço social podem ver as ações de editar/excluir
  const canManageEvolutions = user
    ? ([Roles.COORDENADOR, Roles.MEDICO, Roles.ENFERMEIRO, Roles.ASSISTENTE_SOCIAL] as string[]).includes(user.cargo)
    : false;

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

        <div className="border-t border-slate-200 pt-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="flex items-start gap-2">
              <UserCheck
                size={14}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div>
                <strong className="text-xs text-slate-700">
                  Profissional
                </strong>

                <p className="mt-0.5 text-xs text-slate-500">
                  {evolution.user.nome}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Briefcase
                size={14}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div>
                <strong className="text-xs text-slate-700">
                  Cargo
                </strong>

                <p className="mt-0.5 text-xs text-slate-500">
                  {evolution.user.cargo}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar
                size={14}
                className="mt-0.5 shrink-0 text-slate-400"
              />

              <div>
                <strong className="text-xs text-slate-700">
                  Data
                </strong>

                <p className="mt-0.5 text-xs text-slate-500">
                  {new Date(
                    evolution.createdAt
                  ).toLocaleString("pt-BR")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50/40 px-4 py-3">
            <CheckCircle2
              size={16}
              className="shrink-0 text-emerald-600"
            />

            <div>
              <p className="text-xs font-semibold text-emerald-800">
                Assinado eletronicamente
              </p>

              <p className="mt-0.5 text-[11px] text-slate-500">
                Registro associado ao profissional autenticado no CareHome.
              </p>
            </div>

            <PenTool
              size={14}
              className="ml-auto shrink-0 text-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* 👇 Exibe os botões de ação apenas se o usuário tiver permissão */}
      {canManageEvolutions && (
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
      )}
    </div>
  );
}