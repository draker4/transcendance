import React from "react";
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import NavbarWelcome from "@/components/navbar/NavbarWelcome";
import styles from "@/styles/layout/LayoutWelcome.module.css";

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
		<div className={styles.all}>
			<div className={styles.navbar}>
				<NavbarWelcome />
			</div>
			<div className={styles.children}>
				{ children }
			</div>
		</div>
	);
}
