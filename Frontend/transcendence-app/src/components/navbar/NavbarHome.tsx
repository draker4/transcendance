"use client"

import styles from "@/styles/navbar/NavbarLogged.module.css"
import avatarType from "@/types/Avatar.type";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
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
