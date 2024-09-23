"use client";

import { useState } from "react";
//import { signOut } from '@/auth/auth.ts';
import { Button } from "./ui/button.tsx";
import { Input } from "./ui/input.tsx";
import { Label } from "./ui/label.tsx";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { TrashIcon } from "@heroicons/react/24/outline";
import type { PortfolioHolding } from "@/stocks/stocks.ts";
import type { PortfolioAnalysis } from "./PortfolioAnalysis.tsx";
import { PortfolioAnalysisDisplay } from "./PortfolioAnalysis.tsx";
import { savePortfolioToDatabase } from "@/database/database.ts";

// Simulated stock API function
/*
const testFetchStockData = async (ticker: string) => {
  // In a real application, this would make an API call
  const mockData = {
    AAPL: { price: 150.25, sector: 'Technology' },
    GOOGL: { price: 2750.50, sector: 'Technology' },
    MSFT: { price: 305.75, sector: 'Technology' },
    AMZN: { price: 3380.00, sector: 'Consumer Cyclical' },
    JPM: { price: 155.30, sector: 'Financial Services' },
    // Add more mock data as needed
  }
  return mockData[ticker] || { price: 100, sector: 'Unknown' }
}

*/

export default function Portfolio() {
	const [stocks, setStocks] = useState<PortfolioHolding[]>([]);
	const [ticker, setTicker] = useState<string>("");
	const [shares, setShares] = useState<number>();
	const [analysis, setAnalysis] = useState<PortfolioAnalysis>();
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const addStock = async () => {
		if (ticker && shares) {
			setIsLoading(true);
			try {
				const response = await fetch(`/api/fetch-stock?ticker=${ticker}`);
				if (!response.ok) {
					throw new Error("Failed to fetch stock data");
				}
				const stockData = await response.json();
				setStocks((prevStocks) => {
					const existingStockIndex = prevStocks.findIndex(
						(stock) => stock.ticker === ticker,
					);
					let updatedStocks: PortfolioHolding[];
					if (existingStockIndex !== -1) {
						updatedStocks = [...prevStocks];
						updatedStocks[existingStockIndex] = {
							...updatedStocks[existingStockIndex],
							shares: updatedStocks[existingStockIndex].shares + shares,
							price: stockData.price,
						};
					} else {
						updatedStocks = [...prevStocks, { shares, ...stockData }];
					}
					savePortfolioToDatabase(updatedStocks);
					return updatedStocks;
				});

				setTicker("");
				setShares(0);
			} catch (error) {
				console.error("Error adding stock:", error);
				// Handle error (e.g., show an error message to the user)
			} finally {
				setIsLoading(false);
			}
		}
	};

	const removeStock = (tickerToRemove: string) => {
		setStocks((prevStocks) => {
			const updatedStocks = prevStocks.filter(
				(stock) => stock.ticker !== tickerToRemove,
			);
			savePortfolioToDatabase(updatedStocks);
			return updatedStocks;
		});
	};

	const calculateAllocation = () => {
		const total = stocks.reduce(
			(sum, stock) => sum + (stock.price ?? 0) * stock.shares,
			0,
		);

		return stocks.map((stock) => ({
			name: stock.ticker,
			value:
				Number.parseFloat(
					(((stock.price ?? 0) * stock.shares) / total).toFixed(4),
				) * 100, // Might throw error if total is 0
		}));
	};

	const calculateSectorAllocation = () => {
		const sectorTotals = stocks.reduce(
			(acc: Record<string, number>, stock: PortfolioHolding) => {
				const value: number = (stock.price ?? 0) * stock.shares;
				acc[stock.sector ?? ""] = (acc[stock.sector ?? ""] || 0) + value;
				return acc;
			},
			{},
		);
		const total = Object.values(sectorTotals).reduce(
			(sum, value) => sum + value,
			0,
		);
		return Object.entries(sectorTotals).map(([sector, value]) => ({
			name: sector,
			value: Number.parseFloat((value / total).toFixed(4)) * 100,
		}));
	};

	const analyzePortfolio = async () => {
		setAnalysis({
			overallDiversity: "Analyzing portfolio...",
		} as PortfolioAnalysis);
		try {
			const response = await fetch("/api/analyze-portfolio", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ stocks }),
			});
			if (!response.ok) {
				throw new Error("Failed to analyze portfolio");
			}
			const data = await response.json();
			setAnalysis(data.analysis as PortfolioAnalysis);
		} catch (error) {
			console.error("Error analyzing portfolio:", error);
			setAnalysis({
				overallDiversity: "Failed to analyze portfolio.  Please try agai;n",
			} as PortfolioAnalysis);
		}
	};

	const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

	return (
		<div className="space-y-6">
			<div className="flex space-x-4">
				<div className="space-y-2">
					<Label htmlFor="ticker">Stock Symbol</Label>
					<Input
						id="ticker"
						value={ticker}
						onChange={(e) => setTicker(e.target.value.toUpperCase())}
						placeholder="e.g., AAPL"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="shares">Number of Shares</Label>
					<Input
						id="shares"
						type="number"
						value={shares}
						onChange={(e) => setShares(Number.parseInt(e.target.value))}
						placeholder="e.g., 100"
					/>
				</div>
				<Button onClick={addStock} disabled={isLoading} className="mt-8">
					{isLoading ? "Adding..." : "Add Stock"}
				</Button>
			</div>

			{stocks.length > 0 && (
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Your Portfolio</h2>
					<ul>
						{stocks.map((stock, index) => (
							<li key={index} className="flex justify-left gap-2 py-2">
								<span>
									{stock.ticker}: {stock.shares} shares at $
									{stock.price?.toFixed(2)} ($
									{((stock.price ?? 0) * stock.shares).toFixed(2)})
								</span>
								<Button
									onClick={() => removeStock(stock.ticker)}
									className="rounded-md border p-2 hover:bg-red-100"
								>
									<TrashIcon className="w-5" />
								</Button>
							</li>
						))}
					</ul>

					<div className="flex space-x-4">
						<div className="w-1/2">
							<h3 className="text-lg font-semibold">Allocation by Stock</h3>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={calculateAllocation()}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={80}
										label
									>
										{calculateAllocation().map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
						<div className="w-1/2">
							<h3 className="text-lg font-semibold">Allocation by Sector</h3>
							<ResponsiveContainer width="100%" height={300}>
								<PieChart>
									<Pie
										data={calculateSectorAllocation()}
										dataKey="value"
										nameKey="name"
										cx="50%"
										cy="50%"
										outerRadius={80}
										label
									>
										{calculateSectorAllocation().map((entry, index) => (
											<Cell
												key={`cell-${index}`}
												fill={COLORS[index % COLORS.length]}
											/>
										))}
									</Pie>
									<Legend />
								</PieChart>
							</ResponsiveContainer>
						</div>
					</div>

					<Button onClick={analyzePortfolio}>Analyze Portfolio</Button>
					{analysis && <PortfolioAnalysisDisplay analysis={analysis} />}
				</div>
			)}
		</div>
	);
}
