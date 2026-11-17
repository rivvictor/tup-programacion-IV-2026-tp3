import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useAuth } from "./Auth";

export function VehiculosEditar() {
  const { id } = useParams();
  const [vehiculo, setVehiculo] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { fetchAuth } = useAuth();

  const obtenerVehiculo = useCallback(async () => {
    try {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`);
      if (!response.ok) {
        throw new Error("No se pudo cargar el vehículo");
      }
      const data = await response.json();
      setVehiculo(data);
    } catch (err) {
      setError(err.message);
    }
  }, [id, fetchAuth]);

  useEffect(() => {
    obtenerVehiculo();
  }, [obtenerVehiculo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetchAuth(`http://localhost:3000/vehiculos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vehiculo),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(
          errData.error ||
            errData.mensaje ||
            (errData.errors && errData.errors.map((e) => e.msg).join(", ")) ||
            "Error al actualizar el vehículo"
        );
      }

      navigate("/vehiculos");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!vehiculo) {
    return error ? <p style={{ color: "red" }}>{error}</p> : <p>Cargando...</p>;
  }

  return (
    <>
      <h2>Editar Vehículo #{id}</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="marca">Marca:</label>
        <input
          id="marca"
          type="text"
          value={vehiculo.marca}
          onChange={(e) => setVehiculo((v) => ({ ...v, marca: e.target.value }))}
          required
        />

        <label htmlFor="modelo">Modelo:</label>
        <input
          id="modelo"
          type="text"
          value={vehiculo.modelo}
          onChange={(e) => setVehiculo((v) => ({ ...v, modelo: e.target.value }))}
          required
        />

        <label htmlFor="patente">Patente:</label>
        <input
          id="patente"
          type="text"
          value={vehiculo.patente}
          onChange={(e) => setVehiculo((v) => ({ ...v, patente: e.target.value }))}
          required
        />

        <label htmlFor="anio">Año:</label>
        <input
          id="anio"
          type="number"
          min={1900}
          max={2100}
          value={vehiculo.anio}
          onChange={(e) => setVehiculo((v) => ({ ...v, anio: Number(e.target.value) }))}
          required
        />

        <label htmlFor="capacidad_carga">Capacidad de Carga (kg):</label>
        <input
          id="capacidad_carga"
          type="number"
          min={1}
          value={vehiculo.capacidad_carga}
          onChange={(e) =>
            setVehiculo((v) => ({ ...v, capacidad_carga: Number(e.target.value) }))
          }
          required
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button type="submit">Guardar cambios</button>{" "}
          <Link to="/vehiculos">
            <button type="button">Volver</button>
          </Link>
        </div>
      </form>
    </>
  );
}