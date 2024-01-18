import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "../api/db";
import { eq } from "drizzle-orm";
import { users } from "../api/schema";
import bcrypt from "bcrypt";

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
			id: "signUp",

			credentials: {
				email: {
					label: "Email",
					type: "email",
				},
				password: {
					label: "Password",
					type: "passsword",
				},
				firstName: {
					label: "First Name",
					type: "text",
				},
				lastName: {
					label: "Last Name",
					type: "text",
				},
			},

			async authorize(credentials, req) {
				const { firstName, lastName, email, password } =
					credentials as {
						firstName: string;
						lastName: string;
						email: string;
						password: string;
					};

				const oldUser = await db.query.users.findFirst({
					where: eq(users.email, email),
				});
				if (oldUser)
					throw new Error("User with this email already exists!");

				const hashedPassword = await bcrypt.hash(password, 12);

				try {
					await db.insert(users).values({
						first_name: firstName,
						last_name: lastName,
						email,
						password: hashedPassword,
					});
					const newUser = await db.query.users.findFirst({
						where: eq(users.email, email),
					});
					return newUser;
				} catch (error) {
					console.error(error);
					throw new Error("Unable to create new user at this time!");
				}
			},
		}),
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
