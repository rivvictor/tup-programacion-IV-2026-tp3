import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function Login() {
  const { error, login } = useAuth();
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, contrasena);
    if (res.success) {
      navigate("/");
    }
  };

  return (
    <>
      <h2>Ingresar al Sistema</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Correo electrónico:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="contrasena">Contraseña:</label>
        <input
          id="contrasena"
          name="contrasena"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button type="submit">Ingresar</button>{" "}
          <Link to="/registro">
            <button type="button">Registrarse</button>
          </Link>{" "}
          <Link to="/">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}