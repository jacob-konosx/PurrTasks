import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";

import NextAuthProvider from "./NextAuthProvider";
import Footer from "./components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Purr 🐱 Tasks",
	description: "A simple todo app. Built with Next.js, PlanetScale (Drizzle ORM), and TailwindCSS.",
	icons: {
		icon: "/icon.ico", // /public path
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="dark" className="h-[100%]">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</head>
			<body className={`${inter.className} p-0 h-auto]`}>
				<NextAuthProvider>
					<NavBar />
					<main className="h-full pb-1">{children}</main>
					<Footer />
				</NextAuthProvider>
			</body>
		</html>
	);
}
