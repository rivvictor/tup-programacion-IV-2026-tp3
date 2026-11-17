import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import { Layout } from "./Layout";
import { Home } from "./Home";
import { Login } from "./Login";
import { Registro } from "./Registro";
import { AuthLayout } from "./AuthLayout";
import { AuthProvider } from "./Auth";
import { Vehiculos } from "./Vehiculos";
import { VehiculosCrear } from "./VehiculosCrear";
import { VehiculosEditar } from "./VehiculosEditar";
import { Conductores } from "./Conductores";
import { ConductoresCrear } from "./ConductoresCrear";
import { ConductoresEditar } from "./ConductoresEditar";
import { Viajes } from "./Viajes";
import { ViajesCrear } from "./ViajesCrear";
import { ViajesEditar } from "./ViajesEditar";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="registro" element={<Registro />} />

            <Route path="vehiculos" element={<AuthLayout />}>
              <Route index element={<Vehiculos />} />
              <Route path="crear" element={<VehiculosCrear />} />
              <Route path=":id" element={<VehiculosEditar />} />
            </Route>

            <Route path="conductores" element={<AuthLayout />}>
              <Route index element={<Conductores />} />
              <Route path="crear" element={<ConductoresCrear />} />
              <Route path=":id" element={<ConductoresEditar />} />
            </Route>

            <Route path="viajes" element={<AuthLayout />}>
              <Route index element={<Viajes />} />
              <Route path="crear" element={<ViajesCrear />} />
              <Route path=":id" element={<ViajesEditar />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);