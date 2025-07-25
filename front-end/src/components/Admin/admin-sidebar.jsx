import { useState } from "react";

import {
  LayoutDashboard,
  Package,
  Calendar,
  Users,
  BarChart3,
  Settings,
  Gift,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "./ui/Button";
import Tooltip from "../common/Tooltip";
import { cn } from "../../lib/utils";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "packages", label: "Pacotes", icon: Package },
  { id: "reservations", label: "Reservas", icon: Calendar },
  { id: "users", label: "Usuários", icon: Users },
  { id: "promotions", label: "Promoções", icon: Gift },
  { id: "destinations", label: "Destinos", icon: MapPin },
  { id: "reports", label: "Relatórios", icon: BarChart3 },
  { id: "settings", label: "Configurações", icon: Settings },
];

export default function AdminSidebar({ activeTab, onTabChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "bg-white/95 backdrop-blur-sm border-r border-blue-200/50 transition-all duration-300 sticky top-[73px] h-[calc(100vh-73px)] overflow-y-auto",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className="p-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "mb-4 text-blue-600 hover:bg-blue-50",
            collapsed ? "w-full justify-center px-1" : "w-full justify-end"
          )}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const buttonContent = (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className={cn(
                  "w-full text-left",
                  activeTab === item.id ? "bg-blue-500 text-white hover:bg-blue-600" : "text-blue-700 hover:bg-blue-50",
                  collapsed ? "justify-center px-1" : "justify-start px-3"
                )}
                onClick={() => onTabChange(item.id)}
              >
                <div className={cn(
                  "flex items-center",
                  collapsed ? "justify-center" : "justify-start"
                )}>
                  <item.icon className={cn("w-5 h-5", !collapsed && "mr-3")} />
                  {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
                </div>
              </Button>
            );

            return collapsed ? (
              <Tooltip key={item.id} content={item.label} position="right">
                {buttonContent}
              </Tooltip>
            ) : (
              buttonContent
            );
          })}
        </nav>
      </div>
    </aside>
  );
}