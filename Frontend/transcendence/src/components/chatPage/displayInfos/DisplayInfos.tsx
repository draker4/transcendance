import { ReactNode } from "react";
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
}: {
	icon: ReactNode,
	socket: Socket,
	display: {
		"button": string,
	}
	openDisplay: (display: Display) => void;
}) {

	if (display.button === "pongies")
		return <DisplayPongies
					icon={icon}
					socket={socket}
					openDisplay={openDisplay}
				/>

	if (display.button === "channels")
		return <DisplayChannels
					icon={icon}
					socket={socket}
					openDisplay={openDisplay}
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
