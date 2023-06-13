"use client"

import styles from "@/styles/navbar/Navbar.module.css"
import { useRouter } from "next/navigation";
import React from "react";

export default function NavbarWelcome() {

	const	router = useRouter();

	const	logIn = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/welcome/login");
	}

	const	welcome = () => {
		router.push("/welcome");
	}

	return (
		<nav className={styles.main}>
			<div>
				<img src="/images/logo.png" alt="Crunhy Pong logo" onClick={welcome}/>
				<button type="button" onClick={logIn}>Log In</button>
			</div>
		</nav>
	);
}
