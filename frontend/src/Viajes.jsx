import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "./Auth";

export function Viajes() {
  const [viajes, setViajes] = useState([]);
  const [totalKilometros, setTotalKilometros] = useState(0);
  const [error, setError] = useState(null);
  const { fetchAuth } = useAuth();

  const obtenerViajes = useCallback(async () => {
    setError(null);
    try {
      const response = await fetchAuth("http://localhost:3000/viajes");

      if (!response.ok) {
        throw new Error("Fallo al obtener los viajes");
      }

      const data = await response.json();
      
      setViajes(Array.isArray(data) ? data : (data.viajes || []));
      setTotalKilometros(data.totalKilometros || 0);
    } catch (err) {
      console.error(err);
      setError(err.message);
      setViajes([]);
    }
  }, [fetchAuth]);

  useEffect(() => {
    obtenerViajes();
  }, [obtenerViajes]);

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que querés eliminar este viaje?")) return;

    try {
      const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || errData.mensaje || "No se pudo eliminar el viaje");
      }

      obtenerViajes();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <h1>Viajes</h1>

      <Link to="/viajes/crear">
        <button>Nuevo viaje</button>
      </Link>

      <p style={{ marginTop: "10px", fontWeight: "bold" }}>
        Kilómetros totales recorridos: {totalKilometros} km
      </p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo</th>
            <th>Conductor</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Salida</th>
            <th>Llegada</th>
            <th>Km</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {viajes.map((v) => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{v.vehiculo_marca ? `${v.vehiculo_marca} ${v.vehiculo_modelo} (${v.vehiculo_patente})` : v.vehiculo_id}</td>
              <td>{v.conductor_nombre ? `${v.conductor_nombre} ${v.conductor_apellido}` : v.conductor_id}</td>
              <td>{v.origen}</td>
              <td>{v.destino}</td>
              <td>{v.fecha_salida?.replace("T", " ").substring(0, 16)}</td>
              <td>{v.fecha_llegada?.replace("T", " ").substring(0, 16)}</td>
              <td>{v.kilometros}</td>
              <td>
                <Link to={`/viajes/${v.id}`}>
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