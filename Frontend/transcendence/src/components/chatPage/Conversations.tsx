import { useEffect, useState } from "react";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";
import styles from "@/styles/chatPage/Conversations.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { Socket } from "socket.io-client";

export default function Chat({ socket, maxWidth, openDisplay }: {
	socket: Socket;
	maxWidth: string;
	openDisplay: (display: Channel | Pongie) => void;
}) {
	const	[channels, setChannels] = useState<Channel[]>([]);
	const	[pongies, setPongies] = useState<Pongie[]>([]);

	const channelsList = channels.map((channel) => {

		const	handleClick = () => {
			openDisplay(channel);
		}

		return (
			<React.Fragment key={channel.id}>
				<div className={styles.list} onClick={handleClick}>
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
				</div>
			</React.Fragment>
		);
	});

	const pongiesList = pongies.map((pongie) => {

		const	handleClick = () => {
			openDisplay(pongie);
		}

		return (
			<React.Fragment key={pongie.id}>
				<div
					className={styles.list}
					onClick={handleClick}
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
  
	useEffect(() => {
	  socket?.emit(
		"getChannels",
		(payload: { success: boolean; channels: Channel[] }) => {
			if (payload.success)
				setChannels(payload.channels);
		}
	  );
	  socket?.emit(
		"getPongies",
		async (payload: { success: boolean; pongies: Pongie[] }) => {
			if (payload.success)
				setPongies(payload.pongies);
		}
	  );
	}, [socket]);

	return (
		<div className={styles.main} style={{maxWidth: maxWidth}}>
			<h3>Recherche</h3>
			<div className={styles.title}>
				<h3>Discussions</h3>
				<FontAwesomeIcon
					icon={faPenToSquare}
					className={styles.menu}
				/>
			</div>
			{channelsList}
			{pongiesList}
    	</div>
	);
}
