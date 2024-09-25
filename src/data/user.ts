import { eq } from "drizzle-orm";
import { DB } from "./db"; // Assume this is your database instance
import { users } from "./schema";

export class UserManager {
	// Add a new user
	async addUser(email: string): Promise<number> {
		// Check if the email already exists
		const existingUser = await DB.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);

		if (existingUser.length > 0) {
			throw new Error("User with this email already exists");
		}

		// Insert the new user
		const result = await DB.insert(users)
			.values({ email })
			.returning({ insertedId: users.id });

		if (result.length === 0) {
			throw new Error("Failed to insert user");
		}

		return result[0].insertedId;
	}

	// Get user by email
	async getUserByEmail(
		email: string,
	): Promise<{ id: number; email: string } | null> {
		const result = await DB.select()
			.from(users)
			.where(eq(users.email, email))
			.limit(1);
		return result.length > 0 ? result[0] : null;
	}

	// Get user by id
	async getUserById(id: number): Promise<{ id: number; email: string } | null> {
		const result = await DB.select()
			.from(users)
			.where(eq(users.id, id))
			.limit(1);
		return result.length > 0 ? result[0] : null;
	}
}
