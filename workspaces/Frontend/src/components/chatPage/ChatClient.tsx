"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/chatPage/ChatClient.module.css";
import stylesError from "@/styles/chatPage/ChatPage.module.css";
import Conversations from "./ConversationPannel/Conversations";
import ChatDisplay from "./ChatDisplay";
import ChatService from "@/services/Chat.service";
import LoadingSuspense from "../loading/LoadingSuspense";
import { Socket } from "socket.io-client";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ChatClient({
  token,
  myself,
  channelId,
}: {
  token: string;
  myself: Profile & { avatar: Avatar };
  channelId: number[] | undefined;
}) {
  const [littleScreen, setLittleScreen] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [display, setDisplay] = useState<Display>();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  const [getChannel, setGetChannel] = useState<boolean>(channelId && channelId.length >= 1 ? true : false);
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

  useEffect(() => {
    if (socket && channelId && channelId.length >= 1)
      socket.emit('getChannel', channelId[0], (payload: {
        success: boolean;
        error: string;
        channel: Channel;
    }) => {
      if (payload && payload.success) {
        openDisplay(payload.channel);
        setGetChannel(false);
        return ;
      }
      if (payload && payload.error && payload.error === "protected")
        toast.info('This channel is protected! You need a password');
      if (payload && payload.error && payload.error === "private")
        toast.info('This channel is private! You cannot see it!');
      setError(true);
    });
  }, [socket]);

  if (!socket || (getChannel && !error))
    return <LoadingSuspense />;

  if (error) {
    return (
			<div className={stylesError.error}>
				<h2>Oops... You cannot access this channel!</h2>
				<Link href={"/home"} className={stylesError.errorLink}>
					<p>Return to Home Page!</p>
				</Link>
			</div>
		);
  }

  // narrow screen width, display not opened
  if (littleScreen && !open)
    return (
      <div className={styles.main}>
        <Conversations
          socket={socket}
          maxWidth="100%"
          openDisplay={openDisplay}
          myself={myself}
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
        myself={myself}
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
