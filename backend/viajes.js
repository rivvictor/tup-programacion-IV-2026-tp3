import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarFiltrosViajes,
  validarId,
  validarViaje,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

router.get(
  "/",
  validarAutenticacion,
  validarFiltrosViajes,
  verificarValidaciones,
  async (req, res) => {
    try {
      const { vehiculo_id, conductor_id } = req.query;

      let sql = `
        SELECT 
          v.id,
          v.vehiculo_id,
          v.conductor_id,
          v.fecha_salida,
          v.fecha_llegada,
          v.origen,
          v.destino,
          v.kilometros,
          v.observaciones,
          ve.marca AS vehiculo_marca,
          ve.modelo AS vehiculo_modelo,
          ve.patente AS vehiculo_patente,
          c.nombre AS conductor_nombre,
          c.apellido AS conductor_apellido,
          c.numero_documento AS conductor_documento
        FROM viajes v
        JOIN vehiculos ve ON v.vehiculo_id = ve.id
        JOIN conductores c ON v.conductor_id = c.id
        WHERE 1=1
      `;
      const params = [];

      if (vehiculo_id) {
        sql += " AND v.vehiculo_id = ?";
        params.push(Number(vehiculo_id));
      }
      if (conductor_id) {
        sql += " AND v.conductor_id = ?";
        params.push(Number(conductor_id));
      }

      sql += " ORDER BY v.fecha_salida DESC";

      const [viajes] = await db.execute(sql, params);

      const totalKilometros = viajes.reduce(
        (acum, item) => acum + Number(item.kilometros),
        0,
      );

      res.json({
        viajes,
        totalKilometros: Number(totalKilometros.toFixed(2)),
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener los viajes" });
    }
  },
);

router.get(
  "/kilometros/vehiculo/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [vehiculos] = await db.execute(
        "SELECT id, marca, modelo, patente FROM vehiculos WHERE id = ?",
        [id],
      );
      if (vehiculos.length === 0) {
        return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      }

      const [rows] = await db.execute(
        "SELECT COALESCE(SUM(kilometros), 0) AS total_kilometros, COUNT(*) AS cantidad_viajes FROM viajes WHERE vehiculo_id = ?",
        [id],
      );

      res.json({
        vehiculo: vehiculos[0],
        total_kilometros: Number(rows[0].total_kilometros),
        cantidad_viajes: rows[0].cantidad_viajes,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ mensaje: "Error al calcular kilómetros del vehículo" });
    }
  },
);

router.get(
  "/kilometros/conductor/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [conductores] = await db.execute(
        "SELECT id, nombre, apellido, numero_documento FROM conductores WHERE id = ?",
        [id],
      );
      if (conductores.length === 0) {
        return res.status(404).json({ mensaje: "Conductor no encontrado" });
      }

      const [rows] = await db.execute(
        "SELECT COALESCE(SUM(kilometros), 0) AS total_kilometros, COUNT(*) AS cantidad_viajes FROM viajes WHERE conductor_id = ?",
        [id],
      );

      res.json({
        conductor: conductores[0],
        total_kilometros: Number(rows[0].total_kilometros),
        cantidad_viajes: rows[0].cantidad_viajes,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ mensaje: "Error al calcular kilómetros del conductor" });
    }
  },
);

router.get(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [viajes] = await db.execute("SELECT * FROM viajes WHERE id = ?", [
        id,
      ]);

      if (viajes.length === 0) {
        return res.status(404).json({ mensaje: "Viaje no encontrado" });
      }

      res.json(viajes[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener el viaje" });
    }
  },
);

router.post(
  "/",
  validarAutenticacion,
  validarViaje,
  verificarValidaciones,
  async (req, res) => {
    try {
      const {
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones,
      } = req.body;

      const [vehiculos] = await db.execute(
        "SELECT id FROM vehiculos WHERE id = ?",
        [vehiculo_id],
      );
      if (vehiculos.length === 0) {
        return res.status(400).json({ mensaje: "El vehículo seleccionado no existe" });
      }

      const [conductores] = await db.execute(
        "SELECT id, fecha_vencimiento_licencia FROM conductores WHERE id = ?",
        [conductor_id],
      );
      if (conductores.length === 0) {
        return res.status(400).json({ mensaje: "El conductor seleccionado no existe" });
      }

      const [result] = await db.execute(
        `INSERT INTO viajes 
        (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          vehiculo_id,
          conductor_id,
          fecha_salida,
          fecha_llegada,
          origen,
          destino,
          kilometros,
          observaciones || null,
        ],
      );

      res.status(201).json({
        id: result.insertId,
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones: observaciones || null,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al registrar el viaje" });
    }
  },
);

router.put(
  "/:id",
  validarAutenticacion,
  validarId,
  validarViaje,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const {
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones,
      } = req.body;

      const [result] = await db.execute(
        `UPDATE viajes 
        SET vehiculo_id = ?, conductor_id = ?, fecha_salida = ?, fecha_llegada = ?, origen = ?, destino = ?, kilometros = ?, observaciones = ? 
        WHERE id = ?`,
        [
          vehiculo_id,
          conductor_id,
          fecha_salida,
          fecha_llegada,
          origen,
          destino,
          kilometros,
          observaciones || null,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Viaje no encontrado" });
      }

      res.json({
        id,
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones: observaciones || null,
      });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res
          .status(400)
          .json({ mensaje: "Vehículo o conductor inexistente" });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el viaje" });
    }
  },
);

router.delete(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [result] = await db.execute("DELETE FROM viajes WHERE id = ?", [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Viaje no encontrado" });
      }

      res.json({ mensaje: "Viaje eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el viaje" });
    }
  },
);

export default router;