import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { fetchStockData } from "@/stocks/stocks.ts";

export async function GET(request: NextRequest) {
	const { searchParams } = new URL(request.url);
	const ticker = searchParams.get("ticker");

	if (!ticker) {
		return NextResponse.json({ error: "Ticker is required" }, { status: 400 });
	}

	try {
		const stockData = await fetchStockData(ticker);
		return NextResponse.json(stockData);
	} catch (error) {
		console.error("Error fetching stock data:", error);
		return NextResponse.json(
			{ error: "Failed to fetch stock data" },
			{ status: 500 },
		);
	}
}
