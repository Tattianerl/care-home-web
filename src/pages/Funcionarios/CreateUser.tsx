import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { registerNewUser } from "../../services/users";
import { validarCPF } from "../../utils/validarCPF";
import { cargos } from "../../constants/cargos";

export function CreateUser() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState(""); 
  const [senha, setSenha] = useState("");
  const [cargo, setCargo] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    // Adicionado validação de preenchimento do CPF
    if (!nome || !email || !cpf || !senha || !cargo) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    const cpfLimpo = cpf.replace(/\D/g, "");

    // 1. Validação no Frontend (Se foi digitado errado)
    if (!validarCPF(cpfLimpo)) {
      alert("Por favor, digite um CPF válido.");
      return;
    }

    try {
      setLoading(true);

      // Envia os dados para o serviço (incluindo o cpfLimpo)
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
        const mensagemErro = error.response?.data?.error || "Erro ao registrar funcionário.";
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <Link to="/funcionarios" className="text-blue-600 hover:underline">
            ← Voltar
          </Link>
          <h1 className="text-3xl font-bold mt-2">Cadastrar Novo Funcionário</h1>
          <p className="text-gray-500 text-sm mt-1">
            Atenção: A função selecionada definirá o nível de acesso do profissional aos prontuários dos residentes.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow p-6 space-y-5 max-w-2xl"
      >
        <div>
          <label className="block font-semibold mb-2">Nome Completo</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Ex.: Dra. Ana Souza ou Cuidador Carlos"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            required
          />
        </div>
        <div>
          <label className="block font-semibold mb-2">CPF (Apenas números)</label>
          <input
            type="text"
            maxLength={11}
            value={cpf}
            onChange={(e) => setCpf(e.target.value.replace(/\D/g, ""))}
            placeholder="00000000000"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">E-mail (Login de Acesso)</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nome@casaderepouso.com"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Senha Provisória</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Defina a senha inicial do funcionário"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none text-gray-800"
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-2">Função / Cargo</label>
          <select
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
              className="w-full border rounded-lg p-3"
              required
            >
              <option value="">
                Selecione...
              </option>

              {cargos.map((item) => (
                <option
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </option>
              ))}
            </select>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
          <Link
            to="/funcionarios"
            className="px-6 py-3 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium transition-colors"
          >
            Cancelar
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium transition-colors"
          >
            {loading ? "Registrando..." : "Confirmar Cadastro"}
          </button>
        </div>
      </form>
    </div>
  );
}