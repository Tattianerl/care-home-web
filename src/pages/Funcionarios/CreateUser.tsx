import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import {
  ArrowLeft,
  UserPlus,
  ShieldAlert,
  User,
  CreditCard,
  Mail,
  Lock,
  Briefcase,
  Loader2,
} from "lucide-react";

import { registerNewUser } from "../../services/users";
import { validarCPF } from "../../utils/validarCPF";
import { cargos } from "../../constants/cargos";
import { UserRole } from "../../types/enums";

export function CreateUser() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState<UserRole | "">("");
  const [loading, setLoading] = useState(false);

  // Formatação em tempo real do CPF (ex: 000.000.000-00)
  const handleCpfChange = (value: string) => {
    const apenasNumeros = value.replace(/\D/g, "").slice(0, 11);
    const cpfFormatado = apenasNumeros
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");

    setCpf(cpfFormatado);
  };

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!nome || !email || !cpf || !senha || !cargo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!validarCPF(cpfLimpo)) {
      alert("Por favor, digite um CPF válido.");
      return;
    }

    try {
      setLoading(true);

      await registerNewUser({
        nome,
        email,
        cpf: cpfLimpo,
        senha,
        cargo,
      });

      alert("Funcionário registrado com sucesso!");
      navigate("/funcionarios");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const mensagemErro =
          error.response?.data?.error || "Erro ao registrar funcionário.";
        alert(mensagemErro);
      } else {
        console.error(error);
        alert("Erro inesperado ao registrar o funcionário.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-8 pb-10">
      {/* Botão de Voltar + Header Principal */}
      <header className="space-y-3">
        <Link
          to="/funcionarios"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Voltar para lista de funcionários</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
            <UserPlus className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
              Cadastrar Novo Funcionário
            </h1>
            <p className="mt-0.5 text-sm text-slate-500">
              Preencha as credenciais do novo colaborador para liberá-lo no sistema.
            </p>
          </div>
        </div>
      </header>

      {/* Banner Informativo sobre Níveis de Acesso */}
      <div className="flex items-start gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4 text-amber-900">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
        <p className="text-xs leading-relaxed text-amber-800">
          <strong>Atenção:</strong> A função/cargo selecionada definirá o nível de
          permissão para leitura e edição nos prontuários e módulos clínicos dos residentes.
        </p>
      </div>

      {/* Formulário Principal */}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs md:p-8"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Nome Completo */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Nome Completo
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Dra. Ana Souza ou Cuidador Carlos"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>

          {/* CPF */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              CPF
            </label>
            <div className="relative">
              <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={cpf}
                onChange={(e) => handleCpfChange(e.target.value)}
                placeholder="000.000.000-00"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>

          {/* Função / Cargo */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Função / Cargo
            </label>
            <div className="relative">
              <Briefcase className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <select
                value={cargo}
                onChange={(e) => setCargo(e.target.value as UserRole | "")}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              >
                <option value="">Selecione o cargo...</option>
                {cargos.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* E-mail */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              E-mail (Login de Acesso)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@casaderepouso.com"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>

          {/* Senha Provisória */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Senha Provisória
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Defina a senha inicial"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                required
              />
            </div>
          </div>
        </div>

        {/* Rodapé de Ações */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <Link
            to="/funcionarios"
            className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-semibold text-white shadow-xs transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Registrando...</span>
              </>
            ) : (
              <span>Confirmar Cadastro</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}