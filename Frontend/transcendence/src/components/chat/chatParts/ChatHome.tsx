import { ChatSocketContext } from "@/context/ChatSocketContext";
import { responsiveFontSizes } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import React from "react";

export default function ChatHome() {

	const	socket = useContext(ChatSocketContext);
	const	[channels, setChannels] = useState<string []>([]);


	useEffect(() => {
		socket?.emit('getChannels', (payload: any) => {
			console.log("ici", payload[0]);
		});
	}, [socket]);

	return (
		<div>
			<p>Channels</p>
			<p>Pongies</p>
		</div>
	)
}
