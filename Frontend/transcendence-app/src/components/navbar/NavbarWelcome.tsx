"use client"

import Client from "@/services/Client.service";
import styles from "@/styles/Navbar.module.css"
import { useRouter } from "next/navigation";
import React from "react";

const	client = new Client();

export default function NavbarWelcome() {

	const	router = useRouter();

	const	logIn = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/welcome/login");
	}

	return (
		<nav className={styles.main}>
			<div className={styles.buttons}>
				<button onClick={logIn} className={styles.button}>Log In</button>
			</div>
		</nav>
	);
}
