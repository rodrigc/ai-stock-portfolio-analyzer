"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

const SignInContent = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleSignIn = (provider: string) => {
		signIn(provider, { callbackUrl });
	};

	return (
		<>
			<h1 className="text-4xl font-bold mb-8 text-center text-gray-800 dark:text-gray-200">
				AI Stock Portfolio Analyzer
			</h1>
			<Card className="w-[350px]">
				<CardHeader>
					<CardTitle>Sign In</CardTitle>
					<CardDescription>Choose your sign-in method below.</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						className="w-full bg-black"
						onClick={() => handleSignIn("github")}
					>
						<SiGithub className="mr-2 h-4 w-4" />
						Sign in with GitHub
					</Button>
				</CardContent>
				<CardFooter className="flex justify-center">
					<p className="text-sm text-gray-500 dark:text-gray-400">
						Educational purposes only. Consult a financial advisor for actual
						financial advice.
					</p>
				</CardFooter>
			</Card>
		</>
	);
};

const SignInPage = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
			{isMounted ? (
				<Suspense fallback={<div>Loading...</div>}>
					<SignInContent />
				</Suspense>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default SignInPage;
