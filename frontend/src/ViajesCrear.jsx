import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function ViajesCrear() {
  const [viaje, setViaje] = useState({
    vehiculo_id: 0,
    conductor_id: 0,
    fecha_salida: "",
    fecha_llegada: "",
    origen: "",
    destino: "",
    kilometros: 0,
    observaciones: "",
  });
  
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const cargarDatosAsociados = useCallback(async () => {
    try {
      const [resVehiculos, resConductores] = await Promise.all([
        fetchAuth("http://localhost:3000/vehiculos"),
        fetchAuth("http://localhost:3000/conductores"),
      ]);

      if (resVehiculos.ok) setVehiculos(await resVehiculos.json());
      if (resConductores.ok) setConductores(await resConductores.json());
    } catch (err) {
      console.error("Error al cargar vehículos o conductores", err);
    }
  }, [fetchAuth]);

  useEffect(() => {
    cargarDatosAsociados();
  }, [cargarDatosAsociados]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetchAuth("http://localhost:3000/viajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(viaje),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error ||
            errData.mensaje ||
            (errData.errors && errData.errors.map((e) => e.msg).join(", ")) ||
            "Error al registrar el viaje"
        );
      }

      navigate("/viajes");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <h2>Nuevo Viaje</h2>
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
          <button type="submit">Crear</button>{" "}
          <Link to="/viajes">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}