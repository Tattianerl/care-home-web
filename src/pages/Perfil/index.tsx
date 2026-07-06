import { useState, type FormEvent } from "react";
import { updateOwnPassword } from "../../services/users";

export function Perfil() {
  const [senhaAntiga, setSenhaAntiga] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState<{ tipo: "sucesso" | "erro"; texto: string } | null>(null);

  async function handleAlterarSenha(e: FormEvent) {
    e.preventDefault();
    setMensagem(null);

    // Validação básica no front-end
    if (novaSenha !== confirmarSenha) {
      setMensagem({ tipo: "erro", texto: "A nova senha e a confirmação não coincidem." });
      return;
    }

    if (novaSenha.length < 6) {
      setMensagem({ tipo: "erro", texto: "A nova senha deve ter pelo menos 6 caracteres." });
      return;
    }

    try {
      setCarregando(true);
      await updateOwnPassword({ senhaAntiga, novaSenha });
      
      setMensagem({ tipo: "sucesso", texto: "Senha alterada com sucesso!" });
      // Limpa os campos após o sucesso
      setSenhaAntiga("");
      setNovaSenha("");
      setConfirmarSenha("");
    } catch (error: unknown) {
      const err = error as { response?: { data?: { error?: string } } };
      const erroMensagem = err.response?.data?.error || "Erro ao atualizar a senha. Tente novamente.";
      setMensagem({ tipo: "erro", texto: erroMensagem });
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Meu Perfil</h1>
      <p className="text-gray-500 mb-8">Gerencie suas informações de segurança e acesso ao sistema.</p>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-700 mb-6 border-b pb-3">Alterar Senha</h2>

        {mensagem && (
          <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${
            mensagem.tipo === "sucesso" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleAlterarSenha} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Senha Atual</label>
            <input
              type="password"
              required
              value={senhaAntiga}
              onChange={(e) => setSenhaAntiga(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
              placeholder="Digite sua senha atual"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Nova Senha</label>
            <input
              type="password"
              required
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
              placeholder="Mínimo de 6 caracteres"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Confirmar Nova Senha</label>
            <input
              type="password"
              required
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow outline-none"
              placeholder="Digite a nova senha novamente"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={carregando}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-sm transition-colors"
            >
              {carregando ? "Salvando..." : "Atualizar Senha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}