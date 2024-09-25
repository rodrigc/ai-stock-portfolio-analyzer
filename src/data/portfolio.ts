import type { PortfolioHolding } from "@/stocks/stocks.ts";
import { and, eq } from "drizzle-orm";
import { DB } from "./db.ts"; // Assume this is your database instance
import type { NewStock } from "./schema.ts";
import { portfolios, stocks } from "./schema.ts";

export class PortfolioManager {
	// 1. Load a portfolio for a user
	async loadPortfolio(userId: number): Promise<PortfolioHolding[]> {
		const result = await DB.select({
			symbol: stocks.symbol,
			quantity: portfolios.quantity,
		})
			.from(portfolios)
			.innerJoin(stocks, eq(stocks.id, portfolios.stockId))
			.where(eq(portfolios.userId, userId));

		return result.map(
			(row) =>
				({
					ticker: row.symbol,
					shares: row.quantity,
				}) as PortfolioHolding,
		);
	}

	// 2. Save a portfolio for a user
	async savePortfolio(
		userId: number,
		holdings: PortfolioHolding[],
	): Promise<void> {
		await DB.transaction(async (tx) => {
			// Delete existing portfolio
			await tx.delete(portfolios).where(eq(portfolios.userId, userId));

			// Insert new holdings
			for (const holding of holdings) {
				const stock = await tx
					.select()
					.from(stocks)
					.where(eq(stocks.symbol, holding.ticker))
					.limit(1);
				if (stock.length === 0) {
					throw new Error(`Stock ${holding.ticker} not found`);
				}
				await tx.insert(portfolios).values({
					userId,
					stockId: stock[0].id,
					quantity: holding.shares,
				});
			}
		});
	}

	// 3. Delete a portfolio holding for a user
	async deleteHolding(userId: number, stockSymbol: string): Promise<void> {
		const stock = await DB.select()
			.from(stocks)
			.where(eq(stocks.symbol, stockSymbol))
			.limit(1);
		if (stock.length === 0) {
			throw new Error(`Stock ${stockSymbol} not found`);
		}
		await DB.delete(portfolios).where(
			and(eq(portfolios.userId, userId), eq(portfolios.stockId, stock[0].id)),
		);
	}

	// 4. Change a portfolio holding for a user
	async changeHolding(
		userId: number,
		stockSymbol: string,
		newQuantity: number,
	): Promise<void> {
		const stock = await DB.select()
			.from(stocks)
			.where(eq(stocks.symbol, stockSymbol))
			.limit(1);
		if (stock.length === 0) {
			throw new Error(`Stock ${stockSymbol} not found`);
		}
		await DB.update(portfolios)
			.set({ quantity: newQuantity })
			.where(
				and(eq(portfolios.userId, userId), eq(portfolios.stockId, stock[0].id)),
			);
	}

	// 5. Add a portfolio holding for a user
	/*
	async addHolding(userId: number, stockSymbol: string, quantity: number, stockName: string): Promise<void> {
		let stock = await DB.select().from(stocks).where(eq(stocks.symbol, stockSymbol)).limit(1);
		if (stock.length === 0) {
			// If the stock doesn't exist, add it to the database
			const [newStock] = await DB.insert(stocks).values([{
				symbol: stockSymbol,
				name: stockName || stockSymbol,
			} as NewStock]).returning();
			stock = [newStock];
		}
		await DB.insert(portfolios).values({
			userId,
			stockId: stock[0].id,
			quantity,
		});
	}
	*/
	async addHolding(
		userId: number,
		stockSymbol: string,
		quantity: number,
		stockName: string,
	): Promise<void> {
		let stock = await DB.select()
			.from(stocks)
			.where(eq(stocks.symbol, stockSymbol))
			.limit(1);
		if (stock.length === 0) {
			// If the stock doesn't exist, add it to the database
			const [newStock] = await DB.insert(stocks)
				.values([
					{
						symbol: stockSymbol,
						name: stockName || stockSymbol,
					} as NewStock,
				])
				.returning();
			stock = [newStock];
		}

		const existingHolding = await DB.select()
			.from(portfolios)
			.where(
				and(eq(portfolios.userId, userId), eq(portfolios.stockId, stock[0].id)),
			)
			.limit(1);

		if (existingHolding.length > 0) {
			// If the holding exists, update the quantity
			await DB.update(portfolios)
				.set({ quantity: existingHolding[0].quantity + quantity })
				.where(
					and(
						eq(portfolios.userId, userId),
						eq(portfolios.stockId, stock[0].id),
					),
				);
		} else {
			// If the holding doesn't exist, insert a new one
			await DB.insert(portfolios).values({
				userId,
				stockId: stock[0].id,
				quantity,
			});
		}
	}
}
