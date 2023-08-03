"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/chatPage/ChatClient.module.css";
import Conversations from "./Conversations";
import ChatDisplay from "./ChatDisplay";
import ChatService from "@/services/Chat.service";
import LoadingSuspense from "../loading/LoadingSuspense";
import { Socket } from "socket.io-client";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";

export default function ChatClient({
  token,
  myself,
}: {
  token: string;
  myself: Profile & { avatar: Avatar };
}) {
  const [littleScreen, setLittleScreen] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [display, setDisplay] = useState<Display>();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const  router = useRouter();

  const openDisplay = (display: Display) => {
    setOpen(true);
    setDisplay(display);
  };

  const closeDisplay = () => {
    setOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setLittleScreen(screenWidth < 800);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // WsException Managing
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

  if (!socket)
    return <LoadingSuspense />;

  // narrow screen width, display not opened
  if (littleScreen && !open)
    return (
      <div className={styles.main}>
        <Conversations
          socket={socket}
          maxWidth="100%"
          openDisplay={openDisplay}
        />
      </div>
    );

  // narrow screen width, display opened
  if (littleScreen && open)
    return (
      <div className={styles.main}>
        <ChatDisplay
          socket={socket}
          display={display}
          littleScreen={littleScreen}
          closeDisplay={closeDisplay}
          myself={myself}
          openDisplay={openDisplay}
        />
      </div>
    );

  // wide screen width, open both
  return (
    <div className={styles.main}>
      <Conversations
        socket={socket}
        maxWidth="400px"
        openDisplay={openDisplay}
      />
      <ChatDisplay
        socket={socket}
        display={display}
        littleScreen={littleScreen}
        closeDisplay={closeDisplay}
        myself={myself}
        openDisplay={openDisplay}
      />
    </div>
  );
}
