// import { db } from './db';

interface PortfolioType {}

export async function savePortfolioToDatabase(portfolio: PortfolioType) {
	console.log("Saving portfolio", portfolio);
	// Replace this with your actual database saving logic
	/*
  await db.collection('portfolios').updateOne(
    { userId: portfolio.userId }, // Assuming you have a userId to identify the portfolio
    { $set: { stocks: portfolio.stocks } },
    { upsert: true }
  )
  */
}
