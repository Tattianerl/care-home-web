import { useEffect, useState } from "react";
import { getPatients } from "../../services/patients";

import type {
  Patient,
  PatientsResponse,
} from "../../types/patient";
import { Link } from "react-router-dom";

export function Patients() {
  const [patients, setPatients] =
    useState<Patient[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    async function loadPatients() {
      try {
        const response:
          PatientsResponse =
          await getPatients();

        setPatients(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadPatients();
  }, []);

  const filteredPatients =
    patients.filter((patient) =>
      patient.nome
        .toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Pacientes
      </h1>

      <input
        type="text"
        placeholder="Buscar paciente..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="
          w-full
          p-3
          border
          rounded-lg
          mb-6
        "
      />

      <div className="grid gap-4">

        {filteredPatients.map(
          (patient) => (
            <Link
              to={`/patients/${patient.id}`}
              key={patient.id}
              className="
                bg-white
                rounded-xl
                shadow
                p-4
              "
            >
              <h2 className="font-bold text-lg">
                {patient.nome}
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
                Status:
                {" "}
                {patient.ativo
                  ? "Ativo"
                  : "Inativo"}
              </p>
            </Link>
          )
        )}

      </div>
    </div>
  );
}