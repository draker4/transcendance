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
import SetUpChannelSecondPart from "./SetUpChannelSecondPart";

interface StatusData {
  [key: string]: string;
}

export default function ChatClient({
  token,
  myself,
  channelId,
}: {
  token: string;
  myself: Profile & { avatar: Avatar };
  channelId: number | undefined;
}) {
  const [littleScreen, setLittleScreen] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [display, setDisplay] = useState<Display>();
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const [error, setError] = useState<boolean>(false);
  const [getChannel, setGetChannel] = useState<boolean>(channelId ? true : false);
  const	[status, setStatus] = useState<Map<string, string>>(new Map());
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
    if (socket && channelId !== undefined) {
      if (channelId !== 0)
        socket.emit('getChannel', channelId, (payload: {
          success: boolean;
          error: string;
          channel: Channel;
      }) => {
        if (payload && payload.success) {
          openDisplay(payload.channel);
          setGetChannel(false);

          console.log("ChatClient => emit('getChannel') => channel = ", payload.channel);
          return ;
        }
        if (payload && payload.error && payload.error === "protected")
          toast.info('This channel is protected! You need a password');
        if (payload && payload.error && payload.error === "private")
          toast.info('This channel is private! You cannot see it!');
        if (payload && payload.error && payload.error === "no channel")
          return ;
        setError(true);
      });

      else {
        openDisplay({
          "button": "new",
        });
      }
    }

    const	updateStatus = (payload: StatusData) => {
      if (payload) {
        const	payloadMap = new Map(Object.entries(payload));
        const	statusMap = new Map(status);

        payloadMap.forEach((value, key) => statusMap.set(key, value));
        setStatus(statusMap);
      }
    }
    
    socket?.emit('getStatus', (payload: StatusData) => {
      if (payload) {
        const statusMap = new Map(Object.entries(payload));
        setStatus(statusMap);
      }
    });

		socket?.on('updateStatus', updateStatus);

    return () => {
      socket?.off('updateStatus', updateStatus);
    }

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
          status={status}
          display={display}
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
          status={status}
        />
      </div>
    );

  // wide screen width, open both
  return (
    <div className={styles.main}>
      <Conversations
        socket={socket}
        maxWidth="350px"
        openDisplay={openDisplay}
        myself={myself}
        status={status}
      />
      <ChatDisplay
        socket={socket}
        display={display}
        littleScreen={littleScreen}
        closeDisplay={closeDisplay}
        myself={myself}
        openDisplay={openDisplay}
        status={status}
      />

	  {display && "type" in display && display.type !== "privateMsg" && <SetUpChannelSecondPart channelId={display.id} socket={socket}/>}
	</div>
  );
}
