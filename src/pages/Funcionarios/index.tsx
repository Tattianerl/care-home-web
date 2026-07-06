// src/pages/Funcionarios/index.tsx
import { useEffect, useState } from "react";
import { ResetPasswordModal } from "../../components/ResetPasswordModal";
import { api } from "../../services/api";
import { toggleUserStatus } from "../../services/users";

interface Funcionario {
  id: string;
  nome: string;
  email: string;
  cargo: string;
  ativo: boolean; 
}

export function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState<Funcionario | null>(null);
  const [carregando, setCarregando] = useState(true);

  // 1. Função utilizada apenas para atualizar a lista em segundo plano (após ativação/desativação)
  async function recarregarListaSemLoading() {
    try {
      const token = localStorage.getItem("@CareHome:token");
      const response = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFuncionarios(response.data);
    } catch (error) {
      console.error("Erro ao atualizar lista", error);
    }
  }

  useEffect(() => {
    // 2. Função isolada para a montagem inicial do componente, gerenciando o estado de loading
    async function inicializarComponente() {
      try {
        const token = localStorage.getItem("@CareHome:token");
        const response = await api.get("/users", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFuncionarios(response.data);
      } catch (error) {
        console.error("Erro ao carregar funcionários", error);
      } finally {
        setCarregando(false);
      }
    }

    inicializarComponente();
  }, []);

  // 3. Função para alternar o status do funcionário (Ativar/Desativar)
  async function handleToggleStatus(userId: string) {
    try {
      if (confirm("Tem certeza que deseja alterar o status deste funcionário?")) {
        await toggleUserStatus(userId);
        alert("Status atualizado com sucesso!");
        
        // Atualiza a lista na tela de forma limpa e segura
        await recarregarListaSemLoading(); 
      }
    } catch (error) {
      console.error("Erro detalhado ao alterar status:", error);
      alert("Erro ao alterar o status do funcionário.");
    }
  }

  if (carregando) {
    return <div className="p-6 text-center text-gray-600">Carregando funcionários...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Equipe CareHome</h1>
        <p className="text-sm text-gray-500">{funcionarios.length} funcionário(s) cadastrado(s)</p>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-gray-700 font-semibold text-sm">
              <th className="p-4">Nome</th>
              <th className="p-4">E-mail</th>
              <th className="p-4">Cargo</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {funcionarios.map((func) => (
              <tr key={func.id} className="hover:bg-gray-50 transition-colors text-gray-700">
                <td className="p-4 font-medium text-gray-900">{func.nome}</td>
                <td className="p-4 text-gray-500">{func.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    func.cargo === "admin" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {func.cargo}
                  </span>
                </td>
                {/* Coluna de Status Visual */}
                <td className="p-4 text-center">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    func.ativo ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {func.ativo ? "Ativo" : "Inativo"}
                  </span>
                </td>
                {/* Coluna de Ações com os botões integrados */}
                <td className="p-4 text-center space-x-2">
                  <button
                    onClick={() => {
                      setFuncionarioSelecionado(func);
                      setModalAberto(true);
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                  >
                    Resetar Senha
                  </button>

                  <button
                    onClick={() => handleToggleStatus(func.id)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors shadow-sm border ${
                      func.ativo 
                        ? "bg-white text-red-600 border-red-200 hover:bg-red-50" 
                        : "bg-white text-green-600 border-green-200 hover:bg-green-50"
                    }`}
                  >
                    {func.ativo ? "Desativar" : "Ativar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Janela flutuante (Modal) de Reset */}
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