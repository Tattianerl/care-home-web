import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createEvolution } from "../../services/evolutions";

export function CreateEvolution() {
  const { id } = useParams();
  
  const navigate = useNavigate();
  const [descricao, setDescricao] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      const user = JSON.parse(
        localStorage.getItem("@carehome:user") || "{}"
      );

      await createEvolution({
        descricao,
        patientId: id!,
        assinatura: user.nome,
      });

      alert(
        "Evolução registrada com sucesso!"
      );

      navigate(
        `/patients/${id}/evolutions`
      );

    } catch (error) {
      console.error(error);

      alert(
        "Erro ao registrar evolução"
      );
    }
  }

  return (
    <div>

      <h1 className="text-3xl font-bold mb-6">
        Nova Evolução
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

        <textarea
          placeholder="Descreva a evolução do paciente"
          value={descricao}
          onChange={(e) =>
            setDescricao(e.target.value)
          }
          rows={6}
          className="
            w-full
            border
            p-3
            rounded-lg
          "
        />

        <button
          type="submit"
          className="
            bg-green-600
            text-white
            px-6
            py-3
            rounded-lg
            hover:bg-green-700
          "
        >
          Salvar Evolução
        </button>

      </form>

    </div>
  );
}