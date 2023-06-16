"use client"

import styles from "@/styles/chat/ChatBubbles.module.css";
import { faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

export default function ChatBubbles({ setChatFirst, setChatOpened, chatOpened }: {
	setChatFirst:  Dispatch<SetStateAction<boolean>>,
	setChatOpened:  Dispatch<SetStateAction<boolean>>,
	chatOpened: boolean,
}) {

	const	openChat = () => {
		setChatOpened(!chatOpened);
		setChatFirst(false);
	}

	return (
		<div className={styles.chatBubbles}>

			<FontAwesomeIcon
				icon={faComments}
				className={styles.menu}
				onClick={openChat}
			/>

			<div className={styles.line}></div>

			<div className={styles.bubbles}>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}></Avatar>
				<Avatar className={styles.bubble}>0</Avatar>
				<Avatar className={styles.bubble}>A</Avatar>
			</div>
		</div>
	);
}
