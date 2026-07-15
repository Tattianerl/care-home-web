import { api } from "./api";

interface RegisterUserData {
  nome: string;
  email: string;
  cpf: string;
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

export async function adminResetPassword({
  funcionarioId,
  novaSenhaProvisoria,
}: ResetPasswordData) {
  const response = await api.patch(
    "/users/admin-reset-password",
    {
      funcionarioId,
      novaSenhaProvisoria,
    }
  );

  return response.data;
}

interface UpdatePasswordData {
  senhaAntiga: string;
  novaSenha: string;
}

export async function updateOwnPassword(
  data: UpdatePasswordData
): Promise<void> {
  await api.put("/users/update-password", data);
}

export async function toggleUserStatus(
  id: string
): Promise<void> {
  await api.patch(`/users/${id}/toggle-status`);
}