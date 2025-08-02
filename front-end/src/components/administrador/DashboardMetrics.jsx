import { Calendar, Users, Package, DollarSign, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";
import { useState, useEffect } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { cn } from "../../lib/utils";
import { fetchMetricasGerais } from "../../api/dashboard";

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        setLoading(true);
        const data = await fetchMetricasGerais();
        
        // Formatação dos dados para o componente
        const formattedMetrics = [
          {
            title: "Total Reservas",
            value: data.totalReservas || 0,
            change: "+12%", // Mantendo temporariamente até implementar cálculo real
            trend: "up",
            icon: Calendar,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
          },
          {
            title: "Total Clientes",
            value: data.totalClientes || 0,
            change: "+8%", // Mantendo temporariamente até implementar cálculo real
            trend: "up",
            icon: Users,
            color: "text-green-600",
            bgColor: "bg-green-50",
          },
          {
            title: "Total Pacotes",
            value: data.totalPacotes || 0,
            change: "+3%", // Mantendo temporariamente até implementar cálculo real
            trend: "up",
            icon: Package,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
          },
          {
            title: "Receita Total",
            value: `R$ ${(data.faturamento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
            change: "-2%", // Mantendo temporariamente até implementar cálculo real
            trend: "down",
            icon: DollarSign,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
          },
        ];
        
        setMetrics(formattedMetrics);
      } catch (err) {
        console.error("Erro ao carregar métricas:", err);
        setError("Erro ao carregar dados do dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[...Array(4)].map((_, index) => (
          <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4 md:p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="h-6 md:h-8 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/3"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card className="bg-red-50 border border-red-200">
          <CardContent className="p-4 md:p-6 text-center">
            <AlertTriangle className="w-8 h-8 md:w-12 md:h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
            <p className="text-sm md:text-base text-red-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!metrics || metrics.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 md:gap-6">
        <Card className="bg-gray-50 border border-gray-200">
          <CardContent className="p-4 md:p-6 text-center">
            <Package className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base md:text-lg font-semibold text-gray-600 mb-2">Nenhum dado disponível</h3>
            <p className="text-sm md:text-base text-gray-500">Não há dados suficientes para exibir as métricas.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105"
        >
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1 md:space-y-2 flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium text-gray-600 truncate">{metric.title}</p>
                <p className="text-xl md:text-3xl font-bold text-gray-900 truncate">{metric.value}</p>
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-red-500 flex-shrink-0" />
                  )}
                  <span className={`text-xs md:text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </span>
                  <span className="text-xs md:text-sm text-gray-500 hidden sm:inline">vs mês anterior</span>
                </div>
              </div>
              <div className={`p-2 md:p-3 rounded-full ${metric.bgColor} flex-shrink-0 ml-2`}>
                <metric.icon className={`w-5 h-5 md:w-8 md:h-8 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}