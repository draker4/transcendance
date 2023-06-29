import { ChatSocketContext } from "@/context/ChatSocketContext";
import avatarType from "@/types/Avatar.type";
import { useContext, useEffect, useState } from "react";
import React from "react";

type ChannelType = {
	id: number,
	name: string,
	avatar: avatarType,
}

export default function ChatHome() {

	const	socket = useContext(ChatSocketContext);
	const	[channels, setChannels] = useState<ChannelType []>([]);


	useEffect(() => {
		socket?.emit('getChannels', (payload: {
			success: boolean,
			channels: ChannelType [],
		}) => {
			console.log(payload.channels);
			// if (payload.success === true)
			// 	setChannels((prev) => [...prev, payload.channels]);
			// console.log("ici", payload[0]);
		});
		console.log("channels", channels);
	}, [socket, channels]);

	return (
		<div>
			<p>Channels</p>
			<p>Pongies</p>
		</div>
	)
}
