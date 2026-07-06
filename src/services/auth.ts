import { api } from "./api";

export async function login(
  email: string,
  senha: string
) {
  const response = await api.post("/login", {
    email,
    senha,
  });

  return response.data;
}

export function handleLogout(){
  localStorage.removeItem("@carehome:token");
  localStorage.removeItem("@carehome:user");

  window.location.href = "/";
}