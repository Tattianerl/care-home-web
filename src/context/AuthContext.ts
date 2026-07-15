import { createContext } from "react";
import type { User } from "../types/auth";

export interface AuthContextData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  logout: () => void;
  updateUser: (user: User) => void;
}

export const AuthContext =
  createContext({} as AuthContextData);