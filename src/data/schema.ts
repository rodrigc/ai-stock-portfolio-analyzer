import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	integer,
	pgTable,
	primaryKey,
	serial,
	text,
	varchar,
} from "drizzle-orm/pg-core";

// USERS table
export const users = pgTable("users", {
	id: serial("id").primaryKey(),
	email: varchar("email", { length: 255 }).notNull().unique(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

// STOCKS table (updated with serial id)
export const stocks = pgTable("stocks", {
	id: serial("id").primaryKey(),
	symbol: varchar("symbol", { length: 10 }).notNull().unique(),
	name: text("name").notNull(),
});
export type Stock = InferSelectModel<typeof stocks>;
export type NewStock = InferInsertModel<typeof stocks>;

// PORTFOLIOS table
export const portfolios = pgTable(
	"portfolios",
	{
		id: serial("id"),
		userId: integer("user_id").references(() => users.id),
		stockId: integer("stock_id").references(() => stocks.id),
		quantity: integer("quantity").notNull(),
	},
	(table) => ({
		pk: primaryKey({ columns: [table.id, table.userId, table.stockId] }),
	}),
);

export type Portfolio = InferSelectModel<typeof portfolios>;
export type NewPortfolio = InferInsertModel<typeof portfolios>;
