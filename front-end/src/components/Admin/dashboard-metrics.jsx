import { Calendar, Users, Package, DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { cn } from "../../lib/utils";

const metrics = [
  {
    title: "Total Reservas",
    value: "1,247",
    change: "+12%",
    trend: "up",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Total Clientes",
    value: "892",
    change: "+8%",
    trend: "up",
    icon: Users,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Total Pacotes",
    value: "156",
    change: "+3%",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    title: "Receita Total",
    value: "R$ 328K",
    change: "-2%",
    trend: "down",
    icon: DollarSign,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
];

export default function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <Card
          key={metric.title}
          className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
                <div className="flex items-center space-x-1">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${metric.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                    {metric.change}
                  </span>
                  <span className="text-sm text-gray-500">vs mês anterior</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${metric.bgColor}`}>
                <metric.icon className={`w-8 h-8 ${metric.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}