import { PortfolioManager } from "@/data/portfolio.ts";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
	const portfolioManager = new PortfolioManager();

	try {
		const r = await request.json();
		console.log(r);
		const { userId, ticker } = r;

		if (!userId || !ticker) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		await portfolioManager.deleteHolding(userId, ticker);

		return NextResponse.json(
			{ message: "Stock removed successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error removing stock:", error);
		return NextResponse.json(
			{ error: "Failed to remove stock" },
			{ status: 500 },
		);
	}
}
