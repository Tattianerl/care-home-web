import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  FileText,
  Calendar,
  Clock,
  Loader2,
  History,
  Info,
} from "lucide-react";

import { getTimeline } from "../../services/timeline";
import type { TimelineItem } from "../../types/timeline";

// Mapeamento visual para cada tipo de evento da linha do tempo
const EVENT_CONFIG: Record<
  string,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    dotBg: string;
    lineBorder: string;
    icon: React.ElementType;
  }
> = {
  EVOLUTION: {
    label: "Evolução",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
    dotBg: "bg-emerald-500",
    lineBorder: "border-emerald-200",
    icon: FileText,
  },
  VITAL_SIGN: {
    label: "Sinais Vitais",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-800",
    dotBg: "bg-sky-500",
    lineBorder: "border-sky-200",
    icon: Activity,
  },
  APPOINTMENT: {
    label: "Agendamento",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
    dotBg: "bg-purple-500",
    lineBorder: "border-purple-200",
    icon: Calendar,
  },
};

const DEFAULT_CONFIG = {
  label: "Evento",
  badgeBg: "bg-slate-100",
  badgeText: "text-slate-800",
  dotBg: "bg-slate-400",
  lineBorder: "border-slate-200",
  icon: Info,
};

export function PatientTimeline() {
  const { id } = useParams<{ id: string }>();

  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadTimeline() {
      if (!id) return;

      try {
        setLoading(true);
        const data = await getTimeline(id);

        if (isMounted) {
          setTimeline(data || []);
        }
      } catch (error) {
        console.error("Erro ao carregar linha do tempo:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTimeline();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <History className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Linha do Tempo
            </h1>
            <p className="mt-0.5 text-xs font-medium text-slate-500">
              Histórico cronológico de atividades e registros do paciente.
            </p>
          </div>
        </div>

        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao Perfil</span>
        </Link>
      </div>

      {/* PAINEL DA TIMELINE */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            <p className="text-xs font-medium">Carregando linha do tempo...</p>
          </div>
        ) : timeline.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="h-10 w-10 text-slate-300 mb-2" />
            <h3 className="text-sm font-semibold text-slate-700">
              Nenhum evento registrado
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Ainda não existem evoluções, aferições ou agendamentos gravados para este paciente.
            </p>
          </div>
        ) : (
          <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {timeline.map((item, index) => {
              const config = EVENT_CONFIG[item.tipo] || DEFAULT_CONFIG;
              const IconComponent = config.icon;

              return (
                <div key={index} className="relative group">
                  {/* MARCADOR NA LINHA DO TEMPO */}
                  <div
                    className={`absolute -left-[1.875rem] sm:-left-[2.125rem] top-1 flex h-6 w-6 items-center justify-center rounded-full text-white ring-4 ring-white shadow-xs ${config.dotBg}`}
                  >
                    <IconComponent className="h-3 w-3" />
                  </div>

                  {/* CARTÃO DO EVENTO */}
                  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.badgeBg} ${config.badgeText}`}
                      >
                        {config.label}
                      </span>

                      <div className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                        <Clock className="h-3.5 w-3.5" />
                        <time dateTime={item.data}>
                          {new Date(item.data).toLocaleString("pt-BR", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </time>
                      </div>
                    </div>

                    <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {item.descricao}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}