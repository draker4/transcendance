"use client"

import { useEffect, useState } from "react";
import ChatBubbles from "./ChatBubbles"
import ChatMain from "./ChatMain"
import styles from "@/styles/chat/Chat.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

export default function Chat() {

	const	[chatOpened, setChatOpened] = useState<boolean>(false);
	const	[chatFirst, setChatFirst] = useState<boolean>(true);
	const	[littleScreen, setLittleScreen] = useState<boolean>(true);
	const	[isClosing, setIsClosing] = useState<boolean>(false);
	const	[widthStyle, setWidthStyle] = useState<string>("");

	useEffect(() => {
		const handleResize = () => {

			const screenWidth = window.innerWidth;
			setLittleScreen(screenWidth < 800);

			if (screenWidth < 800)
				setWidthStyle("calc(100vw - clamp(60px, 5vw, 80px) - 10px)");
			else
				setWidthStyle("calc(clamp(400px, 35vw, 600px) - 10px)");
		};
	
		handleResize();
	
		window.addEventListener("resize", handleResize);
	
		return () => {
		  window.removeEventListener("resize", handleResize);
		};
	}, []);

	useEffect(() => {
		document.documentElement.style.setProperty('--width-style', widthStyle);
	}, [widthStyle]);
	
	const	openAll = () => {
		setChatOpened(!chatOpened);
		setChatFirst(false);
		setIsClosing(false);
	}

	return (
		<>
			{
				!littleScreen && 
				<div className={styles.chatTotalBig} id="chat">
					<ChatBubbles
						littleScreen={littleScreen}
						setIsClosing={setIsClosing}
						setChatOpened={setChatOpened}
						isClosing={isClosing}
						chatOpened={chatOpened}
						setChatFirst={setChatFirst}
					/>
					<ChatMain
						chatOpened={chatOpened}
						chatFirst={chatFirst}
						widthStyle={widthStyle}
						isClosing={isClosing}
					/>
				</div>
			}
			{
				littleScreen && !chatOpened &&
				<div className={styles.display}>
					{/* <div className={styles.round}> */}
						<FontAwesomeIcon
							icon={faComments}
							className={styles.menu}
							onClick={openAll}
						/>
					{/* </div> */}
				</div>
			}
			{
				littleScreen && chatOpened &&
				<div className={isClosing ? styles.close : styles.chatTotalLittle} id="chat">
					<ChatBubbles
						littleScreen={littleScreen}
						setIsClosing={setIsClosing}
						isClosing={isClosing}
						setChatOpened={setChatOpened}
						chatOpened={chatOpened}
						setChatFirst={setChatFirst}
					/>
					<ChatMain
						chatOpened={chatOpened}
						chatFirst={chatFirst}
						widthStyle={widthStyle}
						isClosing={isClosing}
					/>
				</div>
			}
		</>
	);
}
