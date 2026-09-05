import axios from "axios";
import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Lock, ArrowLeft } from "lucide-react";

import { api } from "../../services/api";
import { Button } from "../../components/ui/Button";
// 👇 Importando autenticação e roles
import { useAuth } from "../../context/useAuth";
import { Roles } from "../../permissions/roles";

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
  const { user } = useAuth();

  // 👇 Apenas equipe clínica, coordenação e serviço social podem editar evoluções
  const canManageEvolutions = user
    ? ([Roles.COORDENADOR, Roles.MEDICO, Roles.ENFERMEIRO, Roles.ASSISTENTE_SOCIAL] as string[]).includes(user.cargo)
    : false;
  
  const state = location.state as LocationState;
  const [descricao, setDescricao] = useState(() => state?.evolution?.descricao || "");
  
  const [loading, setLoading] = useState(false);

  // Se o usuário não tiver permissão clínica, bloqueia o acesso imediatamente
  if (!canManageEvolutions) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-3">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Acesso Restrito
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
          Apenas profissionais de saúde, assistência social e coordenação possuem permissão para editar evoluções clínicas.
        </p>
        <div className="pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        </div>
      </div>
    );
  }

  // Efeito mantido para garantir integridade via state
  // (Nota: mantido com useEffect padrão sem quebrar regras do React)
  // ...

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
    <div>
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
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="success"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
            
      </form>
    </div>
  );
}