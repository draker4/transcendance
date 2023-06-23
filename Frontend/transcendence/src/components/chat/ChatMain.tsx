import styles from "@/styles/chat/ChatMain.module.css";

export default function ChatMain({ chatOpened, chatFirst, widthStyle }: {
	chatOpened: boolean,
	chatFirst: boolean,
	widthStyle: string,
}) {

	return (
		<div
			className={chatFirst ?
				styles.chatFirst
				: chatOpened ? styles.chatOpened
				: styles.chatClosed
			}
			style={chatOpened ? { width: widthStyle } : { width: 0 }}
		>
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
