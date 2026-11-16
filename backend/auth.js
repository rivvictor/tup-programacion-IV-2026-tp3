import express from "express";
import { db } from "./db.js";
import {
  validarLogin,
  validarRegistro,
  verificarValidaciones,
} from "./validaciones.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    }),
  );
}

router.post(
  "/register",
  validarRegistro,
  verificarValidaciones,
  async (req, res) => {
    try {
      const { nombre, email, contrasena } = req.body;

      const [existentes] = await db.execute(
        "SELECT id FROM usuarios WHERE email = ?",
        [email],
      );
      if (existentes.length > 0) {
        return res.status(400).json({ mensaje: "El email ya está registrado" });
      }

      const hashedPassword = await bcrypt.hash(contrasena, 12);

      const [result] = await db.execute(
        "INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)",
        [nombre, email, hashedPassword],
      );

      res.status(201).json({
        id: result.insertId,
        nombre,
        email,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al registrar usuario" });
    }
  },
);

router.post(
  "/login",
  validarLogin,
  verificarValidaciones,
  async (req, res) => {
    try {
      const { email, contrasena } = req.body;

      const [usuarios] = await db.execute(
        "SELECT * FROM usuarios WHERE email = ?",
        [email],
      );

      if (usuarios.length === 0) {
        return res
          .status(401)
          .json({ mensaje: "Email o contraseña inválidos" });
      }

      const passwordComparada = await bcrypt.compare(
        contrasena,
        usuarios[0].contrasena,
      );

      if (!passwordComparada) {
        return res
          .status(401)
          .json({ mensaje: "Email o contraseña inválidos" });
      }

      const payload = {
        userId: usuarios[0].id,
        email: usuarios[0].email,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "4h",
      });

      res.json({
        token,
        usuario: {
          id: usuarios[0].id,
          nombre: usuarios[0].nombre,
          email: usuarios[0].email,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ mensaje: "Error al iniciar sesión" });
    }
  },
);

export default router;