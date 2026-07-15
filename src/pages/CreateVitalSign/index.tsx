import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { api } from "../../services/api";

export function CreateVitalSign() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  // Estados do formulário - Alinhados com os nomes do seu request.body do backend
  const [pressao, setPressao] = useState(""); // Ajustado de pressaoArterial para pressao
  const [glicemia, setGlicemia] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [frequenciaCardiaca, setFrequenciaCardiaca] = useState("");
  const [saturacao, setSaturacao] = useState("");
  const [observacoes, setObservacoes] = useState(""); // Novo campo adicionado!
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) return;

    try {
      setLoading(true);

      // Envia as chaves exatas que o seu CreateVitalSignController espera
      await api.post(`/patients/${id}/vital-signs`, {
        pressao, // Nome exato do seu backend
        glicemia: Number(glicemia),
        temperatura: Number(temperatura),
        frequenciaCardiaca: Number(frequenciaCardiaca),
        saturacao: Number(saturacao),
        observacoes: observacoes || null, // Passa null se estiver em branco
      });

      alert("Sinais vitais registrados com sucesso!");
      navigate(`/patients/${id}`); 
    } catch (error) {
      console.error("Erro ao salvar sinais vitais:", error);
      alert("Erro ao registrar sinais vitais. Verifique os dados.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Registrar Sinais Vitais</h1>
        <Link
          to={`/patients/${id}`}
          className="text-sm text-gray-600 hover:underline"
        >
          Voltar para o perfil
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* PRESSÃO ARTERIAL */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Pressão Arterial (mmHg) *
            </label>
            <input
              type="text"
              placeholder="Ex: 12/8"
              value={pressao}
              onChange={(e) => setPressao(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {/* GLICEMIA */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Glicemia (mg/dL) *
            </label>
            <input
              type="number"
              placeholder="Ex: 95"
              value={glicemia}
              onChange={(e) => setGlicemia(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {/* TEMPERATURA */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Temperatura (°C) *
            </label>
            <input
              type="number"
              step="0.1"
              placeholder="Ex: 36.5"
              value={temperatura}
              onChange={(e) => setTemperatura(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {/* FREQUÊNCIA CARDÍACA */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">
              Frequência Cardíaca (bpm) *
            </label>
            <input
              type="number"
              placeholder="Ex: 72"
              value={frequenciaCardiaca}
              onChange={(e) => setFrequenciaCardiaca(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {/* SATURAÇÃO */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Saturação de Oxigênio (%) *
            </label>
            <input
              type="number"
              placeholder="Ex: 98"
              value={saturacao}
              onChange={(e) => setSaturacao(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          {/* OBSERVAÇÕES (NOVO CAMPO) */}
          <div className="space-y-1 sm:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Observações / Sintomas relatados
            </label>
            <textarea
              placeholder="Ex: Paciente queixou-se de leve dor de cabeça antes da medição..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full rounded-lg border p-3"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-3 font-semibold text-white transition hover:bg-green-700 disabled:bg-gray-400"
          >
            {loading ? "Salvando..." : "Salvar Registro"}
          </button>
        </div>
      </form>
    </div>
  );
}