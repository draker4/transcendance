import React from "react";
import { Inter } from "next/font/google"
import "@/styles/globals.css"

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
				{children}
			</body>
		</html>
	);
}
