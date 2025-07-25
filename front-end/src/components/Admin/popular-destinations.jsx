import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import { MapPin } from "lucide-react";
import { cn } from "../../lib/utils";

const destinationsData = [
  { name: "Paris", bookings: 145, percentage: 28.5 },
  { name: "Londres", bookings: 132, percentage: 26.0 },
  { name: "Roma", bookings: 98, percentage: 19.3 },
  { name: "Barcelona", bookings: 87, percentage: 17.1 },
  { name: "Amsterdam", bookings: 46, percentage: 9.1 },
];

const COLORS = ["#FF6B35", "#4A90E2", "#7ED321", "#F5A623", "#BD10E0"];

export default function PopularDestinations() {
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
                data={destinationsData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="bookings"
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                labelLine={false}
                style={{ cursor: 'pointer' }}
              >
                {destinationsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ cursor: 'pointer' }} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} reservas`, "Reservas"]} />
            </PieChart>
          </ResponsiveContainer>

          <div className="space-y-4">
            {destinationsData.map((destination, index) => (
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