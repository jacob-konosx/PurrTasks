import { getToken } from "next-auth/jwt";
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	async function middleware(req) {
		const token = await getToken({ req });
		const isAuthenticated = !!token;

		const protectedRoutes = ["/auth/signup", "/auth/signin", "/verify"];

		// Protect routes when user is authenticated
		if (protectedRoutes.includes(req.nextUrl.pathname) && isAuthenticated) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// Protect routes when user is unauthenticated
		if (!protectedRoutes.includes(req.nextUrl.pathname) && !isAuthenticated) {
			return NextResponse.redirect(new URL("/auth/signin", req.url));
		}
	},
	{
		callbacks: {
			authorized: () => true,
		},
	}
);