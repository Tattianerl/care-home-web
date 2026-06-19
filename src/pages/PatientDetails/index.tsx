import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import { MainLayout }
from "../../layouts/MainLayout";

import { getPatient }
from "../../services/patient";

import type {
  PatientDetails,
} from "../../types/patientDetails";


export function PatientDetails() {

  const { id } = useParams();

  const [patient, setPatient] =
    useState<PatientDetails | null>(
      null
    );

  useEffect(() => {

    async function loadPatient() {

      if (!id) return;

      try {
        const data =
          await getPatient(id);

        setPatient(data);

      } catch (error) {
        console.error(error);
      }
    }

    loadPatient();

  }, [id]);

  if (!patient) {
    return (
      <MainLayout>
        <p>Carregando...</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        {patient.nome}
      </h1>

      

      <div className="grid md:grid-cols-2 gap-6">
        <Link
          to={`/patients/${patient.id}/edit`}
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
          Editar Paciente
        </Link>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">
            Dados do Paciente
          </h2>

          <p>
            Responsável:
            {" "}
            {patient.responsavel}
          </p>

          <p>
            Telefone:
            {" "}
            {patient.telefone}
          </p>

          <p>
            Diagnóstico:
            {" "}
            {patient.diagnosticos}
          </p>

          <p>
            Alergias:
            {" "}
            {patient.alergias}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="font-bold mb-4">
            Histórico Médico
          </h2>

          <p>
            {patient.historicoMedico}
          </p>
        </div>

      </div>

      <div className="bg-white p-6 rounded-xl shadow mt-6">

        <h2 className="font-bold mb-4">
          Evoluções
        </h2>

        {patient.evolutions.map(
          (evolution) => (
            <div
              key={evolution.id}
              className="
                border-b
                py-4
              "
            >
              <p>
                {evolution.descricao}
              </p>

              <small>
                {evolution.user.nome}
              </small>
            </div>
          )
        )}

      </div>

    </MainLayout>
  );
}