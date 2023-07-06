import styles from "@/styles/chatPage/ChatDisplay.module.css";
import privMsgStyles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import { faPeopleGroup, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { Socket } from "socket.io-client";
import ChatPrivateMsg from "./privateMsg/ChatPrivateMsg";
import DisplayInfos from "./displayInfos/DisplayInfos";
import { faMessage, faFaceLaughBeam } from "@fortawesome/free-regular-svg-icons";

export default function ChatClient({
	socket,
	display,
	littleScreen,
	closeDisplay,
}: {
	socket: Socket;
	display: Display;
	littleScreen: boolean;
	closeDisplay: () => void;
}) {

	const	renderIcon = (): ReactNode => {
		if (littleScreen)
			return <FontAwesomeIcon
						icon={faArrowLeft}
						onClick={closeDisplay}
						className={styles.iconArrow}
					/>
		
		if (!display)
			return <FontAwesomeIcon
						icon={faMessage}
						className={styles.icon}
					/>
		
		if ('button' in display && display.button === "new")
			return <FontAwesomeIcon
						icon={faMessage}
						className={styles.icon}
					/>

		if ('name' in display
			|| ('button' in display && display.button === "channels"))
			return <FontAwesomeIcon
						icon={faPeopleGroup}
						className={styles.icon}
					/>
		
		if ('login' in display
		|| ('button' in display && display.button === "pongies"))
			return <FontAwesomeIcon
						icon={faFaceLaughBeam}
						className={styles.icon}
					/>
	}

	if (!display)
		return (
			<div className={styles.main}>
				{renderIcon()}
				Display
			</div>
		)
	
	if ('button' in display) {
		return (
			<div className={styles.main}>
				<DisplayInfos
					icon={renderIcon()}
					socket={socket}
					display={display}
				/>
			</div>
		)
	}

	if ('name' in display)
		return (
			<div className={styles.main}>
				{renderIcon()}
				{display.name}
			</div>
		)

	// PrivateMsg
	if ('login' in display)
			console.log(display);
		return (
			<div className={styles.main + ' ' + styles.noPadding}>
				<ChatPrivateMsg icon={renderIcon()} pongie={display}/>
			</div>
		)
	
}
