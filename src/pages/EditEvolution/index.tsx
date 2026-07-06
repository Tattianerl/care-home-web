import axios from "axios";
import { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout";
import { api } from "../../services/api";

interface LocationState {
  evolution?: {
    id: string;
    descricao: string;
  };
}

export function EditEvolution() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const state = location.state as LocationState;
  const [descricao, setDescricao] = useState(() => state?.evolution?.descricao || "");
  
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!state?.evolution) {
      alert("Para editar, selecione a evolução diretamente a partir da listagem.");
      navigate(-1);
    }
  }, [state, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) return;

    try {
      setLoading(true);
      await api.put(`/evolutions/${id}`, {
        descricao,
      });

      alert("Evolução atualizada com sucesso!");
      navigate(-1); 
    } catch (error) {
      console.error("Erro ao atualizar evolução:", error);
      
      if (axios.isAxiosError(error)) {
        const backendError = error.response?.data?.error;
        if (backendError) {
          alert(`Erro do Servidor: ${backendError}`);
          return;
        }
      }
      
      alert("Erro ao atualizar a evolução. Verifique os dados digitados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <MainLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <button 
            type="button"
            onClick={() => navigate(-1)} 
            className="text-sm text-blue-600 hover:underline bg-transparent border-none cursor-pointer p-0"
          >
            ← Voltar para a lista
          </button>
          <h1 className="text-3xl font-bold mt-1">Editar Evolução</h1>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow"
      >
        {/* RELATÓRIO / DESCRIÇÃO */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700 block">
            Relatório de Evolução Diária *
          </label>
          <textarea
            placeholder="Digite aqui o relatório detalhado da evolução do paciente..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full rounded-lg border p-3 h-48 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

       

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-lg bg-gray-100 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </MainLayout>
  );
}