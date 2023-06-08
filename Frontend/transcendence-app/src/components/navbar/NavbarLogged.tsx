"use client"

import styles from "@/styles/navbar/NavbarLogged.module.css"
import { deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import React from "react";

export default function NavbarLogged() {

	const	router = useRouter();

	const	signoff = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		deleteCookie("crunchy-token");
		router.push("/welcome");
	}

	const	welcome = () => {
		router.push("/home");
	}

	return (
		<nav className={styles.main}>
			<svg fill="currentColor" stroke="currentColor" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
				<path d="M0.844 6.050c-0.256-0.256-0.381-0.581-0.381-0.975s0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.125 0.975 0.381s0.381 0.581 0.381 0.975-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381zM31.306 14.963c0.256 0.256 0.381 0.581 0.381 0.975s-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381s-0.381-0.581-0.381-0.975 0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.125 0.975 0.381zM31.306 25.819c0.256 0.256 0.381 0.581 0.381 0.975s-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381s-0.381-0.581-0.381-0.975 0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.131 0.975 0.381z"></path>
			</svg>
			<div>
				<img src="/images/logo.png" onClick={welcome}/>
				<button onClick={signoff}>Sign Off</button>
			</div>
		</nav>
	);
}
