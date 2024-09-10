import NextAuth from "next-auth";
import { config } from "./config.ts";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth(config);
