import { PortfolioManager } from "@/data/portfolio.ts"; // Import your database saving function
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(
	_request: NextRequest,
	{ params }: { params: { id: string } },
) {
	try {
		const portfolioManager = new PortfolioManager();
		const { id } = params;
		const portfolio = await portfolioManager.loadPortfolio(Number.parseInt(id));
		return NextResponse.json(portfolio);
	} catch (error) {
		console.error("Error loading portfolio:", error);
		return NextResponse.json(
			{ error: "Failed to load portfolio" },
			{ status: 500 },
		);
	}
}
