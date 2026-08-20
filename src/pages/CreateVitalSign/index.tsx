import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import {
  Activity,
  ArrowLeft,
  HeartPulse,
  Loader2,
  Ruler,
  Scale,
  Thermometer,
  Wind,
  Droplets,
} from "lucide-react";

import { createVitalSign } from "../../services/vitalSigns";

export function CreateVitalSign() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pressaoSistolica, setPressaoSistolica] =
    useState("");

  const [pressaoDiastolica, setPressaoDiastolica] =
    useState("");

  const [temperatura, setTemperatura] =
    useState("");

  const [frequenciaCardiaca, setFrequenciaCardiaca] =
    useState("");

  const [
    frequenciaRespiratoria,
    setFrequenciaRespiratoria,
  ] = useState("");

  const [saturacao, setSaturacao] =
    useState("");

  const [glicemia, setGlicemia] =
    useState("");

  const [peso, setPeso] =
    useState("");

  const [altura, setAltura] =
    useState("");

  const [dor, setDor] =
    useState("");

  const [observacoes, setObservacoes] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  function optionalNumber(
    value: string
  ): number | null {
    return value.trim()
      ? Number(value)
      : null;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!id) {
      alert(
        "ID do paciente não encontrado na URL."
      );
      return;
    }

    try {
      setLoading(true);

      await createVitalSign(id, {
        pressaoSistolica:
          Number(pressaoSistolica),

        pressaoDiastolica:
          Number(pressaoDiastolica),

        temperatura:
          Number(temperatura),

        frequenciaCardiaca:
          optionalNumber(
            frequenciaCardiaca
          ),

        frequenciaRespiratoria:
          optionalNumber(
            frequenciaRespiratoria
          ),

        saturacao:
          optionalNumber(saturacao),

        glicemia:
          optionalNumber(glicemia),

        peso:
          optionalNumber(peso),

        altura:
          optionalNumber(altura),

        dor:
          optionalNumber(dor),

        observacoes:
          observacoes.trim() || null,
      });

      alert(
        "Sinais vitais registrados com sucesso!"
      );

      navigate(`/patients/${id}`);
    } catch (error) {
      console.error(
        "Erro ao salvar sinais vitais:",
        error
      );

      alert(
        "Não foi possível registrar os sinais vitais. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link
            to={`/patients/${id}`}
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para o prontuário
          </Link>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Registrar Sinais Vitais
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Preencha os dados aferidos do paciente.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* Pressão sistólica */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Pressão Sistólica (mmHg) *
            </label>

            <input
              type="number"
              min="40"
              max="300"
              placeholder="Ex: 120"
              value={pressaoSistolica}
              onChange={(e) =>
                setPressaoSistolica(
                  e.target.value
                )
              }
              required
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Pressão diastólica */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Pressão Diastólica (mmHg) *
            </label>

            <input
              type="number"
              min="20"
              max="200"
              placeholder="Ex: 80"
              value={pressaoDiastolica}
              onChange={(e) =>
                setPressaoDiastolica(
                  e.target.value
                )
              }
              required
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Temperatura */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Temperatura (°C) *
            </label>

            <div className="relative">
              <Thermometer className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-orange-500" />

              <input
                type="number"
                step="0.1"
                min="30"
                max="45"
                placeholder="Ex: 36.5"
                value={temperatura}
                onChange={(e) =>
                  setTemperatura(
                    e.target.value
                  )
                }
                required
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Frequência cardíaca */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Frequência Cardíaca (bpm)
            </label>

            <div className="relative">
              <HeartPulse className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-rose-500" />

              <input
                type="number"
                min="30"
                max="250"
                placeholder="Ex: 72"
                value={frequenciaCardiaca}
                onChange={(e) =>
                  setFrequenciaCardiaca(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Frequência respiratória */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Frequência Respiratória (irpm)
            </label>

            <div className="relative">
              <Wind className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sky-500" />

              <input
                type="number"
                min="5"
                max="60"
                placeholder="Ex: 18"
                value={frequenciaRespiratoria}
                onChange={(e) =>
                  setFrequenciaRespiratoria(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Saturação */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Saturação de Oxigênio (%)
            </label>

            <div className="relative">
              <Activity className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-500" />

              <input
                type="number"
                min="50"
                max="100"
                placeholder="Ex: 98"
                value={saturacao}
                onChange={(e) =>
                  setSaturacao(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Glicemia */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Glicemia (mg/dL)
            </label>

            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-indigo-500" />

              <input
                type="number"
                min="1"
                placeholder="Ex: 95"
                value={glicemia}
                onChange={(e) =>
                  setGlicemia(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Peso */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Peso (kg)
            </label>

            <div className="relative">
              <Scale className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-500" />

              <input
                type="number"
                step="0.1"
                min="1"
                placeholder="Ex: 72.5"
                value={peso}
                onChange={(e) =>
                  setPeso(e.target.value)
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Altura */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Altura (m)
            </label>

            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-500" />

              <input
                type="number"
                step="0.01"
                min="0.3"
                placeholder="Ex: 1.70"
                value={altura}
                onChange={(e) =>
                  setAltura(
                    e.target.value
                  )
                }
                className="w-full rounded-xl border border-slate-300 py-3 pl-10 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Dor */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Dor (0 a 10)
            </label>

            <input
              type="number"
              min="0"
              max="10"
              placeholder="Ex: 3"
              value={dor}
              onChange={(e) =>
                setDor(e.target.value)
              }
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Observações */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
              Observações / Sintomas relatados
            </label>

            <textarea
              rows={4}
              maxLength={500}
              placeholder="Descreva observações relevantes..."
              value={observacoes}
              onChange={(e) =>
                setObservacoes(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-slate-300 p-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
          <Link
            to={`/patients/${id}`}
            className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading || !id}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Activity className="h-4 w-4" />
                Salvar Registro
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}