import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import AdminSidebar from "../components/admin/admin-sidebar";
// import DashboardMetrics from "../components/admin/dashboard-metrics";
// import RevenueChart from "../components/admin/revenue-chart";
// import PopularDestinations from "../components/admin/popular-destinations";
// import FrequentClients from "../components/admin/frequent-clients";
// import ExportButtons from "../components/admin/export-buttons";
// import PackageManagement from "../components/admin/PackageManagement";
// import ReservationManagement from "../components/admin/ReservationManagement";
// import UserManagement from "../components/admin/UserManagement";
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
        {/* <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} /> */}

        <main className="flex-1 min-h-screen lg:ml-0">
          <div className="p-3 md:p-6 space-y-4 md:space-y-6 overflow-x-hidden pt-16 lg:pt-3">
            
            {/* Mensagem temporária */}
            <div className="bg-white/95 backdrop-blur-sm rounded-lg p-6 md:p-8 text-center">
              <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
                Painel Administrativo
              </h2>
              <p className="text-gray-600">
                Os componentes administrativos foram temporariamente removidos. 
                Para reativá-los, descomente os imports e componentes no arquivo AdminPainel.jsx.
              </p>
            </div>

            {activeTab === "dashboard" && (tipoUsuario === 1 || tipoUsuario === 2) && (
              <>
                {/* <ExportButtons /> */}
                {/* <DashboardMetrics /> */}
                {/* <RevenueChart /> */}
                {/* <PopularDestinations /> */}

                <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 md:gap-6">
                  {/* <FrequentClients /> */}
                </div>
              </>
            )}

            {activeTab !== "dashboard" && (
              <>
                {/* {activeTab === "packages" && <PackageManagement />} */}
                {/* {activeTab === "reservations" && <ReservationManagement />} */}
                {/* {activeTab === "users" && <UserManagement />} */}
                
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