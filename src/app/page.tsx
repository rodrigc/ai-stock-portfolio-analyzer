import { redirect } from "next/navigation";
import { auth } from "@/auth/auth.ts";
import Link from "next/link";
import { Button } from "@/components/ui/button.tsx";
import Portfolio from "../components/Portfolio.tsx";

export default async function Home() {
	const session = await auth();

	if (!session) {
		redirect("/signin");
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
			<Portfolio />
		</div>
	);
}
