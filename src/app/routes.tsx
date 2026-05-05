import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { SuperAdminLayout } from "./components/SuperAdminLayout";
import { DashboardGlobal } from "./components/DashboardGlobal";
import { GerenciarCursosSuperAdmin } from "./components/GerenciarCursosSuperAdmin";
import { ConfigurarRegrasSuperAdmin } from "./components/ConfigurarRegrasSuperAdmin";
import { Coordenadores } from "./components/Coordenadores";
import { Estudantes } from "./components/Estudantes";
import { Login } from "./pages/login";

// ─── Proteção genérica (token existe) ────────────────────────────────────────

const ProtectedRoute = () => {
  const token = localStorage.getItem('@EduManage:token');
  return token ? <Outlet /> : <Navigate to="/" replace />;
};

// ─── Proteção por perfil ──────────────────────────────────────────────────────

const SuperAdminRoute = () => {
  const token = localStorage.getItem('@EduManage:token');
  const perfil = localStorage.getItem('@EduManage:perfil');
  if (!token) return <Navigate to="/" replace />;
  if (perfil !== 'SUPER_ADMIN') return <Navigate to="/nao-autorizado" replace />;
  return <Outlet />;
};

const CoordenadorRoute = () => {
  const token = localStorage.getItem('@EduManage:token');
  const perfil = localStorage.getItem('@EduManage:perfil');
  if (!token) return <Navigate to="/" replace />;
  if (perfil !== 'COORDENADOR') return <Navigate to="/nao-autorizado" replace />;
  return <Outlet />;
};

// ─── Tela de acesso negado ────────────────────────────────────────────────────

const NaoAutorizado = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="text-center">
      <h1 className="text-3xl font-bold text-[#002868] mb-2">Acesso Negado</h1>
      <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta página.</p>
      <a href="/" className="text-[#FF9414] underline">Voltar ao login</a>
    </div>
  </div>
);

// ─── Redirect por perfil ──────────────────────────────────────────────────────

const AppRedirect = () => {
  const perfil = localStorage.getItem('@EduManage:perfil');
  return <Navigate to={perfil === 'SUPER_ADMIN' ? '/app/super' : '/app/coord'} replace />;
};

// ─── Rotas ────────────────────────────────────────────────────────────────────

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/nao-autorizado",
    element: <NaoAutorizado />,
  },

  // ── Super Admin ──────────────────────────────────────────────────────────────
  {
    path: "/app/super",
    element: <SuperAdminRoute />,
    children: [
      {
        element: <SuperAdminLayout />,
        children: [
          { index: true, element: <DashboardGlobal /> },
          { path: "cursos", element: <GerenciarCursosSuperAdmin /> },
          { path: "regras", element: <ConfigurarRegrasSuperAdmin /> },
          { path: "coordenadores", element: <Coordenadores /> },
          { path: "estudantes", element: <Estudantes /> },
          { path: "*", element: <DashboardGlobal /> },
        ],
      },
    ],
  },

  // ── Coordenador ──────────────────────────────────────────────────────────────
  // Por enquanto usa o mesmo layout e telas do SuperAdmin
  // mas com acesso restrito pelo perfil
  // Quando tiver layout próprio do coordenador, trocar aqui
  {
    path: "/app/coord",
    element: <CoordenadorRoute />,
    children: [
      {
        element: <SuperAdminLayout />,
        children: [
          { index: true, element: <DashboardGlobal /> },
          { path: "estudantes", element: <Estudantes /> },
          { path: "*", element: <DashboardGlobal /> },
        ],
      },
    ],
  },

  // Rota antiga /app — redireciona para o perfil correto
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <AppRedirect />,
      },
    ],
  },
]);