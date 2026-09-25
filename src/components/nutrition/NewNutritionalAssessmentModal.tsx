import React, { useEffect, useState } from "react";
import {
  X,
  Scale,
  Ruler,
  Activity,
  AlertCircle,
  Lock,
} from "lucide-react";
import { AxiosError } from "axios";

import { nutritionService } from "../../services/nutritionService";
import type { NutritionalAssessment } from "../../types/nutritionalAssessment";

import { useAuth } from "../../context/useAuth";
import { can } from "../../permissions/can";
import { Permissions } from "../../permissions/permissions";

interface NewNutritionalAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;

  // Se informado, o modal funciona como edição.
  assessment?: NutritionalAssessment | null;

  onSuccess?: (assessment: NutritionalAssessment) => void;
}

export function NewNutritionalAssessmentModal({
  isOpen,
  onClose,
  patientId,
  patientName,
  assessment = null,
  onSuccess,
}: NewNutritionalAssessmentModalProps) {
  const { user } = useAuth();

  const isEditMode = Boolean(assessment);

  const canCreateNutrition = user
    ? can(user.cargo, Permissions.CREATE_NUTRITION_ASSESSMENT)
    : false;

  const canEditNutrition = user
    ? can(user.cargo, Permissions.EDIT_NUTRITION_ASSESSMENT)
    : false;

  const canManageNutrition = isEditMode
    ? canEditNutrition
    : canCreateNutrition;

  const [peso, setPeso] = useState<string>("");
  const [altura, setAltura] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");

  const [imcCalculado, setImcCalculado] = useState<number | null>(null);
  const [classificacaoImc, setClassificacaoImc] = useState<string>("");
  const [corClassificacao, setCorClassificacao] =
    useState<string>("text-slate-600");

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  /*
   * Preenche o formulário quando estamos editando.
   *
   * Quando o modal é usado para criação, os campos permanecem vazios.
   */
  useEffect(() => {
    if (!isOpen) return;

    if (assessment) {
      setPeso(String(assessment.peso ?? ""));
      setAltura(String(assessment.altura ?? ""));
      setObservacoes(assessment.observacoes ?? "");
    } else {
      setPeso("");
      setAltura("");
      setObservacoes("");
    }

    setErrorMessage(null);
  }, [isOpen, assessment]);

  /*
   * Calcula o IMC em tempo real.
   */
  useEffect(() => {
    const numPeso = parseFloat(peso.replace(",", "."));
    let numAltura = parseFloat(altura.replace(",", "."));

    if (
      !isNaN(numPeso) &&
      !isNaN(numAltura) &&
      numPeso > 0 &&
      numAltura > 0
    ) {
      if (numAltura > 3) {
        numAltura = numAltura / 100;
      }

      const imc = parseFloat(
        (numPeso / (numAltura * numAltura)).toFixed(2)
      );

      setImcCalculado(imc);

      /*
       * Classificação para idosos.
       */
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
    setCorClassificacao("text-slate-600");
  };

  const handleClose = () => {
    if (isSubmitting) return;

    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!canManageNutrition) {
      setErrorMessage(
        isEditMode
          ? "Você não possui permissão para editar avaliações nutricionais."
          : "Você não possui permissão para registrar avaliações nutricionais."
      );
      return;
    }

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

      let savedAssessment: NutritionalAssessment;

      if (isEditMode && assessment) {
        savedAssessment = await nutritionService.update(assessment.id, {
          peso: numPeso,
          altura: numAltura,
          observacoes: observacoes.trim() || undefined,
        });
      } else {
        savedAssessment = await nutritionService.create({
          patientId,
          peso: numPeso,
          altura: numAltura,
          observacoes: observacoes.trim() || undefined,
        });
      }

      onSuccess?.(savedAssessment);

      handleClose();
    } catch (err: unknown) {
      console.error("Erro ao salvar avaliação nutricional:", err);

      if (err instanceof AxiosError && err.response?.data?.error) {
        setErrorMessage(err.response.data.error);
      } else {
        setErrorMessage(
          isEditMode
            ? "Erro ao atualizar a avaliação nutricional."
            : "Erro ao salvar a avaliação nutricional."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl transition-all">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              {isEditMode
                ? "Editar Avaliação Nutricional"
                : "Nova Avaliação Nutricional"}
            </h2>

            <p className="text-xs text-slate-500">
              Residente: {patientName}
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Verificação de permissão */}
        {!canManageNutrition ? (
          <div className="space-y-3 p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
              <Lock className="h-6 w-6" />
            </div>

            <h3 className="text-sm font-bold text-slate-800">
              Acesso Restrito
            </h3>

            <p className="mx-auto max-w-xs text-xs text-slate-500">
              {isEditMode
                ? "Seu perfil não possui autorização para editar avaliações nutricionais."
                : "Seu perfil não possui autorização para registrar avaliações nutricionais."}
            </p>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-200"
              >
                Fechar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 p-6">
            {errorMessage && (
              <div className="flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Peso */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Peso (kg){" "}
                  <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
                    className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Altura */}
              <div>
                <label className="mb-1 block text-xs font-semibold text-slate-700">
                  Altura (m ou cm){" "}
                  <span className="text-rose-500">*</span>
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
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
                    className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* IMC */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
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
                <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-2 text-xs">
                  <span className="text-slate-500">
                    Classificação (Idoso):
                  </span>

                  <span className={corClassificacao}>
                    {classificacaoImc}
                  </span>
                </div>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700">
                Observações / Apetite / Conduta
              </label>

              <textarea
                rows={3}
                placeholder="Ex: Boa aceitação da dieta pastosa. Apresenta leve ganho de peso em relação ao mês anterior."
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                className="w-full resize-none rounded-lg border border-slate-300 p-2.5 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            {/* Botões */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-50"
              >
                {isSubmitting
                  ? isEditMode
                    ? "Atualizando..."
                    : "Salvando..."
                  : isEditMode
                    ? "Atualizar Avaliação"
                    : "Salvar Avaliação"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
