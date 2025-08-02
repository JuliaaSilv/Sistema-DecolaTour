import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/administrador/AdminSidebar";
import DashboardMetrics from "../components/administrador/DashboardMetrics";
import RevenueChart from "../components/administrador/RevenueChart";
import PopularDestinations from "../components/administrador/PopularDestinations";
import FrequentClients from "../components/administrador/FrequentClients";
import ExportButtons from "../components/administrador/ExportButtons";
import PackageManagement from "../components/administrador/PackageManagement";
import ReservationManagement from "../components/administrador/ReservationManagement";
import UserManagement from "../components/administrador/UserManagement";
import { obterTipoUsuario, estaLogado } from "../api/auth"; 

export default function AdminPainel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();
  const tipoUsuario = parseInt(obterTipoUsuario());

  // Verificar acesso ao painel administrativo
  useEffect(() => {
    if (!estaLogado()) {
      navigate('/admin-login');
      return;
    }

    if (tipoUsuario !== 1 && tipoUsuario !== 2) {
      // Se não for administrador (1) nem atendente (2), redirecionar para home
      navigate('/');
      return;
    }
  }, [navigate, tipoUsuario]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden pt-16 lg:pt-3">

            {activeTab === "dashboard" && (tipoUsuario === 1 || tipoUsuario === 2) && (
              <>
                <ExportButtons />
                <DashboardMetrics />
                <RevenueChart />
                <PopularDestinations />

                <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 md:gap-6">
                  <FrequentClients />
                </div>
              </>
            )}

            {activeTab !== "dashboard" && (
              <>
                {activeTab === "packages" && <PackageManagement />}
                {activeTab === "reservations" && <ReservationManagement />}
                {activeTab === "users" && <UserManagement />}
                
                {activeTab === "promotions" && (
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 md:p-8 text-center">
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                      Gerenciamento de Promoções
                    </h2>
                    <p className="text-gray-600">Esta seção está em desenvolvimento.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}