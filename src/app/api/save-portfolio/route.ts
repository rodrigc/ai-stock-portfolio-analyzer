import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { savePortfolioToDatabase } from "@/database/database.ts"; // Import your database saving function

export async function POST(request: NextRequest) {
	try {
		const portfolio = await request.json();
		await savePortfolioToDatabase(portfolio); // Save the portfolio to the database
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error saving portfolio:", error);
		return NextResponse.json(
			{ error: "Failed to save portfolio" },
			{ status: 500 },
		);
	}
}
