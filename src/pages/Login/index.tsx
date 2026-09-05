import { useState } from "react";
import type { FormEvent } from "react";
import { Lock, Mail, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

import { login } from "../../services/auth";
import { Logo } from "../../components/Logo";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();
    setErrorMessage(null);

    try {
      setLoading(true);

      const data = await login(email, senha);

      localStorage.setItem("@carehome:token", data.token);
      localStorage.setItem("@carehome:user", JSON.stringify(data.user));
      if (data.user.cargo === "ADMIN") {
        window.location.href = "/funcionarios";
      } else {
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setErrorMessage("Email ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-slate-100 p-4 overflow-hidden">
      <div className="w-full max-w-md space-y-3">
        <div className="flex justify-center">
          {/* Logo com tamanho reduzido para ficar mais elegante */}
          <Logo className="max-w-[140px] md:max-w-[160px] h-auto" />
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 sm:p-6 shadow-sm space-y-4"
        >
          {errorMessage && (
            <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 text-xs font-medium text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              E-mail *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:bg-slate-50 disabled:opacity-60"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Senha *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={loading}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-10 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all disabled:bg-slate-50 disabled:opacity-60"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
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

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-3 px-4 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Entrando...</span>
              </>
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}