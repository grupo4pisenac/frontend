// alt 2 de maio: adicionada rota para página "gerenciar estudantes", acessável pelo menu lateral
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { SuperAdminLayout } from "./components/SuperAdminLayout";
import { DashboardGlobal } from "./components/DashboardGlobal";
import { GerenciarCursosSuperAdmin } from "./components/GerenciarCursosSuperAdmin";
import { ConfigurarRegrasSuperAdmin } from "./components/ConfigurarRegrasSuperAdmin";
import { Coordenadores } from "./components/Coordenadores";
import { Estudantes } from "./components/Estudantes";
import { Login } from "./pages/Login";

// Componente de proteção para validar o acesso
const ProtectedRoute = () => {
  const token = localStorage.getItem('@EduManage:token');
  // Se não tiver token, volta pro login. Se tiver, libera o conteúdo (Outlet)
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/app",
    element: <ProtectedRoute />, 
    children: [
      {
        // O Layout agora envolve todos os filhos corretamente
        element: <SuperAdminLayout />, 
        children: [
          { index: true, element: <DashboardGlobal /> },
          { path: "cursos", element: <GerenciarCursosSuperAdmin /> },
          { path: "regras", element: <ConfigurarRegrasSuperAdmin /> },
          { path: "coordenadores", element: <Coordenadores /> },
          { path: "estudantes", element: <Estudantes /> },
          { path: "*", element: <DashboardGlobal /> },
        ]
      }
    ],
  },
]);
