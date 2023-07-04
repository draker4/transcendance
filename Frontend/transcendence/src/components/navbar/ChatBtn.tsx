import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "@/styles/navbar/Navbar.module.css";
import ChatService from "@/services/chat/Chat.service";
import { useEffect } from "react";

export default async function ChatBtn({ token } : {
	token: string | undefined;
}) {
	const	chatService = new ChatService(token as string);
	
	useEffect(() => {
		return () => {
			if (chatService.socket)
				chatService.socket.disconnect();
		}
	}, [chatService.socket]);

	return (
		<FontAwesomeIcon
			icon={faComments}
			className={styles.menu}
		/>
	);
}
