import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useEffect } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import { MapPin, AlertTriangle, Globe } from "lucide-react";
import { cn } from "../../lib/utils";
import { fetchDestinosPopulares, fetchDestinosPopularesComMocks } from "../../api/dashboard";

const COLORS = ["#FF6B35", "#4A90E2", "#7ED321", "#F5A623", "#BD10E0"];

export default function PopularDestinations() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDestinations = async () => {
      try {
        setLoading(true);
        const response = await fetchDestinosPopularesComMocks();
        
        // Limitar a 5 destinos mais populares para melhor visualização
        const topDestinos = response.slice(0, 5);
        
        // Calcular percentuais
        const totalReservas = topDestinos.reduce((sum, item) => sum + item.reservas, 0);
        const formattedData = topDestinos.map(item => ({
          name: item.destino || "Destino não informado",
          bookings: item.reservas || 0,
          percentage: totalReservas > 0 ? ((item.reservas / totalReservas) * 100).toFixed(1) : 0
        }));
        
        setData(formattedData);
      } catch (err) {
        console.error("Erro ao carregar destinos populares:", err);
        setError("Erro ao carregar dados de destinos");
      } finally {
        setLoading(false);
      }
    };

    loadDestinations();
  }, []);

  if (loading) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="flex items-center text-blue-700 text-base md:text-lg">
            <MapPin className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Destinos Populares
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <div className="h-64 md:h-80 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <Globe className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-sm md:text-base text-gray-500">Carregando destinos...</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <MapPin className="w-5 h-5 mr-2" />
            Destinos Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-300 flex items-center justify-center">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center text-blue-700">
            <MapPin className="w-5 h-5 mr-2" />
            Destinos Populares
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-300 flex items-center justify-center">
            <div className="text-center">
              <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum destino disponível</h3>
              <p className="text-gray-500">Não há dados de destinos para exibir.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center text-blue-700">
          <MapPin className="w-5 h-5 mr-2" />
          Destinos Populares
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="bookings"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
                style={{ cursor: 'pointer' }}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ cursor: 'pointer' }} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} reservas`, "Reservas"]} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            {data.map((destination, index) => (
              <div key={destination.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="font-medium text-gray-800">{destination.name}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{destination.bookings}</p>
                  <p className="text-sm text-gray-500">{destination.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}