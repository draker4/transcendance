import AvatarMenu from "./AvatarMenu";
import ChatBtn from "./ChatBtn";
import NavbarLogo from "./NavbarLogo";
import Link from "next/link";
import Theme from "../theme/Theme";
import styles from "@/styles/navbar/Navbar.module.css";
import ChatService from "@/services/Chat.service";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

export default function NavbarConnected({
	avatar,
	token,
	profile,
}: {
	avatar: Avatar,
	token: string,
	profile: Profile,
}) {
	const [socket, setSocket] = useState<Socket | undefined>(undefined);

	useEffect(() => {

		const handleError = () => {
			toast.info("Connection closed! Reconnecting...");
			setSocket(undefined);
		}

		if (!socket) {
			const intervalId = setInterval(() => {
				const chatService = new ChatService(token);
				if (chatService.socket) {
					setSocket(chatService.socket);
					clearInterval(intervalId);
				}
				console.log("button service reload here", chatService.socket?.id);
			}, 500);
		}

		socket?.on("disconnect", handleError);

		return () => {
			socket?.off("disconnect", handleError);
		}
	}, [socket]);

	return (
		<header>
		<nav className={styles.nav}>
			<NavbarLogo link="/home" />
			<div className={styles.right}>
			<Theme />
			<Link href={"/home/chat"} className={styles.chatBtn}>
				<ChatBtn socket={socket} />
			</Link>
			<AvatarMenu avatar={avatar} profile={profile} socket={socket}/>
			</div>
		</nav>
		</header>
	);
}
