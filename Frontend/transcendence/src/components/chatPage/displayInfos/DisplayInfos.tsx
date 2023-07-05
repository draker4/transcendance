import { ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";
import AvatarUser from "@/components/loggedIn/avatarUser/AvatarUser";

export default function DisplayInfos({
	icon,
	socket,
	display,
}: {
	icon: ReactNode,
	socket: Socket,
	display: {
		"button": string,
	}
}) {
	const	[pongies, setPongies] = useState<Pongie []>([]);

	const pongiesList = pongies.map((pongie) => {

		return (
			<React.Fragment key={pongie.id}>
				<div
					className={styles.list}
				>
					<div className={styles.avatar}>
						<AvatarUser
							avatar={pongie.avatar}
							borderSize="2px"
							borderColor={pongie.avatar.borderColor}
							backgroundColor={pongie.avatar.backgroundColor}
						/>
					</div>
					<div className={styles.name}>
						{pongie.login}
					</div>
				</div>
			</React.Fragment>
		);
	});

	if (display.button === "pongies") {
		socket.emit("getPongies", (pongies: Pongie []) => {
			setPongies(pongies);
		});
		return (
			<>
				<div className={styles.header}>
					{icon}
					<h3>My Pongies!</h3>
					<div></div>
				</div>
				<div className={styles.main}>
					{pongiesList}
				</div>
			</>
		)
	}
	return (
		<>
			{display.button}
		</>
	)
}
