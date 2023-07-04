import styles from "@/styles/chatPage/ChatDisplay.module.css";
import privMsgStyles from "@/styles/chatPage/privateMsg/ChatPrivateMsg.module.css";
import { faPeopleGroup, faMessage, faFaceLaughBeam, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode } from "react";
import { Socket } from "socket.io-client";
import ChatPrivateMsg from "./privateMsg/ChatPrivateMsg";

export default function ChatClient({
	socket,
	display,
	littleScreen,
	closeDisplay,
}: {
	socket: Socket;
	display: Channel | Pongie | undefined;
	littleScreen: boolean;
	closeDisplay: () => void;
}) {

	const	renderIcon = (): ReactNode => {
		if (littleScreen)
			return <FontAwesomeIcon icon={faArrowLeft} onClick={closeDisplay}/>
		
		if (!display)
			return <FontAwesomeIcon icon={faMessage} />
		
		if ('name' in display)
			return <FontAwesomeIcon icon={faPeopleGroup} />
		
		if ('login' in display)
			return <FontAwesomeIcon icon={faFaceLaughBeam} />
	}

	if (!display)
		return (
			<div className={styles.main}>
				{renderIcon()}
				Display
			</div>
		)

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
			<>
			<div className={styles.main + ' ' + styles.noPadding}>
				<ChatPrivateMsg icon={renderIcon()} pongie={display}/>
			</div>
			</>
		)
	
}
