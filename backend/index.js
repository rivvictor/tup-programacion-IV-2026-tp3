import express from "express";
import cors from "cors";
import { conectarDB } from "./db.js";
import authRouter, { authConfig } from "./auth.js";
import usuariosRouter from "./usuarios.js";
import vehiculosRouter from "./vehiculos.js";
import conductoresRouter from "./conductores.js";
import viajesRouter from "./viajes.js";

conectarDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

authConfig();

app.get("/", (req, res) => {
  res.send("API de Gestión de Transporte funcionando");
});

app.use("/auth", authRouter);
app.use("/usuarios", usuariosRouter);
app.use("/vehiculos", vehiculosRouter);
app.use("/conductores", conductoresRouter);
app.use("/viajes", viajesRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ mensaje: "Error interno del servidor" });
});

app.listen(port, () => {
  console.log(`La aplicación está funcionando en http://localhost:${port}`);
});