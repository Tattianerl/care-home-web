import type { AuditLog } from "../../types/auditLog";
import { Badge } from "../ui/Badge";
import { ShieldAlert } from "lucide-react";

function getActionBadge(action: string) {
  switch (action) {
    case "CREATE":
      return <Badge color="green">Criação</Badge>;

    case "UPDATE":
      return <Badge color="blue">Atualização</Badge>;

    case "DELETE":
      return <Badge color="red">Exclusão</Badge>;

    default:
      return <Badge color="gray">{action || "-"}</Badge>;
  }
}

function getRoleBadge(role?: string) {
  if (!role) return <Badge color="gray">-</Badge>;

  switch (role.toLowerCase()) {
    case "admin":
      return <Badge color="red">Administrador</Badge>;

    case "medico":
    case "médico":
      return <Badge color="blue">Médico</Badge>;

    case "enfermeiro":
    case "enfermeira":
      return <Badge color="green">Enfermeiro(a)</Badge>;

    case "assistente_social":
      return <Badge color="purple">Assist. Social</Badge>;

    case "recepcao":
    case "recepção":
      return <Badge color="orange">Recepção</Badge>;

    default:
      return <Badge color="gray">{role}</Badge>;
  }
}

function getEntityBadge(entity: string) {
  if (!entity) return <Badge color="gray">-</Badge>;

  const normalized = entity.toUpperCase().replace(/_|\s|-/g, "");

  switch (normalized) {
    case "PATIENT":
      return <Badge color="blue">Paciente</Badge>;

    case "APPOINTMENT":
      return <Badge color="purple">Agendamento</Badge>;

    case "EVOLUTION":
      return <Badge color="green">Evolução</Badge>;

    case "MEDICATION":
      return <Badge color="red">Medicação</Badge>;

    case "DOCUMENT":
    case "PATIENTDOCUMENT":
      return <Badge color="orange">Documento</Badge>;

    case "USER":
      return <Badge color="purple">Funcionário</Badge>;

    default:
      return <Badge color="gray">{entity}</Badge>;
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return "-";

  try {
    const date = new Date(dateString);

    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return "-";
  }
}

interface Props {
  logs: AuditLog[];
}

export function AuditTable({ logs }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/70 font-semibold uppercase tracking-wider text-[11px] text-slate-700">
              <th className="px-4 py-3.5">Data / Hora</th>
              <th className="px-4 py-3.5">Usuário</th>
              <th className="px-4 py-3.5">Cargo</th>
              <th className="px-4 py-3.5">Ação</th>
              <th className="px-4 py-3.5">Entidade</th>
              <th className="px-4 py-3.5">Descrição</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 font-medium">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="transition-colors hover:bg-slate-50/60"
              >
                {/* DATA */}
                <td className="whitespace-nowrap px-4 py-3.5 font-mono text-[11px] text-slate-500">
                  {formatDate(log.createdAt)}
                </td>

                {/* USUÁRIO */}
                <td className="whitespace-nowrap px-4 py-3.5 font-bold text-slate-800">
                  {log.user?.nome || "Usuário do Sistema"}
                </td>

                {/* CARGO */}
                <td className="whitespace-nowrap px-4 py-3.5">
                  {getRoleBadge(log.user?.cargo)}
                </td>

                {/* AÇÃO */}
                <td className="whitespace-nowrap px-4 py-3.5">
                  {getActionBadge(log.acao)}
                </td>

                {/* ENTIDADE */}
                <td className="whitespace-nowrap px-4 py-3.5">
                  {getEntityBadge(log.entidade)}
                </td>

                {/* DESCRIÇÃO */}
                <td
                  className="max-w-xs truncate px-4 py-3.5 text-slate-600"
                  title={log.descricao ?? ""}
                >
                  {log.descricao || (
                    <span className="text-slate-300">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ESTADO VAZIO */}
      {logs.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 text-center">
          <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <p className="text-xs font-bold text-slate-700">
            Nenhum registro de auditoria encontrado
          </p>

          <p className="mt-0.5 text-[11px] text-slate-400">
            Tente ajustar os filtros de busca para encontrar outros logs.
          </p>
        </div>
      )}
    </div>
  );
}

