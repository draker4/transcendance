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
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";

export default function NavbarConnected({
	avatar,
	token,
	profile,
}: {
	avatar: Avatar,
	token: string,
	profile: Profile,
}) {
	const	[socket, setSocket] = useState<Socket | undefined>(undefined);
	const	router = useRouter();

	useEffect(() => {

		const handleError = () => {
			toast.info("Connection closed! Reconnecting...");
			setSocket(undefined);
		}

		const	disconnectClient = async () => {
			await disconnect();
			router.refresh();
		}

		if (!socket) {
			const	intervalId = setInterval(() => {
				const chatService = new ChatService(token);
				if (chatService.disconnectClient) {
					clearInterval(intervalId);
					disconnectClient();
				}
				else if (chatService.socket) {
					setSocket(chatService.socket);
					clearInterval(intervalId);
				}
				console.log("button service reload here", chatService.socket?.id);
			}, 500);
		}

		socket?.on("disconnect", handleError);

		return () => {
			socket?.off("disconnect", handleError);
			socket?.off("connect_error");
			socket?.off("error");
			socket?.off("exception");
			socket?.off("refresh");
			socket?.disconnect();
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
