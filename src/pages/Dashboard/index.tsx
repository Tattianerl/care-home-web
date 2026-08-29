import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Apple,
  CalendarDays,
  ChevronRight,
  ClipboardList,
  FileText,
  HeartPulse,
  UserRoundCheck,
  Users,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

import { DashboardItem } from "../../components/dashboard/DashboardItem";
import { DashboardList } from "../../components/dashboard/DashboardList";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";

import { getDashboardToday } from "../../services/dashboard";

import type { DashboardToday } from "../../types/dashboard";

export function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] = useState<DashboardToday | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      try {
        const response = await getDashboardToday();
        if (isMounted) {
          setDashboard(response);
        }
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    void fetchInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  const cards = useMemo(() => {
    if (!dashboard) return [];

    return [
      {
        title: "Residentes Ativos",
        value: dashboard.pacientesAtivos,
        icon: <Users className="h-5 w-5 text-emerald-600" />,
        bgIcon: "bg-emerald-50",
        path: "/patients",
      },
      {
        title: "Profissionais Ativos",
        value: dashboard.profissionaisAtivos,
        icon: <UserRoundCheck className="h-5 w-5 text-blue-600" />,
        bgIcon: "bg-blue-50",
        path: "/funcionarios",
      },
      {
        title: "Atendimentos Hoje",
        value: dashboard.atendimentosHoje,
        icon: <CalendarDays className="h-5 w-5 text-indigo-600" />,
        bgIcon: "bg-indigo-50",
        path: "/appointments",
      },
      {
        title: "Próximos Atendimentos",
        value: dashboard.proximosAtendimentos,
        icon: <Activity className="h-5 w-5 text-emerald-600" />,
        bgIcon: "bg-emerald-50",
        path: "/appointments",
      },
      {
        title: "Evoluções Hoje",
        value: dashboard.evolucoesHoje,
        icon: <ClipboardList className="h-5 w-5 text-purple-600" />,
        bgIcon: "bg-purple-50",
        path: "/evolutions",
      },
      {
        title: "Avaliações Nutricionais",
        value: dashboard.avaliacoesNutricionaisHoje,
        icon: <Apple className="h-5 w-5 text-teal-600" />,
        bgIcon: "bg-teal-50",
        path: "/nutritional-assessments/today",
      },
      {
        title: "Sinais Vitais",
        value: dashboard.sinaisVitaisHoje,
        icon: <HeartPulse className="h-5 w-5 text-rose-600" />,
        bgIcon: "bg-rose-50",
        path: "/vital-signs",
      },
      {
        title: "Documentos Hoje",
        value: dashboard.documentosHoje,
        icon: <FileText className="h-5 w-5 text-sky-600" />,
        bgIcon: "bg-sky-50",
        path: "/documents",
      },
    ];
  }, [dashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center shadow-xs backdrop-blur-sm">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <Activity className="h-6 w-6" />
        </div>
        <h3 className="text-lg font-semibold text-rose-900">Falha ao carregar dados</h3>
        <p className="mt-1 text-sm text-rose-600">
          Não foi possível conectar ao servidor. Tente atualizar a página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Principal */}
      <header className="flex flex-col gap-1 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Olá, <span className="text-emerald-600">{user?.nome}</span> 👋
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Acompanhe o resumo em tempo real e os indicadores operacionais da instituição.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Sistema Operacional
          </span>
        </div>
      </header>

      {/* Grid de Cards KPIs */}
      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.title}
            to={card.path}
            className="group relative block overflow-hidden rounded-xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md active:translate-y-0"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`rounded-lg p-2.5 ${card.bgIcon} transition-transform group-hover:scale-110`}>
                {card.icon}
              </div>
            </div>

            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-3xl font-bold tracking-tight text-slate-900">
                {card.value}
              </span>
              <ChevronRight className="h-4 w-4 text-slate-300 transition-colors group-hover:text-slate-600" />
            </div>
          </Link>
        ))}
      </section>

      {/* Seção Inferior: Listas Informativas */}
      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card Lista 1: Pacientes */}
        <DashboardList title="Últimos Residentes Cadastrados">
          {dashboard.ultimosPacientes.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">Nenhum residente recente.</p>
          ) : (
            dashboard.ultimosPacientes.map((patient) => (
              <DashboardItem key={patient.id}>
                <Link
                  to={`/patients/${patient.id}`}
                  className="flex items-center justify-between py-1 group/item"
                >
                  <span className="font-medium text-slate-800 transition-colors group-hover/item:text-emerald-600">
                    {patient.nome}
                  </span>
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                    Ver detalhes
                  </span>
                </Link>
              </DashboardItem>
            ))
          )}
        </DashboardList>

        {/* Card Lista 2: Evoluções */}
        <DashboardList title="Últimas Evoluções Clínicas">
          {dashboard.ultimasEvolucoes.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">Nenhuma evolução registrada hoje.</p>
          ) : (
            dashboard.ultimasEvolucoes.map((evolution) => (
              <DashboardItem key={evolution.id}>
                <Link
                  to={`/patients/${evolution.patient}/evolutions`}
                  className="block space-y-1 py-1 group/item"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-900 transition-colors group-hover/item:text-emerald-600">
                      {evolution.patient.nome}
                    </p>
                  </div>
                  <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                    {evolution.descricao}
                  </p>
                </Link>
              </DashboardItem>
            ))
          )}
        </DashboardList>

        {/* Card Lista 3: Próximos Atendimentos */}
        <DashboardList title="Próximos Atendimentos">
          {dashboard.proximosAtendimentosDetalhados.length === 0 ? (
            <p className="py-4 text-center text-xs text-slate-400">Sem agendamentos próximos.</p>
          ) : (
            dashboard.proximosAtendimentosDetalhados.map((appointment) => (
              <DashboardItem key={appointment.id}>
                <Link
                  to="/appointments"
                  className="flex items-center justify-between py-1 group/item"
                >
                  <div>
                    <p className="text-xs font-semibold text-slate-900 transition-colors group-hover/item:text-emerald-600">
                      {appointment.patient.nome}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {new Date(appointment.dataHora).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <span className="rounded-md bg-indigo-50 px-2 py-1 text-[10px] font-medium text-indigo-700">
                    Agendado
                  </span>
                </Link>
              </DashboardItem>
            ))
          )}
        </DashboardList>
      </section>
    </div>
  );
}




