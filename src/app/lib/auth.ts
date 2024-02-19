import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../api/db";
import { users } from "../api/schema";
import { sendEmail } from "./mailer";

export const authOptions: NextAuthOptions = {
	callbacks: {
		jwt: ({ token, user }) => {
			if (user) {
				return { ...token, id: user.id };
			}
			return token;
		},
		session: ({ session, token }) => {
			return {
				...session,
				user: {
					...session.user,
					id: token.id,
				},
			};
		},
	},
	session: {
		strategy: "jwt",
	},
	providers: [
		Credentials({
			type: "credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "",
				},
			},
			async authorize(credentials): Promise<any> {
				const { email, password } = credentials as {
					email: string;
					password: string;
				};

				const user = await db.query.users.findFirst({
					where: eq(users.email, email),
				});

				if (!user) {
					throw new Error("User with this email doesn't exist!");
				}
				if (!user.is_verified) {
					throw new Error("User not verified! Verify your email to login.");
				}
				const isPasswordCorrect = await bcrypt.compare(
					password,
					user.password
				);
				if (!isPasswordCorrect) {
					throw new Error("Invalid credentials!");
				}
				return user;
			},
		}),
	],
	pages: {
		signIn: "/auth/signin",
		// signOut: "/auth/signout",
		// error: "/auth/error",
		// verifyRequest: "/auth/verify-request",
		// newUser: "/auth/new-user",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
