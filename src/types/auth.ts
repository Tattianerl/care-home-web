export interface User {
  id: string;
  nome: string;
  email: string;
  cargo: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}