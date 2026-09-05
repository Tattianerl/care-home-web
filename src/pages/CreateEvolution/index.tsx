import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  PenTool,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  UserCheck,
  Lock,
} from "lucide-react";

import { createEvolution } from "../../services/evolutions";
import { Button } from "../../components/ui/Button";

import { useAuth } from "../../context/useAuth";
import { Roles } from "../../permissions/roles";

interface UserStorage {
  nome?: string;
  cargo?: string;
  funcao?: string;
}

export function CreateEvolution() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // 👇 Apenas equipe clínica e coordenação podem registrar evoluções clínicas
  const canManageEvolutions = user
    ? ([Roles.COORDENADOR, Roles.MEDICO, Roles.ENFERMEIRO, Roles.ASSISTENTE_SOCIAL] as string[]).includes(user.cargo)
    : false;

  const [descricao, setDescricao] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentUser] = useState<UserStorage>(() => {
    try {
      const userRaw = localStorage.getItem("@carehome:user");
      return userRaw ? JSON.parse(userRaw) : {};
    } catch (err) {
      console.error("Erro ao carregar dados do usuário logado:", err);
      return {};
    }
  });

  // Se o usuário não tiver permissão clínica, bloqueia o acesso à tela de criação
  if (!canManageEvolutions) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 mb-3">
          <Lock className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-slate-800">
          Acesso Restrito
        </h2>
        <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500">
          Apenas profissionais de saúde e coordenação possuem permissão para registrar evoluções clínicas dos residentes.
        </p>
        <div className="pt-4">
          <Link
            to={`/patients/${id}/evolutions`}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para evoluções
          </Link>
        </div>
      </div>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!id) return;

    if (!descricao.trim()) {
      setErrorMessage(
        "Por favor, descreva a evolução do residente antes de salvar."
      );
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setSaving(true);

      await createEvolution({
        descricao,
        patientId: id,
      });

      setSuccessMessage("Evolução registrada com sucesso!");

      setTimeout(() => {
        navigate(`/patients/${id}/evolutions`);
      }, 1200);
    } catch (error) {
      console.error("Erro ao registrar evolução:", error);
      setErrorMessage(
        "Não foi possível salvar o registro de evolução. Tente novamente."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* CABEÇALHO */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            to={`/patients/${id}/evolutions`}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Nova Evolução
            </h1>

            <p className="text-xs font-medium text-slate-500">
              Registre a evolução diária, sinais vitais ou ocorrências do residente.
            </p>
          </div>
        </div>
      </div>

      {/* FEEDBACKS */}
      {errorMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-4 text-xs font-medium text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {successMessage && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-4 text-xs font-medium text-emerald-800">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* FORMULÁRIO */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          {/* CARD DA ASSINATURA AUTOMÁTICA */}
          <div className="flex items-center justify-between rounded-xl border border-slate-200/70 bg-slate-50 p-3.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <UserCheck className="h-4 w-4" />
              </div>

              <div>
                <span className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Assinatura do Registro
                </span>

                <span className="font-bold text-slate-800">
                  {currentUser.nome || "Usuário do Sistema"}
                </span>

                {(currentUser.cargo || currentUser.funcao) && (
                  <span className="ml-1.5 text-slate-500">
                    ({currentUser.cargo || currentUser.funcao})
                  </span>
                )}
              </div>
            </div>

            <PenTool className="h-4 w-4 shrink-0 text-slate-400" />
          </div>

          {/* CAMPO DE TEXTO */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Descrição Detalhada da Evolução *
            </label>

            <textarea
              required
              rows={8}
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o estado do paciente, horários de medicações, alimentação, comportamento ou qualquer intercorrência relevante..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-400 transition-all focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* BARRAS DE AÇÃO */}
        <div className="flex items-center justify-end gap-3 pt-1">
          <Button
            type="button"
            variant="outline"
            disabled={saving}
            onClick={() => navigate(-1)}
          >
            Cancelar
          </Button>

          <Button type="submit" variant="success" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Salvar Evolução</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}