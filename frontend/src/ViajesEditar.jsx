import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "./Auth";

export function ViajesEditar() {
  const { id } = useParams();
  const [viaje, setViaje] = useState(null);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const cargarDatos = useCallback(async () => {
    try {
      const [resViaje, resVehiculos, resConductores] = await Promise.all([
        fetchAuth(`http://localhost:3000/viajes/${id}`),
        fetchAuth("http://localhost:3000/vehiculos"),
        fetchAuth("http://localhost:3000/conductores"),
      ]);

      if (!resViaje.ok) throw new Error("No se pudo cargar el viaje");

      const dataViaje = await resViaje.json();
      
      setViaje({
        ...dataViaje,
        fecha_salida: dataViaje.fecha_salida ? dataViaje.fecha_salida.substring(0, 16) : "",
        fecha_llegada: dataViaje.fecha_llegada ? dataViaje.fecha_llegada.substring(0, 16) : "",
      });

      if (resVehiculos.ok) setVehiculos(await resVehiculos.json());
      if (resConductores.ok) setConductores(await resConductores.json());
    } catch (err) {
      setError(err.message);
    }
  }, [id, fetchAuth]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetchAuth(`http://localhost:3000/viajes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(viaje),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error ||
            errData.mensaje ||
            (errData.errors && errData.errors.map((e) => e.msg).join(", ")) ||
            "Error al actualizar el viaje"
        );
      }

      navigate("/viajes");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!viaje) {
    return error ? <p style={{ color: "red" }}>{error}</p> : <p>Cargando...</p>;
  }

  return (
    <>
      <h2>Editar Viaje #{id}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="vehiculo_id">Vehículo:</label>
        <select
          id="vehiculo_id"
          value={viaje.vehiculo_id}
          onChange={(e) => setViaje((v) => ({ ...v, vehiculo_id: Number(e.target.value) }))}
          required
        >
          <option value={0}>Seleccione un vehículo</option>
          {vehiculos.map((vh) => (
            <option key={vh.id} value={vh.id}>
              {vh.marca} {vh.modelo} - {vh.patente}
            </option>
          ))}
        </select>

        <label htmlFor="conductor_id">Conductor:</label>
        <select
          id="conductor_id"
          value={viaje.conductor_id}
          onChange={(e) => setViaje((v) => ({ ...v, conductor_id: Number(e.target.value) }))}
          required
        >
          <option value={0}>Seleccione un conductor</option>
          {conductores.map((c) => (
            <option key={c.id} value={c.id}>
              {c.apellido}, {c.nombre} (DNI: {c.numero_documento})
            </option>
          ))}
        </select>

        <label htmlFor="origen">Origen:</label>
        <input
          id="origen"
          type="text"
          value={viaje.origen}
          onChange={(e) => setViaje((v) => ({ ...v, origen: e.target.value }))}
          required
        />

        <label htmlFor="destino">Destino:</label>
        <input
          id="destino"
          type="text"
          value={viaje.destino}
          onChange={(e) => setViaje((v) => ({ ...v, destino: e.target.value }))}
          required
        />

        <label htmlFor="fecha_salida">Fecha y Hora de Salida:</label>
        <input
          id="fecha_salida"
          type="datetime-local"
          value={viaje.fecha_salida}
          onChange={(e) => setViaje((v) => ({ ...v, fecha_salida: e.target.value }))}
          required
        />

        <label htmlFor="fecha_llegada">Fecha y Hora de Llegada:</label>
        <input
          id="fecha_llegada"
          type="datetime-local"
          value={viaje.fecha_llegada}
          onChange={(e) => setViaje((v) => ({ ...v, fecha_llegada: e.target.value }))}
          required
        />

        <label htmlFor="kilometros">Kilómetros:</label>
        <input
          id="kilometros"
          type="number"
          step="0.01"
          min={0}
          value={viaje.kilometros}
          onChange={(e) => setViaje((v) => ({ ...v, kilometros: Number(e.target.value) }))}
          required
        />

        <label htmlFor="observaciones">Observaciones:</label>
        <input
          id="observaciones"
          type="text"
          value={viaje.observaciones}
          onChange={(e) => setViaje((v) => ({ ...v, observaciones: e.target.value }))}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button type="submit">Guardar cambios</button>{" "}
          <Link to="/viajes">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}