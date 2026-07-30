import { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  PenTool,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Save,
  UserCheck,
} from "lucide-react";

import { createEvolution } from "../../services/evolutions";
import { Button } from "../../components/ui/Button";

interface UserStorage {
  nome?: string;
  cargo?: string;
  funcao?: string;
}

export function CreateEvolution() {
  const { id } = useParams();
  const navigate = useNavigate();

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!id) return;

    if (!descricao.trim()) {
      setErrorMessage("Por favor, descreva a evolução do residente antes de salvar.");
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      setSaving(true);

      const assinaturaProfissional =
        currentUser.nome || "Profissional Responsável";

      await createEvolution({
        descricao,
        patientId: id,
        assinatura: assinaturaProfissional,
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
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition-colors"
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
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-5">
          {/* CARD DA ASSINATURA AUTOMÁTICA */}
          <div className="flex items-center justify-between rounded-xl bg-slate-50 border border-slate-200/70 p-3.5 text-xs text-slate-600">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
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
            <PenTool className="h-4 w-4 text-slate-400 shrink-0" />
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
              className="w-full rounded-xl border border-slate-200 bg-white p-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all resize-y"
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