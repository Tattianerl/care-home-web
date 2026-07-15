import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import type { Role } from "../permissions/roles";

interface ProtectedRouteProps {
  allowedRoles?: readonly  Role[];
}

export function ProtectedRoute({
  allowedRoles,
}: ProtectedRouteProps) {

  const { user, isAuthenticated } = useAuth();


  if (!isAuthenticated) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }


  if (
    allowedRoles &&
    (!user || !allowedRoles.includes(user.cargo))
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  return <Outlet />;
}