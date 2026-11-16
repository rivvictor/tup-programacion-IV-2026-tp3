import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarConductor,
  validarFiltrosConductores,
  validarId,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

router.get(
  "/",
  validarAutenticacion,
  validarFiltrosConductores,
  verificarValidaciones,
  async (req, res) => {
    try {
      const { apellido, documento } = req.query;
      let sql = "SELECT * FROM conductores WHERE 1=1";
      const params = [];

      if (apellido) {
        sql += " AND apellido LIKE ?";
        params.push(`%${apellido}%`);
      }
      if (documento) {
        sql += " AND numero_documento LIKE ?";
        params.push(`%${documento}%`);
      }

      sql += " ORDER BY apellido ASC, nombre ASC";

      const [conductores] = await db.execute(sql, params);
      res.json(conductores);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener los conductores" });
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
      const [conductores] = await db.execute(
        "SELECT * FROM conductores WHERE id = ?",
        [id],
      );

      if (conductores.length === 0) {
        return res.status(404).json({ mensaje: "Conductor no encontrado" });
      }

      res.json(conductores[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener el conductor" });
    }
  },
);

router.post(
  "/",
  validarAutenticacion,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    try {
      const {
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia,
      } = req.body;

      const [result] = await db.execute(
        `INSERT INTO conductores 
        (nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia) 
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
          nombre,
          apellido,
          numero_documento,
          numero_licencia,
          fecha_alta_licencia,
          fecha_vencimiento_licencia,
        ],
      );

      res.status(201).json({
        id: result.insertId,
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          mensaje: "El número de documento o de licencia ya está registrado",
        });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al crear el conductor" });
    }
  },
);

router.put(
  "/:id",
  validarAutenticacion,
  validarId,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const {
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia,
      } = req.body;

      const [result] = await db.execute(
        `UPDATE conductores 
        SET nombre = ?, apellido = ?, numero_documento = ?, numero_licencia = ?, fecha_alta_licencia = ?, fecha_vencimiento_licencia = ? 
        WHERE id = ?`,
        [
          nombre,
          apellido,
          numero_documento,
          numero_licencia,
          fecha_alta_licencia,
          fecha_vencimiento_licencia,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Conductor no encontrado" });
      }

      res.json({
        id,
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia,
      });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          mensaje:
            "El número de documento o de licencia ya pertenece a otro conductor",
        });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al actualizar el conductor" });
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
      const [result] = await db.execute(
        "DELETE FROM conductores WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ mensaje: "Conductor no encontrado" });
      }

      res.json({ mensaje: "Conductor eliminado correctamente" });
    } catch (error) {
      if (error.code === "ER_ROW_IS_REFERENCED_2") {
        return res.status(400).json({
          mensaje:
            "No se puede eliminar el conductor porque tiene viajes asociados",
        });
      }
      console.error(error);
      res.status(500).json({ mensaje: "Error al eliminar el conductor" });
    }
  },
);

export default router;