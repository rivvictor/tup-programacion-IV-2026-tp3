import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarId,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

router.get("/", validarAutenticacion, async (req, res) => {
  try {
    const [usuarios] = await db.execute(
      "SELECT id, nombre, email FROM usuarios",
    );
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener los usuarios" });
  }
});

router.get(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    try {
      const id = Number(req.params.id);
      const [usuarios] = await db.execute(
        "SELECT id, nombre, email FROM usuarios WHERE id = ?",
        [id],
      );

      if (usuarios.length === 0) {
        return res.status(404).json({ mensaje: "Usuario no encontrado" });
      }

      res.json(usuarios[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al obtener el usuario" });
    }
  },
);

export default router;