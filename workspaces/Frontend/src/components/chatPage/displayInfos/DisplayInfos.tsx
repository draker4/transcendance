import { ReactNode } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";

export default function DisplayInfos({
	icon,
	socket,
}: {
	icon: ReactNode;
	socket: Socket | undefined;
}) {

	return (
		<>
			<div className={styles.header}>
				{icon}
				<h3>Create a new channel!</h3>
				<div></div>
			</div>
			
			<div>
				Choose a name
			</div>
			
			<div>
				Add people
			</div>

			<div>
				Choose type if more than one people
			</div>

			<div>
				Choose topic if you want, do we have topics ??
			</div>

			<div>
				Choose channel avatar colors
			</div>

			<div>
				Validate, join special, you are owner, join other too
			</div>

			<div>
				Open display channel
			</div>
		</>
	)
}
