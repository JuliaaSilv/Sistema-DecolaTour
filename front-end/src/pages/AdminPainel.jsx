import React, { useState } from "react";
import AdminSidebar from "../components/Admin/admin-sidebar";
import DashboardMetrics from "../components/Admin/dashboard-metrics";
import RevenueChart from "../components/Admin/revenue-chart";
import PopularDestinations from "../components/Admin/popular-destinations";
import ActivePromotions from "../components/Admin/active-promotions";
import FrequentClients from "../components/Admin/frequent-clients";
import ExportButtons from "../components/Admin/export-buttons";
import PackageManagement from "../components/Admin/PackageManagement";
import ReservationManagement from "../components/Admin/ReservationManagement";
import UserManagement from "../components/Admin/UserManagement";
import { obterTipoUsuario } from "../api/auth"; 

export default function AdminPainel() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const tipoUsuario = parseInt(obterTipoUsuario());

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6 space-y-6 overflow-x-hidden min-h-screen">
          {activeTab === "dashboard" && tipoUsuario === 1 && (
            <>
              <ExportButtons />
              <DashboardMetrics />

              <RevenueChart />
              <PopularDestinations />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ActivePromotions />
                <FrequentClients />
              </div>
            </>
          )}

          {activeTab !== "dashboard" && (
            <>
              {activeTab === "packages" && <PackageManagement />}
              {activeTab === "reservations" && <ReservationManagement />}
              {activeTab === "users" && <UserManagement />}
              
              {(activeTab === "promotions" || activeTab === "destinations" || activeTab === "reports" || activeTab === "settings") && (
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {activeTab === "promotions" && "Gerenciamento de Promoções"}
                    {activeTab === "destinations" && "Gerenciamento de Destinos"}
                    {activeTab === "reports" && "Relatórios Detalhados"}
                    {activeTab === "settings" && "Configurações do Sistema"}
                  </h2>
                  <p className="text-gray-600">Esta seção está em desenvolvimento.</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}