"use client";

import React from "react";
import styles from "@/styles/profile/Profile.module.css";
import ChannelFirstPart from "./ChannelFirstPart";
import ChannelSecondPart from "./ChannelSecondPart";
import { Socket } from "socket.io-client";
import disconnect from "@/lib/disconnect/disconnect";
import { useRouter } from "next/navigation";
import ChatService from "@/services/Chat.service";
import { useEffect, useState } from "react";
import LoadingSuspense from "../loading/LoadingSuspense";

type Props = {
  channelAndUsersRelation: ChannelUsersRelation;
  myRelation: UserRelation;
  token: string;
};

export default function ChannelMainFrame({
  channelAndUsersRelation,
  myRelation,
  token,
}: Props) {
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  const router = useRouter();

  // Chat Websocket call
  useEffect(() => {
    const handleError = () => {
      setSocket(undefined);
    };

    const disconnectClient = async () => {
      await disconnect();
      router.refresh();
    };

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
      }, 500);
    }

    socket?.on("disconnect", handleError);

    return () => {
      socket?.off("disconnect", handleError);
    };
  }, [socket]);

  if (!socket) return <LoadingSuspense />;

  return (
    <div className={styles.profileMainFrame}>
      <ChannelFirstPart
        token={token}
        channelAndUsersRelation={channelAndUsersRelation}
        myRelation={myRelation}
      />
      <ChannelSecondPart
        socket={socket}
        channelAndUsersRelation={channelAndUsersRelation}
        myRelation={myRelation}
      />
    </div>
  );
}
