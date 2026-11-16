import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

export const validarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

export const verificarValidaciones = (req, res, next) => {
  const resultadoValidacion = validationResult(req);
  if (!resultadoValidacion.isEmpty()) {
    return res.status(400).json({
      mensaje: "Parámetros no válidos",
      errores: resultadoValidacion.array(),
    });
  }
  next();
};

export const validarId = param("id")
  .isInt({ min: 1 })
  .withMessage("El ID debe ser un número entero positivo");

export const validarRegistro = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 100 })
    .withMessage("El nombre no puede superar los 100 caracteres"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Debe ingresar un email válido")
    .isLength({ max: 100 }),
  body("contrasena")
    .isLength({ min: 6, max: 50 })
    .withMessage("La contraseña debe tener entre 6 y 50 caracteres"),
];

export const validarLogin = [
  body("email").trim().isEmail().withMessage("Debe ingresar un email válido"),
  body("contrasena")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ max: 50 }),
];

export const validarFiltrosVehiculos = [
  query("patente").optional().trim().isLength({ max: 20 }),
  query("marca").optional().trim().isLength({ max: 50 }),
];

export const validarVehiculo = [
  body("marca")
    .trim()
    .notEmpty()
    .withMessage("La marca es obligatoria")
    .isLength({ max: 50 }),
  body("modelo")
    .trim()
    .notEmpty()
    .withMessage("El modelo es obligatorio")
    .isLength({ max: 50 }),
  body("patente")
    .trim()
    .notEmpty()
    .withMessage("La patente es obligatoria")
    .isAlphanumeric("es-ES", { ignore: "- " })
    .withMessage("Formato de patente inválido")
    .isLength({ min: 6, max: 20 }),
  body("anio")
    .isInt({ min: 1950, max: new Date().getFullYear() + 1 })
    .withMessage("Año inválido"),
  body("capacidad_carga")
    .isFloat({ gt: 0 })
    .withMessage("La capacidad de carga debe ser mayor a 0"),
];

export const validarFiltrosConductores = [
  query("apellido").optional().trim().isLength({ max: 100 }),
  query("documento").optional().trim().isLength({ max: 20 }),
];

export const validarConductor = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio")
    .isLength({ max: 100 }),
  body("apellido")
    .trim()
    .notEmpty()
    .withMessage("El apellido es obligatorio")
    .isLength({ max: 100 }),
  body("numero_documento")
    .trim()
    .notEmpty()
    .withMessage("El número de documento es obligatorio")
    .isNumeric()
    .withMessage("El documento debe contener solo números")
    .isLength({ min: 7, max: 20 }),
  body("numero_licencia")
    .trim()
    .notEmpty()
    .withMessage("El número de licencia es obligatorio")
    .isLength({ max: 30 }),
  body("fecha_alta_licencia")
    .isISO8601()
    .withMessage("Fecha de alta de licencia inválida (YYYY-MM-DD)"),
  body("fecha_vencimiento_licencia")
    .isISO8601()
    .withMessage("Fecha de vencimiento inválida (YYYY-MM-DD)")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.fecha_alta_licencia)) {
        throw new Error(
          "La fecha de vencimiento debe ser posterior a la fecha de alta",
        );
      }
      return true;
    }),
];

export const validarFiltrosViajes = [
  query("vehiculo_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("vehiculo_id debe ser un entero positivo"),
  query("conductor_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("conductor_id debe ser un entero positivo"),
];

export const validarViaje = [
  body("vehiculo_id")
    .isInt({ min: 1 })
    .withMessage("Debe seleccionar un vehículo válido"),
  body("conductor_id")
    .isInt({ min: 1 })
    .withMessage("Debe seleccionar un conductor válido"),
  body("fecha_salida")
    .isISO8601()
    .withMessage("Fecha de salida inválida"),
  body("fecha_llegada")
    .isISO8601()
    .withMessage("Fecha de llegada inválida")
    .custom((value, { req }) => {
      if (new Date(value) < new Date(req.body.fecha_salida)) {
        throw new Error(
          "La fecha de llegada no puede ser anterior a la de salida",
        );
      }
      return true;
    }),
  body("origen")
    .trim()
    .notEmpty()
    .withMessage("El origen es obligatorio")
    .isLength({ max: 150 }),
  body("destino")
    .trim()
    .notEmpty()
    .withMessage("El destino es obligatorio")
    .isLength({ max: 150 }),
  body("kilometros")
    .isFloat({ gt: 0 })
    .withMessage("Los kilómetros deben ser mayores a 0"),
  body("observaciones").optional({ nullable: true }).trim(),
];