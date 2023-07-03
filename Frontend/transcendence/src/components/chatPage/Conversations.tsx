"use client"
import ChatService from "@/services/chat/Chat.service";
import { useEffect, useState } from "react";
import AvatarUser from "../loggedIn/avatarUser/AvatarUser";
import styles from "@/styles/chatPage/Conversations.module.css";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

export default function Chat({ token }: {
	token: string;
}) {
	const	chatService = new ChatService(token);
	const [channels, setChannels] = useState<Channel[]>([]);
	const [pongies, setPongies] = useState<Pongie[]>([]);
	const channelsList = channels.map((channel) => {
		return (
			<React.Fragment key={channel.id}>
				<div className={styles.list}>
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
		return (
			<React.Fragment key={pongie.id}>
				<div className={styles.list}>
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
	  chatService.socket?.emit(
		"getChannels",
		(payload: { success: boolean; channels: Channel[] }) => {
		  setChannels(payload.channels);
		  console.log(payload);
		}
	  );
	  chatService.socket?.emit(
		"getPongies",
		(payload: { success: boolean; pongies: Pongie[] }) => {
		  setPongies(payload.pongies);
		}
	  );
	}, [chatService.socket]);

	return (
		<div className={styles.main}>
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
