import { ReactNode, useState } from "react";
import { Socket } from "socket.io-client";
import styles from "@/styles/chatPage/displayInfos/DisplayInfos.module.css";
import React from "react";
import AvatarUser from "@/components/loggedIn/avatarUser/AvatarUser";

export default function DisplayInfos({
	icon,
	socket,
}: {
	icon: ReactNode,
	socket: Socket,
}) {
	const	[channels, setChannels] = useState<Channel []>([]);

	const channelsList = channels.map((channel) => {
		return (
			<React.Fragment key={channel.id}>
				<div
					className={styles.list}
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
				</div>
			</React.Fragment>
		);
	});

	socket.emit("getChannels", (channels: Channel []) => {
		setChannels(channels);
	});

	return (
		<>
			<div className={styles.header}>
				{icon}
				<h3>My Channels!</h3>
				<div></div>
			</div>
			<div className={styles.main}>
				{channelsList}
			</div>
		</>
	)
}
