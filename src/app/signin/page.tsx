"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { SiGithub } from "@icons-pack/react-simple-icons";

const SignInContent = () => {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const handleSignIn = (provider: string) => {
		signIn(provider, { callbackUrl });
	};

	return (
		<Card className="w-[350px]">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>Choose your sign-in method below.</CardDescription>
			</CardHeader>
			<CardContent>
				<Button className="w-full" onClick={() => handleSignIn("github")}>
					<SiGithub className="mr-2 h-4 w-4" />
					Sign in with GitHub
				</Button>
			</CardContent>
			<CardFooter className="flex justify-center">
				<p className="text-sm text-gray-500 dark:text-gray-400">
					Secure authentication powered by NextAuth.js
				</p>
			</CardFooter>
		</Card>
	);
};

const SignInPage = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
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
