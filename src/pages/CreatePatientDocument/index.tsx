import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";

import { MainLayout } from "../../layouts/MainLayout";
import { createPatientDocument } from "../../services/documents";

export function CreatePatientDocument() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) {
      alert("Paciente não encontrado.");
      return;
    }

    if (!arquivo) {
      alert("Selecione um arquivo.");
      return;
    }

    try {
      setLoading(true);

      console.log("Paciente:", id);
      console.log("Nome:", nome);
      console.log("Arquivo:", arquivo);

      const response = await createPatientDocument(
        id,
        nome,
        arquivo
      );

      console.log("DOCUMENTO CRIADO:", response);

      alert("Documento enviado com sucesso!");

      navigate(`/patients/${id}/documents`);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("STATUS:", error.response?.status);
        console.error("DATA:", error.response?.data);
      } else {
        console.error(error);
      }

      alert("Erro ao enviar documento.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link
            to={`/patients/${id}/documents`}
            className="text-blue-600 hover:underline"
          >
            ← Voltar
          </Link>

          <h1 className="text-3xl font-bold mt-2">
            Novo Documento
          </h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-5 max-w-2xl"
      >
        <div>
          <label className="block font-semibold mb-2">
            Nome do documento
          </label>

          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Exame de Sangue"
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">
            Arquivo
          </label>

          <input
            type="file"
            onChange={(e) =>
              setArquivo(e.target.files?.[0] ?? null)
            }
            className="w-full border rounded-lg p-3"
            required
          />
        </div>

        <div className="flex justify-end gap-3">
          <Link
            to={`/patients/${id}/documents`}
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Enviando..." : "Enviar Documento"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}