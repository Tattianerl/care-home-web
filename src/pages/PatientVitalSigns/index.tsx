import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Heart,
  Thermometer,
  Droplet,
  Wind,
  Plus,
  Loader2,
} from "lucide-react";

import { api } from "../../services/api";
import type { VitalSign } from "../../types/vitalSigns";
import { evaluateVitalStatus } from "../../types/vitalSigns";

// 👇 Importando autenticação e roles
import { useAuth } from "../../context/useAuth";
import { Roles } from "../../permissions/roles";

export function PatientVitalSigns() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // 👇 Apenas equipe clínica, coordenação e serviço social podem registrar sinais vitais
  const canManageVitals = user
    ? ([Roles.COORDENADOR, Roles.MEDICO, Roles.ENFERMEIRO, Roles.ASSISTENTE_SOCIAL] as string[]).includes(user.cargo)
    : false;

  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [latestVital, setLatestVital] = useState<VitalSign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadVitalSignsData() {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const [historyResponse, latestResponse] = await Promise.all([
          api.get<VitalSign[]>(`/patients/${id}/vital-signs`),
          api.get<VitalSign>(`/patients/${id}/vital-signs/latest`).catch(
            () => null,
          ),
        ]);

        if (!isMounted) return;

        const history = Array.isArray(historyResponse.data)
          ? historyResponse.data
          : [];

        setVitalSigns(history);
        setLatestVital(latestResponse?.data ?? history[0] ?? null);
      } catch (error: unknown) {
        console.error("Erro ao carregar sinais vitais:", error);

        if (isMounted) {
          setVitalSigns([]);
          setLatestVital(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void loadVitalSignsData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function formatDate(dateString?: string | null) {
    if (!dateString) {
      return "Data não informada";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Data inválida";
    }

    return date.toLocaleString("pt-BR");
  }

  function getVitalStatus(vital: VitalSign | null) {
    if (!vital) {
      return {
        label: "Sem Registros",
        color: "bg-slate-100 text-slate-700 border-slate-200",
      };
    }

    const status = evaluateVitalStatus(vital);

    switch (status) {
      case "critico":
        return {
          label: "Alerta Crítico",
          color:
            "bg-rose-50 text-rose-700 border-rose-200 animate-pulse",
        };

      case "alerta":
        return {
          label: "Atenção",
          color: "bg-amber-50 text-amber-700 border-amber-200",
        };

      default:
        return {
          label: "Estável",
          color: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
    }
  }

  const statusInfo = getVitalStatus(latestVital);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando sinais vitais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Cabeçalho */}
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
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Sinais Vitais
            </h1>

            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Histórico completo de aferições e quadro clínico
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>

            {/* 👇 Botão de registro exibido apenas para cargos autorizados */}
            {canManageVitals && (
              <Link
                to={`/patients/${id}/vital-signs/new`}
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
              >
                <Plus className="h-4 w-4" />
                <span>Registrar Sinais</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Último registro */}
      {latestVital ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* Pressão */}
          <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Pressão Arterial
              </span>

              <Activity className="h-4 w-4 text-indigo-600" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.pressaoSistolica}/
                {latestVital.pressaoDiastolica}
              </span>

              <span className="text-[10px] font-semibold text-slate-400">
                mmHg
              </span>
            </div>
          </div>

          {/* Frequência cardíaca */}
          <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Freq. Cardíaca
              </span>

              <Heart className="h-4 w-4 text-rose-600" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.frequenciaCardiaca ?? "--"}
              </span>

              <span className="text-[10px] font-semibold text-slate-400">
                bpm
              </span>
            </div>
          </div>

          {/* Saturação */}
          <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Saturação O₂
              </span>

              <Wind className="h-4 w-4 text-cyan-600" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.saturacao != null
                  ? `${latestVital.saturacao}%`
                  : "--"}
              </span>
            </div>
          </div>

          {/* Temperatura */}
          <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Temperatura
              </span>

              <Thermometer className="h-4 w-4 text-amber-600" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.temperatura != null
                  ? `${latestVital.temperatura.toFixed(1)}°C`
                  : "--"}
              </span>
            </div>
          </div>

          {/* Glicemia */}
          <div className="space-y-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">
                Glicemia
              </span>

              <Droplet className="h-4 w-4 text-emerald-600" />
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.glicemia ?? "--"}
              </span>

              <span className="text-[10px] font-semibold text-slate-400">
                mg/dL
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-xs font-medium text-slate-500">
          Nenhuma aferição de sinais vitais cadastrada para este residente.
        </div>
      )}

      {/* Histórico */}
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <h2 className="flex items-center gap-2 border-b border-slate-100 pb-3 text-sm font-bold uppercase tracking-wider text-slate-800">
          <Activity className="h-4 w-4 text-emerald-600" />
          Histórico Completo
        </h2>

        {vitalSigns.length === 0 ? (
          <p className="py-2 text-xs italic text-slate-400">
            Nenhum registro encontrado.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 font-semibold uppercase text-slate-400">
                  <th className="px-3 py-2.5">Data/Hora</th>
                  <th className="px-3 py-2.5">P.A.</th>
                  <th className="px-3 py-2.5">Glicemia</th>
                  <th className="px-3 py-2.5">Temp.</th>
                  <th className="px-3 py-2.5">F.C.</th>
                  <th className="px-3 py-2.5">Sat.</th>
                  <th className="px-3 py-2.5">Observações</th>
                  <th className="px-3 py-2.5">Aferido por</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {vitalSigns.map((vital) => (
                  <tr
                    key={vital.id}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="px-3 py-3 font-semibold text-slate-800">
                      {formatDate(vital.createdAt)}
                    </td>

                    <td className="px-3 py-3">
                      {vital.pressaoSistolica}/
                      {vital.pressaoDiastolica} mmHg
                    </td>

                    <td className="px-3 py-3">
                      {vital.glicemia != null
                        ? `${vital.glicemia} mg/dL`
                        : "-"}
                    </td>

                    <td className="px-3 py-3">
                      {vital.temperatura != null
                        ? `${vital.temperatura.toFixed(1)}°C`
                        : "-"}
                    </td>

                    <td className="px-3 py-3">
                      {vital.frequenciaCardiaca != null
                        ? `${vital.frequenciaCardiaca} bpm`
                        : "-"}
                    </td>

                    <td className="px-3 py-3">
                      {vital.saturacao != null
                        ? `${vital.saturacao}%`
                        : "-"}
                    </td>

                    <td className="max-w-xs truncate px-3 py-3 italic text-slate-500">
                      {vital.observacoes || "-"}
                    </td>

                    <td className="px-3 py-3">
                      {vital.user ? (
                        <div>
                          <p className="font-semibold text-slate-800">
                            {vital.user.nome}
                          </p>

                          <p className="text-[10px] text-slate-400">
                            {vital.user.cargo}
                          </p>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}