import Anthropic from "@anthropic-ai/sdk";

import type { PortfolioHolding } from "@/stocks/stocks.ts";

//const portfolio: PortfolioHolding[] = [
//  { ticker: "AAPL", shares: 100, sector: "Technology" },
//  { ticker: "GOOGL", shares: 50, sector: "Technology" },
//  { ticker: "XOM", shares: 200, sector: "Energy" },
//  { ticker: "JPM", shares: 75, sector: "Finance" },
//];

function preparePortfolioForClaude(portfolio: PortfolioHolding[]): string {
	const portfolioString = JSON.stringify(portfolio, null, 2);

	return `Here is my stock portfolio data:

${portfolioString}

Please analyze this portfolio for performance, sector allocation, and provide a summarized report. Consider the following aspects and structure your response in JSON format:

{
  "overallDiversity": "Your analysis of overall portfolio diversity",
  "sectorBalance": "Your analysis of sector balance",
  "risksAndOpportunities": [
	  "Potential risk or opportunity 1",
	  "Potential risk or opportunity 2",
	  ...
  ],
  "suggestions": [
    "Suggestion for rebalancing or diversification 1",
    "Suggestion for rebalancing or diversification 2",
    ...
  ]
}
`;
}

export async function analyzePortfolioWithClaude(
	portfolio: PortfolioHolding[],
): Promise<string> {
	const anthropic = new Anthropic({
		apiKey: process.env.ANTHROPIC_API_KEY, // Use environment variable for API key
	});

	const message = preparePortfolioForClaude(portfolio);

	try {
		const response = await anthropic.messages.create({
			model: "claude-3-sonnet-20240229",
			max_tokens: 1000,
			messages: [{ role: "user", content: message }],
		});

		if (response.content[0].type === "text") {
			return response.content[0].text;
		}
		throw new Error(`Unexpected response type: ${response.content[0].type}`);
	} catch (error) {
		console.error("Failed to get analysis from Claude:", error);
		throw error;
	}
}

// Usage
//analyzePortfolioWithClaude(portfolio)
//  .catch(error => console.error('Failed to get analysis from Claude:', error));
