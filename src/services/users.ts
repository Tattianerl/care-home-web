import { api } from "./api";

interface RegisterUserData {
  nome: string;
  email: string;
  senha?: string;
  cargo: string;
}

export async function registerNewUser(data: RegisterUserData) {
  const response = await api.post("/register", data);
  return response.data;
}

interface ResetPasswordData {
  funcionarioId: string;
  novaSenhaProvisoria: string;
}

/**
 * 🔑 Permite ao Admin resetar a senha de um funcionário
 */
export async function adminResetPassword({ funcionarioId, novaSenhaProvisoria }: ResetPasswordData) {
  const token = localStorage.getItem("@CareHome:token");

  const response = await api.patch(
    "/users/admin-reset-password",
    { funcionarioId, novaSenhaProvisoria },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
}

interface UpdatePasswordData {
  senhaAntiga: string;
  novaSenha: string;
}

export async function updateOwnPassword(data: UpdatePasswordData): Promise<void> {
  const token = localStorage.getItem("@CareHome:token");
  
  await api.put("/users/update-password", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}