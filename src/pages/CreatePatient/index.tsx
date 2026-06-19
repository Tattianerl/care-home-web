import { useState } from "react";

import { MainLayout } from "../../layouts/MainLayout";
import { createPatient } from "../../services/createPatient";

    export function CreatePatient() {
    const [nome, setNome] = useState("");
    const [dataNascimento, setDataNascimento] = useState("");
    const [responsavel, setResponsavel] = useState("");
    const [telefone, setTelefone] = useState("");
    const [historicoMedico, setHistoricoMedico] = useState("");
    const [medicamentos, setMedicamentos] = useState("");
    const [alergias, setAlergias] = useState("");
    const [diagnosticos, setDiagnosticos] = useState("");
    const [observacoes, setObservacoes] = useState("");

    async function handleSubmit(
    event: React.FormEvent
    ) {
    event.preventDefault();

    try {

        await createPatient({
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
        "Paciente cadastrado com sucesso!"
        );

    } catch (error) {
        console.error(error);

        alert(
        "Erro ao cadastrar paciente"
        );
    }
    }

  return (
    <MainLayout>

      <h1 className="text-3xl font-bold mb-6">
        Novo Paciente
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
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) =>
            setNome(e.target.value)
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
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
          type="text"
          placeholder="Responsável"
          value={responsavel}
          onChange={(e) =>
            setResponsavel(e.target.value)
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        />

        <input
          type="text"
          placeholder="Telefone"
          value={telefone}
          onChange={(e) =>
            setTelefone(e.target.value)
          }
          className="
            w-full
            border
            rounded-lg
            p-3
          "
        />
        <textarea
            placeholder="Histórico Médico"
            value={historicoMedico}
            onChange={(e) =>
                setHistoricoMedico(
                e.target.value
                )
            }
            className="w-full border rounded-lg p-3"
            />

            <textarea
            placeholder="Medicamentos"
            value={medicamentos}
            onChange={(e) =>
                setMedicamentos(
                e.target.value
                )
            }
            className="w-full border rounded-lg p-3"
            />

            <textarea
            placeholder="Alergias"
            value={alergias}
            onChange={(e) =>
                setAlergias(
                e.target.value
                )
            }
            className="w-full border rounded-lg p-3"
            />

            <textarea
            placeholder="Diagnósticos"
            value={diagnosticos}
            onChange={(e) =>
                setDiagnosticos(
                e.target.value
                )
            }
            className="w-full border rounded-lg p-3"
            />

            <textarea
            placeholder="Observações"
            value={observacoes}
            onChange={(e) =>
                setObservacoes(
                e.target.value
                )
            }
            className="w-full border rounded-lg p-3"
            />

        <button
          className="
            bg-blue-600
            text-white
            px-6
            py-3
            rounded-lg
          "
        >
          Salvar
        </button>

      </form>

    </MainLayout>
  );
}