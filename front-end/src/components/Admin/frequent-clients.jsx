import { Star, Crown, Award } from "lucide-react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import Badge from "./ui/Badge";
import { cn } from "../../lib/utils";

const frequentClients = [
	{
		id: 1,
		name: "Maria Silva",
		email: "maria@email.com",
		reservations: 12,
		totalSpent: 45600,
		tier: "Platinum",
		lastBooking: "2024-07-15",
	},
	{
		id: 2,
		name: "João Santos",
		email: "joao@email.com",
		reservations: 8,
		totalSpent: 32400,
		tier: "Gold",
		lastBooking: "2024-07-10",
	},
	{
		id: 3,
		name: "Ana Costa",
		email: "ana@email.com",
		reservations: 7,
		totalSpent: 28900,
		tier: "Gold",
		lastBooking: "2024-07-08",
	},
	{
		id: 4,
		name: "Pedro Lima",
		email: "pedro@email.com",
		reservations: 6,
		totalSpent: 24300,
		tier: "Silver",
		lastBooking: "2024-07-05",
	},
];

const getTierIcon = (tier) => {
	switch (tier) {
		case "Platinum":
			return <Crown className="w-4 h-4" />;
		case "Gold":
			return <Award className="w-4 h-4" />;
		default:
			return <Star className="w-4 h-4" />;
	}
};

const getTierColor = (tier) => {
	switch (tier) {
		case "Platinum":
			return "bg-purple-100 text-purple-800";
		case "Gold":
			return "bg-yellow-100 text-yellow-800";
		default:
			return "bg-gray-100 text-gray-800";
	}
};

export default function FrequentClients() {
	return (
		<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
			<CardHeader>
				<CardTitle className="flex items-center text-blue-700">
					<Star className="w-5 h-5 mr-2" />
					Clientes Frequentes
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{frequentClients.map((client, index) => (
						<div
							key={client.id}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<div className="flex items-center space-x-4">
								<div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-full font-bold">
									#{index + 1}
								</div>
								<div>
									<div className="flex items-center space-x-2 mb-1">
										<h4 className="font-semibold text-gray-800">
											{client.name}
										</h4>
										<Badge
											className={`${
												getTierColor(client.tier)
											} flex items-center space-x-1`}
										>
											{getTierIcon(client.tier)}
											<span>{client.tier}</span>
										</Badge>
									</div>
									<p className="text-sm text-gray-600">
										{client.email}
									</p>
									<p className="text-xs text-gray-500">
										Última reserva: {client.lastBooking}
									</p>
								</div>
							</div>
							<div className="text-right">
								<p className="font-semibold text-gray-900">
									{client.reservations} reservas
								</p>
								<p className="text-lg font-bold text-green-600">
									R$ {client.totalSpent.toLocaleString()}
								</p>
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}