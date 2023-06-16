"use client"

import { useEffect, useState } from "react";
import ChatBubbles from "./ChatBubbles"
import ChatMain from "./ChatMain"
import styles from "@/styles/chat/Chat.module.css";

export default function Chat() {

	const	[chatOpened, setChatOpened] = useState<boolean>(false);
	const	[chatFirst, setChatFirst] = useState<boolean>(true);

	return (
		<div className={styles.chatTotal}>
			<ChatBubbles setChatOpened={setChatOpened} chatOpened={chatOpened} setChatFirst={setChatFirst}/>
			<ChatMain chatOpened={chatOpened} chatFirst={chatFirst}/>
        </div>
	);
}
