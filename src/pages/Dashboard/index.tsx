import { useEffect, useState } from "react";
import { Card } from "../../components/Card";
import { MainLayout } from "../../layouts/MainLayout";
import { getDashboardToday } from "../../services/dashboard";
import type { DashboardToday } from "../../types/dashboard";

export function Dashboard() {
  const [data, setData] =
    useState<DashboardToday | null>(null);

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
      <MainLayout>
        <p>Carregando...</p>
      </MainLayout>
    );
  }

  return (
     <MainLayout>
      <h1 className="text-3xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        <Card
          title="Pacientes Ativos"
          value={data.pacientesAtivos}
        />

        <Card
          title="Atendimentos Hoje"
          value={data.atendimentosHoje}
        />

        <Card
          title="Próximos Atendimentos"
          value={data.proximosAtendimentos}
        />

        <Card
          title="Evoluções Hoje"
          value={data.evolucoesHoje}
        />

        <Card
          title="Documentos Hoje"
          value={data.documentosHoje}
        />

        <Card
          title="Sinais Vitais"
          value={data.sinaisVitaisHoje}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

      {/* Últimos Pacientes */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-4">
          Últimos Pacientes
        </h2>

        {data.ultimosPacientes.map((patient) => (
          <div
            key={patient.id}
            className="border-b py-2"
          >
            {patient.nome}
          </div>
        ))}
      </div>

      {/* Últimas Evoluções */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-4">
          Últimas Evoluções
        </h2>

        {data.ultimasEvolucoes.map((evolution) => (
          <div
            key={evolution.id}
            className="border-b py-2"
          >
            <p className="font-medium">
              {evolution.patient.nome}
            </p>

            <p className="text-sm text-gray-500">
              {evolution.descricao}
            </p>
          </div>
        ))}
      </div>

      {/* Próximos Atendimentos */}
      <div className="bg-white rounded-xl shadow p-4">
        <h2 className="font-semibold text-lg mb-4">
          Próximos Atendimentos
        </h2>

        {data.proximosAtendimentosDetalhados.map(
          (appointment) => (
            <div
              key={appointment.id}
              className="border-b py-2"
            >
              <p className="font-medium">
                {appointment.patient.nome}
              </p>

              <p className="text-sm text-gray-500">
                {new Date(
                  appointment.dataHora
                ).toLocaleString("pt-BR")}
              </p>
            </div>
          )
        )}
      </div>

    </div>
    </MainLayout>
  );
}