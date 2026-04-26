import { Outlet, Link, useLocation } from "react-router";
import { Bell, LayoutDashboard, GraduationCap, Settings, Users, Menu, X } from "lucide-react";
import { useState } from "react";

export function SuperAdminLayout() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Dashboard Global", path: "/", icon: LayoutDashboard },
    { name: "Gerenciar Cursos", path: "/cursos", icon: GraduationCap },
    { name: "Configurar Regras", path: "/regras", icon: Settings },
    { name: "Coordenadores", path: "/coordenadores", icon: Users },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#EEEEEE]">
      {/* Sidebar - Desktop */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-[#002868] text-white hidden lg:block">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-white/10">
            <h1 className="text-3xl text-white" style={{ fontFamily: 'Arvo, serif' }}>
              Senac
            </h1>
          </div>

          {/* Navigation */}
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

          {/* Footer */}
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
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-white/70 hover:text-white"
                >
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

      {/* Main Content Area */}
      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 h-20 sticky top-0 z-30 shadow-sm">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Left side - page title */}
            <div className="hidden lg:block">
              <h2 className="text-xl text-[#002868]" style={{ fontFamily: 'Arvo, serif' }}>
                {navigation.find((item) => isActive(item.path))?.name || "Dashboard Global"}
              </h2>
            </div>

            {/* Right side - notifications and profile */}
            <div className="flex items-center gap-4 ml-auto">
              {/* Notifications */}
              <button className="relative p-2 text-gray-600 hover:text-[#002868] hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF9414] rounded-full"></span>
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                <div className="hidden sm:block text-right">
                  <div className="text-sm text-gray-900" style={{ fontFamily: 'Roboto, sans-serif' }}>
                    Dr. Ricardo Silva
                  </div>
                  <div className="text-xs text-white bg-[#FF9414] px-2 py-0.5 rounded-full inline-block mt-0.5">
                    Super Admin
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#002868] to-[#0051A2] flex items-center justify-center text-white text-sm">
                  RS
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
