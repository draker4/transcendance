import { ReactNode, useEffect, useState } from "react";
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
	const	[channels, setChannels] = useState<Channel []>([]);

	const channelsList = channels.map((channel) => {

		return (
			<React.Fragment key={channel.id}>
				<div
					className={styles.list}
					onClick={() => openDisplay(channel)}
				>
					<div className={styles.avatar}>
						<AvatarUser
							avatar={channel.avatar}
							borderSize="2px"
							borderColor={channel.avatar.borderColor}
							backgroundColor={channel.avatar.backgroundColor}
						/>
					</div>
					<div className={styles.name}>
						{channel.name}
					</div>
					<div className={styles.delete}>
						<FontAwesomeIcon icon={faTrashCan} />
					</div>
				</div>
			</React.Fragment>
		);
	});

	useEffect(() => {
		socket.emit("getChannels", (channels: Channel []) => {
			setChannels(channels);
		});
	}, [socket]);

	return (
		<>
			<div className={styles.header}>
				{icon}
				<h3>My Channels!</h3>
				<div></div>
			</div>
			<div className={styles.main}>
				<div className={styles.search}>
					<SearchBar
						socket={socket}
						search="myChannels"
						openDisplay={openDisplay}
					/>
				</div>
				{channelsList}
			</div>
		</>
	)
}
