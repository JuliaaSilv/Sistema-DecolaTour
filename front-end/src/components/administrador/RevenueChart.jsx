import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useState, useEffect } from "react";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import { TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { fetchFaturamentoMensal, fetchFaturamentoMensalComValoresReais } from "../../api/dashboard";

export default function RevenueChart() {
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadRevenueData = async () => {
			try {
				setLoading(true);
				const response = await fetchFaturamentoMensalComValoresReais();
				
				const formattedData = response.map(item => ({
					month: item.mes,
					revenue: item.valor || 0
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
				<CardHeader className="p-4 md:p-6">
					<CardTitle className="flex items-center text-blue-700 text-base md:text-lg">
						<TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 md:p-6">
					<div className="h-64 md:h-80 lg:h-96 flex items-center justify-center">
						<div className="animate-pulse text-center">
							<BarChart3 className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
							<p className="text-sm md:text-base text-gray-500">Carregando dados...</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (error) {
		return (
			<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
				<CardHeader className="p-4 md:p-6">
					<CardTitle className="flex items-center text-blue-700 text-base md:text-lg">
						<TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 md:p-6">
					<div className="h-64 md:h-80 lg:h-96 flex items-center justify-center">
						<div className="text-center">
							<AlertTriangle className="w-8 h-8 md:w-12 md:h-12 text-red-500 mx-auto mb-4" />
							<h3 className="text-base md:text-lg font-semibold text-red-800 mb-2">Erro ao carregar dados</h3>
							<p className="text-sm md:text-base text-red-600">{error}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!data || data.length === 0) {
		return (
			<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
				<CardHeader className="p-4 md:p-6">
					<CardTitle className="flex items-center text-blue-700 text-base md:text-lg">
						<TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
						Receita Mensal
					</CardTitle>
				</CardHeader>
				<CardContent className="p-4 md:p-6">
					<div className="h-64 md:h-80 lg:h-96 flex items-center justify-center">
						<div className="text-center">
							<BarChart3 className="w-8 h-8 md:w-12 md:h-12 text-gray-400 mx-auto mb-4" />
							<h3 className="text-base md:text-lg font-semibold text-gray-600 mb-2">Nenhum dado disponível</h3>
							<p className="text-sm md:text-base text-gray-500">Não há dados de receita para exibir no gráfico.</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
			<CardHeader className="p-4 md:p-6">
				<CardTitle className="flex items-center text-blue-700 text-base md:text-lg">
					<TrendingUp className="w-4 h-4 md:w-5 md:h-5 mr-2" />
					Receita Mensal
				</CardTitle>
			</CardHeader>
			<CardContent className="p-4 md:p-6">
				<style>
					{`
						.recharts-bar-rectangle:hover {
							fill: #E55B2B !important;
							filter: brightness(1.1) drop-shadow(0 4px 8px rgba(0,0,0,0.1));
							transform: translateY(-2px);
							transition: all 0.3s ease;
							cursor: pointer;
						}
						.recharts-bar-rectangle {
							transition: all 0.3s ease;
						}
					`}
				</style>
				<div className="h-64 md:h-80 lg:h-96">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={data}
							margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
							barCategoryGap="30%"
						>
							<CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
							<XAxis 
								dataKey="month" 
								stroke="#6b7280" 
								fontSize={12}
								angle={-45}
								textAnchor="end"
								height={70}
								interval={0}
								tick={{ fontSize: 12, fill: '#6b7280' }}
							/>
							<YAxis
								stroke="#6b7280"
								fontSize={11}
								tick={{ fontSize: 11, fill: '#6b7280' }}
								tickFormatter={(value) => {
									if (value >= 1000) {
										return `${(value / 1000).toFixed(0)}K`;
									}
									return value.toString();
								}}
								width={60}
							/>
							<Tooltip
								formatter={(value, name) => [
									`R$ ${Number(value).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
									"Receita Total"
								]}
								labelFormatter={(label) => `Mês: ${label}`}
								labelStyle={{ color: "#374151", fontWeight: "bold" }}
								contentStyle={{
									backgroundColor: "white",
									border: "1px solid #e5e7eb",
									borderRadius: "8px",
									boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
									fontSize: "14px",
									padding: "12px"
								}}
								cursor={{ fill: 'rgba(255, 107, 53, 0.1)' }}
							/>
							<Bar
								dataKey="revenue"
								fill="#FF6B35"
								radius={[4, 4, 0, 0]}
								name="Receita"
								maxBarSize={80}
							/>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}