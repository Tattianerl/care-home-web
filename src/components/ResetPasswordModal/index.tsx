import { useState } from "react";
import { KeyRound, Lock, Eye, EyeOff, Loader2, AlertCircle, X } from "lucide-react";

import { adminResetPassword } from "../../services/users";

interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: { id: string; nome: string } | null;
}

export function ResetPasswordModal({
  isOpen,
  onClose,
  funcionario,
}: ResetPasswordModalProps) {
  const [novaSenha, setNovaSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen || !funcionario) return null;

  function handleClose() {
    setNovaSenha("");
    setErrorMessage(null);
    setSuccessMessage(null);
    setShowPassword(false);
    onClose();
  }

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!funcionario) return;

    if (novaSenha.length < 6) {
      setErrorMessage("A senha deve conter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true);

      await adminResetPassword({
        funcionarioId: funcionario.id,
        novaSenhaProvisoria: novaSenha,
      });

      setSuccessMessage(`A senha de ${funcionario.nome} foi redefinida com sucesso!`);
      
      // Fecha o modal após 1.5s para exibir o feedback de sucesso
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      setErrorMessage(
        err.response?.data?.error || "Ocorreu um erro ao redefinir a senha."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* CABEÇALHO */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Redefinir Senha
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Criar senha provisória de acesso
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Defina uma nova senha provisória para o colaborador{" "}
          <strong className="font-semibold text-slate-800">
            {funcionario.nome}
          </strong>
          .
        </p>

        {/* MENSAGENS DE FEEDBACK */}
        {errorMessage && (
          <div className="flex items-center gap-2.5 rounded-xl border border-rose-200 bg-rose-50/70 p-3 text-xs font-medium text-rose-800">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs font-medium text-emerald-800">
            <KeyRound className="h-4 w-4 shrink-0 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* FORMULÁRIO */}
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Nova Senha Provisória *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={carregando || !!successMessage}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="No mínimo 6 caracteres"
                className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:bg-slate-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* AÇÕES */}
          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={carregando}
              className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              type="submit"
              disabled={carregando || !!successMessage}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Confirmar Nova Senha</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}