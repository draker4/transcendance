"use client"

import styles from "@/styles/navbar/NavbarLogged.module.css"
import avatarType from "@/types/Avatar.type";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import React from "react";
import AvatarUser from "../logged-in/avatarUser/AvatarUser";
import { deleteCookie } from "cookies-next";

export default function NavbarHome({ avatar }: {
	avatar: avatarType,
}) {
	
	const	router = useRouter();
	const	segment = useSelectedLayoutSegment();

	const	welcome = () => {
		router.push("/home");
	}
	
	const	signoff = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		deleteCookie("crunchy-token");
		router.push("/welcome");
	}
	
	return (
		<nav className={styles.main}>
			{
				segment !== "create" &&
				<>
				<svg className={styles.menu} fill="currentColor" stroke="currentColor" width="800px" height="800px" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg">
					<path d="M0.844 6.050c-0.256-0.256-0.381-0.581-0.381-0.975s0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.125 0.975 0.381s0.381 0.581 0.381 0.975-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381zM31.306 14.963c0.256 0.256 0.381 0.581 0.381 0.975s-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381s-0.381-0.581-0.381-0.975 0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.125 0.975 0.381zM31.306 25.819c0.256 0.256 0.381 0.581 0.381 0.975s-0.125 0.719-0.381 0.975-0.581 0.381-0.975 0.381h-28.512c-0.394 0-0.719-0.125-0.975-0.381s-0.381-0.581-0.381-0.975 0.125-0.719 0.381-0.975 0.581-0.381 0.975-0.381h28.512c0.394 0 0.719 0.131 0.975 0.381z"></path>
				</svg>
				<div className={styles.center}>
					<img src="/images/logo.png"
						onClick={welcome}
						title="Logo Crunchy Pong"
						className={styles.logo}/>
					<div className={styles.avatar} onClick={signoff}>
							<AvatarUser avatar={avatar}/>
					</div>
				</div>
				</>
			}
			{
				segment === "create" &&
				<div className={styles.center}>
					<img
						src="/images/logo.png"
						title="Logo Crunchy Pong"
						className={styles.logoCreate}/>
					<h2 className={styles.title}>Crunchy Pong</h2>
				</div>
			}
		</nav>
	);
}
