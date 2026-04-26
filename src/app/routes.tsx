import { createBrowserRouter } from "react-router";
import { SuperAdminLayout } from "./components/SuperAdminLayout";
import { DashboardGlobal } from "./components/DashboardGlobal";
import { GerenciarCursosSuperAdmin } from "./components/GerenciarCursosSuperAdmin";
import { ConfigurarRegrasSuperAdmin } from "./components/ConfigurarRegrasSuperAdmin";
import { Coordenadores } from "./components/Coordenadores";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SuperAdminLayout />,
    children: [
      { index: true, element: <DashboardGlobal /> },
      { path: "cursos", element: <GerenciarCursosSuperAdmin /> },
      { path: "regras", element: <ConfigurarRegrasSuperAdmin /> },
      { path: "coordenadores", element: <Coordenadores /> },
      { path: "*", element: <DashboardGlobal /> },
    ],
  },
]);