import { useState } from "react";
import type { FormEvent } from "react";
import { AxiosError } from "axios";
import {
  User,
  ShieldCheck,
  KeyRound,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { updateOwnPassword } from "../../services/users";

export function Perfil() {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{
    tipo: "sucesso" | "erro";
    texto: string;
  } | null>(null);

  async function handleAlterarSenha(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    // Validações no front-end
    if (novaSenha !== confirmarSenha) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha e a confirmação não coincidem.",
      });
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem({
        tipo: "erro",
        texto: "A nova senha deve ter pelo menos 6 caracteres.",
      });
      return;
    }

    try {
      setCarregando(true);
      await updateOwnPassword({ senhaAntiga, novaSenha });

      setMensagem({
        tipo: "sucesso",
        texto: "Senha alterada com sucesso!",
      });

      // Limpa os campos após o sucesso
      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const mensagemErro =
          error.response?.data?.error ||
          "Erro ao atualizar a senha. Verifique sua senha atual.";
        setMensagem({ tipo: "erro", texto: mensagemErro });
      } else {
        console.error(error);
        setMensagem({
          tipo: "erro",
          texto: "Erro inesperado ao atualizar a senha. Tente novamente.",
        });
      }
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* Header da Página */}
      <header className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Meu Perfil
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Gerencie suas credenciais e configurações de segurança de acesso.
          </p>
        </div>
      </header>

      {/* Card de Alteração de Senha */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-6">
          <ShieldCheck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-base font-bold text-slate-800">
            Segurança & Alteração de Senha
          </h2>
        </div>

        {/* Feedback visual de mensagens */}
        {mensagem && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-xs font-medium ${
              mensagem.tipo === "sucesso"
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-800"
                : "border-rose-200 bg-rose-50/70 text-rose-800"
            }`}
          >
            {mensagem.tipo === "sucesso" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
            )}
            <span>{mensagem.texto}</span>
          </div>
        )}

        <form onSubmit={handleAlterarSenha} className="space-y-5">
          {/* Senha Atual */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Senha Atual
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={senhaAntiga}
                onChange={(e) => setSenhaAntiga(e.target.value)}
                placeholder="Digite sua senha atual"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Nova Senha */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={novaSenha}
                  onChange={(e) => setNovaSenha(e.target.value)}
                  placeholder="Mínimo de 6 caracteres"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>

            {/* Confirmar Nova Senha */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Confirmar Nova Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  value={confirmarSenha}
                  onChange={(e) => setConfirmarSenha(e.target.value)}
                  placeholder="Repita a nova senha"
                  className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
            </div>
          </div>

          {/* Botão de Envio */}
          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={carregando}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
            >
              {carregando ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Salvando...</span>
                </>
              ) : (
                <span>Atualizar Senha</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}