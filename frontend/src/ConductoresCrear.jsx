import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function ConductoresCrear() {
  const [conductor, setConductor] = useState({
    nombre: "",
    apellido: "",
    numero_documento: "",
    numero_licencia: "",
    fecha_alta_licencia: "",
    fecha_vencimiento_licencia: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetchAuth("http://localhost:3000/conductores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(conductor),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error ||
            errData.mensaje ||
            (errData.errors && errData.errors.map((e) => e.msg).join(", ")) ||
            "Error al crear el conductor"
        );
      }

      navigate("/conductores");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2>Nuevo Conductor</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre:</label>
        <input
          id="nombre"
          type="text"
          value={conductor.nombre}
          onChange={(e) => setConductor((c) => ({ ...c, nombre: e.target.value }))}
          required
        />

        <label htmlFor="apellido">Apellido:</label>
        <input
          id="apellido"
          type="text"
          value={conductor.apellido}
          onChange={(e) => setConductor((c) => ({ ...c, apellido: e.target.value }))}
          required
        />

        <label htmlFor="numero_documento">Número de Documento:</label>
        <input
          id="numero_documento"
          type="text"
          value={conductor.numero_documento}
          onChange={(e) => setConductor((c) => ({ ...c, numero_documento: e.target.value }))}
          required
        />

        <label htmlFor="numero_licencia">Número de Licencia:</label>
        <input
          id="numero_licencia"
          type="text"
          value={conductor.numero_licencia}
          onChange={(e) => setConductor((c) => ({ ...c, numero_licencia: e.target.value }))}
          required
        />

        <label htmlFor="fecha_alta_licencia">Fecha Alta Licencia:</label>
        <input
          id="fecha_alta_licencia"
          type="date"
          value={conductor.fecha_alta_licencia}
          onChange={(e) => setConductor((c) => ({ ...c, fecha_alta_licencia: e.target.value }))}
          required
        />

        <label htmlFor="fecha_vencimiento_licencia">Fecha Vencimiento Licencia:</label>
        <input
          id="fecha_vencimiento_licencia"
          type="date"
          value={conductor.fecha_vencimiento_licencia}
          onChange={(e) => setConductor((c) => ({ ...c, fecha_vencimiento_licencia: e.target.value }))}
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button type="submit">Crear</button>{" "}
          <Link to="/conductores">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}