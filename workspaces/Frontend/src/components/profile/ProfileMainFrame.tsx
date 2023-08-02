"use client";

import styles from "@/styles/profile/Profile.module.css";
import ProfileFirstPart from "./ProfileFirstPart";
import ProfileSecondPart from "./ProfileSecondPart";
import { useEffect, useState } from "react";
import ChatService from "@/services/Chat.service";
import { Socket } from "socket.io-client";
import LoadingSuspense from "../loading/LoadingSuspense";

type Props = {
  profile: Profile;
  isOwner: boolean;
  avatar: Avatar;
  token: string;
};

export default function ProfileMainFrame({
  profile,
  isOwner,
  avatar,
  token,
}: Props) {
  const [login, setLogin] = useState<string>(profile.login);
  const [socket, setSocket] = useState<Socket | undefined>(undefined);
  
  // WsException Managing
  useEffect(() => {

    const handleError = () => {
      setSocket(undefined);
    }

    if (!socket) {
      const intervalId = setInterval(() => {
        const chatService = new ChatService(token);
        console.log("profile service reload here", chatService.socket?.id);
        if (chatService.socket) {
          setSocket(chatService.socket);
          clearInterval(intervalId);
        }
      }, 500);
    }

    socket?.on("disconnect", handleError);

    return () => {
      socket?.off("disconnect", handleError);
    }
  }, [socket]);

  
  if (!socket)
    return <LoadingSuspense />

  return (
    <div className={styles.profileMainFrame}>
      <ProfileFirstPart
        login={login}
        isOwner={isOwner}
        avatar={avatar}
        socket={socket}
      />
      <ProfileSecondPart
        profile={profile}
        isOwner={isOwner}
        setLogin={setLogin}
        socket={socket}
      />
    </div>
  );
}
