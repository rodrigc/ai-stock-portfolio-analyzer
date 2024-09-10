import { NextResponse } from "next/server";
import { analyzePortfolioWithClaude } from "@/ai/claude.ts";

export async function POST(request: Request) {
	try {
		console.log("POST");
		const { stocks } = await request.json();
		const analysisText = await analyzePortfolioWithClaude(stocks);
		const analysis = JSON.parse(analysisText);

		console.log(analysis);
		return NextResponse.json({ analysis });
	} catch (error) {
		console.error("Error analyzing portfolio:", error);
		return NextResponse.json(
			{ error: "Failed to analyze portfolio" },
			{ status: 500 },
		);
	}
}
