"use client"

import { useEffect, useState } from "react";
import Lobby from "../lobby/Lobby";
import HomeProfile from "../lobby/homeProfile/HomeProfile";
import { Socket } from "socket.io-client";
import ChatService from "@/services/Chat.service";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";

export default function ChatClient({
	token,
	profile,
	avatar,
  }: {
	token: string;
	profile: Profile;
	avatar: Avatar;
  }) {
	const	[socket, setSocket] = useState<Socket | undefined>(undefined);
	const	router = useRouter();

	// handle socket connection
	useEffect(() => {

		const handleError = () => {
		  setSocket(undefined);
		}
		
			const	disconnectClient = async () => {
				await disconnect();
				router.refresh();
			}
	
		if (!socket) {
	
		  const intervalId = setInterval(() => {
			const chatService = new ChatService(token);
			
					if (chatService.disconnectClient) {
						clearInterval(intervalId);
						disconnectClient();
					}
	
			if (chatService.socket) {
			  setSocket(chatService.socket);
			  clearInterval(intervalId);
			}
			console.log("chatservice reload here", chatService.socket?.id);
		  }, 500);
		}
	
		socket?.on("disconnect", handleError);
	
		return () => {
		  socket?.off("disconnect", handleError);
		}
	  }, [socket]);

	return (
		<>
			<HomeProfile profile={profile} avatar={avatar} />
			<Lobby profile={profile} avatar={avatar} />
		</>
	)
  }
