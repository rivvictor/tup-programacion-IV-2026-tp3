import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";

export function Vehiculos() {
  const [vehiculos, setVehiculos] = useState([]);
  const [error, setError] = useState(null);
  const { fetchAuth } = useAuth();

  const obtenerVehiculos = useCallback(async () => {
    setError(null);
    try {
      const response = await fetchAuth("http://localhost:3000/vehiculos");

      if (!response.ok) {
        throw new Error("Fallo al obtener los vehículos");
      }

      const data = await response.json();
      setVehiculos(data);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setVehiculos([]);
    }
  }, [fetchAuth]);

  useEffect(() => {
    obtenerVehiculos();
  }, [obtenerVehiculos]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este vehículo?")) return;

    try {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.mensaje || "No se pudo eliminar el vehículo");
      }

      obtenerVehiculos();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <h1>Vehículos</h1>

      <Link to="/vehiculos/crear">
        <button>Nuevo vehículo</button>
      </Link>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Patente</th>
            <th>Año</th>
            <th>Capacidad de Carga (kg)</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.patente}</td>
              <td>{v.anio}</td>
              <td>{v.capacidad_carga}</td>
              <td>
                <Link to={`/vehiculos/${v.id}`}>
                  <button type="button">Editar</button>
                </Link>{" "}
                <button type="button" onClick={() => handleEliminar(v.id)}>
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