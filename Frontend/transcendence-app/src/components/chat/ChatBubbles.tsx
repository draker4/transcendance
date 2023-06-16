"use client"

import styles from "@/styles/chat/ChatBubbles.module.css";
import { faArrowLeft, faComments } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Avatar } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

export default function ChatBubbles({ littleScreen, isClosing, setIsClosing, setChatFirst, setChatOpened, chatOpened }: {
	littleScreen: boolean,
	isClosing: boolean,
	setIsClosing: Dispatch<SetStateAction<boolean>>,
	setChatFirst:  Dispatch<SetStateAction<boolean>>,
	setChatOpened:  Dispatch<SetStateAction<boolean>>,
	chatOpened: boolean,
}) {

	const	openChat = () => {
		setChatFirst(false);
		if (littleScreen && chatOpened) {
			setIsClosing(true);
			setTimeout(() => {
				setChatOpened(false);
			}, 500);
		}
		else {
			setChatOpened(!chatOpened);
			setIsClosing(false);
		}
	}

	return (
		<div className={styles.chatBubbles}>

			<div className={styles.icon}>
				{ (!chatOpened || isClosing) && 
					<FontAwesomeIcon
						icon={faComments}
						className={styles.menu}
						onClick={openChat}
					/>
				}

				{ chatOpened && !isClosing &&
					<FontAwesomeIcon
						icon={faArrowLeft} 
						className={styles.menu}
						onClick={openChat}
					/>
				}
			</div>

			<div className={styles.line}></div>

			<div className={styles.bubbles}>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
				<Avatar className={styles.bubble} variant="rounded"></Avatar>
			</div>

			<div className={styles.middleLine}></div>

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

			<div className={styles.bottom}></div>

		</div>
	);
}
