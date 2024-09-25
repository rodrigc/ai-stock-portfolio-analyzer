import axios from "axios";

export interface StockInfo {
	name?: string;
	ticker: string;
	price?: number;
	sector?: string;
}

export interface PortfolioHolding extends StockInfo {
	shares: number;
}

export async function fetchStockData(ticker: string): Promise<StockInfo> {
	try {
		// Replace 'YOUR_API_KEY' with your actual Polygon.io API key
		const apiKey = process.env.POLYGON_API_KEY;
		const baseUrl = process.env.POLYGON_API_URL;

		const config = {
			headers: {
				Authorization: `Bearer ${apiKey}`,
			},
		};

		// Fetch company details

		const tickerUrl = `${baseUrl}/v3/reference/tickers/${ticker}`;
		const detailsResponse = await axios.get(tickerUrl, config);
		const name = detailsResponse?.data?.results?.name;
		const sector = detailsResponse?.data?.results?.sic_description;

		// Fetch latest price
		const tickerInfoURL = `${baseUrl}/v2/aggs/ticker/${ticker}/prev?adjusted=true`;
		const quoteResponse = await axios.get(tickerInfoURL, config);
		//console.log(quoteResponse.data);
		const price = quoteResponse.data.results[0].c;

		return {
			name,
			ticker,
			price,
			sector,
		};
	} catch (error) {
		console.error("Error fetching stock info:", error);
		throw error;
	}
}

// Usage example
//async function main() {
//  try {
//    const stockInfo = await getStockInfo('AAPL');
//    console.log(stockInfo);
//  } catch (error) {
//    console.error('Failed to get stock info:', error);
//  }
//}
