import { Outlet } from "react-router";
import { useAuth } from "./Auth";

export function AuthLayout({ soloAdmin = false }) {
  const { isAuthenticated, esAdmin } = useAuth();

  if (!isAuthenticated) {
    return <p>No está autenticado</p>;
  }

  if (soloAdmin && !esAdmin) {
    return <p>No está autorizado</p>;
  }

  return <Outlet />;
}