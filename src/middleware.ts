export { default } from "next-auth/middleware";

export const config = {
	matcher: [
		/* REVIEW: This comment is wrong, and does not include the extra routes, it should be removed */
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico|auth/signin|auth/signup|verify/*).*)",
	],
};
