import NextAuth from "next-auth";

declare module "next-auth" {
	interface Session {
		user: {
			/** The user's name. */
			name: string;
            email: string;
            id: number;
		};
	}
}
