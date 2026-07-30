import { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Search,
  KeyRound,
  UserX,
  UserCheck,
  ShieldAlert,
  Users,
  Mail,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { ResetPasswordModal } from "../../components/ResetPasswordModal";
import { api } from "../../services/api";
import { getCargoLabel } from "../../utils/getCargoLabel";
import { useAuth } from "../../context/useAuth";
import { Roles, type Role } from "../../permissions/roles";
import { toggleUserStatus } from "../../services/users";

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: Role;
  ativo: boolean;
}

export function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [busca, setBusca] = useState("");

  const { token } = useAuth();

  const carregarFuncionarios = useCallback(async () => {
    try {
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao carregar funcionários", error);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;

    async function inicializarComponente() {
      await carregarFuncionarios();
      setCarregando(false);
    }

    void inicializarComponente();
  }, [token, carregarFuncionarios]);

  async function handleToggleStatus(userId: string) {
    try {
      if (confirm("Tem certeza que deseja alterar o status deste funcionário?")) {
        await toggleUserStatus(userId);
        alert("Status alterado com sucesso!");
        await carregarFuncionarios();
      }
    } catch (error) {
      console.error("Erro detalhado ao alterar status:", error);
      alert("Erro ao alterar o status do funcionário.");
    }
  }

  // Filtro de funcionários por nome ou e-mail
  const funcionariosFiltrados = useMemo(() => {
    const termo = busca.toLowerCase().trim();
    if (!termo) return funcionarios;

    return funcionarios.filter(
      (func) =>
        func.nome.toLowerCase().includes(termo) ||
        func.email.toLowerCase().includes(termo)
    );
  }, [funcionarios, busca]);

  // Função auxiliar para obter as iniciais do nome para o avatar
  const getIniciais = (nome: string) => {
    const partes = nome.trim().split(" ");
    if (partes.length === 1) return partes[0].substring(0, 2).toUpperCase();
    return (partes[0][0] + partes[partes.length - 1][0]).toUpperCase();
  };

  if (carregando) {
    return (
      <div className="space-y-6 pb-10">
        <div className="h-20 w-full animate-pulse rounded-2xl bg-slate-200/60" />
        <div className="h-12 w-72 animate-pulse rounded-xl bg-slate-200/60" />
        <div className="h-96 w-full animate-pulse rounded-2xl bg-slate-200/60" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Principal */}
      <header className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
            Equipe CareHome
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Gerencie as credenciais, permissões e acesso dos colaboradores da instituição.
          </p>
        </div>

        <Link
          to="/funcionarios/new"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition-all duration-200 hover:bg-emerald-700 active:scale-[0.98]"
        >
          <UserPlus className="h-4 w-4" />
          <span>Novo Funcionário</span>
        </Link>
      </header>

      {/* Barra de Filtros e Resumo */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <Users className="h-4 w-4 text-slate-400" />
          <span>
            Total: <strong className="text-slate-900">{funcionariosFiltrados.length}</strong> de{" "}
            {funcionarios.length} cadastrado(s)
          </span>
        </div>
      </div>

      {/* Tabela de Colaboradores */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs">
        {funcionariosFiltrados.length === 0 ? (
          <div className="py-16 text-center">
            <Users className="mx-auto h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-semibold text-slate-800">
              Nenhum funcionário encontrado
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              Tente ajustar os termos da sua busca.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200/80 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th scope="col" className="px-6 py-4">Colaborador</th>
                  <th scope="col" className="px-6 py-4">Cargo / Função</th>
                  <th scope="col" className="px-6 py-4 text-center">Status</th>
                  <th scope="col" className="px-6 py-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {funcionariosFiltrados.map((func) => (
                  <tr
                    key={func.id}
                    className="transition-colors hover:bg-slate-50/60"
                  >
                    {/* Nome e Avatar */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800 ring-2 ring-white">
                          {getIniciais(func.nome)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-900">
                            {func.nome}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="h-3 w-3" />
                            {func.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Cargo */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          func.cargo === Roles.ADMIN
                            ? "bg-purple-50 text-purple-700 ring-purple-600/20"
                            : "bg-blue-50 text-blue-700 ring-blue-600/20"
                        }`}
                      >
                        {func.cargo === Roles.ADMIN && (
                          <ShieldAlert className="h-3 w-3 text-purple-600" />
                        )}
                        {getCargoLabel(func.cargo)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          func.ativo
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20"
                            : "bg-rose-50 text-rose-700 ring-rose-600/20"
                        }`}
                      >
                        {func.ativo ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Ativo
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-rose-600" />
                            Inativo
                          </>
                        )}
                      </span>
                    </td>

                    {/* Botões de Ação */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setFuncionarioSelecionado(func);
                            setModalAberto(true);
                          }}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800 transition-colors hover:bg-amber-100"
                          title="Resetar senha"
                        >
                          <KeyRound className="h-3.5 w-3.5" />
                          <span>Resetar Senha</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(func.id)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                            func.ativo
                              ? "border-rose-200 bg-white text-rose-600 hover:bg-rose-50"
                              : "border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50"
                          }`}
                        >
                          {func.ativo ? (
                            <>
                              <UserX className="h-3.5 w-3.5" />
                              <span>Desativar</span>
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3.5 w-3.5" />
                              <span>Ativar</span>
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal para Reset de Senha */}
      <ResetPasswordModal
        isOpen={modalAberto}
        onClose={() => {
          setModalAberto(false);
          setFuncionarioSelecionado(null);
        }}
        funcionario={funcionarioSelecionado}
      />
    </div>
  );
}