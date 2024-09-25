import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

const { Pool } = pg;
// Assume database connection setup
export const pool = new Pool({
	host: process.env.POSTGRES_HOST,
	port: Number(process.env.POSTGRES_PORT),
	database: process.env.POSTGRES_DB,
	user: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
});

export const DB = drizzle(pool, { logger: true });
