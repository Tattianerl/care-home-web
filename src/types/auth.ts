import type { Role } from "../permissions/roles";

export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: Role;
}

export interface LoginResponse {
  user: User;
  token: string;
}