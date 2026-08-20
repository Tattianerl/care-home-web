import { api } from "./api";

import type { User } from "../types/user";

export interface LoginResponse {
  token: string;
  user: User;
}

export async function login(
  email: string,
  senha: string
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>("/login", {
    email,
    senha,
  });

  return data;
}

export function handleLogout() {
  localStorage.removeItem("@carehome:token");
  localStorage.removeItem("@carehome:user");
  localStorage.removeItem("@carehome:userName");

  window.location.href = "/";
}