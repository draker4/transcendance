import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import ChatService from "@/services/chat/Chat.service";
import { useEffect } from "react";

export default function ChatBtn({ token } : {
	token: string | undefined;
}) {
	const chatService = new ChatService(token as string);

	useEffect(() => {
		return () => {
			chatService.socket?.off("connect_error");
			chatService.socket?.off("error");
			chatService.socket?.off("exception");
			chatService.socket?.disconnect();
		};
	}, [chatService.socket]);

	return (
		<FontAwesomeIcon
			icon={faComments}
			className={styles.menu}
		/>
	);
}
