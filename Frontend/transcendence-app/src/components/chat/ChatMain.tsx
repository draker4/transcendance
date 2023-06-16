import styles from "@/styles/chat/ChatMain.module.css";

export default function ChatMain({ chatOpened, chatFirst }: {
	chatOpened: boolean,
	chatFirst: boolean,
}) {
	
	return (
		<div className={chatFirst ?
				styles.chatFirst
				: chatOpened ? styles.chatOpened : styles.chatClosed
			}>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
			<p>MainChat</p>
		</div>
	);
}
