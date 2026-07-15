import { useState } from "react";
import { login } from "../../services/auth";

export function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();

    try {
      const data = await login(email, senha);
      
      // 1. Salva o token JWT
      localStorage.setItem("@carehome:token", data.token);

      // 2. Salva o objeto do usuário inteiro (útil para cargos e outros dados)
      localStorage.setItem("@carehome:user", JSON.stringify(data.user));

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Email ou senha inválidos");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-md"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Care Home
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border rounded-lg p-3 mb-4 text-gray-700"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Entrar
        </button>
      </form>
    </div>
  );
}