import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarFiltrosVehiculos,
  validarId,
  validarVehiculo,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

router.get(
  "/",
  validarAutenticacion,
  validarFiltrosVehiculos,
  verificarValidaciones,
  async (req, res) => {
    try {
      const { patente, marca } = req.query;
      let sql = "SELECT * FROM vehiculos WHERE 1=1";
      const params = [];

      if (patente) {
        sql += " AND patente LIKE ?";
        params.push(`%${patente}%`);
      }
      if (marca) {
        sql += " AND marca LIKE ?";
        params.push(`%${marca}%`);
      }

      sql += " ORDER BY id DESC";

      const [vehiculos] = await db.execute(sql, params);
      res.json(vehiculos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener los vehículos" });
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
      const [vehiculos] = await db.execute(
        "SELECT * FROM vehiculos WHERE id = ?",
        [id],
      );

      if (vehiculos.length === 0) {
        return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      }

      res.json(vehiculos[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener el vehículo" });
    }
  },
);

router.post(
  "/",
  validarAutenticacion,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    try {
      const { marca, modelo, patente, anio, capacidad_carga } = req.body;
      const patenteNormalizada = patente.toUpperCase();

      const [result] = await db.execute(
        "INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)",
        [marca, modelo, patenteNormalizada, anio, capacidad_carga],
      );

      res.status(201).json({
        id: result.insertId,
        marca,
        modelo,
        patente: patenteNormalizada,
        anio,
        capacidad_carga,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ mensaje: "Ya existe un vehículo con esa patente" });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear el vehículo" });
    }
  },
);

router.put(
  "/:id",
  validarAutenticacion,
  validarId,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const { marca, modelo, patente, anio, capacidad_carga } = req.body;
      const patenteNormalizada = patente.toUpperCase();

      const [result] = await db.execute(
        "UPDATE vehiculos SET marca = ?, modelo = ?, patente = ?, anio = ?, capacidad_carga = ? WHERE id = ?",
        [marca, modelo, patenteNormalizada, anio, capacidad_carga, id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      }

      res.json({
        id,
        marca,
        modelo,
        patente: patenteNormalizada,
        anio,
        capacidad_carga,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ mensaje: "Ya existe otro vehículo con esa patente" });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el vehículo" });
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
      const [result] = await db.execute("DELETE FROM vehiculos WHERE id = ?", [
        id,
      ]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Vehículo no encontrado" });
      }

      res.json({ mensaje: "Vehículo eliminado correctamente" });
    } catch (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          mensaje:
            "No se puede eliminar el vehículo porque tiene viajes asociados",
        });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el vehículo" });
    }
  },
);

export default router;