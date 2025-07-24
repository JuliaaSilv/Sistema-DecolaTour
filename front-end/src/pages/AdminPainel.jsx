import React, { useState } from "react";
import AdminHeader from "../components/Admin/admin-header";
import AdminSidebar from "../components/Admin/admin-sidebar";
import DashboardMetrics from "../components/Admin/dashboard-metrics";
import RevenueChart from "../components/Admin/revenue-chart";
import PopularDestinations from "../components/Admin/popular-destinations";
import ActivePromotions from "../components/Admin/active-promotions";
import FrequentClients from "../components/Admin/frequent-clients";
import ExportButtons from "../components/Admin/export-buttons";

// Exemplo de AdminPainel.jsx já adaptado para usar os novos componentes
export default function AdminPainel() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
      <AdminHeader />

      <div className="flex">
        <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
          {activeTab === "dashboard" && (
            <>
              <ExportButtons />
              <DashboardMetrics />

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <RevenueChart />
                <PopularDestinations />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <ActivePromotions />
                <FrequentClients />
              </div>
            </>
          )}

          {activeTab !== "dashboard" && (
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {activeTab === "packages" && "Gerenciamento de Pacotes"}
                {activeTab === "reservations" && "Gerenciamento de Reservas"}
                {activeTab === "users" && "Gerenciamento de Usuários"}
                {activeTab === "promotions" && "Gerenciamento de Promoções"}
                {activeTab === "destinations" && "Gerenciamento de Destinos"}
                {activeTab === "reports" && "Relatórios Detalhados"}
                {activeTab === "settings" && "Configurações do Sistema"}
              </h2>
              <p className="text-gray-600">Esta seção está em desenvolvimento.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}