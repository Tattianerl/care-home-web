import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  UserCheck,
  Phone,
  AlertTriangle,
  Calendar,
  Activity,
  Plus,
  FileText,
  Clock,
  ChevronRight,
  Loader2,
  FileSpreadsheet,
  Apple,
  Scale,
  Ruler,
  MapPin,
  HeartPulse,
  BedDouble,
  ShieldCheck,
  Pill,
} from "lucide-react";

import { getPatient } from "../../services/patients";
import { api } from "../../services/api";
import { nutritionService } from "../../services/nutritionService";

import type { PatientDetails } from "../../types/patientDetails";
import type { NutritionalAssessment } from "../../types/nutritionalAssessment";
import type {
  AppointmentStatus,
  BloodType,
  DependencyLevel,
  Gender,
  MaritalStatus,
} from "../../types/enums";

import { RegisterPatientModal } from "../../components/RegisterPatientModal";
import { PatientPrintModal } from "../../components/patients/PatientPrintModal";
import { NewNutritionalAssessmentModal } from "../../components/nutrition/NewNutritionalAssessmentModal";

import { getImcClassification } from "../../utils/nutrition";

interface PatientAppointment {
  id: string;
  titulo: string;
  dataHora: string;
  status: AppointmentStatus;
  observacoes: string | null;
}

interface VitalSigns {
  id: string;

  pressaoSistolica?: number | null;
  pressaoDiastolica?: number | null;

  temperatura?: number | null;
  frequenciaCardiaca?: number | null;
  frequenciaRespiratoria?: number | null;
  saturacao?: number | null;
  glicemia?: number | null;

  peso?: number | null;
  altura?: number | null;
  imc?: number | null;
  dor?: number | null;

  observacoes?: string | null;

  createdAt: string;

  user?: {
    nome: string;
    cargo: string;
  };
}

