import styles from "@/styles/chat/ChatMain.module.css";

export default function ChatMain({ chatOpened, chatFirst, widthStyle, isClosing }: {
	chatOpened: boolean,
	chatFirst: boolean,
	widthStyle: string,
	isClosing: boolean,
}) {

	return (
		<div
			className={chatFirst ?
				styles.chatFirst
				: isClosing ? styles.chatClosed
				: chatOpened ? styles.chatOpened : styles.chatClosed
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
