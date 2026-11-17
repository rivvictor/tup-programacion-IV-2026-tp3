import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";

export function Conductores() {
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);
  const { fetchAuth } = useAuth();

  const obtenerConductores = useCallback(async () => {
    setError(null);
    try {
      const response = await fetchAuth("http://localhost:3000/conductores");

      if (!response.ok) {
        throw new Error("Fallo al obtener los conductores");
      }

      const data = await response.json();
      setConductores(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setConductores([]);
    }
  }, [fetchAuth]);

  useEffect(() => {
    obtenerConductores();
  }, [obtenerConductores]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este conductor?")) return;

    try {
      const response = await fetchAuth(`http://localhost:3000/conductores/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.mensaje || "No se pudo eliminar el conductor");
      }

      obtenerConductores();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <h1>Conductores</h1>

      <Link to="/conductores/crear">
        <button>Nuevo conductor</button>
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>N° Documento</th>
            <th>N° Licencia</th>
            <th>Vencimiento Licencia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre}</td>
              <td>{c.apellido}</td>
              <td>{c.numero_documento}</td>
              <td>{c.numero_licencia}</td>
              <td>{c.fecha_vencimiento_licencia?.split("T")[0]}</td>
              <td>
                <Link to={`/conductores/${c.id}`}>
                  <button type="button">Editar</button>
                </Link>{" "}
                <button type="button" onClick={() => handleEliminar(c.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}