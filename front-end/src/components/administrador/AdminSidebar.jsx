import { useState, useEffect } from "react";
import { obterTipoUsuario } from "../../api/auth";
import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  Gift,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "./ui/Button";
import Tooltip from "../common/Tooltip";
import { cn } from "../../lib/utils";

export default function AdminSidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const tipo = obterTipoUsuario();
    if (tipo) {
      setTipoUsuario(parseInt(tipo));
    }
  }, []);

  // Fechar menu mobile quando trocar de aba
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  if (tipoUsuario === null || tipoUsuario === undefined) return null;

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, rolesPermitidas: [1] },
    { id: "packages", label: "Pacotes", icon: Package, rolesPermitidas: [1, 2] },
    { id: "reservations", label: "Reservas", icon: Calendar, rolesPermitidas: [1, 2, 3] },
    { id: "users", label: "Usuários", icon: Users, rolesPermitidas: [1, 2] },
    { id: "promotions", label: "Promoções", icon: Gift, rolesPermitidas: [1] },
    { id: "users", label: "Clientes", icon: Users, rolesPermitidas: [3] }, 
  ];

  
  return (
    <>
      {/* Mobile Menu Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-[60] bg-white shadow-lg text-blue-600 hover:bg-blue-50 border border-blue-200"
      >
        <Package className="w-5 h-5" />
      </Button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white/95 backdrop-blur-sm border-r border-blue-200/50 transition-all duration-300 overflow-y-auto",
          // Desktop (768px+)
          "hidden lg:block lg:sticky lg:top-[73px] lg:h-[calc(100vh-73px)]",
          collapsed ? "lg:w-20" : "lg:w-64",
          // Mobile e Tablet (até 1023px)
          "fixed top-0 left-0 h-full w-72 z-50 shadow-2xl",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="p-4">
          {/* Desktop Collapse Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "hidden lg:flex mb-4 text-blue-600 hover:bg-blue-50",
              collapsed ? "w-full justify-center px-1" : "w-full justify-end"
            )}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>

          {/* Mobile Header */}
          <div className="lg:hidden mb-6 pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-blue-600">Menu Admin</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMobileMenuOpen(false)}
                className="text-blue-600 hover:bg-blue-50"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <nav className="space-y-2">
            {menuItems
              .filter(item => item.rolesPermitidas.includes(tipoUsuario))
              .map((item) => {
                const buttonContent = (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className={cn(
                      "w-full text-left transition-all duration-200",
                      activeTab === item.id ? "bg-blue-500 text-white hover:bg-blue-600" : "text-blue-700 hover:bg-blue-50",
                      // Desktop (1024px+)
                      collapsed ? "lg:justify-center lg:px-1" : "lg:justify-start lg:px-3",
                      // Mobile e Tablet (até 1023px) - sempre expandido
                      "justify-start px-3 py-3"
                    )}
                    onClick={() => onTabChange(item.id)}
                  >
                    <div className={cn(
                      "flex items-center",
                      // Desktop (1024px+)
                      collapsed ? "lg:justify-center" : "lg:justify-start",
                      // Mobile e Tablet (até 1023px) - sempre expandido
                      "justify-start"
                    )}>
                      <item.icon className={cn(
                        "w-5 h-5 flex-shrink-0",
                        // Desktop (1024px+)
                        !collapsed && "lg:mr-3",
                        // Mobile e Tablet - sempre com margem
                        "mr-3"
                      )} />
                      <span className={cn(
                        "text-sm font-medium truncate",
                        // Desktop (1024px+)
                        collapsed && "lg:hidden",
                        // Mobile e Tablet - sempre visível
                        "block"
                      )}>
                        {item.label}
                      </span>
                    </div>
                  </Button>
                );

                return collapsed && window.innerWidth >= 1024 ? (
                  <Tooltip key={item.id} content={item.label} position="right">
                    <div className="hidden lg:block">{buttonContent}</div>
                  </Tooltip>
                ) : (
                  <div key={item.id} className="w-full">
                    {buttonContent}
                  </div>
                );
              })}
          </nav>
        </div>
      </aside>
    </>
  );
}