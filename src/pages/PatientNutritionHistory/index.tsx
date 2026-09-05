import { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Apple,
  Scale,
  Ruler,
  Activity,
  Calendar,
  Trash2,
  Loader2,
  User,
  FileText,
} from "lucide-react";

import { nutritionService } from "../../services/nutritionService";
import { getPatient } from "../../services/patients";
import type { NutritionalAssessment } from "../../types/nutritionalAssessment";
import type { PatientDetails } from "../../types/patientDetails";

import { NewNutritionalAssessmentModal } from "../../components/nutrition/NewNutritionalAssessmentModal";
import { getImcClassification } from "../../utils/nutrition";

// 👇 Importando autenticação e roles
import { useAuth } from "../../context/useAuth";
import { Roles } from "../../permissions/roles";

export function PatientNutritionHistory() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();

  // 👇 Apenas equipe clínica, coordenação e serviço social podem gerenciar avaliações nutricionais
  const canManageNutrition = user
    ? ([Roles.COORDENADOR, Roles.MEDICO, Roles.ENFERMEIRO, Roles.ASSISTENTE_SOCIAL] as string[]).includes(user.cargo)
    : false;

  const [patient, setPatient] = useState<PatientDetails | null>(null);
  const [assessments, setAssessments] = useState<NutritionalAssessment[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Modais
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      const [patientData, nutritionData] = await Promise.all([
        getPatient(id),
        nutritionService.listByPatient(id).catch(() => []),
      ]);

      setPatient(patientData);
      setAssessments(Array.isArray(nutritionData) ? nutritionData : []);
    } catch (error) {
      console.error("Erro ao carregar histórico nutricional:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleDelete(assessmentId: string) {
    if (!canManageNutrition) return;

    if (!confirm("Tem certeza que deseja excluir esta avaliação nutricional?")) {
      return;
    }

    try {
      setDeletingId(assessmentId);
      await nutritionService.delete(assessmentId);
      setAssessments((prev) => prev.filter((item) => item.id !== assessmentId));
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      alert("Não foi possível excluir o registro.");
    } finally {
      setDeletingId(null);
    }
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Data inválida" : date.toLocaleString("pt-BR");
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          <span>Carregando histórico nutricional...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Cabeçalho */}
      <header className="space-y-3">
        <Link
          to={`/patients/${id}`}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 transition-colors hover:text-emerald-600"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar ao prontuário</span>
        </Link>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Apple className="h-6 w-6 text-emerald-600" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Histórico Nutricional
              </h1>
            </div>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Residente: <span className="font-semibold text-slate-700">{patient?.nome}</span>
            </p>
          </div>

          {/* 👇 Botão de nova avaliação exibido apenas para cargos autorizados */}
          {canManageNutrition && (
            <button
              type="button"
              onClick={() => setIsNewModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              <Plus className="h-4 w-4" />
              <span>Nova Avaliação</span>
            </button>
          )}
        </div>
      </header>

      {/* Lista de Avaliações */}
      {assessments.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Apple className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-sm font-bold text-slate-700">
            Nenhuma avaliação registrada
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            {canManageNutrition
              ? "Clique no botão acima para realizar o primeiro registro de peso e altura."
              : "Nenhum registro de avaliação nutricional cadastrado para este residente."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {assessments.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all hover:border-slate-300"
            >
              <div className="flex flex-col gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                  <Calendar className="h-4 w-4 text-emerald-600" />
                  <span>{formatDate(item.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3">
                  {item.user && (
                    <span className="flex items-center gap-1.5 text-xs text-slate-500">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      {item.user.nome} ({item.user.cargo})
                    </span>
                  )}

                  {/* 👇 Botão de exclusão exibido apenas para cargos autorizados */}
                  {canManageNutrition && (
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      disabled={deletingId === item.id}
                      className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                      title="Excluir avaliação"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Indicadores */}
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Scale className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Peso
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {item.peso} kg
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Ruler className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Altura
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {item.altura} m
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                    <Activity className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      IMC
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-slate-800">
                        {item.imc !== null ? Number(item.imc).toFixed(1) : "--"}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        ({getImcClassification(item.imc)})
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Observações */}
              {item.observacoes && (
                <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3 text-xs text-slate-600">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  <div>
                    <span className="font-semibold text-slate-700">Observações: </span>
                    {item.observacoes}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal de Nova Avaliação */}
      {id && patient && canManageNutrition && (
        <NewNutritionalAssessmentModal
          isOpen={isNewModalOpen}
          onClose={() => setIsNewModalOpen(false)}
          patientId={id}
          patientName={patient.nome}
          onSuccess={loadData}
        />
      )}
    </div>
  );
}