import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function Layout() {
  const { isAuthenticated, logout, username } = useAuth();
  const { pathname } = useLocation();
  const useNavigateHook = useNavigate();

  return (
    <main>
      <nav>
        <ul>
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">Inicio</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className={pathname.startsWith("/vehiculos") ? "active" : ""}>
                <Link to="/vehiculos">Vehículos</Link>
              </li>
              <li className={pathname.startsWith("/conductores") ? "active" : ""}>
                <Link to="/conductores">Conductores</Link>
              </li>
              <li className={pathname.startsWith("/viajes") ? "active" : ""}>
                <Link to="/viajes">Viajes</Link>
              </li>
              <span style={{ alignSelf: "center", marginLeft: "auto", fontSize: "0.9rem" }}>
                👤 {username}
              </span>
              <button
                onClick={() => {
                  logout();
                  useNavigateHook("/");
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <li className={pathname.startsWith("/login") ? "active" : ""}>
              <Link to="/login">Ingresar</Link>
            </li>
          )}
        </ul>
      </nav>
      <hr style={{ margin: "15px 0", border: "0", borderTop: "1px solid lightslategray" }} />
      <Outlet />
    </main>
  );
}