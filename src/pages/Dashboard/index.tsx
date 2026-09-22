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
  AlertTriangle,
} from "lucide-react";

import { useAuth } from "../../context/useAuth";

import { DashboardItem } from "../../components/dashboard/DashboardItem";
import { DashboardList } from "../../components/dashboard/DashboardList";
import { DashboardSkeleton } from "../../components/dashboard/DashboardSkeleton";

import { getDashboardToday } from "../../services/dashboard";

import type { DashboardToday } from "../../types/dashboard";

import { can } from "../../permissions/can";
import { Permissions } from "../../permissions/permissions";

export function Dashboard() {
  const { user } = useAuth();

  const [dashboard, setDashboard] =
    useState<DashboardToday | null>(null);

  const [loading, setLoading] =
    useState(true);

  /*
   * ============================================================
   * PERMISSÕES
   * ============================================================
   */

  const canViewPatients = user
    ? can(user.cargo, Permissions.VIEW_PATIENTS)
    : false;

  const canViewAppointments = user
    ? can(user.cargo, Permissions.VIEW_APPOINTMENTS)
    : false;

  const canViewDocuments = user
    ? can(user.cargo, Permissions.VIEW_DOCUMENTS)
    : false;

  const canViewEvolutions = user
    ? can(user.cargo, Permissions.VIEW_EVOLUTIONS)
    : false;

  const canViewVitalSigns = user
    ? can(user.cargo, Permissions.VIEW_VITAL_SIGNS)
    : false;

  const canViewNutrition = user
    ? can(user.cargo, Permissions.VIEW_NUTRITION_ASSESSMENT)
    : false;

  const canViewUsers = user
    ? can(user.cargo, Permissions.MANAGE_USERS)
    : false;

  const canViewClinicalDashboard =
    canViewEvolutions ||
    canViewVitalSigns ||
    canViewNutrition;

  /*
   * As pendências atuais do dashboard são relacionadas a
   * Evoluções e Sinais Vitais.
   *
   * Portanto, Recepção não deve visualizar esse painel.
   */
  const canViewClinicalPendencias =
    canViewEvolutions ||
    canViewVitalSigns;

  /*
   * ============================================================
   * CARREGAMENTO
   * ============================================================
   */

  useEffect(() => {
    let isMounted = true;

    async function fetchInitialData() {
      try {
        const response = await getDashboardToday();

        if (isMounted) {
          setDashboard(response);
        }
      } catch (error) {
        console.error(
          "Erro ao carregar dashboard:",
          error
        );
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

  /*
   * ============================================================
   * CARDS
   * ============================================================
   *
   * Cada card é exibido apenas quando o usuário possui a
   * permissão correspondente ao recurso.
   */

  const cards = useMemo(() => {
    if (!dashboard) {
      return [];
    }

    const availableCards = [];

    if (canViewPatients) {
      availableCards.push({
        title: "Residentes Ativos",
        value: dashboard.pacientesAtivos,
        icon: (
          <Users className="h-5 w-5 text-emerald-600" />
        ),
        bgIcon: "bg-emerald-50",
        path: "/patients",
      });
    }

    if (canViewUsers) {
      availableCards.push({
        title: "Profissionais Ativos",
        value: dashboard.profissionaisAtivos,
        icon: (
          <UserRoundCheck className="h-5 w-5 text-blue-600" />
        ),
        bgIcon: "bg-blue-50",
        path: "/funcionarios",
      });
    }

    if (canViewAppointments) {
      availableCards.push({
        title: "Agendamentos Hoje",
        value: dashboard.atendimentosHoje,
        icon: (
          <CalendarDays className="h-5 w-5 text-indigo-600" />
        ),
        bgIcon: "bg-indigo-50",
        path: "/appointments?filtro=hoje",
      });

      availableCards.push({
        title: "Próximos Agendamentos",
        value: dashboard.proximosAtendimentos,
        icon: (
          <Activity className="h-5 w-5 text-emerald-600" />
        ),
        bgIcon: "bg-emerald-50",
        path: "/appointments?filtro=proximos",
      });
    }

    if (canViewEvolutions) {
      availableCards.push({
        title: "Evoluções Hoje",
        value: dashboard.evolucoesHoje,
        icon: (
          <ClipboardList className="h-5 w-5 text-purple-600" />
        ),
        bgIcon: "bg-purple-50",
        path: "/evolutions",
      });
    }

    if (canViewNutrition) {
      availableCards.push({
        title: "Avaliações Nutricionais",
        value: dashboard.avaliacoesNutricionaisHoje,
        icon: (
          <Apple className="h-5 w-5 text-teal-600" />
        ),
        bgIcon: "bg-teal-50",
        path: "/nutritional-assessments/today",
      });
    }

    if (canViewVitalSigns) {
      availableCards.push({
        title: "Sinais Vitais",
        value: dashboard.sinaisVitaisHoje,
        icon: (
          <HeartPulse className="h-5 w-5 text-rose-600" />
        ),
        bgIcon: "bg-rose-50",
        path: "/vital-signs",
      });
    }

    if (canViewDocuments) {
      availableCards.push({
        title: "Documentos Hoje",
        value: dashboard.documentosHoje,
        icon: (
          <FileText className="h-5 w-5 text-sky-600" />
        ),
        bgIcon: "bg-sky-50",
        path: "/documents",
      });
    }

    return availableCards;
  }, [
    dashboard,
    canViewPatients,
    canViewUsers,
    canViewAppointments,
    canViewEvolutions,
    canViewNutrition,
    canViewVitalSigns,
    canViewDocuments,
  ]);

  /*
   * ============================================================
   * ESTADOS DE INTERFACE
   * ============================================================
   */

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!dashboard) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-100 bg-rose-50/50 p-8 text-center shadow-xs">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <Activity className="h-6 w-6" />
        </div>

        <h3 className="text-lg font-semibold text-rose-900">
          Falha ao carregar dados
        </h3>

        <p className="mt-1 text-sm text-rose-600">
          Não foi possível conectar ao servidor.
          Tente atualizar a página.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* ========================================================
          CABEÇALHO
      ========================================================= */}

      <header className="flex flex-col gap-1 border-b border-slate-200/80 pb-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Olá,{" "}
            <span className="text-emerald-600">
              {user?.nome}
            </span>{" "}
            👋
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Acompanhe o resumo em tempo real e os
            indicadores operacionais da instituição.
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2 md:mt-0">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Sistema Operacional
          </span>
        </div>
      </header>

      {/* ========================================================
          CARDS KPI
      ========================================================= */}

      {cards.length > 0 && (
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

                <div
                  className={`rounded-lg p-2.5 ${card.bgIcon} transition-transform group-hover:scale-110`}
                >
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
      )}

      {/* ========================================================
          CONTEÚDO INFORMATIVO
      ========================================================= */}

      <section
        className={`grid grid-cols-1 gap-6 ${
          canViewClinicalDashboard
            ? "lg:grid-cols-3"
            : "lg:grid-cols-1"
        }`}
      >
        {/* ======================================================
            ÚLTIMOS RESIDENTES
        ====================================================== */}

        {canViewPatients && (
          <DashboardList title="Últimos Residentes Cadastrados">
            {dashboard.ultimosPacientes.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                Nenhum residente recente.
              </p>
            ) : (
              dashboard.ultimosPacientes.map(
                (patient) => (
                  <DashboardItem key={patient.id}>
                    <Link
                      to={`/patients/${patient.id}`}
                      className="group/item flex items-center justify-between py-1"
                    >
                      <span className="font-medium text-slate-800 transition-colors group-hover/item:text-emerald-600">
                        {patient.nome}
                      </span>

                      <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600">
                        Ver detalhes
                      </span>
                    </Link>
                  </DashboardItem>
                )
              )
            )}
          </DashboardList>
        )}

        {/* ======================================================
            ÚLTIMAS EVOLUÇÕES
        ====================================================== */}

        {canViewEvolutions && (
          <DashboardList title="Últimas Evoluções Clínicas">
            {dashboard.ultimasEvolucoes.length === 0 ? (
              <p className="py-4 text-center text-xs text-slate-400">
                Nenhuma evolução registrada hoje.
              </p>
            ) : (
              dashboard.ultimasEvolucoes.map(
                (evolution) => (
                  <DashboardItem key={evolution.id}>
                    <Link
                      to={`/patients/${evolution.patient.id}/evolutions`}
                      className="group/item block space-y-1 py-1"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-slate-900 transition-colors group-hover/item:text-emerald-600">
                          {evolution.patient.nome}
                        </p>

                        <span className="text-[10px] text-slate-400">
                          {evolution.user?.nome}
                        </span>
                      </div>

                      <p className="line-clamp-2 text-xs leading-relaxed text-slate-500">
                        {evolution.descricao}
                      </p>
                    </Link>
                  </DashboardItem>
                )
              )
            )}
          </DashboardList>
        )}

        {/* ======================================================
            PENDÊNCIAS CLÍNICAS
        ====================================================== */}

        {canViewClinicalPendencias && (
          <DashboardList title="Pendências Operacionais de Hoje">
            {dashboard.pendencias.length === 0 ? (
              <div className="py-6 text-center">
                <span className="mb-2 inline-block rounded-full bg-emerald-50 p-2 text-emerald-600">
                  <Users className="h-5 w-5" />
                </span>

                <p className="text-xs font-medium text-slate-600">
                  Tudo em dia por aqui!
                </p>

                <p className="mt-0.5 text-[11px] text-slate-400">
                  Nenhuma pendência crítica registrada
                  para hoje.
                </p>
              </div>
            ) : (
              dashboard.pendencias.map(
                (pendencia, index) => (
                  <DashboardItem key={index}>
                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" />

                        <span className="text-xs font-medium text-slate-700">
                          {pendencia.mensagem}
                        </span>
                      </div>

                      <span
                        className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                          pendencia.tipo === "EVOLUTION"
                            ? "bg-purple-50 text-purple-700"
                            : "bg-rose-50 text-rose-700"
                        }`}
                      >
                        {pendencia.tipo === "EVOLUTION"
                          ? "Evolução"
                          : "Sinais"}
                      </span>
                    </div>
                  </DashboardItem>
                )
              )
            )}
          </DashboardList>
        )}
      </section>
    </div>
  );
}

