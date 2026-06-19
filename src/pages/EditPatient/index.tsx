import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { MainLayout } from "../../layouts/MainLayout";

import { getPatient } from "../../services/patient";
import { updatePatient } from "../../services/updatePatient";

export function EditPatient() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] =
    useState("");

  const [responsavel, setResponsavel] =
    useState("");

  const [telefone, setTelefone] =
    useState("");

  const [historicoMedico, setHistoricoMedico] =
    useState("");

  const [medicamentos, setMedicamentos] =
    useState("");

  const [alergias, setAlergias] =
    useState("");

  const [diagnosticos, setDiagnosticos] =
    useState("");

  const [observacoes, setObservacoes] =
    useState("");

  useEffect(() => {

    async function loadPatient() {

      if (!id) return;

      try {

        const patient =
          await getPatient(id);

        setNome(patient.nome);

        setDataNascimento(
          patient.dataNascimento
            .split("T")[0]
        );

        setResponsavel(
          patient.responsavel
        );

        setTelefone(
          patient.telefone
        );

        setHistoricoMedico(
          patient.historicoMedico || ""
        );

        setMedicamentos(
          patient.medicamentos || ""
        );

        setAlergias(
          patient.alergias || ""
        );

        setDiagnosticos(
          patient.diagnosticos || ""
        );

        setObservacoes(
          patient.observacoes || ""
        );

      } catch (error) {
        console.error(error);
      }
    }

    loadPatient();

  }, [id]);

  async function handleSubmit(
    event: React.FormEvent
  ) {

    event.preventDefault();

    if (!id) return;

    try {

      await updatePatient(id, {
        nome,
        dataNascimento,
        responsavel,
        telefone,
        historicoMedico,
        medicamentos,
        alergias,
        diagnosticos,
        observacoes,
      });

      alert(
        "Paciente atualizado com sucesso!"
      );

      navigate(`/patients/${id}`);

    } catch (error) {

      console.error(error);

      alert(
        "Erro ao atualizar paciente"
      );
    }
  }

  return (
    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Editar Paciente
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          rounded-xl
          shadow
          p-6
          space-y-4
        "
      >

        <input
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          placeholder="Nome"
          className="w-full border rounded-lg p-3"
        />

        <input
          type="date"
          value={dataNascimento}
          onChange={(e) =>
            setDataNascimento(
              e.target.value
            )
          }
          className="w-full border rounded-lg p-3"
        />

        <input
          value={responsavel}
          onChange={(e) =>
            setResponsavel(
              e.target.value
            )
          }
          placeholder="Responsável"
          className="w-full border rounded-lg p-3"
        />

        <input
          value={telefone}
          onChange={(e) =>
            setTelefone(
              e.target.value
            )
          }
          placeholder="Telefone"
          className="w-full border rounded-lg p-3"
        />

        <textarea
          value={historicoMedico}
          onChange={(e) =>
            setHistoricoMedico(
              e.target.value
            )
          }
          placeholder="Histórico Médico"
          className="w-full border rounded-lg p-3"
        />

        <textarea
          value={medicamentos}
          onChange={(e) =>
            setMedicamentos(
              e.target.value
            )
          }
          placeholder="Medicamentos"
          className="w-full border rounded-lg p-3"
        />

        <textarea
          value={alergias}
          onChange={(e) =>
            setAlergias(
              e.target.value
            )
          }
          placeholder="Alergias"
          className="w-full border rounded-lg p-3"
        />

        <textarea
          value={diagnosticos}
          onChange={(e) =>
            setDiagnosticos(
              e.target.value
            )
          }
          placeholder="Diagnósticos"
          className="w-full border rounded-lg p-3"
        />

        <textarea
          value={observacoes}
          onChange={(e) =>
            setObservacoes(
              e.target.value
            )
          }
          placeholder="Observações"
          className="w-full border rounded-lg p-3"
        />

        <button
          type="submit"
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-lg
          "
        >
          Salvar Alterações
        </button>

      </form>

    </MainLayout>
  );
}