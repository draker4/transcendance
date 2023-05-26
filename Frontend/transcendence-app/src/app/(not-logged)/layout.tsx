import React from "react";
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import NavbarWelcome from "@/components/NavbarWelcome";

const	inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: "Transcendence",
	description: "Transcendence is a multiplayer game where you can play with your friends and chat with them."
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<NavbarWelcome />
				{children}
			</body>
		</html>
	);
}
