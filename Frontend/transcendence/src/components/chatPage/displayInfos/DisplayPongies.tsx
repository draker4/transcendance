import { ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";
import AvatarUser from "@/components/loggedIn/avatarUser/AvatarUser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import SearchBar from "../searchBar/SearchBar";

export default function DisplayInfos({
	icon,
	socket,
	openDisplay,
}: {
	icon: ReactNode;
	socket: Socket;
	openDisplay: (display: Display) => void;
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
					<div className={styles.delete}>
						<FontAwesomeIcon icon={faTrashCan} />
					</div>
				</div>
			</React.Fragment>
		);
	});

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
				<div className={styles.search}>
					<SearchBar
						socket={socket}
						search="myPongies"
						openDisplay={openDisplay}
					/>
				</div>
				{pongiesList}
			</div>
		</>
	)
}
