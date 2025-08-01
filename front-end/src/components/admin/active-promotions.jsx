import { Gift, Edit, Trash2, Plus } from "lucide-react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

const activePromotions = [
  {
    id: 1,
    title: "Europa em Família",
    discount: "25%",
    validUntil: "2024-08-15",
    status: "Ativa",
    bookings: 45,
  },
  {
    id: 2,
    title: "Lua de Mel Tropical",
    discount: "30%",
    validUntil: "2024-07-30",
    status: "Ativa",
    bookings: 32,
  },
  {
    id: 3,
    title: "Aventura na Ásia",
    discount: "20%",
    validUntil: "2024-09-01",
    status: "Ativa",
    bookings: 28,
  },
  {
    id: 4,
    title: "Caribe Relaxante",
    discount: "35%",
    validUntil: "2024-08-20",
    status: "Expirando",
    bookings: 18,
  },
];

export default function ActivePromotions() {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-blue-700">
            <Gift className="w-5 h-5 mr-2" />
            Promoções Ativas
          </CardTitle>
          <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-white flex items-center justify-center">
            <Plus className="w-4 h-4 mr-2" />
            Nova Promoção
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activePromotions.map((promo) => (
            <div
              key={promo.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h4 className="font-semibold text-gray-800">{promo.title}</h4>
                  <Badge
                    variant={promo.status === "Ativa" ? "default" : "destructive"}
                    className={promo.status === "Ativa" ? "bg-green-100 text-green-800" : ""}
                  >
                    {promo.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Desconto:</span> {promo.discount}
                  </div>
                  <div>
                    <span className="font-medium">Válido até:</span> {promo.validUntil}
                  </div>
                  <div>
                    <span className="font-medium">Reservas:</span> {promo.bookings}
                  </div>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 bg-transparent"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}