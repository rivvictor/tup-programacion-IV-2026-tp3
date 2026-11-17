import { createContext, useCallback, useContext, useState } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);
  const [esAdmin, setEsAdmin] = useState(true);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, contrasena) => {
    setError(null);
    try {
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });

      const session = await response.json();

      if (!response.ok) {
        throw new Error(session.error || session.message || "Error al iniciar sesión");
      }

      setToken(session.token);
      setUsername(email);
      return { success: true };
    } catch (err) {
      setError(err.message);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
    setEsAdmin(null);
    setError(null);
  }, []);

  const fetchAuth = useCallback(
    async (url, options = {}) => {
      if (!token) {
        throw new Error("No está iniciada la sesión");
      }

      return fetch(url, {
        ...options,
        headers: { ...options.headers, Authorization: `Bearer ${token}` },
      });
    },
    [token],
  );

  return (
    <AuthContext.Provider
      value={{
        token,
        username,
        esAdmin,
        error,
        isAuthenticated: !!token,
        login,
        logout,
        fetchAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};