import { ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";
import DisplayPongies from "./DisplayPongies";
import DisplayChannels from "./DisplayChannels";

export default function DisplayInfos({
	icon,
	socket,
	display,
	openDisplay,
	littleScreen,
}: {
	icon: ReactNode;
	socket: Socket;
	display: { button: string };
	openDisplay: (display: Display) => void;
	littleScreen: boolean,
}) {
	const	[confirm, setConfirm] = useState<Pongie | Channel | null>(null);
	
	const	cancel = (event: React.MouseEvent) => {
		event.stopPropagation();
		setConfirm(null);
	  }
	
	  const	confirmDelete = (data: Pongie | Channel, event: React.MouseEvent) => {
		event.stopPropagation();
		setConfirm(data);
	  }

	if (display.button === "pongies")
		return <DisplayPongies
					icon={icon}
					socket={socket}
					openDisplay={openDisplay}
					confirm={confirm}
					cancel={cancel}
					confirmDelete={confirmDelete}
					littleScreen={littleScreen}
				/>

	if (display.button === "channels")
		return <DisplayChannels
					icon={icon}
					socket={socket}
					openDisplay={openDisplay}
					confirm={confirm}
					cancel={cancel}
					confirmDelete={confirmDelete}
					littleScreen={littleScreen}
				/>

	return (
		<>
			<div className={styles.header}>
				{icon}
				<h3>Test!</h3>
				<div></div>
			</div>
			{display.button}
		</>
	)
}
