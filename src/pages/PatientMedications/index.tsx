import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Loader2,
  Pill,
  Plus,
  ShieldCheck,
  Clock,
  CalendarDays,
  AlertTriangle,
} from "lucide-react";

import {
  getPatientMedications,
} from "../../services/medications";

import type { Medication } from "../../types/medication";

export function PatientMedications() {
  const { id } = useParams();

  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMedications = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const data = await getPatientMedications(id);

      setMedications(
        Array.isArray(data) ? data : []
      );
    } catch (error) {
      console.error(
        "Erro ao carregar medicamentos:",
        error
      );

      setMedications([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadMedications();
  }, [loadMedications]);

  function getStatusClass(
    status: Medication["status"]
  ) {
    switch (status) {
      case "ATIVO":
        return "border-emerald-200 bg-emerald-50 text-emerald-700";

      case "SUSPENSO":
        return "border-amber-200 bg-amber-50 text-amber-700";

      case "FINALIZADO":
        return "border-slate-200 bg-slate-100 text-slate-600";

      default:
        return "border-slate-200 bg-slate-100 text-slate-600";
    }
  }

  function getStatusLabel(
    status: Medication["status"]
  ) {
    switch (status) {
      case "ATIVO":
        return "Ativo";

      case "SUSPENSO":
        return "Suspenso";

      case "FINALIZADO":
        return "Finalizado";

      default:
        return status;
    }
  }

  function formatDate(
    dateString?: string | null
  ) {
    if (!dateString) {
      return "Não informado";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Data inválida";
    }

    return date.toLocaleDateString("pt-BR");
  }

  function formatHorarios(
    horarios?: string[] | null
  ) {
    if (!horarios || horarios.length === 0) {
      return "Não informado";
    }

    return horarios.join(" • ");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando medicamentos...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* CABEÇALHO */}
      <header className="space-y-3">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para o prontuário</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
              <Pill className="h-6 w-6 text-emerald-600" />
              Medicamentos
            </h1>

            <p className="mt-1 text-xs font-medium text-slate-500">
              Prescrições e tratamentos medicamentosos do residente
            </p>
          </div>

          <Link
            to={`/patients/${id}/medications/new`}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
          >
            <Plus className="h-4 w-4" />
            Novo Medicamento
          </Link>
        </div>
      </header>

      {/* RESUMO */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Total"
          value={medications.length}
        />

        <SummaryCard
          label="Ativos"
          value={
            medications.filter(
              (medication) =>
                medication.status === "ATIVO"
            ).length
          }
        />

        <SummaryCard
          label="Controlados"
          value={
            medications.filter(
              (medication) =>
                medication.controlado
            ).length
          }
        />
      </div>

      {/* LISTA */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
            Tratamentos
          </h2>

          <span className="text-xs font-medium text-slate-400">
            {medications.length} registro(s)
          </span>
        </div>

        {medications.length === 0 ? (
          <div className="py-10 text-center">
            <Pill className="mx-auto h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Nenhum medicamento cadastrado.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Cadastre o primeiro medicamento deste residente.
            </p>

            <Link
              to={`/patients/${id}/medications/new`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              <Plus className="h-4 w-4" />
              Cadastrar medicamento
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <article
                key={medication.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 transition-shadow hover:shadow-sm"
              >
                {/* TOPO */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Pill className="h-5 w-5" />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {medication.nome}
                      </h3>

                      <p className="mt-0.5 text-xs font-medium text-slate-500">
                        {medication.dosagem}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {medication.controlado && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-2.5 py-1 text-[10px] font-bold uppercase text-rose-700">
                        <ShieldCheck className="h-3 w-3" />
                        Controlado
                      </span>
                    )}

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase ${getStatusClass(
                        medication.status
                      )}`}
                    >
                      {getStatusLabel(
                        medication.status
                      )}
                    </span>
                  </div>
                </div>

                {/* INFORMAÇÕES */}
                <div className="mt-5 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Frequência"
                    value={medication.frequencia}
                  />

                  <InfoItem
                    icon={<Clock className="h-4 w-4" />}
                    label="Horários"
                    value={formatHorarios(
                      medication.horarios
                    )}
                  />

                  <InfoItem
                    label="Via de administração"
                    value={
                      medication.viaAdministracao
                    }
                  />

                  <InfoItem
                    icon={<CalendarDays className="h-4 w-4" />}
                    label="Período"
                    value={`${formatDate(
                      medication.inicioTratamento
                    )} → ${formatDate(
                      medication.fimTratamento
                    )}`}
                  />
                </div>

                {/* OBSERVAÇÕES */}
                {(medication.usoContinuo ||
                  medication.observacoes) && (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {medication.usoContinuo && (
                      <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                        <ShieldCheck className="h-4 w-4" />
                        Uso contínuo
                      </div>
                    )}

                    {medication.observacoes && (
                      <div className="flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                        <span>
                          {medication.observacoes}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* RODAPÉ */}
                <div className="mt-4 flex justify-end border-t border-slate-100 pt-4">
                  <Link
                    to={`/medications/${medication.id}/edit`}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Editar
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

interface SummaryCardProps {
  label: string;
  value: number;
}

function SummaryCard({
  label,
  value,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <p className="mt-1 text-2xl font-bold text-slate-900">
        {value}
      </p>
    </div>
  );
}

interface InfoItemProps {
  icon?: React.ReactNode;
  label: string;
  value: string;
}

function InfoItem({
  icon,
  label,
  value,
}: InfoItemProps) {
  return (
    <div>
      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <span className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
        {icon && (
          <span className="text-slate-400">
            {icon}
          </span>
        )}

        {value}
      </span>
    </div>
  );
}