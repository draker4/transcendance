// import { ChatSocketContext } from "@/context/ChatSocketContext";
import styles from "@/styles/chat/ChatMain.module.css";
import ChatHome from "./chatParts/ChatHome";
import ChatPrivateMsg from "../chatPage/privateMsg/ChatPrivateMsg";
// import { useContext, useEffect, useState } from "react";

// type MessagePayload = {
// 	id: string,
// 	login: string,
// 	text: string,
// }

export default function ChatMain({ chatOpened, chatFirst, widthStyle }: {
	chatOpened: boolean,
	chatFirst: boolean,
	widthStyle: string,
}) {
	// const	socket = useContext(ChatSocketContext);
	// const	[value, setValue] = useState<string>('');
	// const	[messages, setMessages] = useState<MessagePayload []>([]);

	// useEffect(() => {
	// 	socket?.on("onMessage", (message: MessagePayload) => {
	// 		setMessages((prev) => [...prev, message]);
	// 	})
	// 	return () => {
	// 		socket?.off("onMessage");
	// 	}
	// }, [socket]);

	// const handleSubmit = async (e: any) => {
	// 	e.preventDefault();
	// 	const msg = e.target.msg.value;
	// 	socket?.emit("newMessage", {
	// 		text: msg,
	// 	});
	// 	setValue("");
	// };


	// ici ameliorer pour
	const displayPongiesPM: boolean = true;

	return (
		<div
			className={chatFirst ?
				styles.chatFirst
				: chatOpened ? styles.chatOpened
				: styles.chatClosed
			}
			style={chatOpened ? { width: widthStyle } : { width: 0 }}
		>
			{!displayPongiesPM && <ChatHome />}
			{displayPongiesPM && <ChatPrivateMsg />}







			{/* <div>
				{
					messages.length === 0
					? <div>No messages</div>
					: <div>
						{ messages.map((msg) =>
							<div key={msg.text}>
								{msg.text}
							</div>
						)}
					</div>
				}
			</div>
			<form onSubmit={handleSubmit}>
				<label>Write msg</label>

				<input
					type="text"
					name="msg"
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>

				<button type="submit">Submit</button>
			</form> */}
		</div>
	);
}
