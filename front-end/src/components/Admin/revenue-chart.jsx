import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import CardHeader from "./ui/CardHeader";
import CardTitle from "./ui/CardTitle";
import { TrendingUp } from "lucide-react";
import { cn } from "../../lib/utils";

const monthlyRevenue = [
	{ month: "Jan", revenue: 45000, target: 50000 },
	{ month: "Fev", revenue: 52000, target: 50000 },
	{ month: "Mar", revenue: 48000, target: 50000 },
	{ month: "Abr", revenue: 61000, target: 55000 },
	{ month: "Mai", revenue: 55000, target: 55000 },
	{ month: "Jun", revenue: 67000, target: 60000 },
	{ month: "Jul", revenue: 72000, target: 65000 },
	{ month: "Ago", revenue: 68000, target: 65000 },
];

export default function RevenueChart() {
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
						data={monthlyRevenue}
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
								`R$ ${Number(value).toLocaleString()}`,
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
						/>
						<Bar
							dataKey="revenue"
							fill="#FF6B35"
							radius={[4, 4, 0, 0]}
							name="Receita"
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}