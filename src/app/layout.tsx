import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "@/app/components/NavBar";
import "@/app/globals.css";

import NextAuthProvider from "@/app/NextAuthProvider";
import Footer from "@/app/components/Footer";
import { ReactQueryProvider } from "@/app/ReactQueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Purr 🐱 Tasks",
	description:
		"A simple todo app. Built with Next.js, PlanetScale (Drizzle ORM), and TailwindCSS.",
	icons: {
		icon: "/icon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" data-theme="dark">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="initial-scale=1.0, width=device-width"
				/>
			</head>
			<body className={`${inter.className} p-0 min-h-lvh]`}>
				<NextAuthProvider>
					<ReactQueryProvider>
						<NavBar />
						<main className="h-full pb-1 min">{children}</main>
						<Footer />
					</ReactQueryProvider>
				</NextAuthProvider>
			</body>
		</html>
	);
}
