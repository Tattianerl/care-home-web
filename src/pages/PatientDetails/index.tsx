import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  UserCheck,
  Phone,
  Stethoscope,
  AlertTriangle,
  History,
  Calendar,
  Activity,
  Plus,
  FileText,
  Clock,
  ChevronRight,
  Loader2,
  FileSpreadsheet,
  Printer,
  FileSignature,
  UserPlus,
} from "lucide-react";

import { getPatient } from "../../services/patient";
import { api } from "../../services/api";
import { useAuth } from "../../context/useAuth";
import type { PatientDetails as PatientDetailsType } from "../../types/patientDetails";

import { EvolutionPdfModal } from "../../components/evolutions/EvolutionPdfModal";
import { RegisterPatientModal } from "../../components/RegisterPatientModal";

interface PatientAppointment {
  id: string;
  titulo: string;
  dataHora: string;
  status: string;
  observacoes: string | null;
}

interface VitalSigns {
  id: string;
  pressao: string;
  glicemia: number;
  temperatura: number;
  frequenciaCardiaca: number;
  saturacao: number;
  createdAt: string;
  user?: {
    nome: string;
    cargo: string;
  };
}

export function PatientDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [patient, setPatient] = useState<PatientDetailsType | null>(null);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados dos Modais
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [showSignatureAlertModal, setShowSignatureAlertModal] = useState(false);
  const [isRegisterPatientModalOpen, setIsRegisterPatientModalOpen] = useState(false);

 const loadPatientData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);

      const [patientData, appointmentsResponse, vitalSignsResponse] =
        await Promise.all([
          getPatient(id),
          api.get(`/patients/${id}/appointments`).catch(() => ({ data: [] })),
          api.get(`/patients/${id}/vital-signs`).catch(() => ({ data: [] })),
        ]);

      const actualPatient = patientData?.data
        ? patientData.data
        : patientData;
      setPatient(actualPatient);

      const actualAppointments = Array.isArray(appointmentsResponse.data)
        ? appointmentsResponse.data
        : [];
      setAppointments(actualAppointments);

      const actualVitals = Array.isArray(vitalSignsResponse.data)
        ? vitalSignsResponse.data
        : [];
      setVitalSigns(actualVitals);
    } catch (error) {
      console.error("Erro ao carregar dados do perfil:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  function formatDate(dateString?: string | null) {
    if (!dateString) return "Data não informada";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Data inválida"
      : date.toLocaleString("pt-BR");
  }

  function handleOpenPdfModal() {
    if (!user?.assinatura) {
      setShowSignatureAlertModal(true);
      return;
    }

    setIsPdfModalOpen(true);
  }

  const latestVital = vitalSigns.length > 0 ? vitalSigns[0] : null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando prontuário do residente...</span>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm font-medium text-slate-600">
          Paciente não encontrado ou indisponível.
        </p>
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-600 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para lista de residentes
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Botão de Voltar e Cabeçalho */}
      <header className="space-y-3">
        <Link
          to="/patients"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para lista de residentes</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              {patient.nome}
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Prontuário e Histórico de Acompanhamento
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setIsRegisterPatientModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-xs transition-all hover:bg-emerald-100"
            >
              <UserPlus className="h-4 w-4" />
              <span>Novo Residente</span>
            </button>

            <Link
              to={`/patients/${patient.id}/timeline`}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
            >
              <Clock className="h-4 w-4 text-indigo-600" />
              <span>Timeline</span>
            </Link>

            <Link
              to={`/patients/${patient.id}/edit`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Edit className="h-4 w-4" />
              <span>Editar Residente</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Grid: Informações Gerais e Histórico Médico */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Dados Pessoais & Contato */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            Dados do Residente
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Responsável Familiar
              </span>
              <span className="text-sm font-medium text-slate-800">
                {patient.responsavel || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Telefone de Contato
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {patient.telefone || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Diagnóstico Principal
              </span>
              <span className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                <Stethoscope className="h-3.5 w-3.5 text-slate-400" />
                {patient.diagnosticos || "Nenhum diagnóstico registrado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Alergias & Restrições
              </span>
              <div className="mt-1 flex items-start gap-1.5 rounded-xl border border-amber-200/60 bg-amber-50 p-2.5 text-xs text-amber-700">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <span>{patient.alergias || "Sem alergias registradas."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Histórico Médico */}
        <div className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
            <History className="h-4 w-4 text-emerald-600" />
            Histórico Médico
          </h2>

          <div className="max-h-56 overflow-y-auto pr-2 text-xs leading-relaxed text-slate-600">
            {patient.historicoMedico ? (
              <p className="whitespace-pre-line">{patient.historicoMedico}</p>
            ) : (
              <p className="italic text-slate-400">
                Nenhum histórico médico detalhado foi registrado.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Agenda de Consultas */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            <Calendar className="h-4 w-4 text-emerald-600" />
            Agenda de Consultas e Procedimentos
          </h2>
        </div>

        {appointments.length === 0 ? (
          <p className="py-2 text-xs italic text-slate-400">
            Nenhum agendamento marcado para este residente.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {appointments.map((app) => (
              <div
                key={app.id}
                className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    {app.titulo}
                  </p>
                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />
                    {formatDate(app.dataHora)}
                  </p>
                  {app.observacoes && (
                    <p className="mt-0.5 text-xs italic text-slate-500">
                      Obs: {app.observacoes}
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                    app.status === "concluido"
                      ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                      : app.status === "cancelado"
                      ? "border border-rose-200 bg-rose-50 text-rose-700"
                      : "border border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Seção Sinais Vitais */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            <Activity className="h-4 w-4 text-emerald-600" />
            Sinais Vitais
          </h2>

          <div className="flex items-center gap-3">
            <Link
              to={`/patients/${id}/vital-signs`}
              className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Ver Histórico
            </Link>

            <Link
              to={`/patients/${id}/vital-signs/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Registrar Sinais</span>
            </Link>
          </div>
        </div>

        {latestVital ? (
          <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-5">
            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                P. Arterial
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-800">
                  {latestVital.pressao}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  mmHg
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                F. Cardíaca
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-800">
                  {latestVital.frequenciaCardiaca ?? "--"}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  bpm
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Saturação O₂
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-800">
                  {latestVital.saturacao ? `${latestVital.saturacao}%` : "--"}
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Temperatura
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-800">
                  {latestVital.temperatura ? `${latestVital.temperatura}°C` : "--"}
                </span>
              </div>
            </div>

            <div className="col-span-2 rounded-xl border border-slate-100 bg-slate-50/50 p-3 sm:col-span-1">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Glicemia
              </span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-base font-bold text-slate-800">
                  {latestVital.glicemia ?? "--"}
                </span>
                <span className="text-[10px] font-medium text-slate-400">
                  mg/dL
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="py-2 text-xs italic text-slate-400">
            Nenhum registro de sinais vitais encontrado.
          </p>
        )}
      </section>

      {/* Evoluções do Residente */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            <FileText className="h-4 w-4 text-emerald-600" />
            Evoluções do Residente
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleOpenPdfModal}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98]"
            >
              <Printer className="h-3.5 w-3.5 text-slate-600" />
              <span>Gerar PDF</span>
            </button>

            <Link
              to={`/patients/${id}/evolutions`}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span>Ver Todas</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to={`/patients/${id}/evolutions/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-700"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Evolução</span>
            </Link>
          </div>
        </div>

        {!patient.evolutions || patient.evolutions.length === 0 ? (
          <p className="py-2 text-xs italic text-slate-400">
            Nenhuma evolução registrada recentemente.
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {patient.evolutions.map((evolution) => (
              <div
                key={evolution.id}
                className="space-y-1 py-3.5 first:pt-0 last:pb-0"
              >
                <p className="text-xs leading-relaxed text-slate-700">
                  {evolution.descricao}
                </p>
                <span className="block text-[10px] font-semibold text-slate-400">
                  Registrado por:{" "}
                  {evolution.user?.nome || "Usuário não identificado"}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Documentos */}
      <section className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
            <FileSpreadsheet className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Anexos e Documentos
            </h2>
            <p className="text-xs text-slate-500">
              Arquivos de exames, receitas e laudos anexados.
            </p>
          </div>
        </div>

        <Link
          to={`/patients/${patient.id}/documents`}
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-colors hover:bg-slate-50"
        >
          <span>Acessar Pasta</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </section>

      {/* Modal de Trava de Assinatura */}
      {showSignatureAlertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md space-y-4 rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 text-amber-600">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Assinatura Digital Necessária
                </h3>
                <p className="text-xs text-slate-500">
                  Emissão de PDF de Evoluções
                </p>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-slate-600">
              Para gerar o PDF de evoluções clínicas, você precisa ter uma assinatura digital/rubrica cadastrada no seu perfil.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowSignatureAlertModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowSignatureAlertModal(false);
                  navigate("/assinatura");
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
              >
                <FileSignature className="h-4 w-4" />
                <span>Cadastrar Assinatura</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal do PDF de Evoluções */}
      {isPdfModalOpen && (
        <EvolutionPdfModal
          isOpen={isPdfModalOpen}
          onClose={() => setIsPdfModalOpen(false)}
          patientName={patient.nome}
          evolutions={patient.evolutions || []}
        />
      )}

      {/* Modal de Cadastro de Residente */}
      <RegisterPatientModal
        isOpen={isRegisterPatientModalOpen}
        onClose={() => setIsRegisterPatientModalOpen(false)}
        onSuccess={loadPatientData}
      />
    </div>
  );
}