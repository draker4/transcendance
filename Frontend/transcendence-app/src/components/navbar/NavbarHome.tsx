"use client"

import styles from "@/styles/navbar/NavbarLogged.module.css"
import avatarType from "@/types/Avatar.type";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import React, { useState } from "react";
import AvatarUser from "../logged-in/avatarUser/AvatarUser";
import { deleteCookie } from "cookies-next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

export default function NavbarHome({ avatar, chatOpen }: {
	avatar: avatarType,
	chatOpen: boolean,
}) {
	
	const	router = useRouter();
	const	segment = useSelectedLayoutSegment();
	const	[isOpen, setIsOpen] = useState<boolean>(false);

	const	welcome = () => {
		router.push("/home");
	}
	
	const	signoff = (e: React.MouseEvent<HTMLElement>) => {
		e.preventDefault();
		deleteCookie("crunchy-token");
		router.push("/welcome");
	}

	const	openChat = () => {
		const	chat = document.querySelector("#Chat");

		if (chat) {
			console.log("hereeee");
			chat.classList.add('chatOpened');
		}
		// chatOpen = !chatOpen;
	}
	
	return (
		<nav className={styles.main}>
			{
				segment !== "create" &&
				<>

				<FontAwesomeIcon
					icon={faComments}
					className={styles.menu}
					onClick={openChat}
				/>

				<div className={styles.center}>
					<img src="/images/logo.png"
						onClick={welcome}
						title="Logo Crunchy Pong"
						className={styles.logo}/>
					<div className={styles.avatar} onClick={signoff}>
							<AvatarUser avatar={avatar} borderSize={"3px"}/>
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