export function PatientDetails() {
  const { id } = useParams();

  const [patient, setPatient] =
    useState<PatientDetails | null>(null);

  const [appointments, setAppointments] = useState<
    PatientAppointment[]
  >([]);

  const [vitalSigns, setVitalSigns] =
    useState<VitalSigns[]>([]);

  const [nutritionAssessments, setNutritionAssessments] =
    useState<NutritionalAssessment[]>([]);

  const [loading, setLoading] = useState(true);

  const [isRegisterPatientModalOpen, setIsRegisterPatientModalOpen] =
    useState(false);

  const [isPatientPrintModalOpen, setIsPatientPrintModalOpen] =
    useState(false);

  const [isNutritionModalOpen, setIsNutritionModalOpen] =
    useState(false);

  const loadPatientData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);

      const [
        patientData,
        appointmentsResponse,
        vitalSignsResponse,
        nutritionResponse,
      ] = await Promise.all([
        getPatient(id),

        api
          .get(`/patients/${id}/appointments`)
          .catch(() => ({ data: [] })),

        api
          .get(`/patients/${id}/vital-signs`)
          .catch(() => ({ data: [] })),

        nutritionService
          .listByPatient(id)
          .catch(() => []),
      ]);

      setPatient(patientData);

      setAppointments(
        Array.isArray(appointmentsResponse.data)
          ? appointmentsResponse.data
          : []
      );

      setVitalSigns(
        Array.isArray(vitalSignsResponse.data)
          ? vitalSignsResponse.data
          : []
      );

      setNutritionAssessments(
        Array.isArray(nutritionResponse)
          ? nutritionResponse
          : []
      );
    } catch (error) {
      console.error(
        "Erro ao carregar dados do perfil:",
        error
      );
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadPatientData();
  }, [loadPatientData]);

  function formatDate(
    dateString?: string | null
  ): string {
    if (!dateString) {
      return "Não informado";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Data inválida";
    }

    return date.toLocaleDateString("pt-BR");
  }

  function formatDateTime(
    dateString?: string | null
  ): string {
    if (!dateString) {
      return "Não informado";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Data inválida";
    }

    return date.toLocaleString("pt-BR");
  }

  function getGenderLabel(
    gender?: Gender | null
  ): string {
    if (!gender) return "Não informado";

    const labels: Record<Gender, string> = {
      MASCULINO: "Masculino",
      FEMININO: "Feminino",
      OUTRO: "Outro",
    };

    return labels[gender];
  }

  function getBloodTypeLabel(
    bloodType?: BloodType | null
  ): string {
    if (!bloodType) return "Não informado";

    const labels: Record<BloodType, string> = {
      A_POSITIVO: "A+",
      A_NEGATIVO: "A-",
      B_POSITIVO: "B+",
      B_NEGATIVO: "B-",
      AB_POSITIVO: "AB+",
      AB_NEGATIVO: "AB-",
      O_POSITIVO: "O+",
      O_NEGATIVO: "O-",
    };

    return labels[bloodType];
  }

  function getDependencyLabel(
    dependency?: DependencyLevel | null
  ): string {
    if (!dependency) return "Não informado";

    const labels: Record<DependencyLevel, string> = {
      INDEPENDENTE: "Independente",
      PARCIAL: "Dependência parcial",
      TOTAL: "Dependência total",
    };

    return labels[dependency];
  }

  function getMaritalStatusLabel(
    status?: MaritalStatus | null
  ): string {
    if (!status) return "Não informado";

    const labels: Record<MaritalStatus, string> = {
      SOLTEIRO: "Solteiro(a)",
      CASADO: "Casado(a)",
      DIVORCIADO: "Divorciado(a)",
      VIUVO: "Viúvo(a)",
      UNIAO_ESTAVEL: "União estável",
    };

    return labels[status];
  }

  function getAppointmentStatusClass(
    status: AppointmentStatus
  ): string {
    switch (status) {
      case "REALIZADO":
        return "border border-emerald-200 bg-emerald-50 text-emerald-700";

      case "CANCELADO":
        return "border border-rose-200 bg-rose-50 text-rose-700";

      case "AGENDADO":
      default:
        return "border border-amber-200 bg-amber-50 text-amber-700";
    }
  }

  function getAppointmentStatusLabel(
    status: AppointmentStatus
  ): string {
    switch (status) {
      case "REALIZADO":
        return "Realizado";

      case "CANCELADO":
        return "Cancelado";

      case "AGENDADO":
      default:
        return "Agendado";
    }
  }

  const latestVital =
    vitalSigns.length > 0
      ? vitalSigns[0]
      : null;

  const latestNutrition =
    nutritionAssessments.length > 0
      ? nutritionAssessments[0]
      : null;

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />

          <span>
            Carregando prontuário do residente...
          </span>
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
      {/* CABEÇALHO */}
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

      {/* DADOS PRINCIPAIS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* DADOS DO RESIDENTE */}
        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
            <UserCheck className="h-4 w-4 text-emerald-600" />
            Dados do Residente
          </h2>

          <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2">
            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Nome
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.nome}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Data de Nascimento
              </span>

              <span className="text-sm font-medium text-slate-800">
                {formatDate(patient.dataNascimento)}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Gênero
              </span>

              <span className="text-sm font-medium text-slate-800">
                {getGenderLabel(patient.genero)}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Estado Civil
              </span>

              <span className="text-sm font-medium text-slate-800">
                {getMaritalStatusLabel(
                  patient.estadoCivil
                )}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                CPF
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.cpf || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                RG
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.rg || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Naturalidade
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.naturalidade || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Cartão SUS
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.cartaoSus || "Não informado"}
              </span>
            </div>

            <div className="sm:col-span-2">
              <span className="block font-semibold uppercase text-slate-400">
                Quarto / Leito
              </span>

              <span className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                <BedDouble className="h-4 w-4 text-slate-400" />
                {patient.quartoLeito || "Não informado"}
              </span>
            </div>
          </div>
        </section>

        {/* RESPONSÁVEL */}
        <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Responsável / Familiar
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Responsável
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.responsavel || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Telefone
              </span>

              <span className="mt-0.5 flex items-center gap-1.5 text-sm font-medium text-slate-800">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                {patient.telefone || "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Grau de Parentesco
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.responsavelGrauParentesco ||
                  "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                CPF do Responsável
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.responsavelCpf ||
                  "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                E-mail
              </span>

              <span className="text-sm font-medium text-slate-800">
                {patient.responsavelEmail ||
                  "Não informado"}
              </span>
            </div>

            <div>
              <span className="block font-semibold uppercase text-slate-400">
                Endereço
              </span>

              <span className="mt-0.5 flex items-start gap-1.5 text-sm font-medium text-slate-800">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                {patient.responsavelEndereco ||
                  "Não informado"}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* SAÚDE */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
          <HeartPulse className="h-4 w-4 text-emerald-600" />
          Saúde e Informações Clínicas
        </h2>

        <div className="grid grid-cols-1 gap-4 text-xs sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Tipo Sanguíneo
            </span>

            <span className="text-sm font-bold text-slate-800">
              {getBloodTypeLabel(
                patient.tipoSanguineo
              )}
            </span>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Grau de Dependência
            </span>

            <span className="text-sm font-medium text-slate-800">
              {getDependencyLabel(
                patient.grauDependencia
              )}
            </span>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Plano de Saúde
            </span>

            <span className="text-sm font-medium text-slate-800">
              {patient.planoSaude || "Não informado"}
            </span>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Emergência
            </span>

            <span className="text-sm font-medium text-slate-800">
              {patient.contatoEmergencia ||
                "Não informado"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Diagnósticos
            </span>

            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
              {patient.diagnosticos ||
                "Nenhum diagnóstico registrado."}
            </p>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Histórico Médico
            </span>

            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
              {patient.historicoMedico ||
                "Nenhum histórico médico registrado."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 md:grid-cols-2">
          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Alergias
            </span>

            <div className="mt-1 flex items-start gap-1.5 rounded-xl border border-amber-200/60 bg-amber-50 p-2.5 text-xs text-amber-700">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

              <span>
                {patient.alergias ||
                  "Sem alergias registradas."}
              </span>
            </div>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Restrição Alimentar
            </span>

            <p className="mt-1 rounded-xl border border-slate-100 bg-slate-50 p-2.5 text-sm text-slate-700">
              {patient.restricaoAlimentar ||
                "Nenhuma restrição registrada."}
            </p>
          </div>
        </div>

        {patient.observacoes && (
          <div className="border-t border-slate-100 pt-4">
            <span className="block font-semibold uppercase text-slate-400">
              Observações
            </span>

            <p className="mt-1 whitespace-pre-line text-sm text-slate-700">
              {patient.observacoes}
            </p>
          </div>
        )}
      </section>

      {/* INTERNAÇÃO */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
          <Calendar className="h-4 w-4 text-emerald-600" />
          Situação da Internação
        </h2>

        <div className="mt-4 grid grid-cols-1 gap-4 text-xs sm:grid-cols-3">
          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Status
            </span>

            <span
              className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${
                patient.falecido
                  ? "bg-slate-100 text-slate-600"
                  : patient.ativo
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
              }`}
            >
              {patient.falecido
                ? "Falecido"
                : patient.ativo
                  ? "Ativo"
                  : "Inativo"}
            </span>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Data de Internação
            </span>

            <span className="text-sm font-medium text-slate-800">
              {formatDate(patient.dataInternacao)}
            </span>
          </div>

          <div>
            <span className="block font-semibold uppercase text-slate-400">
              Data de Alta
            </span>

            <span className="text-sm font-medium text-slate-800">
              {formatDate(patient.dataAlta)}
            </span>
          </div>
        </div>
      </section>

      {/* AGENDA */}
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
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <p className="text-sm font-bold text-slate-800">
                    {appointment.titulo}
                  </p>

                  <p className="flex items-center gap-1 text-xs text-slate-500">
                    <Clock className="h-3 w-3" />

                    {formatDateTime(
                      appointment.dataHora
                    )}
                  </p>

                  {appointment.observacoes && (
                    <p className="mt-0.5 text-xs italic text-slate-500">
                      Obs: {appointment.observacoes}
                    </p>
                  )}
                </div>

                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${getAppointmentStatusClass(
                    appointment.status
                  )}`}
                >
                  {getAppointmentStatusLabel(
                    appointment.status
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SINAIS VITAIS */}
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
          <div className="grid grid-cols-2 gap-3 pt-1 sm:grid-cols-3 lg:grid-cols-6">
            <VitalCard
              label="P. Arterial"
              value={
                latestVital.pressaoSistolica !== null &&
                latestVital.pressaoSistolica !== undefined &&
                latestVital.pressaoDiastolica !== null &&
                latestVital.pressaoDiastolica !== undefined
                  ? `${latestVital.pressaoSistolica}/${latestVital.pressaoDiastolica}`
                  : "--"
              }
              unit="mmHg"
            />

            <VitalCard
              label="F. Cardíaca"
              value={
                latestVital.frequenciaCardiaca ??
                "--"
              }
              unit="bpm"
            />

            <VitalCard
              label="F. Respiratória"
              value={
                latestVital.frequenciaRespiratoria ??
                "--"
              }
              unit="rpm"
            />

            <VitalCard
              label="Saturação O₂"
              value={
                latestVital.saturacao != null
                  ? `${latestVital.saturacao}%`
                  : "--"
              }
            />

            <VitalCard
              label="Temperatura"
              value={
                latestVital.temperatura != null
                  ? `${latestVital.temperatura}°C`
                  : "--"
              }
            />

            <VitalCard
              label="Glicemia"
              value={
                latestVital.glicemia ?? "--"
              }
              unit="mg/dL"
            />
          </div>
        ) : (
          <p className="py-2 text-xs italic text-slate-400">
            Nenhum registro de sinais vitais encontrado.
          </p>
        )}
      </section>

      <Link
        to={`/patients/${patient.id}/medications`}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50"
      >
        <Pill className="h-4 w-4 text-emerald-600" />
        <span>Medicamentos</span>
      </Link>

      {/* NUTRIÇÃO */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            <Apple className="h-4 w-4 text-emerald-600" />
            Avaliação Nutricional & IMC
          </h2>

          <div className="flex items-center gap-3">
            <Link
              to={`/patients/${id}/nutrition`}
              className="text-xs font-semibold text-emerald-600 transition-colors hover:text-emerald-700"
            >
              Ver Histórico Nutricional
            </Link>

            <button
              type="button"
              onClick={() =>
                setIsNutritionModalOpen(true)
              }
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Avaliação</span>
            </button>
          </div>
        </div>

        {latestNutrition ? (
          <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
            <NutritionCard
              icon={<Scale className="h-5 w-5" />}
              label="Peso Atual"
              value={`${latestNutrition.peso} kg`}
            />

            <NutritionCard
              icon={<Ruler className="h-5 w-5" />}
              label="Altura"
              value={`${latestNutrition.altura} m`}
            />

            <NutritionCard
              icon={<Activity className="h-5 w-5" />}
              label="IMC"
              value={
                latestNutrition.imc !== null &&
                latestNutrition.imc !== undefined
                  ? Number(
                      latestNutrition.imc
                    ).toFixed(1)
                  : "--"
              }
              secondary={
                latestNutrition.imc !== null &&
                latestNutrition.imc !== undefined
                  ? getImcClassification(
                      latestNutrition.imc
                    )
                  : undefined
              }
            />
          </div>
        ) : (
          <p className="py-2 text-xs italic text-slate-400">
            Nenhuma avaliação nutricional cadastrada para este residente.
          </p>
        )}
      </section>

      {/* EVOLUÇÕES */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col gap-2 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800">
            <FileText className="h-4 w-4 text-emerald-600" />
            Evoluções do Residente
          </h2>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/patients/${id}/evolutions`}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <span>Ver Todas</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>

            <Link
              to={`/patients/${id}/evolutions/new`}
              className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs transition-colors hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Nova Evolução</span>
            </Link>
          </div>
        </div>

        {!patient.evolutions ||
        patient.evolutions.length === 0 ? (
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

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-semibold text-slate-400">
                  <span>
                    Registrado por:{" "}
                    {evolution.user?.nome ||
                      "Usuário não identificado"}
                  </span>

                  <span>
                    {formatDateTime(
                      evolution.createdAt
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* DOCUMENTOS */}
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

      {/* MODAL DE CADASTRO */}
      <RegisterPatientModal
        isOpen={isRegisterPatientModalOpen}
        onClose={() =>
          setIsRegisterPatientModalOpen(false)
        }
        onSuccess={loadPatientData}
      />

      {/* MODAL DE IMPRESSÃO */}
      <PatientPrintModal
        isOpen={isPatientPrintModalOpen}
        onClose={() =>
          setIsPatientPrintModalOpen(false)
        }
        patient={patient}
      />

      {/* MODAL NUTRIÇÃO */}
      {id && (
        <NewNutritionalAssessmentModal
          isOpen={isNutritionModalOpen}
          onClose={() =>
            setIsNutritionModalOpen(false)
          }
          patientId={id}
          patientName={patient.nome}
          onSuccess={loadPatientData}
        />
      )}
    </div>
  );
}

interface VitalCardProps {
  label: string;
  value: string | number;
  unit?: string;
}

function VitalCard({
  label,
  value,
  unit,
}: VitalCardProps) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </span>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-base font-bold text-slate-800">
          {value}
        </span>

        {unit && (
          <span className="text-[10px] font-medium text-slate-400">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

interface NutritionCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  secondary?: string;
}

function NutritionCard({
  icon,
  label,
  value,
  secondary,
}: NutritionCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
        {icon}
      </div>

      <div>
        <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-base font-bold text-slate-800">
            {value}
          </span>

          {secondary && (
            <span className="text-xs font-semibold text-slate-600">
              ({secondary})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}