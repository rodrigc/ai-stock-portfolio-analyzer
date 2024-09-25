import { PortfolioManager } from "@/data/portfolio.ts";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
	const portfolioManager = new PortfolioManager();

	try {
		const r = await request.json();
		const { userId, ticker, shares, name } = r;

		if (!userId || !ticker || shares === undefined) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 },
			);
		}

		await portfolioManager.addHolding(userId, ticker, shares, name);

		return NextResponse.json(
			{ message: "Stock added successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error adding stock:", error);
		return NextResponse.json({ error: "Failed to add stock" }, { status: 500 });
	}
}
