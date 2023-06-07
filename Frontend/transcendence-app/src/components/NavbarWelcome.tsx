"use client"

import Client from "@/services/Client.service";
import styles from "@/styles/Navbar.module.css"
import { useRouter } from "next/navigation";
import React from "react";

const	client = new Client();

export default function NavbarWelcome() {

	const	router = useRouter();

	const	signIn = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/welcome/signin");
	}

	const	signUp = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		router.push("/welcome/signup");
	}

	return (
		<nav className={styles.main}>
			<svg fill="currentColor" stroke="currentColor" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" className={styles.menu}>
				<path d="M0.844 6.050c-0.256-0.256-0.381-0.581-0.381-0.975s0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.125 0.975 0.381s0.381 0.581 0.381 0.975-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381zM31.306 14.963c0.256 0.256 0.381 0.581 0.381 0.975s-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381s-0.381-0.581-0.381-0.975 0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.125 0.975 0.381zM31.306 25.819c0.256 0.256 0.381 0.581 0.381 0.975s-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381s-0.381-0.581-0.381-0.975 0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.131 0.975 0.381z"></path>
			</svg>
			<div className={styles.buttons}>
				<button onClick={signIn} className={styles.button}>Sign In</button>
				<button onClick={signUp} className={styles.button}>Sign Up</button>
			</div>
		</nav>
	);
}
