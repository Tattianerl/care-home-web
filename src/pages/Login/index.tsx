import { useState } from "react";
import { login } from "../../services/auth";


export function Login(){
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");


    async function handleLogin(
    event: React.FormEvent
  ) {
    event.preventDefault();

    try {
      const data = await login(
        email,
        senha
      );
      localStorage.setItem(
        "@carehome:token",
        data.token
      );

      localStorage.setItem(
        "@carehome:user",
        JSON.stringify(data.user)
      );

      window.location.href =
        "/dashboard";

    } catch {
      alert(
        "Email ou senha inválidos"
      );
    }
  }


   return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">

      <form
        onSubmit={handleLogin}
        className="
          bg-white
          p-8
          rounded-xl
          shadow-md
          w-full
          max-w-md
        "
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Care Home
        </h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3 mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Senha"
          className="w-full border rounded-lg p-3 mb-4"
          value={senha}
          onChange={(e) =>
            setSenha(e.target.value)
          }
        />

        <button
          className="
            w-full
            bg-blue-600
            text-white
            py-3
            rounded-lg
          "
        >
          Entrar
        </button>
      </form>

    </div>
  );
}