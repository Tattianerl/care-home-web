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

interface VitalSign {
  id: string;
  pressao: string;
  temperatura: number;
  glicemia: number | null;
  frequenciaCardiaca: number | null;
  saturacao: number | null;
  observacoes: string | null;
  createdAt: string;
  user?: {
    nome: string;
    cargo: string;
  };
}

export function PatientVitalSigns() {
  const { id } = useParams();

  const [vitalSigns, setVitalSigns] = useState<VitalSign[]>([]);
  const [latestVital, setLatestVital] = useState<VitalSign | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadVitalSignsData() {
      if (!id) return;

      try {
        setLoading(true);

        const [historyResponse, latestResponse] = await Promise.all([
          api.get(`/patients/${id}/vital-signs`).catch(() => ({ data: [] })),
          api.get(`/patients/${id}/vital-signs/latest`).catch(() => ({ data: null })),
        ]);

        if (isMounted) {
          const actualHistory = Array.isArray(historyResponse.data)
            ? historyResponse.data
            : [];
          setVitalSigns(actualHistory);

          setLatestVital(latestResponse.data || null);
        }
      } catch (error) {
        console.error("Erro ao carregar sinais vitais:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadVitalSignsData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  function formatDate(dateString?: string | null) {
    if (!dateString) return "Data não informada";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Data inválida"
      : date.toLocaleString("pt-BR");
  }

  // Avalia o nível de risco do sinal vital mais recente
  function getVitalStatus(vital: VitalSign | null) {
    if (!vital) return { label: "Sem Registros", color: "bg-slate-100 text-slate-700 border-slate-200" };

    const { frequenciaCardiaca, saturacao, temperatura } = vital;

    if (
      (saturacao && saturacao < 92) ||
      (frequenciaCardiaca && (frequenciaCardiaca < 50 || frequenciaCardiaca > 120)) ||
      (temperatura && (temperatura < 35 || temperatura > 38.5))
    ) {
      return { label: "Alerta Crítico", color: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse" };
    }

    if (
      (saturacao && saturacao <= 95) ||
      (frequenciaCardiaca && (frequenciaCardiaca < 60 || frequenciaCardiaca > 100)) ||
      (temperatura && (temperatura >= 37.5 || temperatura <= 35.5))
    ) {
      return { label: "Atenção", color: "bg-amber-50 text-amber-700 border-amber-200" };
    }

    return { label: "Estável", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }

  const statusInfo = getVitalStatus(latestVital);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 font-medium text-slate-500 text-sm">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando sinais vitais...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Cabeçalho e Botão Voltar */}
      <header className="space-y-3">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
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

            <Link
              to={`/patients/${id}/vital-signs/new`}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 transition-all active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Registrar Sinais</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Cards de Métricas do Último Registro */}
      {latestVital ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {/* P.A. */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Pressão Arterial</span>
              <Activity className="h-4 w-4 text-indigo-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">{latestVital.pressao}</span>
              <span className="text-[10px] font-semibold text-slate-400">mmHg</span>
            </div>
          </div>

          {/* F.C. */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Freq. Cardíaca</span>
              <Heart className="h-4 w-4 text-rose-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.frequenciaCardiaca ?? "--"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">bpm</span>
            </div>
          </div>

          {/* SpO2 */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Saturação O₂</span>
              <Wind className="h-4 w-4 text-cyan-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.saturacao ? `${latestVital.saturacao}%` : "--"}
              </span>
            </div>
          </div>

          {/* Temp */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Temperatura</span>
              <Thermometer className="h-4 w-4 text-amber-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.temperatura ? `${latestVital.temperatura}°C` : "--"}
              </span>
            </div>
          </div>

          {/* Glicemia */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-bold uppercase tracking-wider">Glicemia</span>
              <Droplet className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-slate-800">
                {latestVital.glicemia ?? "--"}
              </span>
              <span className="text-[10px] font-semibold text-slate-400">mg/dL</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500 text-xs font-medium">
          Nenhuma aferição de sinais vitais cadastrada para este residente.
        </div>
      )}

      {/* Tabela de Histórico de Sinais Vitais */}
      <section className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
          <Activity className="h-4 w-4 text-emerald-600" />
          Histórico Completo
        </h2>

        {vitalSigns.length === 0 ? (
          <p className="py-2 italic text-slate-400 text-xs">
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
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-3 py-3 font-semibold text-slate-800">
                      {formatDate(vital.createdAt)}
                    </td>
                    <td className="px-3 py-3">{vital.pressao} mmHg</td>
                    <td className="px-3 py-3">
                      {vital.glicemia ? `${vital.glicemia} mg/dL` : "-"}
                    </td>
                    <td className="px-3 py-3">{vital.temperatura}°C</td>
                    <td className="px-3 py-3">
                      {vital.frequenciaCardiaca ? `${vital.frequenciaCardiaca} bpm` : "-"}
                    </td>
                    <td className="px-3 py-3">
                      {vital.saturacao ? `${vital.saturacao}%` : "-"}
                    </td>
                    <td className="px-3 py-3 text-slate-500 italic max-w-xs truncate">
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