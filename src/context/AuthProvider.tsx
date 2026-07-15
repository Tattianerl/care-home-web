import { useState, type ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import { handleLogout } from "../services/auth";
import type { User } from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {

  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("@carehome:user");

    return storedUser
      ? (JSON.parse(storedUser) as User)
      : null;
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("@carehome:token");
  });

  function updateUser(user: User) {
    localStorage.setItem(
      "@carehome:user",
      JSON.stringify(user)
    );

    setUser(user);
  }

  function logout() {
    handleLogout();

    setUser(null);
    setToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}