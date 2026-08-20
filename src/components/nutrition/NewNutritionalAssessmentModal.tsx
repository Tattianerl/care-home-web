import React, { useState, useEffect } from "react";
import { X, Scale, Ruler, Activity, AlertCircle } from "lucide-react";
import { AxiosError } from "axios";
import { nutritionService } from "../../services/nutritionService";
import type { NutritionalAssessment } from "../../types/nutritionalAssessment";

interface NewNutritionalAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
  onSuccess?: (newAssessment: NutritionalAssessment) => void;
}

export function NewNutritionalAssessmentModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  onSuccess,
}: NewNutritionalAssessmentModalProps) {
  const [peso, setPeso] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");

  const [imcCalculado, setImcCalculado] = useState<number | null>(null);
  const [classificacaoImc, setClassificacaoImc] = useState<string>("");
  const [corClassificacao, setCorClassificacao] = useState<string>("text-slate-600");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Calcula o IMC e a classificação para Idosos (Lipschitz) em tempo real
  useEffect(() => {
    const numPeso = parseFloat(peso.replace(",", "."));
    let numAltura = parseFloat(altura.replace(",", "."));

    if (!isNaN(numPeso) && !isNaN(numAltura) && numPeso > 0 && numAltura > 0) {
      if (numAltura > 3) {
        numAltura = numAltura / 100;
      }

      const imc = parseFloat((numPeso / (numAltura * numAltura)).toFixed(2));
      setImcCalculado(imc);

      if (imc < 22) {
        setClassificacaoImc("Baixo peso / Desnutrição");
        setCorClassificacao("text-rose-600 font-bold");
      } else if (imc >= 22 && imc <= 27) {
        setClassificacaoImc("Eutrofia (Peso adequado)");
        setCorClassificacao("text-emerald-600 font-bold");
      } else {
        setClassificacaoImc("Sobrepeso / Obesidade");
        setCorClassificacao("text-amber-600 font-bold");
      }
    } else {
      setImcCalculado(null);
      setClassificacaoImc("");
      setCorClassificacao("text-slate-600");
    }
  }, [peso, altura]);

  if (!isOpen) return null;

  const resetForm = () => {
    setPeso("");
    setAltura("");
    setObservacoes("");
    setErrorMessage(null);
    setImcCalculado(null);
    setClassificacaoImc("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const numPeso = parseFloat(peso.replace(",", "."));
    let numAltura = parseFloat(altura.replace(",", "."));

    if (isNaN(numPeso) || numPeso <= 0) {
      setErrorMessage("Por favor, informe um peso válido.");
      return;
    }

    if (isNaN(numAltura) || numAltura <= 0) {
      setErrorMessage("Por favor, informe uma altura válida.");
      return;
    }

    if (numAltura > 3) {
      numAltura = numAltura / 100;
    }

    try {
      setIsSubmitting(true);

      const created = await nutritionService.create({
        patientId,
        peso: numPeso,
        altura: numAltura,
        observacoes: observacoes.trim() || undefined,
      });

      if (onSuccess) {
        onSuccess(created);
      }

      handleClose();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError && err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage("Erro ao salvar a avaliação nutricional.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-50">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Nova Avaliação Nutricional
            </h2>
            <p className="text-xs text-slate-500">Residente: {patientName}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Corpo do Formulário */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="flex items-center gap-2 rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Campo Peso */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Peso (kg) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Scale className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  placeholder="Ex: 68.5"
                  value={peso}
                  onChange={(e) => setPeso(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Campo Altura */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Altura (m ou cm) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Ruler className="h-4 w-4" />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 1.65 ou 165"
                  value={altura}
                  onChange={(e) => setAltura(e.target.value)}
                  required
                  className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Card de Cálculo em Tempo Real do IMC */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-700">
                  IMC Calculado (Tempo Real):
                </span>
              </div>
              <span className="text-base font-extrabold text-slate-900">
                {imcCalculado !== null ? imcCalculado : "—"}
              </span>
            </div>

            {classificacaoImc && (
              <div className="mt-2 pt-2 border-t border-slate-200 text-xs flex justify-between items-center">
                <span className="text-slate-500">Classificação (Idoso):</span>
                <span className={corClassificacao}>{classificacaoImc}</span>
              </div>
            )}
          </div>

          {/* Campo Observações */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações / Apetite / Conduta
            </label>
            <textarea
              rows={3}
              placeholder="Ex: Boa aceitação da dieta pastosa. Apresenta leve ganho de peso em relação ao mês anterior."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              className="w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 resize-none"
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {isSubmitting ? "Salvando..." : "Salvar Avaliação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}