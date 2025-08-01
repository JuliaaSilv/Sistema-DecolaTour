import { Star, Crown, Award, AlertTriangle, Users } from "lucide-react";
import { useState, useEffect } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import Badge from "./ui/Badge";
import { cn } from "../../lib/utils";
import { fetchClientesFrequentes } from "../../api/dashboard";

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

const getTierByReservations = (reservations) => {
	if (reservations >= 10) return "Platinum";
	if (reservations >= 5) return "Gold";
	return "Silver";
};

export default function FrequentClients() {
	const [clients, setClients] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadClients = async () => {
			try {
				setLoading(true);
				const response = await fetchClientesFrequentes();
				
				// Formatar dados e calcular tier
				const formattedClients = response.map(client => ({
					id: client.email,
					name: client.nome || "Cliente não informado",
					email: client.email || "Email não informado",
					reservations: client.reservas || 0,
					totalSpent: 0, // Não temos essa informação na API atual
					tier: getTierByReservations(client.reservas || 0),
					lastBooking: "N/A" // Não temos essa informação na API atual
				}));
				
				setClients(formattedClients);
			} catch (err) {
				console.error("Erro ao carregar clientes frequentes:", err);
				setError("Erro ao carregar dados de clientes");
			} finally {
				setLoading(false);
			}
		};

		loadClients();
	}, []);

	if (loading) {
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
						{[...Array(4)].map((_, index) => (
							<div key={index} className="p-4 bg-gray-50 rounded-lg animate-pulse">
								<div className="flex items-center space-x-4">
									<div className="w-10 h-10 bg-gray-300 rounded-full"></div>
									<div className="flex-1">
										<div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
										<div className="h-3 bg-gray-300 rounded w-1/3"></div>
									</div>
								</div>
							</div>
						))}
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
						<Star className="w-5 h-5 mr-2" />
						Clientes Frequentes
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

	if (!clients || clients.length === 0) {
		return (
			<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center text-blue-700">
						<Star className="w-5 h-5 mr-2" />
						Clientes Frequentes
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-300 flex items-center justify-center">
						<div className="text-center">
							<Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum cliente frequente</h3>
							<p className="text-gray-500">Não há dados de clientes frequentes para exibir.</p>
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
					<Star className="w-5 h-5 mr-2" />
					Clientes Frequentes
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{clients.map((client, index) => (
						<div
							key={client.id}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
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
											className={`${getTierColor(client.tier)} px-2 py-1`}
										>
											<div className="flex items-center gap-1">
												{getTierIcon(client.tier)}
												<span className="text-xs font-medium">{client.tier}</span>
											</div>
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
								{client.totalSpent > 0 && (
									<p className="text-lg font-bold text-green-600">
										R$ {client.totalSpent.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
									</p>
								)}
							</div>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}