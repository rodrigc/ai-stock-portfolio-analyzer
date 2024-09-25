import { auth } from "@/auth/auth.ts";
import { Button } from "@/components/ui/button.tsx";
import { UserManager } from "@/data/user.ts";
import Link from "next/link";
import { redirect } from "next/navigation";
import Portfolio from "../components/Portfolio.tsx";

export default async function Home() {
	const session = await auth();

	if (!session) {
		redirect("/signin");
	}

	const userManager = new UserManager();

	const email = session?.user?.email;
	let user = null;
	if (email) {
		user = await userManager.getUserByEmail(email);
	}

	if (!user && email) {
		// User doesn't exist, create a new user
		const newUserId = await userManager.addUser(email);
		user = { id: newUserId, email };
		console.log(`New user created with ID: ${newUserId}`);
	}

	return (
		<div className="container mx-auto p-4">
			<div className="flex flex-row justify-between">
				<h1 className="text-2xl font-bold mb-4">AI Stock Portfolio Analyzer</h1>
				<Link href="/api/auth/signout">
					<Button className="bg-red-500 text-white px-4 py-2 rounded">
						Logout
					</Button>
				</Link>
			</div>
			{user && <Portfolio userId={user.id} />}
		</div>
	);
}
