import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { DashboardActivity } from "../../components/DashboardActivity";
import { getDashboardToday } from "../../services/dashboard";
import type { DashboardToday } from "../../types/dashboard";
import {
  Users,
  CalendarDays,
  Activity,
  HeartPulse,
  FileText,
  ClipboardList,
  UserRoundCheck,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { DashboardList } from "../../components/dashboard/DashboardList";
import { DashboardItem } from "../../components/dashboard/DashboardItem";

export function Dashboard() {
  const [data, setData] =
    useState<DashboardToday | null>(null);
  const { user } = useAuth();  

  useEffect(() => {
    async function loadDashboard() {
      try {
        const dashboard =
          await getDashboardToday();

        setData(dashboard);
      } catch (error) {
        console.error(error);
      }
    }

    loadDashboard();
  }, []);

  if (!data) {
    return (
      <div>
        <p>Carregando dashboard...</p>
      </div>
    );
  }

  return (
     <div>
      <h1 className="text-3xl font-bold mt-5">
        Olá, {user?.nome} 
      </h1>
      <p className="text-gray-500 mb-5">
        Confira o resumo das atividades da instituição.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <Card
          title="Pacientes Ativos"
          value={data.pacientesAtivos}
          icon={<Users size={24} />}
        />
        <Card
          title="Profissionais Ativos"
          value={data.profissionaisAtivos}
          icon={<UserRoundCheck size={24}/>}
        />

        <Card
          title="Atendimentos Hoje"
          value={data.atendimentosHoje}
          icon={<CalendarDays size={24} />}
        />
        
        <Card
          title="Próximos Atendimentos"
          value={data.proximosAtendimentos}
          icon={< Activity size={24} />}
        />

        <Card
          title="Evoluções Hoje"
          value={data.evolucoesHoje}
          icon={<ClipboardList size={24} />}
        />

        <Card
          title="Documentos Hoje"
          value={data.documentosHoje}
          icon={<FileText size={24} />}
        />

        <Card
          title="Sinais Vitais"
          value={data.sinaisVitaisHoje}
          icon={<HeartPulse size={24} />}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

      {/* Últimos Pacientes */}
      <DashboardList title="Últimos Pacientes">
        {data.ultimosPacientes.map((patient) => (
          <DashboardItem key={patient.id}>
            <p className="border-b last:border-0 pb-2">
               {patient.nome}
            </p>
          </DashboardItem>
        ))}
      </DashboardList>

      {/* Últimas Evoluções */}
       <DashboardList title="Últimas Evoluções">
          {data.ultimasEvolucoes.map((evolution) => (
            <DashboardItem key={evolution.id}>
              <p className="font-medium">
                {evolution.patient.nome}
              </p>

              <p className="text-sm text-slate-500">
                {evolution.descricao}
              </p>
            </DashboardItem>
          ))}
        </DashboardList>

      {/* Próximos Atendimentos */}
      <DashboardList title="Próximos Atendimentos">
  {data.proximosAtendimentosDetalhados.map(
    (appointment) => (
            <DashboardItem key={appointment.id}>
              <p className="font-medium">
                {appointment.patient.nome}
              </p>

              <p className="text-sm text-slate-500">
                {new Date(
                  appointment.dataHora
                ).toLocaleString("pt-BR")}
              </p>
            </DashboardItem>
          )
        )}
      </DashboardList>
      <div className="mt-8">
          <DashboardActivity
            atividadeRecente={data.atividadeRecente}
          />
        </div>

    </div>
    </div>
  );
}