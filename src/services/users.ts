import { api } from "./api";

import type { User } from "../types/user";
import type { UserRole } from "../types/enums";

export interface RegisterUserData {
  nome: string;
  email: string;
  cpf: string;
  cargo: UserRole;
  senha?: string;
  telefone?: string;
  registroProfissional?: string;
  dataAdmissao?: string;
  observacoes?: string;
  fotoUrl?: string;
  assinatura?: string;
}

export interface ResetPasswordData {
  funcionarioId: string;
  novaSenhaProvisoria: string;
}

export interface UpdatePasswordData {
  senhaAntiga: string;
  novaSenha: string;
}

export async function registerNewUser(
  data: RegisterUserData
): Promise<User> {
  const { data: response } = await api.post<User>(
    "/register",
    data
  );

  return response;
}

export async function adminResetPassword(
  data: ResetPasswordData
): Promise<void> {
  await api.patch(
    "/users/admin-reset-password",
    data
  );
}

export async function updateOwnPassword(
  data: UpdatePasswordData
): Promise<void> {
  await api.put(
    "/users/update-password",
    data
  );
}

export async function toggleUserStatus(
  id: string
): Promise<void> {
  await api.patch(
    `/users/${id}/toggle-status`
  );
}