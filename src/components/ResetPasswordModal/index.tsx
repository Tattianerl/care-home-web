// src/components/ResetPasswordModal.tsx
import { useState } from "react";
import { adminResetPassword } from "../../services/users";


interface ResetPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  funcionario: { id: string; nome: string } | null;
}

export function ResetPasswordModal({ isOpen, onClose, funcionario }: ResetPasswordModalProps) {
  const [novaSenha, setNovaSenha] = useState("");
  const [carregando, setCarregando] = useState(false);

  // Se o modal não estiver aberto ou não houver funcionário, não renderiza nada
  if (!isOpen || !funcionario) return null;

  async function handleResetSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!funcionario) return;

    if (novaSenha.length < 6) {
      alert("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    try {
      setCarregando(true); 
      
      await adminResetPassword({
        funcionarioId: funcionario.id,
        novaSenhaProvisoria: novaSenha,
      });

      alert(`A senha de ${funcionario.nome} foi redefinida com sucesso!`);
      setNovaSenha("");
      onClose();
    } catch (error: unknown) { 
      const err = error as { response?: { data?: { error?: string } } };
      alert(err.response?.data?.error || "Erro ao resetar senha.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg text-gray-800">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Resetar Senha</h3>
        <p className="text-sm text-gray-600 mb-4">
          Defina uma nova senha provisória para o funcionário: <strong className="text-gray-900">{funcionario.nome}</strong>.
        </p>

        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nova Senha Provisória
            </label>
            <input
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="No mínimo 6 caracteres"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={carregando}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
            >
              {carregando ? "Salvando..." : "Confirmar Nova Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}