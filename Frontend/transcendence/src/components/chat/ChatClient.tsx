"use client"

import { Socket, io } from "socket.io-client";
import Chat from "./Chat";
import { ChatSocketProvider } from "@/context/ChatSocketContext";
import { useEffect } from "react";

export default async function ChatClient({ token }:
	{ token: string | undefined }) {

	const	socket: Socket = io(`http://${process.env.HOST_IP}:4000/chat`, {
			extraHeaders: {
				Authorization: "Bearer " + token,
			},
			path: "/chat/socket.io"
	});

	useEffect(() => {
		return () => {
			if (socket)
				socket.disconnect();
		}
	}, [socket]);
	
	return (
		<ChatSocketProvider value={socket}>
			<Chat/>
		</ChatSocketProvider>
	);
}
