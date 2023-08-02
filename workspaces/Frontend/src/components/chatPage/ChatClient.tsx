"use client";

import { useEffect, useState } from "react";
import stylesError from "@/styles/chatPage/ChatPage.module.css";
import styles from "@/styles/chatPage/ChatClient.module.css";
import Conversations from "./Conversations";
import ChatDisplay from "./ChatDisplay";
import ChatService from "@/services/Chat.service";
import Link from "next/link";
import LoadingComponent from "../loading/Loading";
import LoadingSuspense from "../loading/LoadingSuspense";
import { Socket } from "socket.io-client";
import { toast } from "react-toastify";

export default function ChatClient({
  token,
  myself,
}: {
  token: string;
  myself: Profile & { avatar: Avatar };
}) {
  let   chatService = new ChatService(token);
  const [littleScreen, setLittleScreen] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [display, setDisplay] = useState<Display>();
  const [error, setError] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | undefined>(chatService.socket);

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
      setError(true);
    }

    socket?.on("disconnect", handleError);

    return () => {
      socket?.off("disconnect", handleError);
    }
  }, [socket]);

  if (!socket || error) {

    const intervalId = setInterval(() => {
      const chatService = new ChatService();
      if (chatService.socket) {
        setSocket(chatService.socket);
        setError(false);
        clearInterval(intervalId);
        toast.info("Connection closed! Reconnecting...");
      }
      console.log("chatservice reload here", chatService.socket?.id);
    }, 500);
    
    return <LoadingSuspense />;
  }

  // narrow screen width, display not opened
  if (littleScreen && !open)
    return (
      <div className={styles.main}>
        <Conversations
          socket={chatService.socket}
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
