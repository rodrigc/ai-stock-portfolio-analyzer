import dotenv from "@dotenvx/dotenvx";
import { type Config, defineConfig } from "drizzle-kit";

dotenv.config();

console.log(
	process.env.POSTGRES_HOST,
	process.env.POSTGRES_USER,
	process.env.POSTGRES_PASSWORD,
	process.env.POSTGRES_DB,
);

export default defineConfig({
	schema: "src/data/schema.ts",
	out: "src/data/migrations",
	dialect: "postgresql", // 'postgresql' | 'mysql' | 'sqlite'
	dbCredentials: {
		host: process.env.POSTGRES_HOST,
		port: process.env.POSTGRES_PORT,
		user: process.env.POSTGRES_USER,
		password: process.env.POSTGRES_PASSWORD,
		database: process.env.POSTGRES_DB,
		ssl: false,
	},
} as Config);
