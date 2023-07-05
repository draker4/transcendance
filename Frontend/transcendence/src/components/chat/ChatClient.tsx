"use client"

import { Socket, io } from "socket.io-client";
import Chat from "./Chat";
import { ChatSocketProvider } from "@/context/ChatSocketContext";
import { useEffect } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

export default function ChatClient({ token }:
	{ token: string | undefined }) {

	const	segment = useSelectedLayoutSegment();
	let		socket: Socket | null = null;

	if (segment !== "create")
		socket = io(`http://${process.env.HOST_IP}:4000/chat`, {
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
		<>
			{
				segment !== "create" &&
				<ChatSocketProvider value={socket}>
					<Chat/>
				</ChatSocketProvider>
			}
		</>
	);
}
