import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

import {
  getEvolutions,
  updateEvolution,
} from "../../services/evolutions";

import { useAuth } from "../../context/useAuth";
import { can } from "../../permissions/can";
import { Permissions } from "../../permissions/permissions";

export function EditEvolution() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const canEditEvolution = user
    ? can(user.cargo, Permissions.EDIT_EVOLUTION)
    : false;

  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadEvolution() {
      if (!id || !canEditEvolution) {
        setLoading(false);
        return;
      }

      try {
        const data = await getEvolutions();
        const evolution = data.evolutions.find(
          (item) => item.id === id
        );

        if (evolution) {
          setDescricao(evolution.descricao || "");
        }
      } catch (error) {
        console.error("Erro ao carregar evolução:", error);
      } finally {
        setLoading(false);
      }
    }

    void loadEvolution();
  }, [id, canEditEvolution]);

  if (!canEditEvolution) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <h1 className="text-xl font-semibold text-gray-800 mb-2">
            Acesso não permitido
          </h1>

          <p className="text-gray-500">
            Seu perfil não possui permissão para editar evoluções.
          </p>
        </div>
      </div>
    );
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!id || !descricao.trim()) return;

    try {
      setSaving(true);

      await updateEvolution(id, {
        descricao: descricao.trim(),
      });

      navigate(-1);
    } catch (error) {
      console.error("Erro ao atualizar evolução:", error);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center text-gray-500">
          Carregando evolução...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-600"
          title="Voltar"
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Editar Evolução
          </h1>

          <p className="text-sm text-gray-500">
            Atualize as informações da evolução do residente.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border border-gray-100 p-6 space-y-5"
      >
        <div>
          <label
            htmlFor="descricao"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Evolução
          </label>

          <textarea
            id="descricao"
            value={descricao}
            onChange={(event) => setDescricao(event.target.value)}
            rows={8}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            placeholder="Digite a evolução do residente..."
            required
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !descricao.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={18} />
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
}
