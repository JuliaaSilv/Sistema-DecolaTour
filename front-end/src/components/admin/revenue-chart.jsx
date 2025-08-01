import { BarChart, Bar, XAxis, YAxis, Ca	if (loading) {
		return (
			<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
				<CardHeader className="p-4 md:p-6">
					<CardTitle className="flex items-center text-blue-700 text-base md:text-lg">
						<TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 md:p-6">{}d, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import { TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { cn } from "../../lib/utils";
import { fetchFaturamentoMensal } from "../../api/dashboard";

export default function RevenueChart() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadRevenueData = async () => {
			try {
				setLoading(true);
				const response = await fetchFaturamentoMensal();
				
				// Transformar dados para o formato do gráfico
				const formattedData = response.map(item => ({
					month: item.mes,
					revenue: item.valor || 0,
					target: (item.valor || 0) * 1.1 // Meta como 110% da receita atual
				}));
				
				setData(formattedData);
			} catch (err) {
				console.error("Erro ao carregar dados de faturamento:", err);
				setError("Erro ao carregar dados de receita");
			} finally {
				setLoading(false);
			}
		};

		loadRevenueData();
	}, []);

	if (loading) {
		return (
			<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
				<CardHeader>
					<CardTitle className="flex items-center text-blue-700">
						<TrendingUp className="w-5 h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-350 flex items-center justify-center">
						<div className="animate-pulse text-center">
							<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-gray-500">Carregando dados...</p>
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
						<TrendingUp className="w-5 h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-350 flex items-center justify-center">
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
						<TrendingUp className="w-5 h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="h-350 flex items-center justify-center">
						<div className="text-center">
							<BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum dado disponível</h3>
							<p className="text-gray-500">Não há dados de receita para exibir no gráfico.</p>
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
					<TrendingUp className="w-5 h-5 mr-2" />
					Receita Mensal
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={350}>
					<BarChart
						data={data}
						margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
					>
						<CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
						<XAxis dataKey="month" stroke="#6b7280" />
						<YAxis
							stroke="#6b7280"
							tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}K`}
						/>
						<Tooltip
							formatter={(value, name) => [
								`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
								name === "revenue" ? "Receita" : "Meta",
							]}
							labelStyle={{ color: "#374151" }}
							contentStyle={{
								backgroundColor: "white",
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
								boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
							}}
						/>
						<Bar
							dataKey="target"
							fill="#e5e7eb"
							radius={[4, 4, 0, 0]}
							name="Meta"
							style={{ cursor: 'pointer' }}
						/>
						<Bar
							dataKey="revenue"
							fill="#FF6B35"
							radius={[4, 4, 0, 0]}
							name="Receita"
							style={{ cursor: 'pointer' }}
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}