import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPatient } from "../../services/patient";
import { api } from "../../services/api"; 

import type { PatientDetails as PatientDetailsType } from "../../types/patientDetails";

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

  const [patient, setPatient] = useState<PatientDetailsType | null>(null);
  const [appointments, setAppointments] = useState<PatientAppointment[]>([]);
  const [loading, setLoading] = useState(true); 
  const [vitalSigns, setVitalSigns] = useState<VitalSigns[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPatientData() {
      if (!id) return;

      try {
        setLoading(true);

        const [patientData, appointmentsResponse, vitalSignsResponse] = await Promise.all([
          getPatient(id),
          api.get(`/patients/${id}/appointments`).catch(() => ({ data: [] })),
          api.get(`/patients/${id}/vital-signs`).catch(() => ({ data: [] }))
        ]);

        if (isMounted) {
          const actualPatient = patientData?.data ? patientData.data : patientData;
          setPatient(actualPatient);
          
          const actualAppointments = Array.isArray(appointmentsResponse.data) ? appointmentsResponse.data : [];
          setAppointments(actualAppointments);

          const actualVitals = Array.isArray(vitalSignsResponse.data) ? vitalSignsResponse.data : [];
          setVitalSigns(actualVitals);
        }
      } catch (error) {
        console.error("Erro ao carregar dados do perfil:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadPatientData();

    return () => {
      isMounted = false;
    };
  }, [id]);
    
  if (loading || !patient) {
    return (
     
        <p className="text-center p-6 text-gray-600">Carregando dados do paciente...</p>
     
    );
  }

  return (
    <div>
      {/* CABEÇALHO PRINCIPAL DA PÁGINA */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{patient.nome}</h1>
        <Link
          to={`/patients/${patient.id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          Editar Paciente
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Dados do Paciente */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4 text-xl">Dados do Paciente</h2>
          <p className="mb-2"><strong>Responsável:</strong> {patient.responsavel}</p>
          <p className="mb-2"><strong>Telefone:</strong> {patient.telefone}</p>
          <p className="mb-2"><strong>Diagnóstico:</strong> {patient.diagnosticos}</p>
          <p className="mb-2"><strong>Alergias:</strong> {patient.alergias}</p>
        </div>

        {/* Histórico Médico */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4 text-xl">Histórico Médico</h2>
          <p>{patient.historicoMedico}</p>
        </div>
      </div>

      {/* AGENDA DE CONSULTAS */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <h2 className="font-bold mb-4 text-xl">Agenda de Consultas e Procedimentos</h2>
        {appointments.length === 0 ? (
          <p className="text-gray-500">Nenhum agendamento marcado para este paciente.</p>
        ) : (
          <div className="space-y-4">
            {appointments.map((app) => (
              <div key={app.id} className="border-b pb-4 last:border-0 flex justify-between items-start">
                <div>
                  <p className="font-semibold text-lg">{app.titulo}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(app.dataHora).toLocaleString("pt-BR")}
                  </p>
                  {app.observacoes && (
                    <p className="text-sm text-gray-500 mt-1 italic">Obs: {app.observacoes}</p>
                  )}
                </div>
                <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  app.status === 'concluido' ? 'bg-green-100 text-green-800' :
                  app.status === 'cancelado' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CARD: SINAIS VITAIS COM AÇÃO NO LADO DIREITO */}
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Histórico de Sinais Vitais</h2>
          <Link 
            to={`/patients/${patient.id}/vital-signs/new`}
            className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
          >
            + Registrar Sinais
          </Link>
        </div>

        {vitalSigns.length === 0 ? (
          <p className="text-gray-500">Nenhum registro de sinais vitais encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-gray-50 text-gray-700 text-sm font-semibold">
                  <th className="p-3">Data/Hora</th>
                  <th className="p-3">P.A.</th>
                  <th className="p-3">Glicemia</th>
                  <th className="p-3">Temp.</th>
                  <th className="p-3">F.C.</th>
                  <th className="p-3">Sat.</th>
                  <th className="p-3">Responsável</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm">
                {vitalSigns.map((vital) => (
                  <tr key={vital.id} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">
                      {new Date(vital.createdAt).toLocaleString("pt-BR")}
                    </td>
                    <td className="p-3">{vital.pressao} mmHg</td>
                    <td className="p-3">{vital.glicemia} mg/dL</td>
                    <td className="p-3">{vital.temperatura}°C</td>
                    <td className="p-3">{vital.frequenciaCardiaca} bpm</td>
                    <td className="p-3">{vital.saturacao}%</td>
                    <td className="p-3">
                      {vital.user ? (
                        <div>
                          <p className="font-medium text-gray-800">{vital.user.nome}</p>
                          <p className="text-xs text-gray-400">{vital.user.cargo}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <div className="bg-white p-6 rounded-xl shadow mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Evoluções</h2>
          <div className="flex gap-2">
            <Link
              to={`/patients/${id}/evolutions`}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Ver Evoluções
            </Link>
            <Link
              to={`/patients/${id}/evolutions/new`}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              Nova Evolução
            </Link>
          <Link
            to={`/patients/${patient.id}/timeline`}
            className="
              bg-indigo-600
              text-white
              px-4
              py-2
              rounded-lg
              hover:bg-indigo-700
            "
          >
            Timeline
          </Link>
          </div>
        </div>

        {(!patient.evolutions || patient.evolutions.length === 0) ? (
          <p className="text-gray-500">Nenhuma evolução registrada para este paciente.</p>
        ) : (
          patient.evolutions.map((evolution) => (
            <div key={evolution.id} className="border-b py-4 last:border-0">
              <p className="text-gray-800">{evolution.descricao}</p>
              <small className="text-gray-500 block mt-1">
                Registrado por: {evolution.user?.nome || "Usuário não identificado"}
              </small>
            </div>
          ))
        )}
        
      </div>
      {/* DOCUMENTOS */}
          <div className="bg-white p-6 rounded-xl shadow mt-6">

            <div className="flex justify-between items-center">

              <h2 className="font-bold text-xl">
                Documentos
              </h2>

              <Link
                to={`/patients/${patient.id}/documents`}
                className="
                  bg-blue-600
                  text-white
                  px-4
                  py-2
                  rounded-lg
                  hover:bg-blue-700
                  transition
                "
              >
                Ver Documentos
              </Link>
            </div>
          </div>        
    </div>
  );
}