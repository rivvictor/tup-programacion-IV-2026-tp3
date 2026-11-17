# Sistema de Gestión de Transporte (TP3)

Aplicación web desarrollada como Trabajo Práctico para la gestión de vehículos, conductores y los viajes realizados por una empresa de transporte.

## Tecnologías Utilizadas

* **Frontend:** React (Vite), React Router, JavaScript, CSS.
* **Backend:** Node.js, Express, REST API.
* **Base de Datos:** MySQL.
* **Autenticación:** JWT (JSON Web Tokens), Passport.js, Bcrypt.

---

## Características y Funcionalidades

* **Autenticación y Seguridad:** 
  * Sistema de inicio de sesión con JWT y rutas protegidas.
  * Opción de registro de nuevos usuarios en el sistema.
* **Módulo de Vehículos:**
  * Listado completo con detalles de marca, modelo, patente, año y capacidad de carga.
  * Alta, modificación y eliminación de vehículos.
* **Módulo de Conductores:**
  * Listado con información personal, número de documento y control de vigencia de licencias.
  * Alta, modificación y eliminación de conductores.
* **Módulo de Viajes:**
  * Registro de viajes asociando un vehículo y un conductor.
  * Control de fechas de salida/llegada, origen, destino y observaciones.
  * Cálculo automático de kilómetros totales recorridos.

---

## Instrucciones de Instalación y Ejecución


### 1. Configuración de la Base de Datos
Ejecutar el script SQL (`schema.sql`) provisto en un servidor MySQL para crear la base de datos y sus respectivas tablas (`usuarios`, `vehiculos`, `conductores`, `viajes`).

### 2. Configuración y ejecución del Backend
1. Entrar a la carpeta del backend (`backend/`):
   ```bash
   cd backend
   ```
2. Instalar las dependencias necesarias:
   ```bash
   npm install
   ```
3. Crear un archivo llamado **`.env`** en la raíz de la carpeta del backend (al mismo nivel que el `package.json`) con la siguiente estructura:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=tu_contraseña_de_mysql
   DB_DATABASE=transporte_db
   JWT_SECRET=clave_secreta_tp3_2026
   PORT=3000
   ```
4. Iniciar el servidor:
   ```bash
   npm run dev
   ```

### 3. Configuración y ejecución del Frontend
1. Entrar a la carpeta del frontend (`frontend/`):
   ```bash
   cd frontend
   ```
2. Instalar las dependencias necesarias:
   ```bash
   npm install
   ```
3. Iniciar la aplicación de React:
   ```bash
   npm run dev
   ```