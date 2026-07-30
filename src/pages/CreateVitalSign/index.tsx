import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../services/api";

export function CreateVitalSign() {
  const { id } = useParams<{ id: string }>(); 
  const navigate = useNavigate();

  // Estados do formulário
  const [pressao, setPressao] = useState("");
  const [glicemia, setGlicemia] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState("");
  const [saturacao, setSaturacao] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) {
      alert("ID do paciente não encontrado na URL.");
      return;
    }

    try {
      setLoading(true);

      // Envia as chaves esperadas pelo controller do backend
      await api.post(`/patients/${id}/vital-signs`, {
        pressao,
        glicemia: glicemia ? Number(glicemia) : null,
        temperatura: temperatura ? Number(temperatura) : null,
        frequenciaCardiaca: frequenciaCardiaca ? Number(frequenciaCardiaca) : null,
        saturacao: saturacao ? Number(saturacao) : null,
        observacoes: observacoes.trim() || null,
      });

      alert("Sinais vitais registrados com sucesso!");
      navigate(`/patients/${id}`); 
    } catch (error) {
      console.error("Erro ao salvar sinais vitais:", error);
      alert("Erro ao registrar sinais vitais. Verifique os dados inseridos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            Registrar Sinais Vitais
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Preencha os dados aferidos do paciente.
          </p>
        </div>

        <Link
          to={`/patients/${id}`}
          className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
        >
          &larr; Voltar para o perfil
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-xl border border-gray-100 bg-white p-6 shadow-xs"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* PRESSÃO ARTERIAL */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Pressão Arterial (mmHg) *
            </label>
            <input
              type="text"
              placeholder="Ex: 12/8 ou 120/80"
              value={pressao}
              onChange={(e) => setPressao(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* GLICEMIA */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Glicemia (mg/dL) *
            </label>
            <input
              type="number"
              placeholder="Ex: 95"
              value={glicemia}
              onChange={(e) => setGlicemia(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* TEMPERATURA */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Temperatura (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 36.5"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* FREQUÊNCIA CARDÍACA */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Frequência Cardíaca (bpm) *
            </label>
            <input
              type="number"
              placeholder="Ex: 72"
              value={frequenciaCardiaca}
              onChange={(e) => setFrequenciaCardiaca(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* SATURAÇÃO */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Saturação de Oxigênio (%) *
            </label>
            <input
              type="number"
              placeholder="Ex: 98"
              value={saturacao}
              onChange={(e) => setSaturacao(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
          </div>

          {/* OBSERVAÇÕES */}
          <div className="space-y-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Observações / Sintomas relatados
            </label>
            <textarea
              placeholder="Ex: Paciente queixou-se de leve dor de cabeça antes da medição..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full rounded-lg border border-gray-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              rows={3}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
          <Link
            to={`/patients/${id}`}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading || !id}
            className="rounded-lg bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}