import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Bell, LayoutDashboard, GraduationCap, Settings, Users, Menu, X, User, ClipboardList } from "lucide-react";
import { useState } from "react";

export function SuperAdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuAberto, setMenuAberto] = useState(false);

  // Pega nome e perfil do localStorage — salvo no login
  const nome = localStorage.getItem('@EduManage:nome') || 'Usuário';
  const perfil = localStorage.getItem('@EduManage:perfil') || '';

  const isSuperAdmin = perfil === 'SUPER_ADMIN';
  const basePath = isSuperAdmin ? '/app/super' : '/app/coord';

  const handleLogout = () => {
    localStorage.removeItem('@EduManage:token');
    localStorage.removeItem('@EduManage:perfil');
    localStorage.removeItem('@EduManage:nome');
    navigate('/');
  };

  const getIniciais = (nome: string) => {
    const partes = nome.trim().split(' ');
    if (partes.length >= 2) return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
    return nome.substring(0, 2).toUpperCase();
  };

  // Super Admin vê tudo, Coordenador vê só o que lhe é permitido
  const navigationSuperAdmin = [
    { name: "Dashboard Global", path: `${basePath}`, icon: LayoutDashboard },
    { name: "Gerenciar Cursos", path: `${basePath}/cursos`, icon: GraduationCap },
    { name: "Configurar Regras", path: `${basePath}/regras`, icon: Settings },
    { name: "Coordenadores", path: `${basePath}/coordenadores`, icon: Users },
    { name: "Gerenciar Estudantes", path: `${basePath}/estudantes`, icon: User },
    { name: "Analisar Submissões", path: `${basePath}/submissoes`, icon: ClipboardList },
  ];

  const navigationCoordenador = [
    { name: "Dashboard", path: `${basePath}`, icon: LayoutDashboard },
    { name: "Gerenciar Estudantes", path: `${basePath}/estudantes`, icon: User },
    { name: "Analisar Submissões", path: `${basePath}/submissoes`, icon: ClipboardList },
  ];

  const navigation = isSuperAdmin ? navigationSuperAdmin : navigationCoordenador;

  const isActive = (path: string) => {
    if (path === basePath) return location.pathname === basePath;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#002868] text-white hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="h-20 flex items-center px-6 border-b border-white/10">
            <h1 className="text-3xl text-white" style={{ fontFamily: 'Arvo, serif' }}>
              Senac
            </h1>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? "bg-[#FF9414] text-white shadow-lg"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  style={{ fontFamily: 'Arvo, serif' }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="text-xs text-white/50 text-center">
              v2.0.0 • Sistema Global AC
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isMobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-[#002868] text-white lg:hidden transform transition-transform">
            <div className="flex flex-col h-full">
              <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
                <h1 className="text-3xl text-white" style={{ fontFamily: 'Arvo, serif' }}>
                  Senac
                </h1>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                        active
                          ? "bg-[#FF9414] text-white shadow-lg"
                          : "text-white/70 hover:bg-white/10 hover:text-white"
                      }`}
                      style={{ fontFamily: 'Arvo, serif' }}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        <header className="bg-white border-b border-gray-200 h-20 sticky top-0 z-30 shadow-sm">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden lg:block">
              <h2 className="text-xl text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                {navigation.find((item) => isActive(item.path))?.name || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button className="relative p-2 text-gray-600 hover:text-[#002868] hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF9414] rounded-full"></span>
              </button>

              <div className="relative flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold text-gray-900">{nome}</div>
                  {perfil && (
                    <div className="text-xs text-white bg-[#FF9414] px-2 py-0.5 rounded-full inline-block mt-0.5 font-medium">
                      {perfil}
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setMenuAberto(!menuAberto)}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002868] to-[#0051A2] flex items-center justify-center text-white font-bold shadow-sm hover:ring-2 hover:ring-[#FF9414] transition-all"
                >
                  {getIniciais(nome)}
                </button>

                {menuAberto && (
                  <div className="absolute right-0 top-12 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 z-50 overflow-hidden">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-bold text-gray-900 truncate">{nome}</p>
                      <p className="text-xs text-gray-500 mt-1">{perfil}</p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Sair do Sistema
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}